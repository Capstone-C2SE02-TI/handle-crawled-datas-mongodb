## Export mongoose collection

import pymongo
import json
from dotenv import dotenv_values

# Load variables from .env file
env_vars = dotenv_values()

# Access the variables
mongodb_crawl_uri = env_vars['MONGODB_CRAWL_URI']

# Establish a connection to the MongoDB server
client = pymongo.MongoClient(mongodb_crawl_uri)

# Access the desired database and collection
db = client['TRACKINGINVESTMENT_CRAWL']
# collection = db['investors']
collection = db['coins']

# Perform the query to retrieve documents from the collection
# documents = collection.find({'is_shark': True})
documents = collection.find()

# Convert the documents to a list of dictionaries
result = [document for document in documents]

# Save the result to a JSON file
with open('output2.json', 'w') as file:
    json.dump(result, file)
