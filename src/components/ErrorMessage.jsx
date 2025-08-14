import React from 'react';

/**
 * Display error messages with support for ProblemDetails format
 */
const ErrorMessage = ({ error, onRetry }) => {
  // Handle different error formats
  let title = 'Error';
  let detail = 'An unknown error occurred';
  let status = null;
  let validationErrors = null;
  
  if (typeof error === 'string') {
    // Simple string error
    detail = error;
  } else if (error) {
    // ProblemDetails or enhanced error object
    title = error.title || 'Error';
    detail = error.detail || error.message || 'An unknown error occurred';
    status = error.status;
    validationErrors = error.errors; // Validation errors if present
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-red-600 text-xl font-bold mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {title}
          {status && <span className="text-gray-500 text-sm ml-2">({status})</span>}
        </h2>
        
        <p className="text-gray-700 mb-4">{detail}</p>
        
        {/* Display validation errors if present */}
        {validationErrors && Object.keys(validationErrors).length > 0 && (
          <div className="mb-4">
            <h3 className="text-red-600 font-bold mb-2">Validation Errors:</h3>
            <ul className="list-disc list-inside text-sm">
              {Object.entries(validationErrors).map(([field, errors]) => (
                <li key={field} className="mb-1">
                  <span className="font-semibold">{field}:</span> {Array.isArray(errors) ? errors.join(', ') : errors}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onRetry}
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
