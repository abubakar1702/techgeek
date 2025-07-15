import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaImage, FaCloudUploadAlt } from 'react-icons/fa';
import { ClipLoader } from "react-spinners";

const ChangeProfilePictureModal = ({ isOpen, onClose, onSubmit, isUpdating }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedFile) onSubmit(selectedFile);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 border border-gray-300 rounded-2xl shadow-2xl w-full max-w-md relative mx-4">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <IoClose size={24} />
                </button>

                <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-3">
                        <FaImage className="text-blue-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Update Profile Picture</h2>
                    <p className="text-gray-500 mt-1">Upload a new photo for your profile</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className={`border-2 border-dashed ${previewUrl ? 'border-transparent' : 'border-gray-200'} rounded-xl p-6 text-center transition-all bg-gray-50 hover:bg-gray-100 cursor-pointer`}>
                        <input
                            type="file"
                            id="file-upload"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            required
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            {previewUrl ? (
                                <div className="relative inline-block">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md"
                                    />
                                    <div className="absolute inset-0 rounded-full overflow-hidden">
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <FaCloudUploadAlt className="text-white text-2xl" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <FaCloudUploadAlt className="mx-auto text-gray-400 text-4xl mb-3" />
                                    <p className="text-gray-600 font-medium">Click to upload</p>
                                    <p className="text-gray-400 text-sm mt-1">PNG, JPG, JPEG (max. 5MB)</p>
                                </>
                            )}
                        </label>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 py-3 px-4 rounded-xl font-medium text-white transition-colors flex items-center justify-center ${isUpdating || !selectedFile ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            disabled={isUpdating || !selectedFile}
                        >
                            {isUpdating ? (
                                <>
                                    <ClipLoader color="#ffffff" size={20} className="mr-2" />
                                    Uploading...
                                </>
                            ) : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangeProfilePictureModal;