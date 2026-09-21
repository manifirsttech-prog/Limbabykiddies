import { Cloudinary } from '@cloudinary/url-gen';

// Initialize Cloudinary with your cloud name
export const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }
});

// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  apiUrl: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`
};

// Upload function for images
export const uploadImage = async (file: File): Promise<string> => {
  console.log('📤 Starting image upload:', file.name, 'Size:', file.size, 'bytes');
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  
  try {
    console.log('🔄 Uploading to Cloudinary with preset:', CLOUDINARY_CONFIG.uploadPreset);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    console.log('📥 Upload response status:', response.status);
    
    const responseData = await response.json();
    console.log('📦 Response data:', responseData);
    
    if (!response.ok) {
      const errorMessage = responseData.error?.message || `Upload failed with status ${response.status}`;
      console.error('❌ Cloudinary upload error:', errorMessage);
      console.error('🔍 Full error response:', responseData);
      throw new Error(errorMessage);
    }
    
    const imageUrl = responseData.secure_url;
    console.log('✅ Upload successful, URL:', imageUrl);
    return imageUrl;
  } catch (error: any) {
    console.error('❌ Error uploading image:', error);
    console.error('🔍 Error details:', error.message);
    throw error;
  }
};

// Upload function for videos
export const uploadVideo = async (file: File): Promise<string> => {
  console.log('📤 Starting video upload:', file.name, 'Size:', file.size, 'bytes');
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('resource_type', 'video');
  
  try {
    console.log('🔄 Uploading video to Cloudinary with preset:', CLOUDINARY_CONFIG.uploadPreset);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/video/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    console.log('📥 Video upload response status:', response.status);
    
    const responseData = await response.json();
    console.log('📦 Response data:', responseData);
    
    if (!response.ok) {
      const errorMessage = responseData.error?.message || `Video upload failed with status ${response.status}`;
      console.error('❌ Cloudinary video upload error:', errorMessage);
      console.error('🔍 Full error response:', responseData);
      throw new Error(errorMessage);
    }
    
    const videoUrl = responseData.secure_url;
    console.log('✅ Video upload successful, URL:', videoUrl);
    return videoUrl;
  } catch (error: any) {
    console.error('❌ Error uploading video:', error);
    console.error('🔍 Error details:', error.message);
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
