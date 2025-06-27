# app.py

from flask import Flask, request, send_file, abort
from flask_cors import CORS
from flask_compress import Compress
import tempfile
import mimetypes
import os
from compress import compress_image
from resize import resize_image

app = Flask(__name__)
CORS(app)
Compress(app)

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'bmp', 'tiff', 'tif', 'webp'}

def get_extension(filename):
    return filename.rsplit('.', 1)[-1].lower()

def is_allowed(filename):
    return '.' in filename and get_extension(filename) in ALLOWED_EXTENSIONS

def get_mime_type(path):
    mime, _ = mimetypes.guess_type(path)
    return mime or "application/octet-stream"

@app.route("/resize", methods=["POST"])
def resize():
    file = request.files.get("file")
    if not file or not is_allowed(file.filename):
        return abort(415, "Unsupported or missing file")

    width, height = map(int, request.form["size"].split("x"))
    
    with tempfile.NamedTemporaryFile(suffix=".webp", delete=False) as temp_out:
        with tempfile.NamedTemporaryFile(suffix=".tmp", delete=False) as temp_in:
            file.save(temp_in.name)
            resize_image(temp_in.name, temp_out.name, width, height)
        
        return send_file(temp_out.name, mimetype="image/webp")

@app.route("/compress", methods=["POST"])
def compress():
    file = request.files.get("file")
    if not file or not is_allowed(file.filename):
        return abort(415, "Unsupported or missing file")

    quality = int(request.form.get("quality", 75))

    with tempfile.NamedTemporaryFile(suffix=".webp", delete=False) as temp_out:
        with tempfile.NamedTemporaryFile(suffix=".tmp", delete=False) as temp_in:
            file.save(temp_in.name)
            compress_image(temp_in.name, temp_out.name, quality)
        
        return send_file(temp_out.name, mimetype="image/webp")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
