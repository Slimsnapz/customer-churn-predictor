# Telecom Customer Churn Predictor

A full-stack machine learning application designed to predict telecom customer churn risk. This project bridges the gap between raw data analysis and production-ready software by combining a robust Scikit-learn predictive model with a modern, interactive Next.js web dashboard.

## Architecture
* **Backend (AI Engine):** Python, Flask, Scikit-learn, Pandas, Joblib
* **Frontend (UI/UX):** Next.js, React, Tailwind CSS
* **Modeling Strategy:** Random Forest Classifier (Champion Model) vs. Logistic Regression (Baseline)

## The Machine Learning Pipeline
The predictive engine was trained on standard Telecom Churn datasets. The data pipeline handles missing values, scales numerical features via `StandardScaler`, and encodes categorical variables. The champion Random Forest model identifies high-risk customers based on 18 critical account features, including total day minutes, customer service calls, and international plan status.

## Local Setup & Installation

To run this application locally, you must run both the backend API and the frontend dashboard simultaneously.

### Part 1: Start the Backend (Flask API)
1. Open a terminal and navigate to the root directory.
2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt