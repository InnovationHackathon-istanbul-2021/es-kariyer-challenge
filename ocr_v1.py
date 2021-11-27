from pdf2image import convert_from_path
from pytesseract import image_to_string
from PIL import Image
import sys, os

if len(sys.argv) != 2:
    print("Usage:",sys.argv[0],"<file-name>")
    print("Supported file extensions : PDF,DOCX,DOC,JPG,PNG")
    exit()

file = sys.argv[1]
filename = sys.argv[1].split(".")[0]
extension = sys.argv[1].split(".")[1]

def docx2pdf(file, filename):
    command = "abiword --verbose=2 --to=pdf "+file+" --to-name="+filename+".pdf"
    os.system(command)

def pdf2jpg(file, filename):
    pages = convert_from_path(file, 500)
    count = 1

    for page in pages:
        yeni_dosya = filename + str(count) + ".jpg"
        page.save(yeni_dosya, 'JPEG')
        count += 1

    return count

def performOcr(file,extension,page_count):

    final = open(filename+".txt","w")
    if page_count != -1:
        for i in range(1,page_count):
            final.write(image_to_string(Image.open(file+str(i)+"."+extension)))

    else:
        final.write(image_to_string(Image.open(file+"."+extension)))

if extension.upper() == "DOCX" or extension.upper() == "DOC":
    docx2pdf(file, filename)
    page_count = pdf2jpg(filename+".pdf", filename)
    performOcr(filename,"jpg",page_count)

elif extension.upper() == "PDF":
    page_count = pdf2jpg(file, filename)
    performOcr(filename,"jpg",page_count)

elif extension.upper() == "JPG" or extension.upper() == "JPEG" or extension.upper() == "PNG":
    performOcr(filename,extension,-1)

