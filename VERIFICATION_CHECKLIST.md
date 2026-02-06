# 📋 Fab Homes Platform - Verification Checklist

Use this checklist to verify everything is properly set up.

---

## ✅ BACKEND SETUP VERIFICATION

### Database & Models
- [ ] Django models created (8 tables)
  - [ ] Agency ✓
  - [ ] UserProfile ✓
  - [ ] Property ✓
  - [ ] Inquiry ✓
  - [ ] Favorite ✓
  - [ ] Review ✓
  - [ ] Transaction ✓
  
- [ ] Migrations ran successfully
  ```bash
  python manage.py migrate
  python manage.py showmigrations
  ```

- [ ] Indexes created
  ```bash
  python manage.py sqlsequencereset properties core
  ```

### API Endpoints
- [ ] PropertyViewSet registered (list, create, update, delete, search, similar)
- [ ] InquiryViewSet registered (list, create, update_status)
- [ ] FavoriteViewSet registered (list, toggle)
- [ ] AgencyViewSet registered (list, properties, agents)
- [ ] Analytics endpoint working

### Admin Panel
- [ ] Superuser created
  ```bash
  python manage.py createsuperuser
  ```
  
- [ ] All models registered in admin
  - [ ] Agency admin ✓
  - [ ] UserProfile admin ✓
  - [ ] Property admin ✓
  - [ ] Inquiry admin ✓
  - [ ] Favorite admin ✓
  - [ ] Review admin ✓
  - [ ] Transaction admin ✓

- [ ] Admin accessible at `/admin/`

### Configuration
- [ ] DEBUG = True (development)
- [ ] SECRET_KEY set (not the default)
- [ ] ALLOWED_HOSTS configured
  ```python
  ALLOWED_HOSTS = ['localhost', '127.0.0.1']
  ```

- [ ] CORS configured properly
  ```python
  CORS_ALLOWED_ORIGINS = [
      "http://localhost:5173",
      "http://localhost:3000",
  ]
  ```

- [ ] REST Framework configuration
  - [ ] Pagination enabled (12 items/page)
  - [ ] Filter backends configured
  - [ ] Throttling enabled

### Firebase Integration
- [ ] Firebase credentials path configured
- [ ] Firebase initialization working
  - [ ] Check: `python manage.py shell` then `from firebase_config import verify_firebase_token`

### Dependencies
- [ ] All packages installed
  ```bash
  pip list | grep -E "Django|djangorest|firebase|psycopg"
  ```

---

## ✅ API TESTING VERIFICATION

### Basic Functionality Tests
```bash
# Test 1: Get all properties
curl http://localhost:8000/api/properties/

# Test 2: Get analytics
curl http://localhost:8000/api/analytics/

# Test 3: Get agencies
curl http://localhost:8000/api/agencies/

# Test 4: Search properties
curl "http://localhost:8000/api/properties/?city=nairobi&price__gte=100000"

# Test 5: Submit inquiry
curl -X POST http://localhost:8000/api/inquiries/ \
  -H "Content-Type: application/json" \
  -d '{
    "property": "test-uuid",
    "name": "Test User",
    "email": "test@example.com",
    "phone": "123456789",
    "message": "Test inquiry",
    "inquiry_type": "general"
  }'
```

Verify:
- [ ] All endpoints return 200 OK
- [ ] Response format is valid JSON
- [ ] Pagination works (has `count`, `next`, `previous`, `results`)
- [ ] Filtering works correctly
- [ ] Error handling works (404, 400, etc.)

---

## ✅ FRONTEND SETUP VERIFICATION

### Dependencies
- [ ] Node modules installed
  ```bash
  npm list | head -20
  ```

- [ ] React installed (latest)
  ```bash
  npm list react
  ```

- [ ] Vite dev server available
  ```bash
  npm run dev
  ```

### Configuration
- [ ] Firebase config updated (`src/firebase.js`)
  ```javascript
  const firebaseConfig = {
    apiKey: "YOUR_KEY",
    authDomain: "YOUR_DOMAIN",
    // ...
  };
  ```

- [ ] API base URL configured (`src/services/api.js`)
  ```javascript
  const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
  });
  ```

- [ ] Tailwind CSS working (styles applied)
  - [ ] Headings are bold
  - [ ] Colors applied correctly
  - [ ] Responsiveness works on mobile

### Components
- [ ] Header component renders ✓
- [ ] Footer component (if created)
- [ ] PropertyCard component renders (if created)
- [ ] Home page loads without errors
- [ ] Navigation between pages works

### SEO
- [ ] react-helmet installed
- [ ] Meta tags in Home.jsx
- [ ] Title tags unique per page

---

## ✅ AUTHENTICATION SETUP VERIFICATION

### Firebase Auth
- [ ] Firebase project created
- [ ] Web SDK credentials obtained
- [ ] Authentication methods enabled (Email, Google, etc.)
- [ ] CORS configured in Firebase

### Token Handling
- [ ] Frontend gets ID token from Firebase
- [ ] Token passed in Authorization header
- [ ] Backend verifies token with Firebase

### Protected Routes
- [ ] Create property requires authentication
- [ ] User favorites requires authentication
- [ ] User dashboard requires authentication

---

## ✅ DOCUMENTATION VERIFICATION

All files created and readable:
- [ ] DATABASE_SCHEMA.md (8 models, relationships, indexes)
- [ ] SETUP_GUIDE.md (installation, configuration, troubleshooting)
- [ ] IMPLEMENTATION_ROADMAP.md (components, features, priority)
- [ ] API_REFERENCE.md (endpoints, examples, error codes)
- [ ] PROJECT_SUMMARY.md (overview, what's built, what's next)

---

## ✅ DIRECTORY STRUCTURE VERIFICATION

Backend:
```
backend/
├── manage.py ✓
├── requirements.txt ✓ (updated)
├── db.sqlite3 (created after migrate)
├── fabhomes/
│   ├── settings.py ✓ (updated)
│   ├── urls.py ✓
│   ├── wsgi.py ✓
│   └── asgi.py ✓
└── properties/
    ├── models.py ✓ (8 models)
    ├── views.py ✓ (4 viewsets + analytics)
    ├── serializers.py ✓ (11 serializers)
    ├── urls.py ✓ (updated)
    ├── admin.py ✓ (7 admin classes)
    └── migrations/
        └── 0001_initial.py ✓
```

Frontend:
```
frontend/
├── package.json ✓
├── tailwind.config.js ✓ (updated)
├── index.html ✓
├── vite.config.js ✓
├── src/
│   ├── App.jsx ✓
│   ├── main.jsx ✓
│   ├── index.css ✓ (fixed)
│   ├── firebase.js (needs config)
│   ├── services/api.js ✓
│   ├── components/
│   │   ├── header.jsx ✓ (updated)
│   │   ├── footer.jsx (to create)
│   │   └── propertyCard.jsx (to create)
│   └── pages/
│       ├── Home.jsx ✓ (premium design)
│       ├── propertylisting.jsx (to create)
│       ├── propertydetails.jsx (to create)
│       ├── contact.jsx (to create)
│       └── About.jsx (to create)
```

Root:
```
├── DATABASE_SCHEMA.md ✓
├── SETUP_GUIDE.md ✓
├── API_REFERENCE.md ✓
├── IMPLEMENTATION_ROADMAP.md ✓
├── PROJECT_SUMMARY.md ✓
└── README.md (create if needed)
```

---

## ✅ PERFORMANCE CHECKS

Database:
- [ ] Indexes created for frequently queried fields
- [ ] Select_related used for foreign keys
- [ ] Prefetch_related used for reverse relations
- [ ] Pagination default 12 items/page

API:
- [ ] Response times < 500ms
- [ ] Throttling working (100/hr anon, 1000/hr user)
- [ ] Caching headers set correctly

Frontend:
- [ ] Lighthouse score > 80
- [ ] Images lazy loading
- [ ] CSS minified
- [ ] No console errors

---

## ✅ SECURITY CHECKS

Backend:
- [ ] DEBUG = False (production)
- [ ] SECRET_KEY unique and strong
- [ ] ALLOWED_HOSTS restricted
- [ ] HTTPS enforced (production)
- [ ] CORS properly configured
- [ ] SQL injection prevention (ORM)
- [ ] CSRF protection enabled
- [ ] Permission classes on endpoints
- [ ] No sensitive data in logs

Frontend:
- [ ] API keys not hardcoded (use env variables)
- [ ] No credentials in localStorage
- [ ] HTTPS used for external resources
- [ ] Input validation on forms

---

## ✅ TESTING CHECKLIST

Unit Tests:
- [ ] Model tests (if created)
- [ ] Serializer tests (if created)
- [ ] View tests (if created)

Integration Tests:
- [ ] Frontend-API integration working
- [ ] Authentication flow working
- [ ] Search/filter working
- [ ] Pagination working

Manual Tests:
- [ ] Create property works
- [ ] List properties with filters
- [ ] Submit inquiry works
- [ ] Favorite toggle works
- [ ] Admin panel works

---

## ✅ DEPLOYMENT CHECKLIST

Before going to production:
- [ ] Database backed up
- [ ] Static files collected
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Email backend configured
- [ ] Monitoring/logging setup
- [ ] Error handling tested
- [ ] Load testing done
- [ ] Security audit completed

---

## 🐛 TROUBLESHOOTING

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'properties'`
```bash
# Solution: Add to INSTALLED_APPS
# In settings.py, verify 'properties' is in INSTALLED_APPS
```

**Problem:** `django.core.exceptions.ImproperlyConfigured: AUTH_PASSWORD_VALIDATORS`
```bash
# Solution: Run migrations
python manage.py migrate
```

**Problem:** CORS errors
```bash
# Solution: Check CORS_ALLOWED_ORIGINS in settings.py
# Should match frontend URL exactly
```

### Frontend Issues

**Problem:** Tailwind styles not applying
```bash
# Solution: Clear cache and rebuild
npm run dev  # Restart dev server
# Hard refresh browser (Ctrl+Shift+Del)
```

**Problem:** Firebase auth not working
```bash
# Solution: Verify config in src/firebase.js
# Check Firebase Console for enabled auth methods
```

**Problem:** API calls returning 401
```bash
# Solution: Ensure token is passed in header
# Check Authorization header format: "Bearer TOKEN"
```

---

## 📞 QUICK COMMANDS

### Backend
```bash
# Migrations
python manage.py showmigrations
python manage.py makemigrations
python manage.py migrate

# Admin
python manage.py createsuperuser
python manage.py changepassword username

# Shell
python manage.py shell
python manage.py dbshell

# Server
python manage.py runserver
python manage.py runserver 0.0.0.0:8000

# Cleanup
python manage.py clean_migrations
```

### Frontend
```bash
# Development
npm run dev
npm run build
npm run preview
npm run lint

# Dependencies
npm install
npm update
npm audit fix
```

---

## ✨ FINAL CHECK

Before deploying to production:

```bash
# Backend checks
python manage.py check
python manage.py check --deploy
python manage.py test

# Frontend checks
npm run build  # Should complete without errors
npm run lint   # Should have no errors
```

---

**All checks passed? You're ready to deploy! 🚀**

