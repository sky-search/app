# FlightAggregator Backend API Documentation

**Environment:** Production

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Core Endpoints](#core-endpoints)
   - [Chat & Conversation AI](#chat--conversation-ai)
   - [Flight Search](#flight-search)
   - [Itinerary Generation](#itinerary-generation)
   - [Trips Management](#trips-management)
   - [Checkout & Booking](#checkout--booking)
   - [Conversations History](#conversations-history)
4. [Request/Response Schemas](#request-response-schemas)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [WebSocket/Streaming](#websocket-streaming)

---

## Overview

The FlightAggregator API is a conversational AI-powered flight booking and trip planning platform. It combines:

- **AI Chat Interface** - Natural language flight search and trip planning
- **Flight Search** - Multi-source flight aggregation (Duffel, Amadeus)
- **Itinerary Generation** - RAG-powered, hallucination-free trip planning
- **Booking System** - Secure checkout with Stripe integration
- **Trip Management** - Full CRUD for saved trips

**Key Features:**
- Real-time streaming chat responses
- AI-powered flight search
- Knowledge engine for destination insights
- Session persistence
- JWT authentication

---

## Authentication

### Base Configuration

All authenticated endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Register User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "email": "user@example.com",
  "created_at": "2025-01-01T10:00:00Z"
}
```

**Validation:**
- Password must be 8-128 characters
- Email must be unique
- Email stored in lowercase

---

### Login

**Endpoint:** `POST /auth/login`

**Request Body:** (OAuth2 compatible - use form data or JSON)
```json
{
  "username": "user@example.com",  // Email goes in username field
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Token Expiration:** 7 days (10080 minutes)

---

### Get Current User

**Endpoint:** `GET /auth/me`

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "created_at": "2025-01-01T10:00:00Z"
}
```

---

## Core Endpoints

### Chat & Conversation AI

The AI chat system is the primary interface for flight search and trip planning.

#### Send Chat Message (Non-Streaming)

**Endpoint:** `POST /chat/message`

**Request Body:**
```json
{
  "message": "I want to fly to Dubai tomorrow",
  "session_id": "sess_abc123",  // Optional - auto-generated if not provided
  "user_id": 1,                  // Optional - for logged-in users
  "stream": false,               // Set to true for streaming
  "save_trip": false             // Auto-save generated itineraries
}
```

**Response:** `200 OK`
```json
{
  "response": "I found 12 flights to Dubai for tomorrow. Here are the best options:",
  "session_id": "sess_abc123",
  "messages": [
    {
      "role": "user",
      "content": "I want to fly to Dubai tomorrow"
    },
    {
      "role": "assistant",
      "content": "I found 12 flights to Dubai..."
    }
  ],
  "flight_cards": [
    {
      "offer_id": "off_12345",
      "airline": "Emirates",
      "origin": "TAS",
      "destination": "DXB",
      "departure_time": "2025-01-02T08:00:00Z",
      "arrival_time": "2025-01-02T11:30:00Z",
      "duration_minutes": 210,
      "stops": 0,
      "price": 450.00,
      "currency": "USD",
      "cabin_class": "economy",
      "booking_url": "https://..."
    }
  ],
  "search_info": {
    "origin": "TAS",
    "destination": "DXB",
    "departure_date": "2025-01-02",
    "return_date": null,
    "total_count": 12
  },
  "suggestions": [
    {
      "label": "✈️ Book this flight",
      "value": "BOOK_FLIGHT_off_12345"
    },
    {
      "label": "📅 Change dates",
      "value": "When would you like to fly?"
    }
  ],
  "itinerary_data": null,
  "saved_trip_id": null,
  "thought_process": [
    "User wants to fly to Dubai",
    "Detected origin: Tashkent (TAS)",
    "Searching for flights tomorrow",
    "Found 12 options"
  ]
}
```

---

#### Send Chat Message (Streaming)

**Endpoint:** `POST /chat/message/stream`

**Request Body:** Same as non-streaming

**Response:** Server-Sent Events (text/event-stream)

```
event: thinking
data: {"steps": ["Analyzing request...", "Searching flights..."], "action": "search_flights"}

event: token
data: {"content": "I found "}

event: token
data: {"content": "12 flights "}

event: data_payload
data: {"type": "flight_cards", "data": [...]}

event: suggestions
data: [{"label": "Book flight", "value": "..."}]

event: done
data: {"session_id": "sess_abc123"}
```

**Event Types:**
- `thinking` - AI reasoning steps (before response)
- `token` - Individual response tokens as they're generated
- `status` - Tool execution status (e.g., "🔍 Running search_flights...")
- `data_payload` - Structured data (flight cards, itineraries)
- `suggestions` - Smart action chips
- `done` - Stream completion
- `error` - Error occurred

**Example Frontend Integration:**
```javascript
const eventSource = new EventSource('/api/v1/chat/message/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    message: "Find flights to Dubai",
    session_id: currentSessionId
  })
});

eventSource.addEventListener('token', (e) => {
  const data = JSON.parse(e.data);
  appendToMessage(data.content);
});

eventSource.addEventListener('data_payload', (e) => {
  const payload = JSON.parse(e.data);
  if (payload.type === 'flight_cards') {
    displayFlightCards(payload.data);
  }
});

eventSource.addEventListener('done', (e) => {
  eventSource.close();
});
```

---

### Flight Search

Direct flight search endpoints (alternative to chat interface).

**Note:** The chat interface (`/chat/message`) is the recommended way to search flights as it provides:
- Natural language processing
- Automatic origin detection
- Personalized results
- Conversational refinement

---

### Itinerary Generation

AI-powered, RAG-grounded trip planning.

#### Generate Itinerary

**Endpoint:** `POST /itinerary/generate`

**Request Body:**
```json
{
  "user_request": "romantic 3-day trip with local food and historical sites",
  "city": "Samarkand",
  "days": 3,
  "start_date": "2025-03-15",  // Optional
  "pace": "relaxed",            // Optional: relaxed, moderate, fast
  "interests": ["history", "food", "culture"],  // Optional
  "budget": "moderate",         // Optional: budget, moderate, luxury
  "max_price_level": 3          // Optional: 1-4 (Google Places price level)
}
```

**Response:** `200 OK`
```json
{
  "city": "Samarkand",
  "country": "Uzbekistan",
  "total_days": 3,
  "interests": ["history", "food", "culture"],
  "pace": "relaxed",
  "days": [
    {
      "day_number": 1,
      "title": "Exploring Ancient Samarkand",
      "activities": [
        {
          "time": "09:00",
          "name": "Registan Square",
          "category": "attraction",
          "description": "Marvel at the stunning architecture of three madrasahs",
          "duration_minutes": 120,
          "location": "Registan, Samarkand",
          "location_lat": 39.6542,
          "location_lng": 66.9757,
          "cost": 10.0,
          "currency": "USD",
          "place_id": 123,
          "insider_tip": "Visit early morning to avoid crowds and get the best photos",
          "booking_required": false
        },
        {
          "time": "12:00",
          "name": "Samarkand Pilaf Center",
          "category": "restaurant",
          "description": "Authentic Uzbek plov experience",
          "duration_minutes": 90,
          "location": "Corner of Mahmud Koshgary and Kuk Saray",
          "location_lat": 39.6458,
          "location_lng": 66.9542,
          "cost": 15.0,
          "currency": "USD",
          "place_id": 456,
          "insider_tip": "Try the traditional plov with quail eggs",
          "booking_required": false
        }
      ]
    }
  ],
  "grounding": {
    "total_places_used": 15,
    "verified_places": 12,
    "sources": [
      "Qdrant semantic search",
      "Google Places verified data"
    ]
  }
}
```

---

#### Save Itinerary to Trip

**Endpoint:** `POST /itinerary/save`

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "itinerary": {
    "city": "Samarkand",
    "total_days": 3,
    "days": [...]  // Full itinerary object from /generate
  },
  "session_id": "sess_abc123"  // Optional - links to chat session
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "trip_id": 42,
  "message": "Saved trip '3 Days in Samarkand' with 3 days"
}
```

---

#### Preview Available Data

**Endpoint:** `GET /itinerary/preview/{city}`

**Query Parameters:**
- `days` (optional, default: 3): Number of days to check

**Example:** `GET /itinerary/preview/Samarkand?days=3`

**Response:** `200 OK`
```json
{
  "city": "Samarkand",
  "is_ready": true,
  "total_places": 150,
  "verified_places": 120,
  "categories": {
    "attraction": 45,
    "restaurant": 30,
    "hotel": 25,
    "cafe": 20,
    "museum": 15,
    "shopping": 15
  },
  "sample_places": [
    {
      "name": "Registan Square",
      "category": "attraction",
      "rating": 4.8,
      "verified": true,
      "has_tip": true
    }
  ],
  "has_metadata": true,
  "metadata": {
    "cultural_badges": ["Silk Road", "Islamic Architecture", "UNESCO Heritage"],
    "best_months": ["April", "May", "September", "October"],
    "description": "Ancient Silk Road city with stunning Islamic architecture"
  },
  "recommendation": "Ready to generate 3-day itinerary!"
}
```

---

### Trips Management

Full CRUD for user's saved trips.

#### List User Trips

**Endpoint:** `GET /trips`

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (planning, active, completed, cancelled)
- `limit` (optional, default: 20): Results per page
- `offset` (optional, default: 0): Pagination offset

**Example:** `GET /trips?status=active&limit=10&offset=0`

**Response:** `200 OK`
```json
{
  "trips": [
    {
      "id": 1,
      "title": "3 Days in Samarkand",
      "destination": "Samarkand",
      "destination_country": "Uzbekistan",
      "destination_country_code": "UZ",
      "start_date": "2025-03-15",
      "end_date": "2025-03-17",
      "status": "planning",
      "total_cost": 450.00,
      "currency": "USD",
      "pace": "relaxed",
      "vibe_tags": ["history", "food", "culture"],
      "cover_image_url": "https://...",
      "session_id": "sess_abc123",
      "created_at": "2025-01-01T10:00:00Z",
      "updated_at": "2025-01-01T12:00:00Z",
      "days": [
        {
          "id": 1,
          "day_number": 1,
          "date": "2025-03-15",
          "title": "Exploring Ancient Samarkand",
          "activities": [...]
        }
      ]
    }
  ],
  "total": 5
}
```

---

#### Get Single Trip

**Endpoint:** `GET /trips/{trip_id}`

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:** `200 OK` - Same structure as single trip in list

**Errors:**
- `404 Not Found` - Trip doesn't exist or doesn't belong to user

---

#### Create Trip

**Endpoint:** `POST /trips`

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "My Uzbekistan Adventure",
  "destination": "Samarkand",
  "destination_country": "Uzbekistan",
  "destination_country_code": "UZ",
  "start_date": "2025-03-15",
  "end_date": "2025-03-17",
  "status": "planning",
  "total_cost": 0.0,
  "currency": "USD",
  "pace": "relaxed",
  "vibe_tags": ["history", "culture"],
  "cover_image_url": "https://...",
  "session_id": "sess_abc123"
}
```

**Response:** `201 Created` - Trip object

---

#### Update Trip

**Endpoint:** `PATCH /trips/{trip_id}`

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Trip Title",
  "status": "active",
  "start_date": "2025-03-20"
}
```

**Response:** `200 OK` - Updated trip object

---

#### Delete Trip

**Endpoint:** `DELETE /trips/{trip_id}`

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:** `204 No Content`

**Note:** Cascades deletion to all days and activities

---

#### Add Day to Trip

**Endpoint:** `POST /trips/{trip_id}/days`

**Request Body:**
```json
{
  "day_number": 4,
  "date": "2025-03-18",
  "title": "Day 4: Free Exploration"
}
```

**Response:** `201 Created`
```json
{
  "id": 10,
  "day_number": 4,
  "date": "2025-03-18",
  "title": "Day 4: Free Exploration",
  "activities": []
}
```

---

#### Add Activity to Day

**Endpoint:** `POST /trips/{trip_id}/days/{day_id}/activities`

**Request Body:**
```json
{
  "name": "Dinner at Local Restaurant",
  "description": "Try traditional Uzbek cuisine",
  "location": "City Center",
  "location_lat": 39.6542,
  "location_lng": 66.9757,
  "time": "19:00",
  "duration_minutes": 90,
  "cost": 25.0,
  "currency": "USD",
  "category": "restaurant",
  "order_index": 0,
  "booking_url": "https://...",
  "is_booked": false,
  "confirmation_code": null
}
```

**Response:** `201 Created` - Activity object

**Categories:** 
- `attraction`, `restaurant`, `hotel`, `transportation`, `activity`, `shopping`, `nightlife`, `other`

---

#### Update Activity

**Endpoint:** `PATCH /trips/{trip_id}/activities/{activity_id}`

**Request Body:** (all fields optional)
```json
{
  "is_booked": true,
  "confirmation_code": "ABC123",
  "cost": 30.0
}
```

**Response:** `200 OK` - Updated activity

**Note:** Automatically recalculates trip total cost

---

#### Delete Activity

**Endpoint:** `DELETE /trips/{trip_id}/activities/{activity_id}`

**Response:** `204 No Content`

---

#### Reorder Activities

**Endpoint:** `POST /trips/{trip_id}/activities/reorder`

**Request Body:**
```json
{
  "activity_ids": [5, 3, 1, 2, 4]  // New order
}
```

**Response:** `200 OK`
```json
{
  "message": "Activities reordered successfully"
}
```

---

### Checkout & Booking

Secure flight booking with Stripe integration.

#### Initiate Checkout

**Endpoint:** `POST /checkout/initiate`

**Request Body:**
```json
{
  "offer_id": "off_12345",
  "user_id": 1,              // Optional
  "email": "user@example.com",  // Optional pre-fill
  "selected_services": [],   // Optional seat/bag service IDs
  "markup_amount": 10.0,     // Your profit margin
  "metadata": {
    "source": "chat",
    "session_id": "sess_abc"
  }
}
```

**Response:** `200 OK`
```json
{
  "checkout_session_id": "checkout_xyz789",
  "client_token": "pi_xyz_secret_abc",  // For Stripe frontend
  "offer_amount": 450.00,
  "markup_amount": 10.00,
  "service_fee": 5.00,
  "total_amount": 465.00,
  "currency": "USD",
  "offer_expires_at": "2025-01-01T11:00:00Z",
  "session_expires_at": "2025-01-01T10:30:00Z",
  "offer_summary": {
    "airline": "Emirates",
    "route": "TAS → DXB",
    "departure": "2025-01-02T08:00:00Z",
    "passengers": 1
  },
  "passenger_requirements": {
    "identity_documents_required": true,
    "passport_required": true
  }
}
```

---

#### Submit Passenger Details

**Endpoint:** `POST /checkout/passengers`

**Request Body:**
```json
{
  "checkout_session_id": "checkout_xyz789",
  "passengers": [
    {
      "offer_passenger_id": "pas_12345",
      "type": "adult",
      "title": "mr",
      "given_name": "John",
      "family_name": "Doe",
      "gender": "m",
      "born_on": "1990-01-15",
      "email": "john@example.com",
      "phone_number": "+998901234567",
      "identity_documents": [
        {
          "type": "passport",
          "unique_identifier": "AB1234567",
          "issuing_country_code": "US",
          "expires_on": "2030-01-15"
        }
      ]
    }
  ],
  "contact_email": "john@example.com",
  "contact_phone": "+998901234567"
}
```

**Response:** `200 OK`
```json
{
  "checkout_session_id": "checkout_xyz789",
  "passengers_valid": true,
  "ready_for_payment": true,
  "validation_errors": null
}
```

**Validation Errors Example:**
```json
{
  "passengers_valid": false,
  "ready_for_payment": false,
  "validation_errors": [
    {
      "field": "passengers[0].identity_documents",
      "error": "Passport required for international flights"
    }
  ]
}
```

---

#### Confirm Payment & Create Booking

**Endpoint:** `POST /checkout/confirm`

**Request Body:**
```json
{
  "checkout_session_id": "checkout_xyz789",
  "payment_method_id": "pm_xyz123",  // Stripe PaymentMethod ID
  "additional_services": []           // Optional
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "booking_id": "booking_abc789",
  "booking_reference": "ABC123",  // PNR
  "duffel_order_id": "ord_xyz",
  "total_paid": 465.00,
  "currency": "USD",
  "flights": [
    {
      "origin": "TAS",
      "destination": "DXB",
      "departure": "2025-01-02T08:00:00Z",
      "arrival": "2025-01-02T11:30:00Z",
      "airline": "Emirates",
      "flight_number": "EK123"
    }
  ],
  "passengers": [
    {
      "name": "John Doe",
      "ticket_number": "1762384765432"
    }
  ],
  "confirmation_email_sent": true,
  "documents": [
    {
      "type": "eticket",
      "url": "https://..."
    }
  ],
  "post_booking": {
    "booking_summary": {
      "booking_id": "booking_abc789",
      "booking_reference": "ABC123",
      "origin_code": "TAS",
      "origin_city": "Tashkent",
      "destination_code": "DXB",
      "destination_city": "Dubai",
      "departure_date": "2025-01-02",
      "return_date": null,
      "airline": "Emirates",
      "total_paid": 465.00,
      "currency": "USD",
      "passengers_count": 1,
      "is_international": true
    },
    "suggestions": [
      {
        "label": "🏨 Book hotel in Dubai",
        "value": "Find hotels in Dubai",
        "icon": "🏨",
        "type": "query"
      },
      {
        "label": "🗺️ Plan Dubai itinerary",
        "value": "Create a 3-day Dubai itinerary",
        "icon": "🗺️",
        "type": "query"
      }
    ],
    "chat_context": "You've successfully booked your flight to Dubai. Would you like help with accommodation or planning activities?",
    "next_steps": [
      "Check-in online 24 hours before departure",
      "Arrive at airport 3 hours early for international flights",
      "Check visa requirements for UAE"
    ]
  }
}
```

**Payment Flow:**
1. Frontend creates Stripe PaymentMethod using Stripe.js
2. Send `payment_method_id` to this endpoint
3. Backend:
   - Authorizes payment (holds funds)
   - Creates Duffel booking
   - If success: Captures payment
   - If failure: Cancels authorization

---

### Conversations History

Manage chat conversation history.

#### List Conversations

**Endpoint:** `GET /conversations`

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional, default: 20)
- `offset` (optional, default: 0)

**Response:** `200 OK`
```json
{
  "conversations": [
    {
      "session_id": "sess_abc123",
      "title": "I want to fly to Dubai tomorrow",
      "trip_id": 5,
      "last_message_at": "2025-01-01T12:00:00Z",
      "message_count": 8,
      "preview": "I found 12 flights to Dubai...",
      "has_flights": true,
      "has_itinerary": false
    }
  ],
  "total": 15
}
```

---

#### Get Conversation Detail

**Endpoint:** `GET /conversations/{session_id}`

**Response:** `200 OK`
```json
{
  "session_id": "sess_abc123",
  "title": "Flight to Dubai",
  "messages": [
    {
      "id": "msg_0",
      "role": "user",
      "content": "I want to fly to Dubai tomorrow",
      "timestamp": "2025-01-01T10:00:00Z"
    },
    {
      "id": "msg_1",
      "role": "assistant",
      "content": "I found 12 flights to Dubai...",
      "timestamp": "2025-01-01T10:00:05Z",
      "ui": {
        "type": "flight_cards",
        "data": [...],
        "is_expired": false,
        "expires_in_minutes": 15,
        "expiration_message": null
      }
    }
  ],
  "trip_id": null,
  "flight_cards": [...],
  "flight_cards_expired": false,
  "search_info": {
    "origin": "TAS",
    "destination": "DXB",
    "departure_date": "2025-01-02",
    "total_count": 12,
    "searched_at": "2025-01-01T10:00:00Z"
  },
  "itinerary_data": null,
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T12:00:00Z"
}
```

**Note:** Flight offers expire after 20 minutes

---

#### Delete Conversation

**Endpoint:** `DELETE /conversations/{session_id}`

**Response:** `204 No Content`

---

## Request/Response Schemas

### Common Types

#### PassengerType
```typescript
type PassengerType = "adult" | "child" | "infant_without_seat";
```

#### CabinClass
```typescript
type CabinClass = "economy" | "premium_economy" | "business" | "first";
```

#### TripStatus
```typescript
type TripStatus = "planning" | "active" | "completed" | "cancelled";
```

#### ActivityCategory
```typescript
type ActivityCategory = 
  | "attraction"
  | "restaurant"
  | "hotel"
  | "transportation"
  | "activity"
  | "shopping"
  | "nightlife"
  | "other";
```

---

### Flight Card Schema

```typescript
interface FlightCard {
  offer_id: string;           // Duffel offer ID (off_xxx)
  airline: string;            // "Emirates"
  airline_logo?: string;      // URL to logo
  origin: string;             // IATA code "TAS"
  destination: string;        // IATA code "DXB"
  departure_time: string;     // ISO 8601
  arrival_time: string;       // ISO 8601
  duration_minutes: number;   // 210
  stops: number;              // 0 = direct
  price: number;              // 450.00
  currency: string;           // "USD"
  cabin_class: CabinClass;
  segments: FlightSegment[];  // Detailed leg info
  
  // Expiration (for cached results)
  is_expired?: boolean;
  expires_in_minutes?: number;
  expiration_message?: string;
}

interface FlightSegment {
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  airline: string;
  flight_number: string;
  aircraft?: string;
  duration_minutes: number;
}
```

---

### Itinerary Schema

```typescript
interface GeneratedItinerary {
  city: string;
  country: string;
  total_days: number;
  interests?: string[];
  pace?: "relaxed" | "moderate" | "fast";
  days: ItineraryDay[];
  grounding?: {
    total_places_used: number;
    verified_places: number;
    sources: string[];
  };
}

interface ItineraryDay {
  day_number: number;
  title: string;
  activities: Activity[];
}

interface Activity {
  time: string;                // "09:00"
  name: string;
  category: ActivityCategory;
  description: string;
  duration_minutes: number;
  location: string;
  location_lat?: number;
  location_lng?: number;
  cost: number;
  currency: string;
  place_id?: number;           // Reference to Place in DB
  insider_tip?: string;
  booking_required: boolean;
  booking_url?: string;
}
```

---

### Chat Message Schema

```typescript
interface ChatMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp?: string;
  tool_calls?: ToolCall[];     // For assistant messages
  tool_call_id?: string;       // For tool messages
}

interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;              // "search_flights", "plan_itinerary"
    arguments: string;         // JSON string
  };
}
```

---

## Error Handling

### Error Response Format

All errors return a consistent format:

```json
{
  "detail": "Error message here",
  "error_code": "VALIDATION_ERROR",  // Optional
  "field": "email"                    // Optional - for validation
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful request |
| 201 | Created | Resource created |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | External API down |

---

### Common Errors

#### Authentication Error
```json
HTTP 401 Unauthorized
{
  "detail": "Could not validate credentials"
}
```

#### Rate Limit Error
```json
HTTP 429 Too Many Requests
{
  "detail": "Rate limit exceeded. Try again in 45 seconds.",
  "retry_after": 45
}
```

#### Validation Error
```json
HTTP 422 Unprocessable Entity
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## Rate Limiting

### Chat Endpoints

**Limit:** 30 requests per minute per IP address

**Headers:**
- No rate limit headers exposed (consider adding `X-RateLimit-Remaining`, `X-RateLimit-Reset`)

**Exceeded Response:**
```json
HTTP 429 Too Many Requests
{
  "error": "Rate limit exceeded",
  "retry_after": 45
}
```

### Other Endpoints

Currently no rate limiting on non-chat endpoints, but recommended to implement:
- Auth: 10 requests/minute
- Trips: 60 requests/minute
- Itinerary: 10 requests/minute

---

## WebSocket/Streaming

### Server-Sent Events (SSE)

The `/chat/message/stream` endpoint uses SSE for real-time streaming.

**Connection:**
```javascript
const response = await fetch('/api/v1/chat/message/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    message: "Find flights to Dubai",
    session_id: sessionId
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      handleEvent(data);
    }
  }
}
```

**React Hook Example:**
```typescript
import { useEffect, useState } from 'react';

function useChatStream(message: string, sessionId: string) {
  const [response, setResponse] = useState('');
  const [flightCards, setFlightCards] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!message) return;
    
    setLoading(true);
    const eventSource = new EventSource(
      `/api/v1/chat/message/stream?message=${encodeURIComponent(message)}&session_id=${sessionId}`
    );
    
    eventSource.addEventListener('token', (e) => {
      const data = JSON.parse(e.data);
      setResponse(prev => prev + data.content);
    });
    
    eventSource.addEventListener('data_payload', (e) => {
      const payload = JSON.parse(e.data);
      if (payload.type === 'flight_cards') {
        setFlightCards(payload.data);
      }
    });
    
    eventSource.addEventListener('done', () => {
      setLoading(false);
      eventSource.close();
    });
    
    eventSource.addEventListener('error', () => {
      setLoading(false);
      eventSource.close();
    });
    
    return () => eventSource.close();
  }, [message, sessionId]);
  
  return { response, flightCards, loading };
}
```

---

## Advanced Features

### Session Persistence

Chat sessions are automatically persisted in the database. Sessions include:
- Full message history
- Flight search results (cached for 20 minutes)
- Generated itineraries
- User preferences
- Active trip context

**Resume Session:**
```javascript
// Just include the session_id in your next message
await fetch('/api/v1/chat/message', {
  method: 'POST',
  body: JSON.stringify({
    message: "Show me cheaper options",
    session_id: "sess_abc123"  // Previous session
  })
});
```

---

### AI Tools (Auto-executed in Chat)

The AI assistant can automatically use these tools:

1. **search_flights** - Search for flight offers
2. **plan_itinerary** - Generate trip itinerary
3. **modify_itinerary** - Modify existing itinerary (add days, change vibe)
4. **extend_itinerary** - Add days to saved trip
5. **check_visa** - Check visa requirements

**Example Flow:**
```
User: "I want to visit Dubai for 3 days"
AI: [Thinks] → [Calls plan_itinerary tool] → [Returns structured itinerary]
    "I've created a 3-day Dubai itinerary for you..."
```

---

### Smart Suggestions

Every assistant response includes contextual action chips:

```json
{
  "suggestions": [
    {
      "label": "✈️ Book this flight",
      "value": "BOOK_FLIGHT_off_12345",
      "type": "action"
    },
    {
      "label": "📅 Different dates",
      "value": "Show me flights next week",
      "type": "query"
    },
    {
      "label": "💰 Cheaper options",
      "value": "Find cheaper flights",
      "type": "query"
    }
  ]
}
```

**Types:**
- `action` - Triggers a specific action (e.g., booking)
- `query` - Sends a new chat message
- `modifier` - Modifies current search/itinerary

---

### Location Detection

User's location is automatically detected from IP address:

```json
{
  "user_location": {
    "city": "Tashkent",
    "country": "Uzbekistan",
    "airport_iata": "TAS",
    "airport_name": "Tashkent International Airport"
  }
}
```

This auto-fills the origin for flight searches.

---

## Best Practices

### Frontend Integration

1. **Use Streaming for Better UX**
   ```typescript
   // Good: Streaming shows tokens as they arrive
   POST /chat/message/stream
   
   // OK: Non-streaming for simple requests
   POST /chat/message
   ```

2. **Handle Flight Card Expiration**
   ```typescript
   if (flightCard.is_expired) {
     showExpiredWarning("These prices may have changed. Search again?");
   } else if (flightCard.expires_in_minutes < 5) {
     showExpiryWarning(`Prices valid for ${expires_in_minutes} more minutes`);
   }
   ```

3. **Persist Session ID**
   ```typescript
   // Store in localStorage for conversation continuity
   localStorage.setItem('chat_session_id', session_id);
   ```

4. **Show Thought Process**
   ```typescript
   // Display AI reasoning for transparency
   eventSource.addEventListener('thinking', (e) => {
     const { steps, action } = JSON.parse(e.data);
     showThinkingIndicator(steps);
   });
   ```

5. **Handle Tool Execution**
   ```typescript
   // Show loading states during tool calls
   eventSource.addEventListener('status', (e) => {
     const { status, message } = JSON.parse(e.data);
     showToolStatus(message); // "🔍 Searching flights..."
   });
   ```

---

### Error Recovery

1. **Retry Failed Requests**
   ```typescript
   async function sendMessageWithRetry(message, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await sendChatMessage(message);
       } catch (error) {
         if (error.status === 429) {
           await sleep(error.retry_after * 1000);
         } else if (i === maxRetries - 1) {
           throw error;
         }
       }
     }
   }
   ```

2. **Handle Stream Interruptions**
   ```typescript
   eventSource.addEventListener('error', () => {
     // Reconnect with exponential backoff
     setTimeout(() => reconnect(), backoff);
   });
   ```

---

### Security

1. **Always Send JWT Token**
   ```typescript
   headers: {
     'Authorization': `Bearer ${getAccessToken()}`
   }
   ```

2. **Validate User Input**
   ```typescript
   // Sanitize before sending
   const sanitized = sanitizeInput(userMessage);
   ```

3. **HTTPS Only**
   - All production traffic must use HTTPS
   - Tokens sent over HTTP are vulnerable

---

## Environment Variables

Required environment variables for backend:

```bash
# Database
DATABASE_URL=mysql+aiomysql://user:pass@host:3306/dbname

# APIs
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
DUFFEL_API_KEY=duffel_test_xxx
GOOGLE_PLACES_API_KEY=your_google_key

# Redis
REDIS_URL=redis://localhost:6379/0

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=optional

# Auth
SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Frontend
FRONTEND_URL=https://your-frontend.com
BACKEND_CORS_ORIGINS=["*"]
```

---

## Changelog

### Version 1.0.0 (Current)

**Features:**
- ✅ AI-powered conversational chat
- ✅ Real-time streaming responses
- ✅ Flight search integration (Duffel)
- ✅ RAG-powered itinerary generation
- ✅ Trip management (CRUD)
- ✅ Secure checkout & booking
- ✅ Session persistence
- ✅ Smart suggestions
- ✅ Location detection

**Known Limitations:**
- Flight offers expire after 20 minutes (cache)
- Rate limiting only on chat endpoints
- No payment webhook handlers yet
- No email notifications for bookings

---

## Support & Contact

**Issues:** Contact your backend team  
**Documentation Updates:** This file is maintained in the repository

---

## Quick Reference

### Most Common Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/register` | POST | Create account |
| `/auth/login` | POST | Get JWT token |
| `/chat/message/stream` | POST | AI chat (streaming) |
| `/trips` | GET | List user trips |
| `/itinerary/generate` | POST | Generate itinerary |
| `/checkout/confirm` | POST | Complete booking |

### Most Common Response Fields

```typescript
// Chat Response
{
  response: string,
  session_id: string,
  flight_cards?: FlightCard[],
  itinerary_data?: Itinerary,
  suggestions: Suggestion[]
}

// Trip Response
{
  id: number,
  title: string,
  destination: string,
  days: Day[]
}

// Booking Response
{
  success: boolean,
  booking_reference: string,
  total_paid: number
}
```

---

**End of Documentation**

Last Updated: January 1, 2025  
API Version: 1.0.0

