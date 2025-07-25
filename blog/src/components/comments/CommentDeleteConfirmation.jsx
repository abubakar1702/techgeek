import React from 'react'

const CommentDeleteConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-2xl p-4 max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-2">Delete Comment</h2>
        <p className="mb-4 text-gray-700">Are you sure you want to delete this comment? This action cannot be undone.</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommentDeleteConfirmation