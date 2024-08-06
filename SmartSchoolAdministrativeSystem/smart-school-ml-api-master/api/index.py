## loading env variables
import settings.config

import os
from flask import Flask, jsonify, request
import json

## function imports
from core.student import get_performance_prediction, get_performance_prediction_with_id

app = Flask(__name__)

home_route = "/ss/api/"

@app.route("/")
def index():
    print(os.getenv("DB_HOST"))
    return "Hello world"

## route handler for student performance prediction
@app.post(os.path.join(home_route, "student/predict"))
def handle_predition():
    data = request.get_json()
    return get_performance_prediction(data)

    
## route handler for student performance prediction with id
@app.post(os.path.join(home_route, "student/predict_with_id"))
def handle_predition_with_id():
    data = request.get_json()
    return get_performance_prediction_with_id(data)

if __name__ == "__main__":
    app.run(debug=True)
    
 # "97dbc32c-e75b-48f9-99a7-1681ccd27dd5"