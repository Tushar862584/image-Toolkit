import cv2
import os

def resize_image(input_path, output_path, width, height):
    image = cv2.imread(input_path)
    resized = cv2.resize(image, (width, height), interpolation=cv2.INTER_AREA)
    ext = os.path.splitext(output_path)[1].lower()
    
    if ext in [".jpg", ".jpeg"]:
        cv2.imwrite(output_path, resized, [cv2.IMWRITE_JPEG_QUALITY, 85])
    elif ext == ".png":
        cv2.imwrite(output_path, resized, [cv2.IMWRITE_PNG_COMPRESSION, 3])
    else:
        raise ValueError(f"Unsupported output format: {ext}")
