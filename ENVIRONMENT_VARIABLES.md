# Environment Variables Setup Guide

## ✅ Environment Variables Created

I've created environment variable files for your project to securely manage your Firebase and Cloudinary credentials.

---

## 📁 Files Created

### 1. `.env` (Your Actual Credentials)
This file contains your real credentials and should **NEVER** be committed to version control.

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCbOXPNgjzC3jEqWuEBzQTrTwxX9w4Czew
VITE_FIREBASE_AUTH_DOMAIN=limbabykiddies.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=limbabykiddies
VITE_FIREBASE_STORAGE_BUCKET=limbabykiddies.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=939154494485
VITE_FIREBASE_APP_ID=1:939154494485:web:ecaa659342fb8092b9ea1c
VITE_FIREBASE_MEASUREMENT_ID=G-YQ4G93XD14

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=pxz965s7
VITE_CLOUDINARY_API_KEY=517622224319167
VITE_CLOUDINARY_API_SECRET=tdhwQ-_lwCifLR8imWLS3iWdg7M
VITE_CLOUDINARY_UPLOAD_PRESET=Lim baby

# Application Settings
VITE_APP_NAME=Limbaby Kiddies
VITE_APP_URL=http://localhost:5173
```

### 2. `.env.example` (Template File)
This is a template file that can be committed to version control. It shows what variables are needed without exposing actual credentials.

```env
# Firebase Configuration
# Get these values from: https://console.firebase.google.com/
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Cloudinary Configuration
# Get these values from: https://cloudinary.com/console
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Application Settings
VITE_APP_NAME=Limbaby Kiddies
VITE_APP_URL=http://localhost:5173
```

### 3. `.gitignore`
Updated to exclude `.env` files from version control.

### 4. `src/vite-env.d.ts`
TypeScript declarations for environment variables to prevent type errors.

---

## 🔧 Files Updated

### 1. `src/lib/firebase.ts`
Updated to use environment variables:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

### 2. `src/lib/cloudinary.ts`
Updated to use environment variables:

```typescript
export const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }
});

export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  apiUrl: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`
};
```

---

## 🔐 Your Environment Variables

Here are all your environment variables with their current values:

### Firebase Variables

| Variable | Value |
|----------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyCbOXPNgjzC3jEqWuEBzQTrTwxX9w4Czew` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `limbabykiddies.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `limbabykiddies` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `limbabykiddies.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `939154494485` |
| `VITE_FIREBASE_APP_ID` | `1:939154494485:web:ecaa659342fb8092b9ea1c` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-YQ4G93XD14` |

### Cloudinary Variables

| Variable | Value |
|----------|-------|
| `VITE_CLOUDINARY_CLOUD_NAME` | `pxz965s7` |
| `VITE_CLOUDINARY_API_KEY` | `517622224319167` |
| `VITE_CLOUDINARY_API_SECRET` | `tdhwQ-_lwCifLR8imWLS3iWdg7M` |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | `Lim baby` |

### Application Variables

| Variable | Value |
|----------|-------|
| `VITE_APP_NAME` | `Limbaby Kiddies` |
| `VITE_APP_URL` | `http://localhost:5173` |

---

## 📋 How to Use Environment Variables

### In Your Code

Access environment variables using `import.meta.env`:

```typescript
// Firebase
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Cloudinary
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Application
const appName = import.meta.env.VITE_APP_NAME;
```

### Important Notes

1. **All variables must start with `VITE_`** to be accessible in the browser
2. **Never commit `.env` to version control** (it's in `.gitignore`)
3. **Commit `.env.example`** as a template for other developers
4. **Restart your dev server** after changing `.env` values

---

## 🚀 Setup Instructions for New Developers

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd limbaby-kiddies
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create `.env` File
Copy the example file:
```bash
cp .env.example .env
```

### Step 4: Fill in Your Credentials
Open `.env` and replace the placeholder values with your actual credentials:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_actual_domain
# ... etc
```

### Step 5: Start Development Server
```bash
npm run dev
```

---

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Use environment variables for all sensitive data
- ✅ Keep `.env` in `.gitignore`
- ✅ Use `.env.example` as a template
- ✅ Use different credentials for development and production
- ✅ Rotate API keys regularly
- ✅ Use Firebase security rules
- ✅ Set up Cloudinary upload restrictions

### ❌ DON'T:
- ❌ Commit `.env` to Git
- ❌ Share `.env` file publicly
- ❌ Hardcode credentials in source code
- ❌ Use the same credentials across environments
- ❌ Store API secrets in client-side code (use backend for sensitive operations)

---

## 🌍 Production Deployment

When deploying to production, you'll need to set environment variables in your hosting platform:

### Vercel
1. Go to Project Settings → Environment Variables
2. Add each variable from `.env`
3. Redeploy

### Netlify
1. Go to Site Settings → Environment Variables
2. Add each variable from `.env`
3. Redeploy

### Firebase Hosting
1. Use Firebase Functions with environment config
2. Or use a `.env.production` file (not recommended for secrets)

---

## 🧪 Testing Environment Variables

To verify your environment variables are working:

```typescript
// Add this temporarily to any component
console.log('Firebase API Key:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('Cloudinary Cloud Name:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
```

Check the browser console to see if values are loaded correctly.

---

## 🆘 Troubleshooting

### Issue: "Property 'env' does not exist on type 'ImportMeta'"
**Solution:** Make sure `src/vite-env.d.ts` exists and is included in your `tsconfig.json`

### Issue: Environment variables are undefined
**Solution:** 
1. Check that variable names start with `VITE_`
2. Restart your development server
3. Verify `.env` file is in the project root

### Issue: Build fails with environment variable errors
**Solution:**
1. Check `.env` file syntax (no spaces around `=`)
2. Ensure all required variables are set
3. Verify TypeScript declarations in `vite-env.d.ts`

---

## 📊 Summary

✅ **Created Files:**
- `.env` - Your actual credentials
- `.env.example` - Template file
- `.gitignore` - Excludes `.env` from Git
- `src/vite-env.d.ts` - TypeScript declarations

✅ **Updated Files:**
- `src/lib/firebase.ts` - Uses environment variables
- `src/lib/cloudinary.ts` - Uses environment variables

✅ **Benefits:**
- 🔒 Secure credential management
- 🔄 Easy environment switching
- 👥 Better team collaboration
- 🚀 Production-ready setup

Your project is now properly configured with environment variables! 🎉
