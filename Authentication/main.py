# Tutorials and some code base from Philipp Wagner <bytefish[at]gmx[dot]de> was used while producing this program
# Python 2 (not 3) should be used in combination with these scripts

import os
import sys
import cv2
import numpy as np
from PIL import Image

FACTOR = 1.5
DIMENSIONY = 112
DIMENSIONX = 92
MARGIN = 20

def detect(in_image):
    
    # Gets user supplied values
    imagePath = in_image
    cascPath = "haarcascade_frontalface_default.xml"

    # Creates the haar cascade
    faceCascade = cv2.CascadeClassifier(cascPath)

    # Reads the image and convert it to grayscale
	
    image = cv2.imread(imagePath)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detects faces in the image
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

    # The debug line - prints the number of faces detected
    # print "The number of detected faces is {0}!".format(len(faces)) 


    # Crops an image around the detected face, converts it to grayscale
    for (x, y, w, h) in faces:
        crop_img = gray[(y+MARGIN):(y+h-MARGIN), (x+MARGIN):(x+w-MARGIN)]
        new_img = cv2.resize(crop_img, (DIMENSIONX, DIMENSIONY))
        
    
    # Save the cropped, reformatted and resized image
    cv2.imwrite('face.pgm', new_img)


""" Reads the images in a given folder, resizes images on the fly if size is given
    Args:
        path: Path to a folder with subfolders representing the subjects (persons).
        sz: A tuple with the size Resizes
    Returns:
        A list [X,y]
            X: The images, which is a Python list of numpy arrays.
            y: The corresponding labels (the unique number of the subject, person) in a Python list.
"""
def read_images(path, sz=None):
    c = 0
    X,y = [], []
    for dirname, dirnames, filenames in os.walk(path):
        for subdirname in dirnames:
            subject_path = os.path.join(dirname, subdirname)
            for filename in os.listdir(subject_path):
                print filename
                if filename == ".DS_Store":
                    continue
                try:
                    im = cv2.imread(os.path.join(subject_path, filename), cv2.IMREAD_GRAYSCALE)
                    # resize to given size (if given)
                    if (sz is not None):
                        im = cv2.resize(im, sz)
                    X.append(np.asarray(im, dtype=np.uint8))
                    y.append(c)
                except IOError, (errno, strerror):
                    print "I/O error({0}): {1}".format(errno, strerror)
                except:
                    print "Unexpected error:", sys.exc_info()[0]
                    raise
            c = c+1
    return [X,y]


def recognize():
    # Read in the image data
    [X,y] = read_images(sys.argv[2])
    
    # Convert labels to 32bit integers
    y = np.asarray(y, dtype=np.int32)
    

    # Create the Eigenfaces model. Might add thresholds later
    model = cv2.createEigenFaceRecognizer()
    

    # Learn the model. The function returns Python lists, so we use np.asarray to turn them into NumPy lists
    model.train(np.asarray(X), np.asarray(y))
    

    # We now get a prediction from the model
    # model.predict is going to return the predicted label and
    # the associated confidence (distance)
    [p_label, p_confidence] = model.predict(np.asarray(np.asarray(cv2.imread(os.path.join("./face.pgm"), cv2.IMREAD_GRAYSCALE), dtype=np.uint8)))
    

    # Print it:
    print "Predicted label = %d (confidence=%.2f)" % (p_label, p_confidence)
	
#########This will be removed once the .csv and training sets are linked.
    if(p_label == 0):
        name = 'Artem Losev'
    elif (p_label == 1):
        name = 'William Vangos'
    elif (p_label == 2):
        name = 'John Careaga'
    elif (p_label == 3):
        name = 'Elizabeth Beckwith'
    elif (p_label == 4):
        name = 'Quentin Li'

    file = open('routes/results.txt', 'w')
    #file.write('<html><h1>Predicted Label= '  + name + '<br> Error Signal Strength= ' + str(p_confidence) + '</h1></html>')
    file.write('{ "name" : "' + name + '" , ' + '"confidence" : ' + str(p_confidence) + '}')
    file.close()
  

	#Write to file
	

	

""" The image data should be prepared as a folder tree:
main_folder
    person_1
        0.pgm
        1.pgm
        ...
    person_2
        0.pgm
        ...
    ...

The training set path should be to the main_folder
"""
if __name__ == "__main__":

    # Script needs at least a path to the image and the training set
    if len(sys.argv) < 3:
        print "USAGE: main.py </path/to/image_to_recognize> </path/to/training_set_images>"
        sys.exit()


    detect(sys.argv[1])
    recognize()

    
