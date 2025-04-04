import React from 'react';

const BasicDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">LARK Dashboard</h1>
      <p className="mb-4">Welcome to the LARK dashboard. This is a basic version to ensure functionality.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Miranda Rights</h2>
          <p>Access and deliver Miranda rights</p>
          <button 
            onClick={() => {
              const event = new CustomEvent('changeTab', { detail: { tabId: 'miranda' } });
              document.dispatchEvent(event);
            }}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Open Miranda
          </button>
        </div>
        
        <div className="p-4 bg-blue-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Voice Assistant</h2>
          <p>Access voice commands and assistance</p>
          <button 
            onClick={() => {
              const event = new CustomEvent('changeTab', { detail: { tabId: 'voice' } });
              document.dispatchEvent(event);
            }}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Open Assistant
          </button>
        </div>
        
        <div className="p-4 bg-blue-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Statutes</h2>
          <p>Access legal statutes and codes</p>
          <button 
            onClick={() => {
              const event = new CustomEvent('changeTab', { detail: { tabId: 'statutes' } });
              document.dispatchEvent(event);
            }}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Open Statutes
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicDashboard;
