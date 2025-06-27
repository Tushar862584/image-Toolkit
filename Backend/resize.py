import cv2

def resize_image(input_path, output_path, width, height):
    image = cv2.imread(input_path)
    resized = cv2.resize(image, (width, height), interpolation=cv2.INTER_NEAREST)
    cv2.imwrite(output_path, resized)
