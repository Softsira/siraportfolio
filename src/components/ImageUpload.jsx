import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { fileToBase64, validateImageFile, compressImage } from '../utils/imageUtils';
import toast from 'react-hot-toast';

const ImageUpload = ({ 
  currentImage, 
  onImageSelect, 
  type = 'avatar', // 'avatar' or 'banner'
  className = '',
  disabled = false 
}) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Validate file
      validateImageFile(file);

      // Compress image if it's large
      const compressedFile = await compressImage(
        file, 
        type === 'banner' ? 1200 : 400, 
        0.85
      );

      // Convert to base64
      const base64 = await fileToBase64(compressedFile);
      
      // Call parent callback
      onImageSelect(base64);
      
      // toast.success(`${type === 'banner' ? 'Banner' : 'Profile picture'} updated successfully!`);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error(error.message || 'Failed to process image');
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onImageSelect(null);
    toast.success(`${type === 'banner' ? 'Banner' : 'Profile picture'} removed`);
  };

  const isAvatar = type === 'avatar';

  return (
    <div className={`group relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload trigger */}
      <div 
        onClick={handleClick}
        className={`
          relative overflow-hidden cursor-pointer
          ${isAvatar 
            ? 'w-24 h-24 rounded-full' 
            : 'w-full h-40 rounded-t-lg'
          }
          ${disabled || isUploading ? 'cursor-not-allowed opacity-60' : 'hover:opacity-90'}
          transition-opacity duration-200
        `}
      >
        {/* Current image or placeholder */}
        {currentImage ? (
          <img
            src={currentImage}
            alt={type === 'banner' ? 'Banner' : 'Profile'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`
            w-full h-full bg-gray-300 flex items-center justify-center
            ${isAvatar ? 'rounded-full' : 'rounded-t-lg'}
          `}>
            <Camera className="w-8 h-8 text-gray-500" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className={`
          absolute inset-0 bg-black bg-opacity-50 
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          ${isAvatar ? 'rounded-full' : 'rounded-t-lg'}
        `}>
          {isUploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            <div className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">
                {currentImage ? 'Change' : 'Upload'}
              </span>
            </div>
          )}
        </div>

        {/* Remove button for existing images */}
        {currentImage && !isUploading && (
          <button
            onClick={handleRemove}
            className={`
              absolute bg-red-500 hover:bg-red-600 text-white
              rounded-full p-1 shadow-lg
              transition-colors duration-200
              ${isAvatar ? 'top-0 right-0 -mt-1 -mr-1' : 'top-2 right-2'}
            `}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Upload button for banner (alternative position) */}
      {!isAvatar && (
        <button
          onClick={handleClick}
          disabled={disabled || isUploading}
          className="absolute top-2 right-2 px-4 py-2 bg-white text-gray-600 rounded-lg shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Edit Banner'}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;