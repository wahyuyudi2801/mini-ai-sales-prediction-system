import pandas as pd
import json
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score
import joblib

# =========================
# 1. LOAD DATA
# =========================
df = pd.read_csv("../data/sales_data.csv")

# =========================
# 2. PREPROCESSING
# =========================
# Ambil fitur & target
X = df[["jumlah_penjualan", "harga", "diskon"]]
y = df["status"]

# Encode label (Laris / Tidak)
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42
)

# =========================
# 3. PIPELINE (SCALING + MODEL)
# =========================
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])

# =========================
# 4. TRAINING
# =========================
pipeline.fit(X_train, y_train)

# =========================
# 5. EVALUASI
# =========================
y_pred = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"Accuracy: {accuracy:.2f}")

# =========================
# 6. SIMPAN MODEL
# =========================
joblib.dump(pipeline, "model_produk.pkl")
joblib.dump(label_encoder, "label_encoder.pkl")

# =========================
# 7. LOAD MODEL
# =========================
model_loaded = joblib.load("model_produk.pkl")
label_loaded = joblib.load("label_encoder.pkl")

# =========================
# 8. PREDIKSI INPUT BARU
# =========================
# Contoh input baru
input_data = pd.DataFrame([{
    "jumlah_penjualan": 120,
    "harga": 50000,
    "diskon": 10
}])

prediction = model_loaded.predict(input_data)
prediction_label = label_loaded.inverse_transform(prediction)

# =========================
# 9. OUTPUT JSON
# =========================
result = {
    "input": input_data.to_dict(orient="records")[0],
    "prediksi_status": prediction_label[0]
}

json_output = json.dumps(result, indent=4)

print(json_output)