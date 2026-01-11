# TODO List for Real Estate Website Project

## 1. Project Structure Setup
- [x] Create 'frontend' and 'backend' subdirectories in the current directory.

## 2. Backend Setup (Django)
- [x] Set up Python virtual environment in backend directory.
- [x] Install Python dependencies: Django, Django REST Framework, psycopg2-binary, firebase-admin.
- [x] Initialize Django project named 'fabhomes' in backend directory.
- [x] Create Django app named 'properties'.
- [x] Configure settings.py: Add 'properties' and 'rest_framework' to INSTALLED_APPS, configure PostgreSQL database connection, add Firebase settings.
- [x] Design and define database models in properties/models.py: Property, Inquiry (extend User if needed for Firebase).
- [x] Run Django migrations to create database schema.
- [x] Create serializers in properties/serializers.py for Property and Inquiry models.
- [x] Create views in properties/views.py for CRUD operations on properties and inquiries, including Firebase Auth verification.
- [x] Configure URLs in properties/urls.py and fabhomes/urls.py for API endpoints (e.g., /api/properties/, /api/inquiries/).
- [x] Add Firebase configuration file for server-side integration.

## 3. Frontend Setup (React with Vite)
- [x] Initialize React app with Vite in frontend directory.
- [x] Install Node.js dependencies: Tailwind CSS, Firebase SDK, Axios, react-helmet for SEO.
- [x] Configure Tailwind CSS in vite.config.js and tailwind.config.js.
- [x] Set up Firebase client-side configuration in src/firebase.js.
- [x] Create basic components: Header, Footer, PropertyCard, PropertyList, PropertyDetail, InquiryForm.
- [x] Implement pages: Home, Properties, PropertyDetails, Contact.
- [x] Set up API service in src/services/api.js for connecting to backend.
- [x] Add SEO meta tags using react-helmet in components.

## 4. Integration and Testing
- [ ] Test backend API endpoints (e.g., create, read properties).
- [ ] Test frontend-backend integration (fetch properties, submit inquiries).
- [ ] Implement authentication flow: Firebase Auth on frontend, token verification on backend.
- [ ] Handle media uploads to Firebase Storage for property images.

## 5. Deployment Preparation
- [ ] Ensure environment variables are set for database, Firebase credentials.
- [ ] Prepare for deployment (e.g., build frontend, configure backend for production).
