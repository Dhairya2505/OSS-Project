from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from dotenv import load_dotenv
import os

load_dotenv()

MONGO_DB_URI = os.getenv("MONGO_DB_URI")

app = Flask(__name__)

CORS(app)

def AllScrapper(URL, mainClass, priceClassName, nameClassName):
    driver = webdriver.Chrome()
    
    driver.get(URL)
    contents = []
    try:
        price_element = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CLASS_NAME, mainClass))
        )
        
        price = price_element.find_element(By.CLASS_NAME, priceClassName).text
        name = price_element.find_element(By.CLASS_NAME, nameClassName).text
        image = price_element.find_element(By.TAG_NAME, "img").get_attribute("src")

        contents.append(price[1:])
        contents.append(name)
        contents.append(image)

        return contents

    except Exception as e:
        contents.append("Price not found.")
        contents.append("Name not found.")
        contents.append("Image not found.")

    
def priceScrapper(URL, priceClassName):

    driver = webdriver.Chrome()
    
    driver.get(URL)
    
    try:
        price_element = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CLASS_NAME, priceClassName))
        )
        
        price_text = price_element.text
        
        return price_text[1:]
    
    except Exception as e:
        return "price not found"

def nameScrapper(URL, nameClassName):

    driver = webdriver.Chrome()
    
    driver.get(URL)
    
    try:
        name_element = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CLASS_NAME, nameClassName))
        )
        
        name_text = name_element.text
        
        return name_text
    
    except Exception as e:
        print("Name not found.", e)

def imageScrapper(URL, imageClassName):
    driver = webdriver.Chrome()
    
    driver.get(URL)
    
    try:
            image_element = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.CLASS_NAME, imageClassName))
            )
            
            img_element = image_element.find_element(By.TAG_NAME, "img")
            img_src = img_element.get_attribute("src")
            
            return img_src
        
    except Exception as e:
            print("Image not found.", e)

def add(name1, URL1, name2, URL2, image, type):
    client = MongoClient(MONGO_DB_URI)
    db = client["OSS_PROJECT"]
    collection = db["Products"]
    single_document = {"name1": name1.lower(), "URL1": URL1, "name2": name2.lower(), "URL2": URL2, "img": image, "type": type}
    result = collection.insert_one(single_document)


@app.route('/')
def home():
    return "Welcome to your Flask API!"

@app.route('/getProducts')
def getProducts():
    client = MongoClient(MONGO_DB_URI)
    db = client["OSS_PROJECT"]
    collection = db["Products"]
    data = list(collection.find({}))
    
    for item in data:
        item["_id"] = str(item["_id"])
    
    return jsonify(data)

@app.route('/getProducts/<string:name>')
def getProductByName(name):
    client = MongoClient(MONGO_DB_URI)
    db = client["OSS_PROJECT"]
    collection = db["Products"]
    data = list(collection.find({}))
    print(data)
    items = []

    for item in data:
        if (name.lower() in item["name1"]) | (name.lower() in item["name2"]):
            items.append(item)
            
    for item in items:
        item["_id"] = str(item["_id"])
    
    return jsonify(items)

@app.route('/addToDatabase', methods=['POST'])
def addToDatabase():

    data = request.get_json()
    URL1 = data.get('URL1')
    URL2 = data.get('URL2')
    category = data.get('category')

    if "flipkart" in URL1:
        nameClassName = "VU-ZEz"
    elif "croma" in URL1:
        nameClassName = "pd-title"
    product1 = nameScrapper(URL1, nameClassName)

    if "flipkart" in URL2:
        nameClassName = "VU-ZEz"
    elif "croma" in URL2:
        nameClassName = "pd-title"

    product2 = nameScrapper(URL2, nameClassName)
    image = imageScrapper(URL1, "_4WELSP")
    type = category

    add(product1, URL1, product2, URL2, image, type)

    return "Successfull"

@app.route('/getDetails', methods=['POST'])
def getDetails():

    data = request.get_json()
    URL1 = data.get('url1')
    URL2 = data.get('url2')

    if "flipkart" in URL1:
        priceClassName = "Nx9bqj"
        nameClassName = "VU-ZEz"
        mainClass = "YJG4Cf"
        contents = AllScrapper(URL1, mainClass, priceClassName, nameClassName)

        product1Name = contents[0]
        product1Price = contents[1]
        image = contents[2]

    elif "croma" in URL1: 

        priceClassName = "amount"
        product2Price = priceScrapper(URL2, priceClassName)

    if "flipkart" in URL2:
        priceClassName = "Nx9bqj"
        nameClassName = "VU-ZEz"
        mainClass = "YJG4Cf"
        contents = AllScrapper(URL2, mainClass, priceClassName, nameClassName)

        product1Price = contents[0]
        product1Name = contents[1]
        image = contents[2]
        
    elif "croma" in URL2: 

        priceClassName = "amount"
        product2Price = priceScrapper(URL2, priceClassName)
    
    return jsonify([product1Name,product1Price,product2Price,image, URL1, URL2])

if __name__ == '__main__':
    app.run(debug=True)
