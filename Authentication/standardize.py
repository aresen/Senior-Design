# Usage: python face_detect.py folder_path
# Python 2 should be used in combination with these scripts
# Takes a folder with jpg images and returns a cropped (based on face detection), resized (100x125) and reformatted (PGM) versions of it named with the same names

import cv2
import sys, os
from PIL import Image

FACTOR = 1.5
DIMENSIONY = 112
DIMENSIONX = 92
PATH = sys.argv[1]
DIRS = os.listdir( PATH )
#DIRS.remove('.DS_Store')
MARGIN = 20

def detect(in_image):
	# Get user supplied values
	f, e = os.path.splitext(in_image)
	imagePath = in_image
	cascPath = "haarcascade_frontalface_default.xml"


	# Create the haar cascade
	faceCascade = cv2.CascadeClassifier(cascPath)

	# Read the image
	image = cv2.imread(imagePath)
	gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

	# If the picture is too huge (e.g. was taken with an iPhone) resize it for better detection results
	# For GG-taken pictures, comment out
	#cv2.resize(image, (1000,1000))

	# Detect faces in the image
	factor = FACTOR
	faces = faceCascade.detectMultiScale(gray, scaleFactor=FACTOR, minNeighbors=5, minSize=(50, 50), flags = cv2.cv.CV_HAAR_SCALE_IMAGE)

	# If the detection failed, adjusts the scaling factor accordingly
	while (len(faces) > 1):
		factor += 0.1
		faces = faceCascade.detectMultiScale(gray, scaleFactor=factor, minNeighbors=5, minSize=(50, 50), flags = cv2.cv.CV_HAAR_SCALE_IMAGE)
	while (len(faces) < 1 and factor >= 1.0):
	 	factor -= 0.1
	 	faces = faceCascade.detectMultiScale(gray, scaleFactor=factor, minNeighbors=5, minSize=(50, 50), flags = cv2.cv.CV_HAAR_SCALE_IMAGE)

	if (len(faces) == 0):
	 	print "The program failed to detect faces"
	 	return False

	# Debug line, comment out
	#print "The number of detected faces is {0}!".format(len(faces)) 



	# Crop the faces
	for (x, y, w, h) in faces:
	    crop_img = gray[(y+MARGIN):(y+h-MARGIN), (x+MARGIN):(x+w-MARGIN)]
	    new_img = cv2.resize(crop_img, (DIMENSIONX, DIMENSIONY))

	    


	cv2.imwrite(f + '.pgm', new_img)


if __name__ == '__main__':
	for item in DIRS:
		if os.path.isfile(PATH+item):
			detect(PATH+item)

