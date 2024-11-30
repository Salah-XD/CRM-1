import React from 'react';

const ConfirmationModal = ({ visible, onCancel, onSubmit, onSaveAsDraft }) => {
  if (!visible) return null; // Return null when modal is not visible

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Confirm</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-800 mb-6">Do you want to save as draft or submit?</p>
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={onSaveAsDraft}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Save as Draft
            </button>
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
        <div className="px-6 py-4 border-t">
          <button
            onClick={onCancel}
            className="w-full text-center text-gray-800 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
