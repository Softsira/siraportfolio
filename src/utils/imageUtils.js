// Convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Validate image file
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB.');
  }

  return true;
};

// Compress image (optional - for better performance)
export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

// Get default avatar/banner
export const getDefaultAvatar = () => {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA1MEM1OC4yODQzIDUwIDY1IDQzLjI4NDMgNjUgMzVDNjUgMjYuNzE1NyA1OC4yODQzIDIwIDUwIDIwQzQxLjcxNTcgMjAgMzUgMjYuNzE1NyAzNSAzNUMzNSA0My4yODQzIDQxLjcxNTcgNTAgNTAgNTBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik01MCA2MEM2MS4wNDU3IDYwIDcwIDY4Ljk1NDMgNzAgODBWOTBIMzBWODBDMzAgNjguOTU0MyAzOC45NTQzIDYwIDUwIDYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
};

export const getDefaultBanner = () => {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDgwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iMjAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoOTBkZWcsICM2MzY2RjEgMCUsICM4QjVDRjYgMTAwJSkiLz4KPC9zdmc+';
};