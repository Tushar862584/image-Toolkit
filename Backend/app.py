# app.py

from flask import Flask, request, send_file, abort, jsonify
from flask_cors import CORS
from flask_compress import Compress
import tempfile
import mimetypes
import os
import logging
from PIL import Image
from compress import compress_image
from resize import resize_image

app = Flask(__name__)
CORS(app)
Compress(app)

logging.basicConfig(level=logging.DEBUG)

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'bmp', 'tiff', 'tif', 'webp'}

def get_extension(filename):
    return filename.rsplit('.', 1)[-1].lower()

def is_allowed(filename):
    return '.' in filename and get_extension(filename) in ALLOWED_EXTENSIONS

def get_mime_type(path):
    mime, _ = mimetypes.guess_type(path)
    return mime or "application/octet-stream"

@app.route("/health", methods=["GET"])
def health():
    return jsonify(status="ok"), 200

@app.route("/resize", methods=["POST"])
def resize():
    try:
        file = request.files.get("file")
        if not file or not is_allowed(file.filename):
            return abort(415, "Unsupported or missing file")

        width, height = map(int, request.form["size"].split("x"))

        with tempfile.NamedTemporaryFile(suffix=".webp", delete=False) as temp_out:
            with tempfile.NamedTemporaryFile(suffix=".tmp", delete=False) as temp_in:
                file.save(temp_in.name)
                resize_image(temp_in.name, temp_out.name, width, height)

            return send_file(temp_out.name, mimetype="image/webp")
    except Exception as e:
        app.logger.error(f"Resize error: {e}")
        return abort(500, "Resize operation failed")

@app.route("/compress", methods=["POST"])
def compress():
    try:
        file = request.files.get("file")
        if not file or not is_allowed(file.filename):
            return abort(415, "Unsupported or missing file")

        quality = int(request.form.get("quality", 75))

        with tempfile.NamedTemporaryFile(suffix=".webp", delete=False) as temp_out:
            with tempfile.NamedTemporaryFile(suffix=".tmp", delete=False) as temp_in:
                file.save(temp_in.name)
                compress_image(temp_in.name, temp_out.name, quality)

                original_size = os.path.getsize(temp_in.name)
                compressed_size = os.path.getsize(temp_out.name)
                app.logger.info(f"Compression: {original_size} -> {compressed_size} bytes")

            return send_file(temp_out.name, mimetype="image/webp")
    except Exception as e:
        app.logger.error(f"Compress error: {e}")
        return abort(500, "Compression operation failed")

def compress_image(input_path: str, output_path: str, quality: int = 75):
    with Image.open(input_path) as img:
        img.save(output_path, format="WEBP", quality=quality, optimize=True, method=6)

if __name__ == "__main__":
    app.logger.info("Starting Flask app on port 5000...")
    try:
        app.run(debug=True, port=5000)
    except Exception as e:
        app.logger.critical(f"Flask failed to start: {e}")
