# Environment Variables - Quick Reference

## 🔑 Your Environment Variables

Copy and paste these into your `.env` file:

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

---

## 📝 Variable Descriptions

### Firebase Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `VITE_FIREBASE_API_KEY` | Your Firebase API key | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_AUTH_DOMAIN` | Authentication domain | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_PROJECT_ID` | Your project ID | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket name | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID | Firebase Console → Project Settings → Cloud Messaging |
| `VITE_FIREBASE_APP_ID` | Your app ID | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_MEASUREMENT_ID` | Analytics measurement ID | Firebase Console → Project Settings → General |

### Cloudinary Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `VITE_CLOUDINARY_CLOUD_NAME` | Your cloud name | Cloudinary Dashboard → Dashboard home |
| `VITE_CLOUDINARY_API_KEY` | Your API key | Cloudinary Dashboard → Settings → API Keys |
| `VITE_CLOUDINARY_API_SECRET` | Your API secret | Cloudinary Dashboard → Settings → API Keys |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Upload preset name | Cloudinary Dashboard → Settings → Upload → Upload presets |

### Application Variables

| Variable | Description | Value |
|----------|-------------|-------|
| `VITE_APP_NAME` | Application name | Limbaby Kiddies |
| `VITE_APP_URL` | Application URL | http://localhost:5173 |

---

## 🚀 Quick Setup

1. **Copy the `.env` content above**
2. **Paste it into your `.env` file** (create if it doesn't exist)
3. **Restart your dev server**: `npm run dev`
4. **Done!** ✅

---

## 🔒 Security Note

⚠️ **IMPORTANT:** 
- The `.env` file contains sensitive credentials
- It's already in `.gitignore` so it won't be committed to Git
- Never share this file publicly
- Use different credentials for production

---

## 📚 Related Documentation

- Full setup guide: `ENVIRONMENT_VARIABLES.md`
- Template file: `.env.example`
- TypeScript types: `src/vite-env.d.ts`
