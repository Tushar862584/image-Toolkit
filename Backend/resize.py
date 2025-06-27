# file: image_utils/resize.py
import cv2
import os

def resize_image(input_path, output_path, width, height):
    if not os.path.isfile(input_path):
        raise FileNotFoundError(f"Input file does not exist: {input_path}")
    
    if not isinstance(width, int) or not isinstance(height, int) or width <= 0 or height <= 0:
        raise ValueError(f"Invalid dimensions: width={width}, height={height}")

    image = cv2.imread(input_path)
    if image is None:
        raise ValueError(f"Failed to read image from path: {input_path}")

    resized = cv2.resize(image, (width, height), interpolation=cv2.INTER_AREA)
    ext = os.path.splitext(output_path)[1].lower()
    
    if ext in [".jpg", ".jpeg"]:
        success = cv2.imwrite(output_path, resized, [cv2.IMWRITE_JPEG_QUALITY, 85])
    elif ext == ".png":
        success = cv2.imwrite(output_path, resized, [cv2.IMWRITE_PNG_COMPRESSION, 3])
    else:
        raise ValueError(f"Unsupported output format: {ext}")

    if not success:
        raise IOError(f"Failed to save resized image to {output_path}")
