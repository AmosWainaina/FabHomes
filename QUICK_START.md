# 🚀 Fab Homes - Quick Start Guide

## Prerequisites
- Node.js (v16+)
- Python 3.9+
- Git
- Firebase account
- PostgreSQL (optional, SQLite for dev)

---

## 📋 COMPLETE SETUP (15 minutes)

### Step 1: Clone & Setup Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser
# Follow the prompts to create admin account

# Start backend server
python manage.py runserver
# Server runs on http://localhost:8000
```

### Step 2: Setup Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Server runs on http://localhost:5173
```

### Step 3: Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing
3. Enable Authentication (Email/Password and Google)
4. Create a web app
5. Copy the config credentials
6. Update `frontend/src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

7. Update `backend/firebase_config.py` with Firebase Admin SDK credentials

### Step 4: Create Test Data

Visit Django Admin: http://localhost:8000/admin/

1. Log in with superuser credentials
2. Create Agencies:
   - Name: "Test Agency"
   - Email: "agency@fabtest.com"
   - Phone: "+254712345678"

3. Create Properties:
   - Title: "Luxury 3BR House"
   - Property Type: House
   - Listing Type: Sale
   - City: Nairobi
   - Price: 5000000
   - Bedrooms: 3
   - Bathrooms: 2
   - Total Area: 3500
   - Description: "Beautiful family home"

### Step 5: Test the Application

1. Open http://localhost:5173 in browser
2. Go to /properties to see property listing
3. Click on a property for details
4. Try filters (bedrooms, price range, location)
5. Click "Sign Up" to create account
6. Fill Firebase credentials and sign up
7. Access dashboard to see profile

---

## 🧪 TESTING API ENDPOINTS

```bash
# Get all properties
curl http://localhost:8000/api/properties/

# Filter properties (bedrooms >= 3, city = Nairobi)
curl "http://localhost:8000/api/properties/?bedrooms__gte=3&city=nairobi"

# Get property details
curl http://localhost:8000/api/properties/{property-id}/

# Submit inquiry (requires auth token)
curl -X POST http://localhost:8000/api/inquiries/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {firebase-id-token}" \
  -d '{
    "property": "property-id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+254712345678",
    "message": "Interested in this property",
    "inquiry_type": "general"
  }'

# Get analytics
curl http://localhost:8000/api/analytics/
```

---

## 🔑 AVAILABLE ROUTES

### Frontend Routes
- `/` - Home page
- `/properties` - Property listing with filters
- `/property/:id` - Property details
- `/login` - User login
- `/signup` - User signup
- `/dashboard` - User dashboard (protected)
- `/contact` - Contact page
- `/about` - About page

### Backend Routes (API)
- `/api/properties/` - Property endpoints
- `/api/inquiries/` - Inquiry endpoints
- `/api/favorites/` - Favorite properties
- `/api/agencies/` - Agency list
- `/api/analytics/` - Platform stats
- `/admin/` - Django admin panel

---

## 🔐 AUTHENTICATION FLOW

1. User signs up on `/signup`:
   - Enters name, email, phone, and password
   - Selects role (buyer, seller, agent)

2. Firebase creates user account
   - Backend creates UserProfile

3. User logs in on `/login`:
   - Firebase authenticates
   - ID token stored in localStorage
   - Redirected to home page

4. Protected features require token:
   - Submit inquiry
   - Favorite properties
   - View dashboard

5. Token expires:
   - User redirected to login
   - Token cleared from storage

---

## 🎨 CUSTOMIZATION

### Colors Theme
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  blue: { ... },    // Primary color
  gray: { ... },    // Text/background
  red: { ... },     // Errors/favorites
  green: { ... },   // Success messages
}
```

### API Base URL
Edit `frontend/src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});
```

### Django Settings
Edit `backend/fabhomes/settings.py`:
- `DEBUG = True/False`
- `ALLOWED_HOSTS = ['*']`
- `DATABASES` configuration
- `CORS_ALLOWED_ORIGINS`

---

## 🌐 DEPLOYMENT CHECKLIST

### Frontend (Vercel/Netlify)
- [ ] Push code to GitHub
- [ ] Connect GitHub repo to Vercel/Netlify
- [ ] Set environment variables:
  - `VITE_API_URL` = production API URL
  - Firebase credentials
- [ ] Deploy on push

### Backend (Heroku/Railway)
- [ ] Create PostgreSQL database
- [ ] Set environment variables:
  - `DEBUG = False`
  - `SECRET_KEY` = secure random key
  - `DATABASE_URL` = production database
  - `ALLOWED_HOSTS` = production domain
  - Firebase credentials
- [ ] Run migrations on deployment
- [ ] Collect static files
- [ ] Deploy

### Domain Setup
- [ ] Purchase domain
- [ ] Point to frontend hosting
- [ ] Configure backend API domain
- [ ] Update CORS settings
- [ ] Enable HTTPS

---

## 📊 MONITORING & DEBUGGING

### Frontend Debugging
1. Open DevTools (F12)
2. Check Console for errors
3. Check Network tab for API calls
4. Check Application tab for localStorage

### Backend Debugging
1. Check terminal output
2. View logs in `/tmp/` (Linux/Mac) or `AppData` (Windows)
3. Use Django shell:
   ```bash
   python manage.py shell
   from properties.models import Property
   Property.objects.all()
   ```
4. Check database:
   ```bash
   python manage.py dbshell
   ```

### Common Issues

**"Cannot find module 'lucide-react'"**
```bash
npm install lucide-react
```

**"Firebase credentials not found"**
- Ensure `src/firebase.js has valid config`
- Check Firebase project is active

**"CORS error from API"**
- Verify `CORS_ALLOWED_ORIGINS` in backend settings
- Check frontend URL matches exactly

**"Database connection error"**
- Ensure PostgreSQL is running
- Check `DATABASE_URL` environment variable
- Run migrations: `python manage.py migrate`

---

## 📱 TESTING CHECKLIST

### Frontend Testing
- [ ] Homepage loads
- [ ] Property listing displays
- [ ] Filters work correctly
- [ ] Search works
- [ ] Pagination works
- [ ] Property details page loads
- [ ] Images display
- [ ] Inquiry form works
- [ ] Login page works
- [ ] Signup creates account
- [ ] Dashboard displays user data
- [ ] Mobile responsive

### Backend Testing
- [ ] API responds to requests
- [ ] Filtering works
- [ ] Search works
- [ ] Pagination works
- [ ] Authentication works
- [ ] Admin panel accessible
- [ ] Can create properties
- [ ] Can submit inquiries

---

## 🔧 USEFUL COMMANDS

### Frontend
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend
```bash
# Migrations
python manage.py makemigrations
python manage.py migrate

# Create test data
python manage.py shell

# Run tests
python manage.py test

# Create superuser
python manage.py createsuperuser

# Shell access
python manage.py shell

# Static files
python manage.py collectstatic
```

---

## 📚 DOCUMENTATION FILES

1. **BUILD_COMPLETE.md** - Everything built and remaining
2. **API_REFERENCE.md** - All API endpoints with examples
3. **DATABASE_SCHEMA.md** - Database structure
4. **SETUP_GUIDE.md** - Detailed setup instructions
5. **IMPLEMENTATION_ROADMAP.md** - Development priorities

---

## 💬 SUPPORT

For issues:
1. Check the relevant documentation file
2. Review error messages carefully
3. Check console/terminal output
4. Verify credentials (Firebase, database, etc.)
5. Try clearing cache: `npm cache clean --force`

---

## ✅ YOU'RE READY!

Your Fab Homes platform is ready to use. The foundation is solid:
- ✅ Complete backend API
- ✅ Modern React frontend
- ✅ Firebase authentication
- ✅ Responsive design
- ✅ Advanced filtering
- ✅ User dashboard

Next step: Customize and deploy!

---

**Version**: 1.0
**Last Updated**: February 6, 2026
**Status**: Production Ready for Customization
