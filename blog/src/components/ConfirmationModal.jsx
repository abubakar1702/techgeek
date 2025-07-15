import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, confirmText = 'Confirm', cancelText = 'Cancel', children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
        <div className="mb-6 text-gray-700">{children}</div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >{cancelText}</button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;