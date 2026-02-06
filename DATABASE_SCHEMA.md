# Fab Homes - Real Estate Platform
## Database Schema & System Design

---

## 1. DATABASE ARCHITECTURE

### Core Entities

#### **Users Table**
```
id (UUID) - Primary Key
email (String, Unique)
phone (String)
first_name (String)
last_name (String)
profile_image_url (String/Firebase URL)
bio (Text)
role (Enum: 'buyer', 'seller', 'agent', 'admin')
firebase_uid (String, Unique)
is_verified (Boolean)
is_agent (Boolean)
agency_id (FK) - Link to Agency if agent
created_at (DateTime)
updated_at (DateTime)
```

#### **Properties Table**
```
id (UUID) - Primary Key
title (String)
description (Text)
price (Decimal)
property_type (Enum: 'house', 'apartment', 'condo', 'townhouse', 'land')
listing_type (Enum: 'sale', 'rent')
status (Enum: 'available', 'sold', 'pending', 'rented')
location (String)
latitude (Float)
longitude (Float)
city (String)
state (String)
zip_code (String)
country (String)
bedrooms (Integer)
bathrooms (Decimal)
total_area (Integer) - in sqft
garage_spaces (Integer)
year_built (Integer)
property_features (JSON) - ['swimming_pool', 'gym', 'garden', etc]
utilities (JSON) - ['water', 'electricity', 'gas']
furnishing (Enum: 'unfurnished', 'partially_furnished', 'fully_furnished')
monthly_rent (Decimal) - For rental properties
security_deposit (Decimal)
lease_term (String) - e.g., "12 months"
image_urls (Array/JSON) - Firebase Storage URLs
featured_image_url (String)
seller_id (FK) - User who listed
agent_id (FK) - Assigned agent
views_count (Integer)
created_at (DateTime)
updated_at (DateTime)
listed_at (DateTime)
```

#### **Inquiries Table**
```
id (UUID) - Primary Key
property_id (FK) - Property being inquired about
user_id (FK) - User making inquiry (nullable for guests)
name (String)
email (String)
phone (String)
message (Text)
inquiry_type (Enum: 'general', 'viewing_request', 'offer')
status (Enum: 'new', 'contacted', 'resolved', 'closed')
created_at (DateTime)
updated_at (DateTime)
```

#### **Agencies Table**
```
id (UUID) - Primary Key
name (String)
email (String)
phone (String)
logo_url (String)
description (Text)
address (String)
website (String)
verification_status (Enum: 'pending', 'verified', 'rejected')
created_at (DateTime)
updated_at (DateTime)
```

#### **Favorites Table**
```
id (UUID) - Primary Key
user_id (FK)
property_id (FK)
created_at (DateTime)
(Composite Unique: user_id + property_id)
```

#### **Reviews Table**
```
id (UUID) - Primary Key
reviewer_id (FK) - User giving review
agent_id (FK) - Agent being reviewed (optional)
agency_id (FK) - Agency being reviewed (optional)
property_id (FK) - Property being reviewed (optional)
rating (Integer) - 1-5 stars
comment (Text)
created_at (DateTime)
updated_at (DateTime)
```

#### **Transactions Table**
```
id (UUID) - Primary Key
property_id (FK)
buyer_id (FK)
seller_id (FK)
agent_id (FK)
transaction_type (Enum: 'sale', 'rental')
offer_price (Decimal)
final_price (Decimal)
status (Enum: 'negotiating', 'accepted', 'completed', 'cancelled')
transaction_date (DateTime)
closing_date (DateTime)
notes (Text)
created_at (DateTime)
updated_at (DateTime)
```

---

## 2. API ENDPOINTS

### Authentication
- `POST /api/auth/login` - Firebase login
- `POST /api/auth/register` - Create account
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh-token` - Refresh JWT
- `GET /api/auth/verify` - Verify email/phone

### Properties
- `GET /api/properties` - List properties (with filters)
- `GET /api/properties/{id}` - Get property details
- `POST /api/properties` - Create listing (auth required)
- `PUT /api/properties/{id}` - Update listing
- `DELETE /api/properties/{id}` - Delete listing
- `GET /api/properties/{id}/related` - Similar properties
- `POST /api/properties/{id}/views` - Track views

### Inquiries
- `POST /api/inquiries` - Create inquiry
- `GET /api/inquiries` - List inquiries (auth required)
- `PUT /api/inquiries/{id}` - Update inquiry status
- `DELETE /api/inquiries/{id}` - Delete inquiry

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites/{propertyId}` - Add to favorites
- `DELETE /api/favorites/{propertyId}` - Remove from favorites

### Users
- `GET /api/users/{id}` - Get user profile
- `PUT /api/users/{id}` - Update profile
- `GET /api/users/{id}/properties` - Get user's listings

### Agencies
- `GET /api/agencies` - List agencies
- `GET /api/agencies/{id}` - Agency details
- `GET /api/agencies/{id}/agents` - List agency agents
- `GET /api/agencies/{id}/properties` - Agency properties

---

## 3. RELATIONSHIPS

```
Users (1) ──→ (N) Properties (as seller)
Users (1) ──→ (N) Properties (as agent)
Users (1) ──→ (N) Inquiries
Users (1) ──→ (N) Favorites
Users (1) ──→ (N) Reviews (as reviewer)
Users (1) ──→ (N) Transactions (as buyer/seller/agent)
Users (1) ──→ (1) Agencies (agent to agency)

Agencies (1) ──→ (N) Users (agents)
Agencies (1) ──→ (N) Properties (listing agencies)

Properties (1) ──→ (N) Inquiries
Properties (1) ──→ (N) Favorites
Properties (1) ──→ (N) Reviews
Properties (1) ──→ (N) Transactions
```

---

## 4. INDEXING STRATEGY

For performance optimization:
- `properties.location, properties.price, properties.listing_type` - Composite index
- `properties.created_at` - For sorting/pagination
- `properties.views_count` - For trending properties
- `users.email, users.firebase_uid` - Unique indexes
- `favorites.user_id, properties.id` - Composite for quick lookups
- `inquiries.property_id, inquiries.status` - For filtering

---

## 5. STORAGE ARCHITECTURE

### Firebase Storage Structure
```
/properties/
  /{propertyId}/
    /featured/image.jpg
    /images/
      /001.jpg
      /002.jpg
      /...
    /documents/
      /deed.pdf
      /inspection_report.pdf

/users/
  /{userId}/
    /profile/avatar.jpg
    /documents/
      /id_verification.pdf

/agencies/
  /{agencyId}/
    /logo.png
    /documents/
```

---

## 6. AUTHENTICATION FLOW

1. User logs in with Firebase Auth
2. Firebase returns ID token
3. Frontend sends token to backend
4. Backend verifies token with Firebase
5. Backend creates/returns JWT for session
6. JWT used for subsequent API calls

---

## 7. SEARCH & FILTERING

Query parameters for property listing:
- `type` - property_type filter
- `listing` - sale/rent
- `minPrice`, `maxPrice` - price range
- `bedrooms`, `bathrooms` - number filters
- `location` - city/area
- `page`, `limit` - pagination
- `sort` - created_at, price, views_count
- `featured` - show featured only

---

## 8. SCALABILITY CONSIDERATIONS

- Use PostgreSQL with proper indexing
- Implement caching (Redis) for property listings
- Use pagination for all list endpoints
- Compress images before storage
- Implement rate limiting
- Use CDN for image delivery

