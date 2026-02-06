# Fab Homes - Real Estate Platform Setup Guide

## Project Overview

A modern real estate platform for buying and selling properties with a powerful Django REST API backend and React frontend.

### Key Features
- 🏠 Property listings (buy/rent)
- 🔍 Advanced search & filtering
- ❤️ Favorites & saved properties
- 📝 Property inquiries/leads
- 👥 User profiles & agencies
- 🔐 Firebase Authentication
- 📸 Firebase Storage for images
- ⭐ Reviews & ratings
- 📞 Contact management
- 📊 Analytics dashboard

---

## Backend Setup

### Prerequisites
- Python 3.9+
- PostgreSQL or SQLite (for development)
- pip

### Installation

1. **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Configure Environment Variables**
Create `.env` file in `backend/` directory:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (SQLite for dev, PostgreSQL for prod)
DATABASE_NAME=fabhomes_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=5432

# Firebase
FIREBASE_CREDENTIALS_PATH=path/to/serviceAccountKey.json

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

3. **Run Migrations**
```bash
python manage.py migrate
```

4. **Create Superuser**
```bash
python manage.py createsuperuser
```

5. **Collect Static Files**
```bash
python manage.py collectstatic --noinput
```

6. **Run Development Server**
```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin/`

---

## Frontend Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure Firebase** 
Update `src/firebase.js` with your Firebase credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

3. **Configure API Base URL**
Update `src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});
```

4. **Run Development Server**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## API Endpoints

### Public Endpoints (No Auth Required)

#### Properties
```
GET    /api/properties/              - List all properties
GET    /api/properties/{id}/         - Property details
GET    /api/properties/search/       - Advanced search
GET    /api/properties/{id}/similar/ - Similar properties
POST   /api/properties/{id}/increment_view/ - Track views
```

#### Agencies
```
GET    /api/agencies/                - List verified agencies
GET    /api/agencies/{id}/           - Agency details
GET    /api/agencies/{id}/properties/ - Agency properties
GET    /api/agencies/{id}/agents/    - Agency agents
```

#### Inquiries
```
POST   /api/inquiries/               - Submit inquiry (guest or auth)
```

#### Analytics
```
GET    /api/analytics/               - Platform analytics
```

### Protected Endpoints (Auth Required)

#### Properties (Authenticated Users)
```
POST   /api/properties/              - Create listing
PUT    /api/properties/{id}/         - Update listing
DELETE /api/properties/{id}/         - Delete listing
```

#### Favorites
```
GET    /api/favorites/               - Get user favorites
POST   /api/favorites/toggle/        - Add/remove favorite
```

#### Inquiries Management
```
GET    /api/inquiries/               - List your inquiries
PATCH  /api/inquiries/{id}/update_status/ - Update status
```

---

## Query Parameters

### Property Listing Filters

```
GET /api/properties/?property_type=house&listing_type=sale&city=nairobi&min_price=100000&max_price=500000&bedrooms__gte=3
```

**Available Filters:**
- `property_type`: house, apartment, condo, townhouse, land
- `listing_type`: sale, rent
- `status`: available, sold, pending, rented
- `city`: exact city match (case-insensitive)
- `bedrooms__gte`, `bedrooms__lte`: bedroom range
- `bathrooms__gte`, `bathrooms__lte`: bathroom range
- `price__gte`, `price__lte`: price range
- `monthly_rent__gte`, `monthly_rent__lte`: rental range
- `total_area__gte`, `total_area__lte`: area range

**Sorting:**
```
GET /api/properties/?ordering=-created_at  # Newest first
GET /api/properties/?ordering=price        # Price ascending
GET /api/properties/?ordering=-views_count # Most viewed
```

**Search:**
```
GET /api/properties/?search=luxury+apartment # Searches title, description, location
```

**Pagination:**
```
GET /api/properties/?page=2&page_size=20
```

---

## Firebase Setup

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com
2. Create a new project
3. Enable Authentication (Email/Password, Google, etc.)
4. Create a Firestore database or Realtime Database
5. Set up Storage bucket

### 2. Download Service Account Key
1. Go to Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Save as `backend/serviceAccountKey.json`

### 3. Frontend Configuration
1. In Firebase Console, go to Project Settings
2. Copy Web API configuration
3. Update `frontend/src/firebase.js`

---

## Database Schema Summary

### Main Tables
- **Users** - Django built-in + UserProfile extension
- **Properties** - Property listings (buy/rent)
- **Inquiries** - Property inquiries/leads
- **Favorites** - Saved properties
- **Agencies** - Real estate agencies
- **Reviews** - Ratings & reviews
- **Transactions** - Property transactions

See `DATABASE_SCHEMA.md` for detailed schema documentation.

---

## Development Workflow

### Creating a Property
```bash
curl -X POST http://localhost:8000/api/properties/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beautiful 3BR House",
    "description": "A lovely family home",
    "property_type": "house",
    "listing_type": "sale",
    "price": "450000",
    "location": "Nairobi",
    "city": "Nairobi",
    "state": "Nairobi",
    "zip_code": "00100",
    "country": "Kenya",
    "bedrooms": 3,
    "bathrooms": 2,
    "total_area": 3500,
    "property_features": ["swimming_pool", "gym"],
    "featured_image_url": "https://..."
  }'
```

### Searching Properties
```bash
curl "http://localhost:8000/api/properties/?property_type=house&city=nairobi&price__gte=300000&price__lte=500000&bedrooms__gte=3"
```

### Submitting Inquiry
```bash
curl -X POST http://localhost:8000/api/inquiries/ \
  -H "Content-Type: application/json" \
  -d '{
    "property": "property-uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+254712345678",
    "message": "I am interested in this property",
    "inquiry_type": "viewing_request"
  }'
```

---

## Deployment

### Production Checklist
- [ ] Set `DEBUG = False` in settings.py
- [ ] Update `SECRET_KEY` to secure random value
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Use PostgreSQL database
- [ ] Setup Gunicorn/uWSGI
- [ ] Use Nginx as reverse proxy
- [ ] Enable HTTPS/SSL
- [ ] Setup environment variables securely
- [ ] Configure static/media file serving
- [ ] Setup logging
- [ ] Configure email backend
- [ ] Run security checks: `python manage.py check --deploy`

### Docker Deployment
```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "fabhomes.wsgi:application", "--bind", "0.0.0.0:8000"]
```

---

## Testing

### Run Backend Tests
```bash
python manage.py test
```

### Run Frontend Tests
```bash
npm test
```

---

## Troubleshooting

### CORS Errors
- Check `CORS_ALLOWED_ORIGINS` in settings.py
- Ensure frontend URL matches exactly

### Firebase Auth Errors
- Verify Firebase credentials path
- Check Firebase rules allow access
- Ensure token is passed in `Authorization: Bearer TOKEN` header

### Database Errors
- Run migrations: `python manage.py migrate`
- Check database credentials in .env
- Ensure PostgreSQL is running (if using PostgreSQL)

### Frontend Not Loading
- Clear browser cache (Ctrl+Shift+Delete)
- Check console for errors (F12)
- Verify API_BASE_URL is correct
- Ensure backend is running

---

## Support & Resources

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

