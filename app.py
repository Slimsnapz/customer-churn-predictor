from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
# Enabling CORS so Next.js can talk to Flask
CORS(app) 

# Loading the champion pipeline into memory
models = {
    'logistic_regression': joblib.load('logistic_regression_pipeline.pkl')
}

@app.route('/predict_churn', methods=['POST'])
def predict():
    try:
        data = request.json 
        
        # FIX 1: Look for 'model' (matches React) and default to 'logistic_regression'
        model_choice = data.get('model', 'logistic_regression').lower()
        
        if model_choice not in models:
            return jsonify({'error': 'Invalid model choice.'}), 400
        
        # Clean the payload so only the customer metrics remain
        customer_data = {key: val for key, val in data.items() if key != 'model'}
        df = pd.DataFrame([customer_data])
        
        # Predict the probability of churn (Class 1)
        selected_model = models[model_choice]
        prob = selected_model.predict_proba(df)[0][1] 
        
        # FIX 2: Return 'churn_risk' so React knows exactly where to read the number
        return jsonify({
            'model_used': model_choice,
            'churn_risk': f"{round(prob * 100, 2)}%"
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Running strictly on port 5000
    app.run(host='0.0.0.0', port=5000)