from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import traceback

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
        model_choice = data.get('model', 'logistic_regression').lower()
        
        if model_choice not in models:
            return jsonify({'error': 'Invalid model choice.'}), 400
            
        selected_model = models[model_choice]

        # 1. Map the React names to the exact names the Model expects
        mapped_data = {
            'state': data.get('state', 16),
            'account_length': data.get('account_length', 128),
            'total_day_minutes': data.get('total_day_minutes', 265.1),
            'number_customer_service_calls': data.get('customer_service_calls', 1),
            'international_plan': data.get('intl_plan', 0)
        }

        # 2. Extract the exact list of columns the model memorized during training
        expected_cols = list(selected_model.feature_names_in_)

        # 3. Create a master dictionary filled with 0s for ALL expected columns
        final_data = {col: 0 for col in expected_cols}

        # 4. Inject our 5 mapped React inputs into the master dictionary
        for key, val in mapped_data.items():
            if key in final_data:
                final_data[key] = val

        # 5. Convert to Pandas DataFrame (it now has the perfect shape and names)
        df = pd.DataFrame([final_data])
        
        # Predict the probability of churn (Class 1)
        prob = selected_model.predict_proba(df)[0][1] 
        
        return jsonify({
            'model_used': model_choice,
            'churn_risk': f"{round(prob * 100, 2)}%"
        })
        
    except Exception as e:
        # Prints the exact crash logic to Render logs for easy debugging
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)