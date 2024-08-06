## utilities
import os
import pickle
import dill

## constants import
from config.constants import CONSTANTS

## db functions
from core.db.db_student import get_student_by_id

## package imports
import pandas as pd


preprocessor = None
estimator = None


## loading preprocessor
with open(
    os.path.join(CONSTANTS["MODELS_PATH"], "student_data_preprocessor.pickle"), "rb"
) as file:
    preprocessor = pickle.load(file)

## loading estimator
with open(
    os.path.join(CONSTANTS["MODELS_PATH"], "grade_predictor.pickle"), "rb"
) as file:
    estimator = pickle.load(file)

## loading explainer
with open(
    os.path.join(CONSTANTS["MODELS_PATH"], "lime_explainer.pickle"), "rb"
) as file:
    lime_explainer = dill.load(file)

# def get_performance_prediction(data):
#     processed = preprocessor.transform(pd.DataFrame(data, index=[0]))
#     return {"prediction": estimator.predict(processed)[0]}


def get_performance_prediction(data):
    df = pd.DataFrame(data)
    processed = preprocessor.transform(df)
    predictions = estimator.predict(processed).flatten().tolist()
    explanations = local_interpretation(df)
    # return {"prediction": estimator.predict(processed).flatten().tolist()}
    return {"predictions": predictions, "explanations": explanations}


def local_interpretation(data):
    mean_score = data["previous_grade"].mean()
    math_intensive = round(data["math_intensive"].mean())

    instance = data.iloc[[0]]
    instance.loc[:,"previous_grade"] = mean_score
    instance.loc[:, "math_intensive"] = math_intensive

    instance_explainer = lime_explainer.explain_instance(
        preprocessor.transform(instance).flatten(), estimator.predict, num_features=10
    )
    
    return instance_explainer.as_list()


## function to get the performance prediction and return results with Id
def get_performance_prediction_with_id(data):
    df = pd.DataFrame(data)
    ids = df["id"].values
    processed = preprocessor.transform(df)
    predictions = estimator.predict(processed).flatten().tolist()
    
    preds_pair = zip(ids, predictions)
    
    result = dict()
    
    for id, pred in preds_pair:
        if id not in result:
            result[id] = [pred]
        else:
            result[id].append(pred)
            
    return result