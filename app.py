from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
# Enabling CORS so Next.js on port 3000 can talk to Flask on port 5000
CORS(app) 

# Loading the two trained pipelines into memory
models = {
    'logistic_regression': joblib.load('logistic_regression_pipeline.pkl'),
    'random_forest': joblib.load('random_forest_pipeline.pkl')
}

@app.route('/predict_churn', methods=['POST'])
def predict():
    try:
        data = request.json 
        
        # Determine which model the front-end requested (defaults to your champion)
        model_choice = data.get('model_choice', 'random_forest').lower()
        
        if model_choice not in models:
            return jsonify({'error': 'Invalid model choice. Choose logistic_regression or random_forest.'}), 400
        
        # Clean the payload so only the customer metrics remain
        customer_data = {key: val for key, val in data.items() if key != 'model_choice'}
        df = pd.DataFrame([customer_data])
        
        # Predict the probability of churn (Class 1)
        selected_model = models[model_choice]
        prob = selected_model.predict_proba(df)[0][1] 
        
        return jsonify({
            'model_used': model_choice,
            'churn_risk_percentage': round(prob * 100, 2)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Running strictly on port 5000
    app.run(host='0.0.0.0', port=5000)