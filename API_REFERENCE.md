# Fab Homes API Reference

## Base URL
```
http://localhost:8000/api/
```

## Authentication
Use Firebase ID Token in header:
```
Authorization: Bearer {firebase_id_token}
```

---

## ENDPOINTS

### 1. PROPERTIES

#### List Properties
```http
GET /properties/
```
**Filters:**
- `property_type`: house, apartment, condo, townhouse, land
- `listing_type`: sale, rent
- `status`: available, sold, pending, rented
- `city`: city name (case insensitive)
- `bedrooms__gte`, `bedrooms__lte`: bedroom range
- `bathrooms__gte`, `bathrooms__lte`: bathroom range
- `price__gte`, `price__lte`: price range
- `total_area__gte`, `total_area__lte`: area in sqft
- `monthly_rent__gte`, `monthly_rent__lte`: rent range

**Sorting:**
- `ordering=created_at` (oldest first)
- `ordering=-created_at` (newest first)
- `ordering=price` (low to high)
- `ordering=-price` (high to low)
- `ordering=-views_count` (most viewed)

**Example:**
```
GET /properties/?property_type=house&city=nairobi&price__gte=300000&price__lte=500000&bedrooms__gte=3&page=1&page_size=12&ordering=-created_at
```

---

#### Get Property Details
```http
GET /properties/{id}/
```

---

#### Create Property (Auth Required)
```http
POST /properties/
Content-Type: application/json

{
  "title": "Luxury 3BR House",
  "description": "Beautiful family home with modern amenities",
  "property_type": "house",
  "listing_type": "sale",
  "price": "450000",
  "location": "Westlands",
  "city": "Nairobi",
  "state": "Nairobi",
  "zip_code": "00100",
  "country": "Kenya",
  "bedrooms": 3,
  "bathrooms": 2.5,
  "total_area": 3500,
  "garage_spaces": 2,
  "year_built": 2020,
  "furnishing": "fully_furnished",
  "property_features": ["swimming_pool", "gym", "garden", "security"],
  "utilities": ["water", "electricity", "gas"],
  "featured_image_url": "https://...",
  "image_urls": ["https://...", "https://..."]
}
```

**Response:** 201 Created
```json
{
  "id": "uuid",
  "title": "...",
  "status": "available",
  "views_count": 0,
  "created_at": "2024-02-06T12:00:00Z"
}
```

---

#### Update Property (Auth Required)
```http
PUT /properties/{id}/
PATCH /properties/{id}/
Content-Type: application/json

{
  "title": "Updated title",
  "price": "500000",
  ...
}
```

---

#### Delete Property (Auth Required)
```http
DELETE /properties/{id}/
```

---

#### Search Properties
```http
GET /properties/search/?q=luxury&listing_type=sale&city=nairobi
```

**Query Params:**
- `q`: search term (searches title, description, location)
- `listing_type`: sale or rent
- `property_type`: house, apartment, etc.
- `city`: location
- `min_price`, `max_price`: price range

---

#### Get Similar Properties
```http
GET /properties/{id}/similar/
```

---

#### Track Property View
```http
POST /properties/{id}/increment_view/
```

---

### 2. INQUIRIES

#### Create Inquiry (No Auth Required)
```http
POST /inquiries/
Content-Type: application/json

{
  "property": "property-uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+254712345678",
  "message": "I am interested in this property",
  "inquiry_type": "viewing_request"
}
```

**Inquiry Types:**
- `general`: General inquiry
- `viewing_request`: Want to schedule viewing
- `offer`: Making an offer

**Response:** 201 Created
```json
{
  "id": "uuid",
  "property": "property-uuid",
  "status": "new",
  "created_at": "2024-02-06T12:00:00Z"
}
```

---

#### List Your Inquiries (Auth Required)
```http
GET /inquiries/
```

**Filters:**
- `property`: property UUID
- `status`: new, contacted, resolved, closed
- `inquiry_type`: general, viewing_request, offer

---

#### Get Inquiry Details (Auth Required)
```http
GET /inquiries/{id}/
```

---

#### Update Inquiry Status (Auth Required)
```http
PATCH /inquiries/{id}/update_status/
Content-Type: application/json

{
  "status": "contacted"
}
```

**Status Values:**
- `new`
- `contacted`
- `resolved`
- `closed`

---

### 3. FAVORITES

#### Get Your Favorites (Auth Required)
```http
GET /favorites/
```

---

#### Toggle Favorite (Auth Required)
```http
POST /favorites/toggle/
Content-Type: application/json

{
  "property_id": "property-uuid"
}
```

**Response if added:**
```json
{
  "detail": "Property added to favorites",
  "is_favorite": true
}
```

**Response if removed:**
```json
{
  "detail": "Property removed from favorites",
  "is_favorite": false
}
```

---

### 4. AGENCIES

#### List Verified Agencies
```http
GET /agencies/
```

**Filters:**
- `search`: search by name, state

---

#### Get Agency Details
```http
GET /agencies/{id}/
```

---

#### Get Agency Properties
```http
GET /agencies/{id}/properties/
```

---

#### Get Agency Agents
```http
GET /agencies/{id}/agents/
```

---

### 5. ANALYTICS

#### Get Platform Analytics
```http
GET /analytics/
```

**Response:**
```json
{
  "total_properties": 1250,
  "total_inquiries": 450,
  "available_properties": 1100,
  "for_sale": 750,
  "for_rent": 350,
  "total_users": 5000,
  "verified_agencies": 45,
  "total_reviews": 320,
  "completed_transactions": 120
}
```

---

## ERROR RESPONSES

### 400 Bad Request
```json
{
  "detail": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "detail": "You don't have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "detail": "Not found"
}
```

### 429 Too Many Requests
```json
{
  "detail": "Request was throttled. Try again in 60 seconds."
}
```

---

## PAGINATION

All list endpoints return paginated responses:

```json
{
  "count": 1250,
  "next": "http://localhost:8000/api/properties/?page=2",
  "previous": null,
  "results": [...]
}
```

**Query Parameters:**
- `page`: page number (default: 1)
- `page_size`: items per page (default: 12, max: 100)

**Example:**
```
GET /properties/?page=2&page_size=20
```

---

## SEARCH & FILTER EXAMPLES

### Example 1: Find Luxury Apartments in Westlands
```
GET /properties/?property_type=apartment&city=westlands&price__gte=500000&price__lte=2000000&ordering=-created_at
```

### Example 2: Find Affordable Houses for Rent
```
GET /properties/?property_type=house&listing_type=rent&city=nairobi&monthly_rent__gte=10000&monthly_rent__lte=50000&bedrooms__gte=2&ordering=price
```

### Example 3: Search for Properties
```
GET /properties/search/?q=modern&listing_type=sale&city=nairobi&min_price=300000&max_price=800000
```

### Example 4: Get Most Viewed Properties
```
GET /properties/?status=available&ordering=-views_count&page_size=10
```

### Example 5: Get Featured Properties
```
GET /properties/?featured=true
```

---

## TESTING WITH CURL

### Create a Property
```bash
curl -X POST http://localhost:8000/api/properties/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beautiful House",
    "price": "450000",
    "property_type": "house",
    "listing_type": "sale",
    "location": "Westlands",
    "city": "Nairobi",
    "state": "Nairobi",
    "zip_code": "00100",
    "country": "Kenya",
    "bedrooms": 3,
    "bathrooms": 2,
    "total_area": 3500
  }'
```

### Submit Inquiry
```bash
curl -X POST http://localhost:8000/api/inquiries/ \
  -H "Content-Type: application/json" \
  -d '{
    "property": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+254712345678",
    "message": "I am interested in this property",
    "inquiry_type": "viewing_request"
  }'
```

### Search Properties
```bash
curl "http://localhost:8000/api/properties/?property_type=house&city=nairobi&price__gte=300000&price__lte=500000&bedrooms__gte=3&ordering=-created_at"
```

---

## RATE LIMITS

- **Anonymous Users**: 100 requests/hour
- **Authenticated Users**: 1000 requests/hour

Response header:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1602838800
```

---

## STATUS CODES

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Server Error |

---

**Last Updated:** February 2024  
**API Version:** 1.0

