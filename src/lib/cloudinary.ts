import { Cloudinary } from '@cloudinary/url-gen';

// Initialize Cloudinary with your cloud name
export const cld = new Cloudinary({
  cloud: {
    cloudName: 'pxz965s7'
  }
});

// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName: 'pxz965s7',
  apiKey: '517622224319167',
  apiSecret: 'tdhwQ-_lwCifLR8imWLS3iWdg7M',
  uploadPreset: 'Lim_baby', // Upload preset from Cloudinary dashboard (no spaces)
  apiUrl: 'https://api.cloudinary.com/v1_1/pxz965s7'
};

// Upload function for images
export const uploadImage = async (file: File): Promise<string> => {
  console.log('Starting image upload:', file.name, 'Size:', file.size, 'bytes');
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  
  try {
    console.log('Uploading to Cloudinary with preset:', CLOUDINARY_CONFIG.uploadPreset);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    console.log('Upload response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload error:', errorData);
      throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Upload successful, URL:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Upload function for videos
export const uploadVideo = async (file: File): Promise<string> => {
  console.log('Starting video upload:', file.name, 'Size:', file.size, 'bytes');
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('resource_type', 'video');
  
  try {
    console.log('Uploading video to Cloudinary with preset:', CLOUDINARY_CONFIG.uploadPreset);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/video/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    console.log('Video upload response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary video upload error:', errorData);
      throw new Error(errorData.error?.message || `Video upload failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Video upload successful, URL:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (publicId: string, options?: {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
}): string => {
  const { width, height, quality = 'auto', format = 'auto' } = options || {};
  
  let transformations = `q_${quality},f_${format}`;
  
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformations}/${publicId}`;
};
