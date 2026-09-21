# Firebase Firestore Setup Guide

## 🚀 Quick Start

### Step 1: Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **limbabykiddies**
3. In the left sidebar, click on **Firestore Database**
4. Click **Create database**
5. Choose **Start in test mode** (for development)
6. Select your preferred location (e.g., `eur3 (europe-west)`)
7. Click **Enable**

### Step 2: Configure Security Rules

For **development**, use test mode rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For **production**, use these secure rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products collection - public read, authenticated write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

To update rules:
1. Go to **Firestore Database** > **Rules** tab
2. Paste the rules above
3. Click **Publish**

### Step 3: Add Your First Product

#### Option A: Using the Admin Dashboard (Recommended)

1. Start the development server: `npm run dev`
2. Go to `http://localhost:5173/admin/login`
3. Login with your Firebase credentials
4. Go to **Products** > **Add Product**
5. Fill in the product details:
   - **Name**: Product name
   - **Category**: Select from dropdown
   - **Price**: Price in Naira (₦)
   - **Description**: Product description
   - **Stock**: Number of items in stock
   - **Sizes**: Comma-separated (e.g., "S, M, L, XL")
   - **Colors**: Comma-separated (e.g., "Red, Blue, Green")
   - **Status**: Active, Draft, or Out of Stock
   - **Featured**: Check to show on homepage
   - **Best Seller**: Check to show in best sellers section
6. Upload product images (multiple allowed)
7. Upload product video (optional)
8. Click **Add Product**

#### Option B: Using Firebase Console

1. Go to **Firestore Database** in Firebase Console
2. Click **Start collection**
3. Collection ID: `products`
4. Click **Add document**
5. Add fields:
   - `name` (string): "Product Name"
   - `slug` (string): "product-name" (lowercase, hyphens)
   - `category` (string): "Clothing" | "Shoes" | "School Bags" | "Bicycles" | "Car Seats" | "Baby Accessories" | "Toys"
   - `price` (number): 12500
   - `description` (string): "Product description..."
   - `images` (array): ["image-url-1", "image-url-2"]
   - `video` (string, optional): "video-url"
   - `sizes` (array, optional): ["S", "M", "L"]
   - `colors` (array, optional): ["Red", "Blue"]
   - `stock` (number): 45
   - `status` (string): "active" | "draft" | "out-of-stock"
   - `featured` (boolean): true/false
   - `bestSeller` (boolean): true/false
6. Click **Save**

### Step 4: Verify Products Display

1. Go to `http://localhost:5173/`
2. Your products should appear on the homepage
3. Go to `/products` to see all products
4. Click on a product to see details

## 📋 Sample Product Data

Here's a sample product you can add to test:

```json
{
  "name": "Organic Cotton Baby Onesie",
  "slug": "organic-cotton-baby-onesie",
  "category": "Clothing",
  "price": 12500,
  "description": "Ultra-soft organic cotton onesie perfect for your baby's delicate skin. Made with 100% GOTS-certified organic cotton.",
  "images": [
    "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=600&fit=crop"
  ],
  "sizes": ["0-3M", "3-6M", "6-12M", "12-18M"],
  "colors": ["White", "Pink", "Blue", "Mint"],
  "stock": 45,
  "status": "active",
  "featured": true,
  "bestSeller": true
}
```

## 🔍 Firestore Collections

### products
- **Purpose**: Store all product information
- **Documents**: Each product is a document
- **Fields**: See data structure above

## 🛠️ Troubleshooting

### Products not showing up?
1. Check browser console for errors
2. Verify Firestore is enabled in Firebase Console
3. Check security rules allow read access
4. Verify products exist in Firestore collection

### Can't add products from dashboard?
1. Verify you're logged in as admin
2. Check security rules allow write access for authenticated users
3. Check browser console for errors
4. Verify Firebase Storage is enabled (for image uploads)

### Images not uploading?
1. Verify Firebase Storage is enabled
2. Check Storage security rules
3. Check browser console for upload errors
4. Verify file size is within limits (5MB for free tier)

## 📊 Firestore Usage Limits (Free Tier)

- **Storage**: 1 GiB total
- **Documents**: Unlimited
- **Reads**: 50,000 per day
- **Writes**: 20,000 per day
- **Deletes**: 20,000 per day

For production, consider upgrading to a paid plan.

## 🔐 Security Best Practices

1. **Never commit Firebase config to public repos**
2. **Use environment variables** for sensitive data
3. **Set up proper security rules** before going live
4. **Enable Firebase Authentication** for admin access
5. **Monitor Firestore usage** in Firebase Console
6. **Set up billing alerts** to avoid unexpected charges

## 🚀 Next Steps

1. Add more products through the admin dashboard
2. Test the complete user flow:
   - Browse products
   - Add to cart
   - View cart
   - Place order
3. Test admin features:
   - Add/edit/delete products
   - Upload images and videos
   - View orders
4. Deploy to production (Vercel, Netlify, or Firebase Hosting)

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify Firebase project settings
3. Check Firestore and Storage are enabled
4. Review security rules
5. Check Firebase documentation: https://firebase.google.com/docs/firestore

---

**Note**: All product data is now stored in Firebase Firestore. The hardcoded product data has been removed. Make sure to add your products through the admin dashboard or Firebase Console.
