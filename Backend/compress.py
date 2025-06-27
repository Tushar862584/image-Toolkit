import cv2

def compress_image(input_path, output_path, quality):
    image = cv2.imread(input_path)
    cv2.imwrite(output_path, image, [cv2.IMWRITE_JPEG_QUALITY, quality])

