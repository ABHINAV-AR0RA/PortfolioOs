import { useState, useRef } from 'react';
import { FiUploadCloud, FiX, FiImage } from 'react-icons/fi';
import { uploadService } from '../../services/uploadService';
import toast from 'react-hot-toast';

const ImageUploader = ({ value, onChange, label, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await uploadFile(file);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) await uploadFile(file);
  };

  const uploadFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      setIsUploading(true);
      const data = await uploadService.uploadImage(file);
      onChange(data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    onChange('');
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800/50 group">
          <img src={value} alt="Uploaded preview" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handleRemove}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-500/10' 
              : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-sm text-zinc-400">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 mb-3 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                <FiUploadCloud size={24} />
              </div>
              <p className="text-sm text-zinc-300 font-medium mb-1">
                Click or drag image to upload
              </p>
              <p className="text-xs text-zinc-500">
                SVG, PNG, JPG or GIF (max. 5MB)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
