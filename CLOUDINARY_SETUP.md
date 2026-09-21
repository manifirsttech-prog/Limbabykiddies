# Cloudinary Setup Guide

## ✅ Cloudinary Integration Complete

Your project is now integrated with Cloudinary for image and video uploads!

**Cloud Name:** `pxz965s7`

## 🚀 Setup Steps

### Step 1: Create Upload Preset in Cloudinary

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Navigate to **Settings** → **Upload** (gear icon)
3. Scroll down to **Upload presets** section
4. Click **Add upload preset**
5. Configure the preset:
   - **Preset Name:** `limbaby_kiddies`
   - **Signing Mode:** `Unsigned` (for frontend uploads)
   - **Folder:** `products` (optional, to organize uploads)
   
6. Under **Upload Control** settings:
   - **Max file size:** 10 MB (or your preference)
   - **Allowed formats:** 
     - Images: jpg, png, gif, webp
     - Videos: mp4, mov, avi
   
7. Click **Save**

### Step 2: Verify Configuration

Your Cloudinary setup should now be ready. The upload preset `limbaby_kiddies` will allow unsigned uploads from your frontend.

## 📝 What's Been Updated

### Files Modified:
- ✅ `src/lib/cloudinary.ts` - Cloudinary configuration and upload functions
- ✅ `src/pages/AdminDashboardPage.tsx` - Updated to use Cloudinary for uploads
- ✅ `src/components/CloudinaryImage.tsx` - Reusable Cloudinary image component

### Features:
- ✅ Image upload to Cloudinary
- ✅ Video upload to Cloudinary
- ✅ Automatic image optimization
- ✅ Automatic format conversion (WebP)
- ✅ Quality optimization
- ✅ CDN delivery

## 🔧 How It Works

### Admin Dashboard Upload Flow:
1. Admin selects images/videos in the product form
2. Files are uploaded to Cloudinary via unsigned upload
3. Cloudinary returns optimized URLs
4. URLs are saved to Firestore with the product
5. Product pages display images from Cloudinary CDN

### Image Optimization:
- **Auto Quality:** Cloudinary automatically adjusts quality for best performance
- **Auto Format:** Converts to WebP when supported by browser
- **Responsive:** Can generate different sizes for different devices
- **CDN:** Global CDN for fast delivery

## 🎨 Using CloudinaryImage Component

```tsx
import CloudinaryImage from '../components/CloudinaryImage';

// Basic usage
<CloudinaryImage 
  publicId="products/image-url" 
  alt="Product name"
  width={600}
  height={600}
/>

// With custom size
<CloudinaryImage 
  publicId="products/image-url" 
  alt="Product name"
  width={300}
  height={300}
  className="rounded-lg"
/>
```

## 📊 Cloudinary Dashboard Features

You can now:
- View all uploaded images in Media Library
- Apply transformations via URL parameters
- Monitor bandwidth and storage usage
- Set up automatic backups
- Configure access control

## 🔐 Security Notes

- **Unsigned Uploads:** Currently using unsigned uploads (simpler, frontend-only)
- **Upload Preset:** `limbaby_kiddies` allows uploads without authentication
- **File Size:** Configure max file size in upload preset settings
- **Allowed Formats:** Restrict file types in upload preset settings

## 🚀 Advanced Features (Optional)

### 1. Signed Uploads (More Secure)
For production, consider using signed uploads:
- Requires API Secret (keep on backend only)
- More control over who can upload
- Better security for sensitive content

### 2. Image Transformations
Cloudinary supports on-the-fly transformations:
```
https://res.cloudinary.com/pxz965s7/image/upload/w_300,h_300,c_fill/products/image.jpg
```

### 3. Video Transformations
```
https://res.cloudinary.com/pxz965s7/video/upload/w_640,h_360/products/video.mp4
```

## 📈 Monitoring

Check your Cloudinary dashboard for:
- **Storage usage:** How much space your media is using
- **Bandwidth:** How much data is being transferred
- **Transformations:** Number of image/video transformations
- **Uploads:** Number of files uploaded

## 🆘 Troubleshooting

### Upload Fails
- Verify upload preset name is `limbaby_kiddies`
- Check upload preset is set to "Unsigned"
- Verify cloud name is `pxz965s7`
- Check browser console for error messages

### Images Not Displaying
- Verify image URL is correct
- Check Cloudinary Media Library for uploaded files
- Verify product has images array in Firestore

### Video Not Playing
- Verify video format is supported (mp4, mov, webm)
- Check video URL is correct
- Verify video was uploaded successfully

## 📚 Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [React SDK](https://cloudinary.com/documentation/sdks/js/frontend/react)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Video Transformations](https://cloudinary.com/documentation/video_manipulation_and_delivery)

## ✅ Next Steps

1. Create the upload preset in Cloudinary dashboard
2. Test uploading a product with images
3. Test uploading a product with video
4. Verify images display correctly on product pages
5. Check Cloudinary dashboard to see uploaded files

---

**Note:** Your Cloudinary integration is complete! Just create the upload preset and you're ready to start uploading products with images and videos.
