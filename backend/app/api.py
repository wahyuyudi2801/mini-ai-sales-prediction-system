import pandas as pd
import json
import joblib
import os

from fastapi import FastAPI, Body, Depends
from decouple import config
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score

from app.auth.auth_bearer import JWTBearer
from app.auth.auth_handler import sign_jwt, decode_jwt
from app.model import PredictRequest

from app.model import UserLoginSchema

users = [
    {
        "fullname": "Wahyudi",
        "email": "wahyudi@x.com",
        "password": "password"
    }
]

def check_user(data: UserLoginSchema):
    for user in users:
        if user["email"] == data.email and user["password"] == data.password:
            return True
    return False

DATA_PATH = config("DATA_PATH")
MODEL_PATH = config("MODEL_PATH")
ENCODER_PATH = config("ENCODER_PATH")

def train_model():
    df = pd.read_csv(DATA_PATH)

    X = df[["jumlah_penjualan", "harga", "diskon"]]
    y = df["status"]

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42
    )

    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("model", LogisticRegression())
    ])

    pipeline.fit(X_train, y_train)

    # Evaluasi
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Training selesai. Accuracy: {acc:.2f}")

    # Simpan
    joblib.dump(pipeline, MODEL_PATH)
    joblib.dump(label_encoder, ENCODER_PATH)

    return pipeline, label_encoder


if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
    model = joblib.load(MODEL_PATH)
    label_encoder = joblib.load(ENCODER_PATH)
else:
    model, label_encoder = train_model()

def make_prediction(data: PredictRequest) -> dict:
    df = pd.DataFrame([data.dict()])
    
    pred = model.predict(df)
    label = label_encoder.inverse_transform(pred)[0]

    return {
        "input": data.dict(),
        "prediksi_status": label
    }


# ROUTES
app = FastAPI()

@app.get("/")
async def read_root() -> dict:
    return {"message": "Welcome to your blog!"}

@app.get("/check-token")
async def check_token(token:str):
    return decode_jwt(token)

@app.post("/login")
async def user_login(user: UserLoginSchema = Body(...)):
    if check_user(user):
        return sign_jwt(user.email)
    return {
        "error": "Wrong login details!"
    }

@app.get("/sales", dependencies=[Depends(JWTBearer())])
async def get_sales(limit: int = 100, offset: int = 0) -> dict: 
    pathname = config("DATA_PATH")
    df = pd.read_csv(pathname, skiprows=range(1, offset + 1), nrows=limit)
    return {"message": "Data sales","data": df.to_dict(orient='records')}

@app.post("/predict", dependencies=[Depends(JWTBearer())])
async def predict(payload: PredictRequest) -> dict: 
    return make_prediction(payload)