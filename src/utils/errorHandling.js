/**
 * Handles API error responses and extracts ProblemDetails information if available
 * @param {Response} response - The fetch API response object
 * @returns {Promise<Object>} - Promise that resolves to an error object with details
 */
export const handleApiError = async (response) => {
  const contentType = response.headers.get('content-type');
  
  // Check if the response is ProblemDetails format (application/problem+json)
  if (contentType && contentType.includes('application/problem+json')) {
    try {
      const problemDetails = await response.json();
      
      return {
        status: response.status,
        title: problemDetails.title || 'API Error',
        detail: problemDetails.detail || `Error ${response.status}`,
        type: problemDetails.type,
        instance: problemDetails.instance,
        extensions: problemDetails.extensions,
        errors: problemDetails.errors, // Validation errors
        isProblemDetails: true
      };
    } catch (err) {
      console.error('Error parsing ProblemDetails JSON:', err);
    }
  }
  
  // For other error formats or if JSON parsing fails
  // Try to parse the body as JSON anyway in case it contains useful information
  try {
    const errorBody = await response.json();
    return {
      status: response.status,
      title: 'API Error',
      detail: errorBody.message || errorBody.error || `Error ${response.status}`,
      isProblemDetails: false
    };
  } catch (err) {
    // Fallback for non-JSON or empty responses
    return {
      status: response.status,
      title: 'API Error',
      detail: `HTTP error! status: ${response.status}`,
      isProblemDetails: false
    };
  }
};

/**
 * Helper function to format an error for display
 * @param {Error|Object} error - Error object or ProblemDetails object
 * @returns {Object} - Formatted error with title and details
 */
export const formatError = (error) => {
  // Check if it's already a processed ProblemDetails object
  if (error && error.isProblemDetails) {
    return error;
  }
  
  // Handle AbortError specially
  if (error && error.name === 'AbortError') {
    return {
      title: 'Request Timeout',
      detail: 'The request timed out. The server might be overloaded or unavailable.',
      status: 408, // Timeout
      isProblemDetails: false
    };
  }
  
  // Handle standard Error objects
  return {
    title: 'Error',
    detail: error?.message || 'An unknown error occurred',
    status: error?.status || 500,
    isProblemDetails: false
  };
};
