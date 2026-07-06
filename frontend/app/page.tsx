"use client";
import { useState } from 'react';

export default function Home() {
  const [modelChoice, setModelChoice] = useState('logistic_regression');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Updated to strictly match the 18 columns from your Jupyter Notebook in exact order!
  const [formData, setFormData] = useState({
    state: 16, // Default numerical code for the state
    account_length: 128,
    international_plan: 0, 
    voice_mail_plan: 1, 
    number_vmail_messages: 25,
    total_day_minutes: 265.1,
    total_day_calls: 110,
    total_day_charge: 45.07,
    total_eve_minutes: 197.4,
    total_eve_calls: 99,
    total_eve_charge: 16.78,
    total_night_minutes: 244.7,
    total_night_calls: 91,
    total_night_charge: 11.01,
    total_intl_minutes: 10.0,
    total_intl_calls: 3,
    total_intl_charge: 2.7,
    number_customer_service_calls: 1
  });

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const predictChurn = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/predict_churn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_choice: modelChoice, ...formData }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        alert("Backend Error: " + data.error);
        setResult(null); 
      } else {
        setResult(data);
      }
      
    } catch (error) {
      console.error("Error connecting to API:", error);
      alert("Make sure your Flask server is running on port 5000!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Telecom Churn Predictor</h1>
          <p className="mt-2 text-lg text-slate-600">Select an ML model and adjust customer metrics to predict churn risk.</p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: Inputs */}
          <div className="p-8 flex-1 bg-white">
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-slate-700">Algorithm Selection</label>
                <select 
                  value={modelChoice} 
                  onChange={(e) => setModelChoice(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border text-slate-900"
                >
                  <option value="random_forest">Random Forest (Champion)</option>
                  <option value="logistic_regression">Logistic Regression (Baseline)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* NEW STATE INPUT */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">State (Numeric Code)</label>
                  <input type="number" name="state" value={formData.state} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-slate-900 bg-indigo-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Account Length (Days)</label>
                  <input type="number" name="account_length" value={formData.account_length} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Total Day Minutes</label>
                  <input type="number" name="total_day_minutes" value={formData.total_day_minutes} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Customer Service Calls</label>
                  <input type="number" name="number_customer_service_calls" value={formData.number_customer_service_calls} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Intl Plan (0=No, 1=Yes)</label>
                  <input type="number" name="international_plan" value={formData.international_plan} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-slate-900" />
                </div>
              </div>

              <button 
                onClick={predictChurn}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {loading ? "Analyzing..." : "Run Prediction"}
              </button>
            </div>
          </div>

          {/* Right Side: Results */}
          <div className="p-8 flex-1 bg-slate-900 text-white flex flex-col justify-center items-center text-center">
            {result ? (
              <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                <h3 className="text-xl font-medium text-slate-300">Churn Probability</h3>
                <div className={`text-6xl font-extrabold ${result.churn_risk_percentage > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {result.churn_risk_percentage}%
                </div>
                <p className="text-sm text-slate-400 pt-4">
                  Powered by <span className="uppercase text-indigo-400 font-semibold">{result.model_used.replace('_', ' ')}</span>
                </p>
              </div>
            ) : (
              <div className="text-slate-400 space-y-4">
                <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <p>Enter parameters and click predict to see the AI assessment.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}