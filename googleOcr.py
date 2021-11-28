import cv2
import imutils
import json
import matplotlib.pyplot as plt
import numpy as np
import os
import pandas as pd
import requests
import time
from base64 import b64encode
from IPython.display import Image
from pylab import rcParams

ENDPOINT_URL = 'https://vision.googleapis.com/v1/images:annotate'
api_key = "AIzaSyD9sRKdnDc_5SCKkUNH0EObkajE9YCgRtA"

#rcParams['figure.figsize'] = 10, 20

def makeImageData(imgpath):
    img_req = None
    with open(imgpath, 'rb') as f:
        ctxt = b64encode(f.read()).decode()
        img_req = {
            'image': {
                'content': ctxt
            },
            'features': [{
                'type': 'DOCUMENT_TEXT_DETECTION',
                'maxResults': 1
            }]
        }
    return json.dumps({"requests": img_req}).encode()

def requestOCR(url, api_key, imgpath):
  imgdata = makeImageData(imgpath)
  response = requests.post(ENDPOINT_URL, 
                           data = imgdata, 
                           params = {'key': api_key}, 
                           headers = {'Content-Type': 'application/json'})
  return response

#with open('vision_api.json') as f:
#    data = json.load(f)

def getPlainText(filename,master):

    #ENDPOINT_URL = 'https://vision.googleapis.com/v1/images:annotate'
    #api_key = "AIzaSyD9sRKdnDc_5SCKkUNH0EObkajE9YCgRtA"

    result = requestOCR(ENDPOINT_URL, api_key, filename)

    if result.status_code != 200 or result.json().get('error'):
        print ("Google Vision Error")
    else:
        result = result.json()['responses'][0]['textAnnotations']

    #output = open(master+".txt","a")
    #for index in range(len(result)):
    #    output.write(result[index]["description"]+"\n")
