# Limbaby Kiddies - Baby & Kids E-commerce Website

A professional, modern, and responsive baby and kids e-commerce website built with React, TypeScript, Vite, Tailwind CSS, and Firebase.

## 🌟 Features

### Public Website
- **Home Page**: Professional hero section, featured products, categories, brand story, and CTAs
- **Products Page**: Search, category filtering, and product grid with animations
- **Product Details**: Image gallery, size/color selection, quantity selector, add to cart
- **Shopping Cart**: Full cart management with customer info and order placement
- **About Page**: Brand story, mission, and values
- **Contact Page**: Contact form, email, phone, WhatsApp, and social links

### Admin Dashboard
- **Firebase Authentication**: Secure login with email/password
- **Overview Dashboard**: Revenue, orders, products stats with charts
- **Product Management**: 
  - Add/Edit/Delete products
  - **Image Upload**: Upload multiple product images to Firebase Storage
  - **Video Upload**: Upload product demonstration videos
  - Size and color management
  - Stock and status management
- **Order Management**: View all customer orders with details
- **Protected Routes**: Only authenticated admins can access the dashboard

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: React Icons + Lucide React
- **Backend**: Firebase
  - **Authentication**: Email/Password
  - **Storage**: Image and video file uploads

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd limbaby-kiddies
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

## 🔐 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "limbabykiddies"
3. Enable the following services:
   - **Authentication** (Email/Password)
   - **Storage** (for image/video uploads)

### 2. Configure Firebase
The Firebase configuration is already set up in `src/lib/firebase.ts` with your project credentials.

### 3. Enable Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Create your admin user:
   - Go to **Users** tab
   - Click **Add user**
   - Enter email and password (min 6 characters)
   - Save

### 4. Configure Storage Rules
In Firebase Console, go to **Storage** > **Rules** and update:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Login to Admin Dashboard
1. Navigate to `/admin/login`
2. Enter your Firebase admin credentials
3. You'll be redirected to the dashboard

## 📦 Product Management with Media Upload

### Adding Products with Images & Videos
1. Go to **Admin Dashboard** > **Products**
2. Click **Add Product**
3. Fill in product details:
   - Name, Category, Price, Description
   - Stock quantity
   - Sizes (comma-separated, e.g., "S, M, L, XL")
   - Colors (comma-separated, e.g., "Red, Blue, Green")
   - Status (Active, Draft, Out of Stock)
4. **Upload Images**:
   - Click the image upload area
   - Select one or multiple images
   - Images are uploaded to Firebase Storage
   - Download URLs are automatically saved
5. **Upload Video** (optional):
   - Click the video upload area
   - Select a video file (MP4, MOV, etc.)
   - Video is uploaded to Firebase Storage
   - Download URL is automatically saved
6. Click **Add Product**

### Editing Products
1. Click the edit icon (pencil) next to a product
2. Modify any field
3. Upload new images/videos (optional - replaces existing)
4. Click **Update**

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AnimatedSection.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── ProtectedRoute.tsx
│   └── StaggerContainer.tsx
├── context/            # React Context providers
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── data/              # Mock data
│   └── products.ts
├── lib/               # Utilities and Firebase config
│   ├── firebase.ts
│   └── utils.ts
├── pages/             # Page components
│   ├── AboutPage.tsx
│   ├── AdminDashboardPage.tsx
│   ├── AdminLoginPage.tsx
│   ├── CartPage.tsx
│   ├── ContactPage.tsx
│   ├── HomePage.tsx
│   ├── ProductDetailPage.tsx
│   └── ProductsPage.tsx
├── types/             # TypeScript types
│   └── product.ts
├── App.tsx            # Main app component with routing
├── index.css          # Global styles
└── main.tsx           # Entry point
```

## 🎨 Design Features

- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Smooth Animations**: Scroll-triggered animations with Framer Motion
- **Professional UI**: Clean, modern design with consistent branding
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Performance**: Optimized images, lazy loading, code splitting

## 🔒 Security

- Firebase Authentication protects admin routes
- Protected Route component redirects unauthenticated users
- Storage rules restrict write access to authenticated users
- All admin actions require valid authentication

## 📱 Routes

### Public Routes
- `/` - Home page
- `/products` - All products with filtering
- `/products/:slug` - Product details
- `/cart` - Shopping cart
- `/about` - About us
- `/contact` - Contact page

### Admin Routes (Protected)
- `/admin/login` - Admin login
- `/admin/dashboard` - Overview
- `/admin/dashboard/orders` - Order management
- `/admin/dashboard/products` - Product management

## 🌍 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Note: The current implementation has Firebase config hardcoded in `src/lib/firebase.ts`. For production, move to environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for Limbaby Kiddies

## 🆘 Support

For support, email adelekelollipop@gmail.com or call +2349048298906

---

**Note**: This is a frontend prototype. For production deployment, you'll need to:
- Set up Firestore database for product/order storage
- Implement payment gateway integration
- Add email notifications
- Set up proper error handling and logging
- Configure CORS for Firebase Storage
- Implement image optimization
- Add analytics and tracking
