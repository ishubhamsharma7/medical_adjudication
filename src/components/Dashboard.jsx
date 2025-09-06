import React from 'react';
import { useNavigate } from 'react-router-dom';
import { patientsList } from '../data/sampleData';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleViewDetail = (patientId) => {
    navigate(`/patient-detail/${patientId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Doctor Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patientsList.map((patient) => (
            <div key={patient.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {patient.patientName}
                </h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                  ID: {patient.id}
                </span>
              </div>
              
              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Hospital:</span> {patient.hospital}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span> {patient.billDate}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total Amount:</span> ₹{patient.totalAmount.toLocaleString()}.00
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Diagnosis:</span> {patient.diagnosis}
                </p>
              </div>
              
              <div className="flex justify-end">
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  onClick={() => handleViewDetail(patient.id)}
                >
                  View Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
