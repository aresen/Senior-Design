# -*- coding: utf-8 -*-
import cv2
import sys
import sys

# Get user supplied values
imagePath = sys.argv[1]
cascPath = sys.argv[2]
print imagePath
print '\n'
print cascPath
# Create the haar cascade
faceCascade = cv2.CascadeClassifier(cascPath)

# Read the image
image = cv2.imread(imagePath)
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Detect faces in the image
for i in range(1,10):
	g = float(i)/10 + 1.0
	faces = faceCascade.detectMultiScale(
		gray,
		scaleFactor=g,
		minNeighbors=5,
   		minSize=(30, 30),
    	flags = cv2.cv.CV_HAAR_SCALE_IMAGE
    	)
	print "Found {0} faces!".format(len(faces)) 
	if (i==1):
		numFaces = len(faces)
		fact = 1
	else:
		if (numFaces > len(faces)):
			numFaces = len(faces)
			fact = i

faces = faceCascade.detectMultiScale(
	gray,
	scaleFactor=float(fact)/10 + 1.0,
	minNeighbors=5,
   	minSize=(30, 30),
    flags = cv2.cv.CV_HAAR_SCALE_IMAGE
    )

print "The minimum number of faces is {0}!".format(len(faces)) 





# Draw a rectangle around the faces
for (x, y, w, h) in faces:
    cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)

cv2.imwrite("routes/face.jpg",image)
cv2.waitKey(0)
