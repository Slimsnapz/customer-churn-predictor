'use client';

import { useState } from 'react';

export default function Page() {
  // State for ML Model Selection
  const [modelChoice, setModelChoice] = useState('logistic_regression');

  // State for Customer Metrics
  const [stateCode, setStateCode] = useState(16);
  const [accountLength, setAccountLength] = useState(128);
  const [totalDayMinutes, setTotalDayMinutes] = useState(265.1);
  const [customerServiceCalls, setCustomerServiceCalls] = useState(1);
  const [intlPlan, setIntlPlan] = useState(0);

  // State for UI handling
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The fixed prediction function
  const runPrediction = async () => {
    setIsAnalyzing(true);
    setError(null);
    setPrediction(null);

    // This is the data package we are sending to your Python API
    const customerData = {
      model: modelChoice,
      state: stateCode,
      account_length: accountLength,
      total_day_minutes: totalDayMinutes,
      customer_service_calls: customerServiceCalls,
      intl_plan: intlPlan
    };

    try {
      // THE FIX: method: 'POST' is now explicitly declared
      const response = await fetch('https://saleem-churn-api.onrender.com/predict_churn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Assuming your Python API returns something like { "churn_risk": "85%" }
      // Adjust this key if your API sends back a different variable name!
      setPrediction(data.churn_risk || data.prediction || "High Risk"); 

    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Failed to connect to the prediction server.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Header */}
      <div className="max-w-4xl w-full text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Telecom Churn Predictor
        </h1>
        <p className="text-lg text-slate-600">
          Select an ML model and adjust customer metrics to predict churn risk.
        </p>
      </div>

      {/* Main App Container */}
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Panel: Inputs */}
        <div className="w-full md:w-1/2 p-8 bg-white flex flex-col gap-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Algorithm Selection</label>
            <select 
              value={modelChoice} 
              onChange={(e) => setModelChoice(e.target.value)}
              className="w-full rounded-md border border-slate-300 p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="logistic_regression">Logistic Regression (Baseline)</option>
              <option value="random_forest">Random Forest (Local Only)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">State (Numeric Code)</label>
              <input 
                type="number" 
                value={stateCode} 
                onChange={(e) => setStateCode(Number(e.target.value))}
                className="w-full rounded-md border border-slate-300 p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account Length (Days)</label>
              <input 
                type="number" 
                value={accountLength} 
                onChange={(e) => setAccountLength(Number(e.target.value))}
                className="w-full rounded-md border border-slate-300 p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Day Minutes</label>
              <input 
                type="number" 
                step="0.1"
                value={totalDayMinutes} 
                onChange={(e) => setTotalDayMinutes(Number(e.target.value))}
                className="w-full rounded-md border border-slate-300 p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer Service Calls</label>
              <input 
                type="number" 
                value={customerServiceCalls} 
                onChange={(e) => setCustomerServiceCalls(Number(e.target.value))}
                className="w-full rounded-md border border-slate-300 p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Intl Plan (0=No, 1=Yes)</label>
            <input 
              type="number" 
              value={intlPlan} 
              onChange={(e) => setIntlPlan(Number(e.target.value))}
              className="w-full rounded-md border border-slate-300 p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button 
            onClick={runPrediction}
            disabled={isAnalyzing}
            className="w-full mt-4 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
          >
            {isAnalyzing ? 'Analyzing...' : 'Run Prediction'}
          </button>
          
        </div>

        {/* Right Panel: Output */}
        <div className="w-full md:w-1/2 p-8 bg-slate-900 flex flex-col justify-center items-center text-center text-slate-300">
          {error ? (
            <div className="text-red-400 font-medium p-4 border border-red-500/30 rounded-lg bg-red-500/10">
              {error}
            </div>
          ) : prediction ? (
            <div className="animate-fade-in-up">
              <h3 className="text-xl font-medium text-slate-400 mb-2">AI Assessment Complete</h3>
              <p className="text-5xl font-bold text-white mb-2">{prediction}</p>
              <p className="text-sm text-indigo-300">Based on Logistic Regression Analysis</p>
            </div>
          ) : (
            <div className="opacity-70">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
              </svg>
              <p>Enter parameters and click predict to see the AI assessment.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}