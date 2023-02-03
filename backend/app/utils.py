from passlib.context import CryptContext
from subprocess import run
import os
import pypdfium2 as pdfium

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash(password:str):
    return pwd_context.hash(password)

def verify(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Pdf thumbnail generator
# Make sure imagemagick is installed on machine
def generate_thumbnail(input_file, output_dir):
    pdf = pdfium.PdfDocument(input_file)
    page = pdf.get_page(0)
    output_file_name = os.path.basename(input_file).split('.')[0] + '.jpg'
    output = output_dir + output_file_name
    pil_image = page.render_topil()
    pil_image.save(output)
    page.close()

    # # cmd = ['convert', 
    # #     input_file + '[0]',
    # #     '-background', 'white', 
    # #     '-alpha', 'background', 
    # #     '-alpha', 
    # #     'off',
    # #     '-compress', 'JPEG',
    # #     '-quality', '85%',
    # #     '-gaussian-blur', '0.05', 
    # #     output]
    # # run(cmd, shell=True)
    # # /home/derrick/app/src/backend/files/2ad9fbd5-311e-4f5b-aaed-b397c11ae9d5.pdf[0] -background white -alpha background -alpha off -compress JPEG -quality 85% -gaussian-blur 0.05, /home/derrick/app/src/backend/files/thumbnails/test.png
    # cmd = [f"/usr/bin/convert {input_file}[0] -background white -alpha background -alpha off -compress JPEG -quality 85% -gaussian-blur 0.05, {output}"]
    # run(cmd, shell=True)
    return output