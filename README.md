# Telecom Customer Churn Predictor

An end-to-end Machine Learning pipeline and full-stack web application designed to predict telecom customer churn risk based on usage metrics. 

This project demonstrates the complete ML lifecycle: from training classification models in Python to deploying a responsive Next.js dashboard backed by a cloud-hosted Flask API.

## Live Demo
* **Frontend Dashboard:** https://customer-churn-predictor-pied.vercel.app/
* **Backend API:** https://dashboard.render.com/web/srv-d93rubq8qa3s73bbmf20/logs?t=app&r=live

## System Architecture

### Frontend (User Interface)
* **Framework:** Next.js / React
* **Styling:** Tailwind CSS
* **Hosting:** Vercel
* **Features:** Responsive design, asynchronous API state management, dynamic error handling.

### Backend (Machine Learning API)
* **Framework:** Python / Flask
* **ML Library:** Scikit-Learn, Pandas, Joblib
* **Hosting:** Render
* **Model:** Logistic Regression Pipeline (Champion)
* **Features:** CORS enabled, dynamic DataFrame padding, automated feature-mapping to prevent strict shape-mismatch errors from Scikit-Learn.

## Machine Learning Engine
The prediction engine utilizes a Logistic Regression classification model trained on a standard Telecom Churn dataset. 

**Dynamic Feature Mapping:** The Flask API includes a custom preprocessing layer. If the frontend submits a partial dataset (e.g., 5 metrics instead of the 20+ used during training), the API automatically queries the model's memory, generates a safely padded DataFrame with default baseline values for missing columns, and maps the incoming React payload to the exact feature names expected by the Scikit-Learn pipeline. 

## How to Run Locally

### 1. Clone the Repository
```bash
git clone [https://github.com/YourUsername/customer-churn-predictor.git](https://github.com/YourUsername/customer-churn-predictor.git)
cd customer-churn-predictor