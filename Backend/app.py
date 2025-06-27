from flask import Flask, request, send_file
from flask_cors import CORS
import tempfile
from compress import  compress_image
from resize import resize_image

app = Flask(__name__)
CORS(app)



@app.route("/resize", methods=["POST"])
def resize():
    file = request.files["file"]
    width, height = map(int, request.form["size"].split("x"))

    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_in, \
         tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_out:
        file.save(temp_in.name)
        resize_image(temp_in.name, temp_out.name, width, height)
        return send_file(temp_out.name, mimetype="image/png")

@app.route("/compress", methods=["POST"])
def compress():
    file = request.files["file"]
    quality = int(request.form.get("quality", 75))

    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_in, \
         tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_out:
        file.save(temp_in.name)
        compress_image(temp_in.name, temp_out.name, quality)
        return send_file(temp_out.name, mimetype="image/jpeg")

if __name__ == "__main__":
    app.run(debug=True, port=5000)

