import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Replace the ID in the URL with the actual patientId from the route params
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <button 
            onClick={() => navigate('/')} 
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">CL</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Control Logic</h1>
          </div>
          <p className="text-gray-600 text-sm">Medical Bill Analysis & Validation Report</p>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="text-sm text-green-700">✅ Document processed successfully</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-sm text-blue-700">📄 PDF Analysis Complete</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded p-3">
              <p className="text-sm text-purple-700">🔍 ICD Code Validated</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded p-3">
              <p className="text-sm text-orange-700">💰 Tariff Analysis Done</p>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        {billDetails && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              👤 Patient Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">{billDetails.patient?.name}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-medium text-gray-700">Patient ID:</span>
                <span className="ml-2 text-gray-900">{billDetails.patient?.patient_id}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-medium text-gray-700">Age:</span>
                <span className="ml-2 text-gray-900">{billDetails.patient?.age} years</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-medium text-gray-700">Gender:</span>
                <span className="ml-2 text-gray-900">{billDetails.patient?.gender === 'F' ? 'Female' : 'Male'}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-medium text-gray-700">Contact:</span>
                <span className="ml-2 text-gray-900">{billDetails.patient?.contact_number}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-medium text-gray-700">Hospital:</span>
                <span className="ml-2 text-gray-900">{billDetails.hospital_name}</span>
              </div>
              {icd_analysis?.insurer_name?.value && (
                <div className="bg-gray-50 p-3 rounded col-span-full">
                  <span className="font-medium text-gray-700">Insurer:</span>
                  <span className="ml-2 text-gray-900">{icd_analysis.insurer_name.value}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ICD Code Analysis */}
        {icd_analysis && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🔍 ICD Code Analysis
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
                <h3 className="font-medium text-green-900 mb-2">Validation Status</h3>
                <div className="space-y-1 text-sm text-green-700">
                  <p>✓ ICD Code Valid: {icd_analysis.icdApproved ? 'Yes' : 'No'}</p>
                  {icd_analysis.diagnosis?.confidence && (
                    <p>✓ Diagnosis Confidence: {Math.round(icd_analysis.diagnosis.confidence * 100)}%</p>
                  )}
                  {icd_analysis.surgery?.confidence && (
                    <p>✓ Surgery Confidence: {Math.round(icd_analysis.surgery.confidence * 100)}%</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Commercial Adjudication */}
        {billDetails && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              💰 Commercial Adjudication
            </h2>
            
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
          </div>
        )}

        {/* Tariff Validation Results */}
        {validationResults?.bill_validation_results && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📊 Tariff Validation Results
            </h2>
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
          </div>
        )}

        {/* Validation Summary */}
        {validationResults?.summary && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📈 Validation Summary
            </h2>
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

        {/* Medical Adjudication */}
        {medical_adjudication && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🏥 Medical Adjudication
            </h2>
            
            {medical_adjudication.medical_analysis && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium text-gray-900 mb-2">Analysis Summary</h3>
                  <p className="text-sm text-gray-700">{medical_adjudication.medical_analysis.analysis_summary}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded">
                  <h3 className="font-medium text-blue-900 mb-2">Closeness Score</h3>
                  <div className="text-3xl font-bold text-blue-600">{medical_adjudication.medical_analysis.closeness_score}%</div>
                  <p className="text-sm text-blue-700">Treatment appropriateness score</p>
                </div>
              </div>
            )}

            {/* Mismatched Items */}
            {medical_adjudication.medical_analysis?.mismatched_items && medical_adjudication.medical_analysis.mismatched_items.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-4">
                <h3 className="font-medium text-yellow-900 mb-2">⚠️ Questionable Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {medical_adjudication.medical_analysis.mismatched_items.map((item, index) => (
                    <div key={index} className="text-sm text-yellow-800">• {item}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Expected Items */}
            {medical_adjudication.medical_analysis?.missing_expected_items && medical_adjudication.medical_analysis.missing_expected_items.length === 0 && (
              <div className="bg-green-50 border border-green-200 p-4 rounded">
                <p className="text-sm text-green-700">✅ No missing expected items identified</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;
