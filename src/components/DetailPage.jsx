import React, { useState, useEffect } from 'react';
import Accordion from './Accordian';
import Tabs from './Tabs';
import { useParams, useNavigate } from 'react-router-dom';

// Status Modal Component - Updated to show status messages
const StatusModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {message}
          </h2>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ApproveRejectModal = ({ isOpen, onClose, onConfirm, action }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Confirm {action === 'approve' ? 'Approval' : 'Rejection'}
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to {action} this claim?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded text-white transition-colors ${
              action === 'approve' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {action === 'approve' ? 'Approve' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state for confirmation
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  
  // Modal state for status messages
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://click-format-covers-pipes.trycloudflare.com/claim-overview/${patientId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPatientData(data);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  // Modal handlers
  const openModal = (action) => {
    setModalAction(action);
    setModalOpen(true);
  };

  const showStatusMessage = (message) => {
    setStatusMessage(message);
    setStatusModalOpen(true);
  };

  const handleApprove = () => {
    console.log('Claim Approved for patient:', patientId);
    showStatusMessage('Claim approved');
    // Add your approve logic here - API call, state update, etc.
  };

  const handleReject = () => {
    console.log('Claim Rejected for patient:', patientId);
    showStatusMessage('Claim rejected');
    // Add your reject logic here - API call, state update, etc.
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading patient data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-xl mb-4">❌ Error Loading Data</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button 
            onClick={() => navigate('/')} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">No patient data found</div>
      </div>
    );
  }

  const { commercial_adjudication, icd_analysis, medical_adjudication } = patientData;
  const billDetails = commercial_adjudication?.final_bill_details;
  const validationResults = commercial_adjudication?.final_validation_details;

  // Progress steps - all completed
  const progressSteps = [
    { title: "Document processed successfully", completed: true },
    { title: "PDF Analysis Complete", completed: true },
    { title: "ICD Code Validated", completed: true },
    { title: "Tariff Analysis Done", completed: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back to Dashboard - moved outside */}
        <button 
          onClick={() => navigate('/')} 
          className="text-blue-600 hover:text-blue-800 font-medium mb-4 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        {/* Header with Approve/Reject buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* Approve/Reject buttons at the top right */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">CL</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{billDetails?.patient?.name}</h1>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => openModal('approve')}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Approve
              </button>
              <button
                onClick={() => openModal('reject')}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Reject
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">Medical Bill Analysis & Validation Report</p>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-base">
            <div className="flex items-center">
              <span className="font-medium text-gray-600">Age:</span>
              <span className="ml-2 text-gray-900">{billDetails?.patient?.age} yrs</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600">Gender:</span>
              <span className="ml-2 text-gray-900">{billDetails?.patient?.gender === 'F' ? 'Female' : 'Male'}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600">Contact:</span>
              <span className="ml-2 text-gray-900">{billDetails?.patient?.contact_number}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600">Hospital:</span>
              <span className="ml-2 text-gray-900">{billDetails?.hospital_name}</span>
            </div>
          </div>
        </div>

        {/* ICD Code Analysis */}
        {icd_analysis && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🔍 Medical Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-blue-900">ICD Code: {icd_analysis.icd_codes}</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {icd_analysis.icdApproved ? '✓ APPROVED' : '❌ NOT APPROVED'}
                  </span>
                </div>
                {icd_analysis.diagnosis?.value && (
                  <p className="text-sm text-blue-700 mb-1">
                    <strong>Diagnosis:</strong> {icd_analysis.diagnosis.value}
                  </p>
                )}
                {icd_analysis.surgery?.value && (
                  <p className="text-sm text-blue-700">
                    <strong>Surgery:</strong> {icd_analysis.surgery.value}
                  </p>
                )}
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-blue-900">Medical Adjudication</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {icd_analysis.icdApproved ? '✓ APPROVED Score: ' : '❌ NOT APPROVED Score: '}{medical_adjudication?.medical_analysis?.closeness_score}
                  </span>
                </div>
                {medical_adjudication?.medical_analysis?.analysis_summary && (
                  <p className="text-sm text-blue-700 mb-1">
                    {medical_adjudication.medical_analysis.analysis_summary}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs
          tabs={[
            {
              label: 'Commercial Overview',
              content: (
                <>
                  {/* Validation Summary - At the top */}
                  {validationResults?.summary && (
                    <div className="mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded text-center">
                          <div className="text-sm text-gray-600 mb-1">Total Billed Amount</div>
                          <div className="text-xl font-bold text-blue-600">₹{validationResults.summary.total_billed_amount?.toLocaleString()}</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded text-center">
                          <div className="text-sm text-gray-600 mb-1">Tariff Matched Amount</div>
                          <div className="text-xl font-bold text-green-600">₹{validationResults.summary.total_tariff_matched_amount?.toLocaleString()}</div>
                        </div>
                        <div className="bg-red-50 p-4 rounded text-center">
                          <div className="text-sm text-gray-600 mb-1">Total Variance</div>
                          <div className="text-xl font-bold text-red-600">₹{validationResults.summary.total_variance?.toLocaleString()}</div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded text-center">
                          <div className="text-sm text-gray-600 mb-1">Classification</div>
                          <div className="text-lg font-bold text-yellow-600">{validationResults.summary.overall_classification}</div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      {validationResults.summary.recommendations && validationResults.summary.recommendations.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                          <h3 className="font-medium text-blue-900 mb-2">💡 Recommendations</h3>
                          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                            {validationResults.summary.recommendations.map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Accordions for Commercial Overview and Tariff Validation */}
                  
                  {/* Commercial Overview Accordion */}
                  {billDetails && (
                    <Accordion title="💰 Commercial Overview">
                      {/* Final Bill Details Header */}
                      <div className="bg-gray-50 p-4 rounded mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">📋 Final Bill Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div><strong>Bill No:</strong> {billDetails.bill_number}</div>
                          <div><strong>Date:</strong> {billDetails.bill_date}</div>
                          <div><strong>Payment Mode:</strong> {billDetails.payment?.payment_mode}</div>
                        </div>
                      </div>

                      {/* Bill Items Table */}
                      {billDetails.items && billDetails.items.length > 0 && (
                        <div className="overflow-x-auto mb-6">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-3 text-left">Description</th>
                                <th className="border border-gray-300 p-3 text-center">Quantity</th>
                                <th className="border border-gray-300 p-3 text-right">Unit Price (₹)</th>
                                <th className="border border-gray-300 p-3 text-right">Amount (₹)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {billDetails.items.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="border border-gray-300 p-3">{item.description}</td>
                                  <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                                  <td className="border border-gray-300 p-3 text-right">{item.unit_price?.toLocaleString()}</td>
                                  <td className="border border-gray-300 p-3 text-right">{item.amount?.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="text-right space-y-2">
                        <div className="flex justify-end gap-20 text-lg font-bold border-t pt-4">
                          <span>Total Amount:</span>
                          <span>₹{billDetails.net_amount?.toLocaleString()}.00</span>
                        </div>
                      </div>
                    </Accordion>
                  )}

                  {/* Tariff Validation Accordion */}
                  {validationResults?.bill_validation_results && (
                    <Accordion title="📊 Tariff Validation Results">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 p-3 text-left">Bill Item</th>
                              <th className="border border-gray-300 p-3 text-right">Billed Amount</th>
                              <th className="border border-gray-300 p-3 text-left">Matched Tariff Service</th>
                              <th className="border border-gray-300 p-3 text-right">Tariff Price</th>
                              <th className="border border-gray-300 p-3 text-right">Variance</th>
                              <th className="border border-gray-300 p-3 text-center">Classification</th>
                            </tr>
                          </thead>
                          <tbody>
                            {validationResults.bill_validation_results.map((result, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-300 p-3">{result.bill_item?.description}</td>
                                <td className="border border-gray-300 p-3 text-right">₹{result.bill_item?.amount?.toLocaleString()}</td>
                                <td className="border border-gray-300 p-3">
                                  {result.matched_tariff_item ? result.matched_tariff_item.service_name : 'No Match'}
                                </td>
                                <td className="border border-gray-300 p-3 text-right">
                                  {result.tariff_calculated_amount ? `₹${result.tariff_calculated_amount.toLocaleString()}` : 'N/A'}
                                </td>
                                <td className={`border border-gray-300 p-3 text-right ${
                                  result.variance < 0 ? 'text-red-600' : 
                                  result.variance > 0 ? 'text-green-600' : 'text-gray-600'
                                }`}>
                                  {result.variance ? `₹${result.variance.toLocaleString()}` : 'N/A'}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    result.classification === 'UNDERCHARGED' ? 'bg-yellow-100 text-yellow-800' :
                                    result.classification === 'OVERCHARGED' ? 'bg-red-100 text-red-800' :
                                    result.classification === 'NO_TARIFF_MATCH' ? 'bg-gray-100 text-gray-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {result.classification?.replace('_', ' ')}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Accordion>
                  )}
                </>
              ),
            },
          ]}
        />

        {/* Confirmation Modal Component */}
        <ApproveRejectModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={modalAction === 'approve' ? handleApprove : handleReject}
          action={modalAction}
        />

        {/* Status Modal Component */}
        <StatusModal
          isOpen={statusModalOpen}
          message={statusMessage}
          onClose={() => setStatusModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default PatientDetail;
