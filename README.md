# 🌾 KisanSetu

### AI-Powered Agricultural Marketplace & Supply-Chain Intelligence Platform

> **KisanSetu** is a full-stack digital agriculture platform that connects farmers, FPOs, shopkeepers, bulk buyers, consumers, and logistics partners through a shared marketplace and operational data layer. The system combines **real-time Firestore synchronization**, **AI-assisted market intelligence**, **multilingual assistance**, **FPO aggregation workflows**, **order lifecycle management**, and **map-based logistics visualization** in a role-driven web application.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

<p align="center">
  <b>Marketplace</b> • <b>AI Intelligence</b> • <b>FPO Aggregation</b> • <b>Logistics</b> • <b>Real-Time Data</b> • <b>Multilingual UX</b>
</p>

---

## 📑 Table of Contents

* [1. Project Overview](#1-project-overview)
* [2. Problem Statement](#2-problem-statement)
* [3. Solution](#3-solution)
* [4. Key Features](#4-key-features)
* [5. User Roles](#5-user-roles)
* [6. Platform Architecture](#6-platform-architecture)
* [7. Architecture Diagrams](#7-architecture-diagrams)
* [8. Application Data Flow](#8-application-data-flow)
* [9. AI Architecture](#9-ai-architecture)
* [10. Firestore Architecture](#10-firestore-architecture)
* [11. Data Model](#11-data-model)
* [12. Repository Structure](#12-repository-structure)
* [13. Technology Stack](#13-technology-stack)
* [14. Environment Variables](#14-environment-variables)
* [15. Local Development](#15-local-development)
* [16. Production Build](#16-production-build)
* [17. API Reference](#17-api-reference)
* [18. Price Intelligence Engine](#18-price-intelligence-engine)
* [19. Real-Time Synchronization](#19-real-time-synchronization)
* [20. Authentication & Authorization](#20-authentication--authorization)
* [21. Maps & Logistics](#21-maps--logistics)
* [22. Resilience & Fallbacks](#22-resilience--fallbacks)
* [23. Security Considerations](#23-security-considerations)
* [24. Prototype vs Production](#24-prototype-vs-production)
* [25. Production Roadmap](#25-production-roadmap)
* [26. Engineering Guidelines](#26-engineering-guidelines)
* [27. Useful Commands](#27-useful-commands)
* [28. Deployment](#28-deployment)
* [29. Project Status](#29-project-status)
* [30. License](#30-license)

---

# 1. Project Overview

KisanSetu is designed as a **shared digital coordination layer for agricultural commerce**. Instead of treating farmers, buyers, retailers, FPOs, and logistics as isolated applications, the platform models them as interconnected participants in the same transaction network.

The current repository is a **feature-rich prototype / hackathon-ready full-stack implementation** with several production-oriented architectural patterns already present:

* React 19 frontend with TypeScript.
* Vite-based development and build pipeline.
* Express server for backend API routes.
* Firebase Authentication for identity management.
* Cloud Firestore for real-time operational data.
* Google Gemini 2.5 Flash for generative AI assistance.
* Deterministic price-comparison logic for explainable recommendations.
* Google Maps integration with a simulation fallback.
* Multilingual UI configuration and browser speech-to-text input.
* Role-oriented dashboards for different supply-chain actors.

The repository should not yet be described as a fully productionized agricultural marketplace. Several areas, including payment settlement, live logistics telemetry, external mandi data ingestion, and advanced ML forecasting, are currently represented through demo or deterministic implementations.

---

# 2. Problem Statement

Agricultural commerce commonly suffers from fragmented information and disconnected workflows.

### Core problems

* Farmers may not have a unified view of buyers, prices, and market demand.
* FPOs require structured mechanisms to aggregate fragmented supply.
* Shopkeepers and institutional buyers need predictable procurement information.
* Consumers need visibility into seller, product, price, and delivery information.
* Logistics operators need an operational view of active deliveries.
* Agricultural decision support is difficult when information is distributed across separate sources.

### Engineering challenge

The core engineering problem is therefore not simply "build an e-commerce website." It is to create a **multi-role transaction system with synchronized state, agricultural-specific data models, decision-support services, and logistics-aware workflows**.

---

# 3. Solution

KisanSetu approaches the problem through a single shared application architecture.

```text
                    ┌─────────────────────┐
                    │      KISANSETU      │
                    │  Digital Agri Hub   │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
   MARKETPLACE             AI LAYER              LOGISTICS
        │                      │                      │
        │                      │                      │
  Products / Orders      Price Intelligence     Tracking / Maps
        │                 Agricultural Chat      Delivery State
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                               ▼
                      Cloud Firestore
                               │
                               ▼
                    Shared Real-Time State
```

The architecture allows different user roles to operate on the same underlying marketplace and operational records while specialized services handle AI, authentication, and geospatial functionality.

---

# 4. Key Features

## 🛒 4.1 Agricultural Marketplace

The marketplace supports produce listings with agricultural-specific metadata such as:

* Product and category
* Seller and seller type
* Location
* Available quantity in kilograms
* Price per kilogram
* Minimum order quantity
* Harvest date
* Quality grade
* Farming method
* Expected delivery date
* Seller verification state
* Product rating
* AI-guided price range
* Bulk pricing tiers

---

## 👨‍🌾 4.2 Farmer Operations

Farmers can work with marketplace inventory and farm-oriented dashboards covering:

* Product listing
* Inventory management
* Pricing
* Farm/pantry information
* Order visibility
* Market intelligence
* FPO participation

---

## 🏪 4.3 Shopkeeper Operations

Shopkeeper workflows include:

* Retail inventory
* Purchase and selling price tracking
* Margin display
* Local procurement
* Bulk marketplace access
* Order management
* Pantry management

---

## 🏢 4.4 FPO Collaboration

FPO aggregation is represented through collective procurement pools.

Each pool can contain:

* FPO name
* Commodity
* Aggregated quantity
* Target buyer demand
* Number of participating farmers
* Deadline
* Pool status
* Farmer-level contributions

Typical state progression:

```text
aggregating
     │
     ├── target not reached ──> continue aggregation
     │
     └── target reached ──────> ready_for_dispatch
                                      │
                                      ▼
                                  dispatched
```

---

## 📦 4.5 Order Management

Orders are represented as domain objects with both commercial and logistics information.

### Order lifecycle

```text
placed
  ↓
confirmed
  ↓
preparing
  ↓
ready_for_pickup
  ↓
picked_up
  ↓
in_transit
  ↓
near_destination
  ↓
delivered
```

Exceptional states include:

```text
cancelled
   or
 disputed
```

The order model includes:

* Buyer and seller identity
* Product reference
* Quantity
* Unit price
* Subtotal
* Logistics fee
* Platform fee
* Total amount
* Payment / escrow status
* Delivery address
* Assigned driver metadata
* Tracking coordinates
* ETA
* Distance
* Progress percentage
* Event timeline

---

## 📈 4.6 Mandi Price Intelligence

The platform includes a `mandi_prices` collection for structured agricultural market-price references.

Each record can contain:

| Field           | Description                  |
| --------------- | ---------------------------- |
| `commodity`     | Agricultural commodity       |
| `mandi`         | Market / mandi name          |
| `state`         | State where the mandi exists |
| `minPrice`      | Minimum recorded price       |
| `maxPrice`      | Maximum recorded price       |
| `modalPrice`    | Modal market price           |
| `date`          | Price observation date       |
| `trend`         | Directional price trend      |
| `changePercent` | Percentage movement          |

The application can seed an initial dataset when the collection is empty. This is useful for demos but should be replaced by controlled ingestion in production.

---

## 🤖 4.7 Kisan AI Assistant

Kisan AI is built as a hybrid intelligence layer rather than a purely generative chatbot.

It combines:

1. **Deterministic price-comparison logic** for structured queries.
2. **Server-side Gemini generation** for general agricultural assistance.
3. **Database-aware context passing** from live product / mandi data available to the UI.
4. **Multilingual response handling**.
5. **Browser speech-to-text input** through microphone interaction.

This design is important because structured financial/market comparisons should remain reproducible instead of being delegated entirely to a language model.

---

## 🗺️ 4.8 Logistics & Mapping

The logistics layer provides a map-oriented operational interface including:

* Vehicle / fleet visualization
* Delivery tracking representation
* Browser geolocation
* Farm and seller locations
* Geofence radius selection
* Estimated arrival information
* Simulated vehicle movement
* Google Maps rendering
* Fallback map simulation when a Maps API key is unavailable

> The repository currently represents vehicle movement primarily through simulation rather than a production GPS/IoT telemetry pipeline.

---

## 🌐 4.9 Multilingual Interface

The frontend contains a language configuration system with Indian-language support.

Relevant files:

```text
src/config/indianLanguages.ts
src/config/translations.ts
src/context/LanguageContext.tsx
```

The selected language is also forwarded to the AI service so deterministic reports can be localized.

---

## 🔔 4.10 Notifications & Reviews

Firestore-backed records support:

* Order notifications
* AI / market notifications
* Logistics notifications
* System notifications
* Product reviews
* Seller reviews

---

# 5. User Roles

| Role                | Primary Responsibility                  | Main Workspace         |
| ------------------- | --------------------------------------- | ---------------------- |
| `farmer`            | Sell produce and manage farm inventory  | Farmer Dashboard       |
| `shopkeeper`        | Manage retail inventory and procurement | Shopkeeper Dashboard   |
| `consumer`          | Discover and purchase produce           | Consumer / Marketplace |
| `fpo`               | Aggregate farmer supply                 | FPO Collaboration      |
| `bulk_buyer`        | B2B / wholesale procurement             | Buyer Dashboard        |
| `logistics_partner` | Delivery operations                     | Logistics Dashboard    |
| `admin`             | Platform monitoring and administration  | Admin Dashboard        |

### Role model

Roles are represented through the shared `UserProfile` type:

```ts
type UserRole =
  | 'farmer'
  | 'shopkeeper'
  | 'consumer'
  | 'fpo'
  | 'bulk_buyer'
  | 'logistics_partner'
  | 'admin';
```

The role model exists at the application level. Production-grade authorization still requires strict server/database enforcement and should not rely only on frontend role selection.

---

# 6. Platform Architecture

KisanSetu follows a layered architecture with a React client, an Express application server, and Firebase/Gemini integrations.

## 6.1 High-Level Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                         PRESENTATION                            │
│                                                                 │
│ React 19 + TypeScript + Tailwind CSS + Lucide + Motion         │
│                                                                 │
│ Pages → Components → Context → Service Functions               │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               │ HTTPS / Firebase SDK
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION                              │
│                                                                 │
│ Express + TypeScript                                            │
│                                                                 │
│ /api/health                                                     │
│ /api/ai/chat                                                    │
│ /api/ai/price-recommendation                                   │
└───────────────┬─────────────────────────┬───────────────────────┘
                │                         │
                ▼                         ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│ Firebase Services       │    │ Google Gemini           │
│                         │    │                         │
│ Auth + Firestore        │    │ AI chat / localization  │
└──────────────┬──────────┘    └─────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
│                                                                 │
│ Cloud Firestore                                                 │
│ users | products | orders | mandi_prices | fpo_pools           │
│ notifications | reviews                                        │
└─────────────────────────────────────────────────────────────────┘

Additional integration:
Google Maps Platform → map rendering / geospatial visualization
```

---

## 6.2 Architectural Characteristics

### Client-driven application state

`AppContext.tsx` acts as the central coordination layer for major application state, user state, marketplace records, orders, and UI navigation.

### Real-time cloud state

Firestore `onSnapshot()` subscriptions keep important collections synchronized with the browser.

### Server-side AI boundary

The Gemini API key is read by the Express server rather than being required in the browser bundle.

### Progressive fallback

Mock data and deterministic local logic are retained so the prototype can remain demonstrable when external services are unavailable.

### SPA-style navigation

The application uses `activePage` state rather than a dedicated React Router setup. Page components are selected from the central application state.

---

# 7. Architecture Diagrams

## 7.1 Runtime Component Diagram

```mermaid
flowchart TB
    User[User Browser] --> React[React 19 Application]
    React --> AppCtx[AppContext]
    React --> LangCtx[LanguageContext]
    React --> KisanAIUI[Kisan AI Assistant]

    AppCtx --> Firebase[Firebase Client SDK]
    Firebase --> Auth[Firebase Authentication]
    Firebase --> Firestore[(Cloud Firestore)]

    KisanAIUI --> API[Express API]
    API --> Gemini[Google Gemini 2.5 Flash]
    KisanAIUI --> Deterministic[KisanAI Deterministic Engine]

    React --> Maps[Google Maps Platform]
    Maps -. API key available .-> Simulation[Map Simulation Fallback]

    Firestore --> Products[Products]
    Firestore --> Orders[Orders]
    Firestore --> Mandi[Mandi Prices]
    Firestore --> FPO[FPO Pools]
    Firestore --> Notifications[Notifications]
    Firestore --> Reviews[Reviews]
```

---

## 7.2 Business Domain Flow

```mermaid
flowchart LR
    Farmer[Farmers] --> Product[Produce Listings]
    FPO[FPOs] --> Aggregation[FPO Aggregation]
    Shopkeeper[Shopkeepers] --> Product
    Product --> Marketplace[Marketplace]
    Marketplace --> Consumer[Consumers]
    Marketplace --> BulkBuyer[Bulk Buyers]
    Marketplace --> Orders[Orders]
    Aggregation --> Orders
    Orders --> Logistics[Logistics]
    Logistics --> Tracking[Tracking]
    Product --> AI[Kisan AI]
    Mandi[Mandi Prices] --> AI
    AI --> Farmer
    AI --> Consumer
    AI --> BulkBuyer
```

---

## 7.3 Request Flow: AI Assistant

```text
┌───────────────┐
│ User Question │
└───────┬───────┘
        ▼
┌────────────────────────┐
│ KisanAIAssistant.tsx   │
│ query + language +     │
│ available product data │
└──────────┬─────────────┘
           ▼
     POST /api/ai/chat
           │
     ┌─────┴─────────────┐
     │                   │
     ▼                   ▼
Price Query?          General Query
     │                   │
   YES                   │
     ▼                   ▼
Deterministic        Gemini 2.5 Flash
Scoring Engine             │
     │                     │
     └──────────┬──────────┘
                ▼
         Final AI Response
```

---

# 8. Application Data Flow

## 8.1 Marketplace Flow

```text
Application startup
        │
        ▼
AppContext initializes
        │
        ▼
Firestore subscriptions attach
        │
        ├── products
        ├── orders
        ├── mandi_prices
        ├── fpo_pools
        ├── notifications
        └── reviews
        │
        ▼
React state updates
        │
        ▼
Dashboard / Marketplace renders current state
```

## 8.2 Order Creation Flow

```text
User selects product
        │
        ▼
Cart / Checkout
        │
        ▼
Quantity validation
        │
        ▼
Order object constructed
        │
        ├── subtotal
        ├── logistics fee
        ├── platform fee
        └── total
        │
        ▼
createOrderInFirestore()
        │
        ▼
Firestore write
        │
        ▼
onSnapshot() propagation
        │
        ▼
Buyer / Seller / Logistics views update
```

## 8.3 FPO Aggregation Flow

```text
FPO creates / joins pool
        │
        ▼
Farmer contribution recorded
        │
        ▼
Total aggregated quantity updated
        │
        ▼
Target demand checked
        │
     ┌──┴──┐
     │     │
 below   reached
     │     │
     ▼     ▼
continue ready_for_dispatch
            │
            ▼
        dispatched
```

---

# 9. AI Architecture

KisanSetu intentionally uses a **hybrid AI architecture**.

## 9.1 Layer A — Deterministic Market Intelligence

Implemented primarily in:

```text
src/services/kisanAI.ts
server.ts
```

Responsibilities include:

* Product matching from user queries.
* Quantity extraction.
* Seller availability checks.
* Lowest-price comparison.
* Fastest-delivery comparison.
* Highest-rated seller comparison.
* Total cost calculation.
* Market scoring.
* Structured terminal-style analysis output.

This layer is useful when the question can be answered through known structured records.

---

## 9.2 Layer B — Server-Side Generative AI

Implemented through the Express API and `@google/genai`.

```text
Browser
   │
   │ POST /api/ai/chat
   ▼
Express Server
   │
   ▼
GoogleGenAI client
   │
   ▼
Gemini 2.5 Flash
   │
   ▼
Response
```

The server creates the Gemini client only when a valid `GEMINI_API_KEY` is available.

---

## 9.3 Layer C — Multilingual Localization

For deterministic price reports, non-English output can be localized using Gemini while preserving:

* Numbers
* Currency amounts
* Quantities
* Percentages
* Scores
* Market names
* Seller names
* Report structure

This keeps the numeric analysis deterministic while using the language model only for presentation/localization.

---

## 9.4 Layer D — Voice Input

The AI interface contains microphone interaction using browser speech recognition capabilities.

Current interpretation:

```text
Voice
  ↓
Browser Speech Recognition
  ↓
Text Query
  ↓
Kisan AI Pipeline
```

This should be considered **voice-enabled input**, not a complete real-time speech-to-speech conversational system.

---

# 10. Firestore Architecture

## 10.1 Collection Model

```text
Cloud Firestore
│
├── users
│   └── UserProfile
│
├── products
│   └── Product
│
├── orders
│   └── Order
│
├── mandi_prices
│   └── MandiPriceRecord
│
├── fpo_pools
│   └── FPOAggregationPool
│
├── notifications
│   └── NotificationItem
│
└── reviews
    └── ReviewItem
```

## 10.2 Real-Time Listener Strategy

The Firebase service layer exposes subscription functions for the major collections:

```ts
subscribeToProducts()
subscribeToOrders()
subscribeToMandiPrices()
subscribeToFPOPools()
subscribeToNotifications()
subscribeToReviews()
subscribeToAuth()
```

These functions use Firestore `onSnapshot()` listeners where applicable.

---

## 10.3 Firebase Service Layer

The main data-access implementation lives in:

```text
src/services/firebaseDb.ts
```

Responsibilities include:

* Reading Firestore collections.
* Creating documents.
* Updating documents.
* Deleting product records.
* Updating order status.
* Joining FPO pools.
* Saving profiles and user settings.
* Reading user profiles.
* Authentication state handling.
* Notifications and reviews.

Keeping these operations in a service module reduces direct Firestore logic spread across UI components.

---

# 11. Data Model

The shared domain contracts live in:

```text
src/types.ts
```

## 11.1 UserProfile

```text
UserProfile
├── uid
├── name
├── email
├── phone
├── role
├── status
├── location
├── farmOrBusinessDetails?
├── rating
├── verified
├── createdAt
├── enableLogistics?
├── enableBulkQuantity?
├── shardId?
└── partitionCluster?
```

## 11.2 Product

```text
Product
├── id
├── name
├── category
├── sellerId
├── sellerName
├── sellerType
├── fpoName?
├── location
├── quantityAvailableKg
├── pricePerKg
├── minOrderKg
├── harvestDate?
├── qualityGrade?
├── farmingMethod?
├── expectedDeliveryDate?
├── image
├── rating
├── verifiedSeller
├── aiSuggestedPriceMin
├── aiSuggestedPriceMax
├── description
├── bulkPricing?
└── purchasePrice?
```

## 11.3 Order

The order entity combines commercial, identity, payment-state, delivery, and tracking information.

Important attributes include:

```text
Order
├── buyerId / buyerName / buyerType
├── sellerId / sellerName / sellerType
├── productId / productName
├── quantityKg
├── pricePerKg
├── subtotal
├── logisticsFee
├── platformFee
├── total
├── status
├── paymentStatus
├── deliveryAddress
├── assignedDriver?
├── tracking
└── timeline
```

## 11.4 DemandForecast

The type exists for forecasting-oriented functionality:

```text
DemandForecast
├── productId
├── productName
├── region
├── currentDemandKg
├── predictedDemandKg
├── confidenceScore
├── trend
├── reason
├── historicalData
└── forecastData
```

The current repository defines this domain contract but does not contain a full production ML forecasting pipeline around it.

---

# 12. Repository Structure

```text
KisanSetu-main/
│
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── bun.lock
├── tsconfig.json
├── index.html
├── metadata.json
├── server.ts
├── firestore.rules
├── firebase-applet-config.json
├── firebase-blueprint.json
│
└── src/
    │
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── types.ts
    │
    ├── components/
    │   ├── AddProductModal.tsx
    │   ├── AuthStatusBar.tsx
    │   ├── CartCheckoutModal.tsx
    │   ├── Footer.tsx
    │   ├── KisanAIAssistant.tsx
    │   ├── KisanMap.tsx
    │   ├── Navbar.tsx
    │   ├── ProductEditorModal.tsx
    │   ├── ProductionNetworkBar.tsx
    │   ├── RoleSelectModal.tsx
    │   ├── SessionVerificationBanner.tsx
    │   └── SettingsModal.tsx
    │
    ├── config/
    │   ├── hyperScaleEngine.ts
    │   ├── indianLanguages.ts
    │   └── translations.ts
    │
    ├── context/
    │   ├── AppContext.tsx
    │   └── LanguageContext.tsx
    │
    ├── data/
    │   └── mockData.ts
    │
    ├── lib/
    │   └── firebase.ts
    │
    ├── pages/
    │   ├── AboutPage.tsx
    │   ├── AdminDashboard.tsx
    │   ├── AuthConsumerPage.tsx
    │   ├── AuthFarmerPage.tsx
    │   ├── AuthPage.tsx
    │   ├── AuthShopkeeperPage.tsx
    │   ├── BulkMarketplacePage.tsx
    │   ├── BuyerDashboard.tsx
    │   ├── CartPage.tsx
    │   ├── ConsumerHomePage.tsx
    │   ├── ContactPage.tsx
    │   ├── FPOCollaborationPage.tsx
    │   ├── FarmerDashboard.tsx
    │   ├── FarmerPantryPage.tsx
    │   ├── GoogleMapsSimulationPage.tsx
    │   ├── LandingPage.tsx
    │   ├── LogisticsDashboard.tsx
    │   ├── MarketplacePage.tsx
    │   ├── NetworkArchitecturePage.tsx
    │   ├── ProductDetailPage.tsx
    │   ├── RegisterConsumerPage.tsx
    │   ├── RegisterFarmerPage.tsx
    │   ├── RegisterShopkeeperPage.tsx
    │   ├── SellerStorefrontPage.tsx
    │   ├── ServicesPage.tsx
    │   ├── ShopkeeperDashboard.tsx
    │   ├── ShopkeeperPantryPage.tsx
    │   ├── TrackOrderPage.tsx
    │   └── WishlistPage.tsx
    │
    └── services/
        ├── firebaseDb.ts
        └── kisanAI.ts
```

---

# 13. Technology Stack

| Layer     | Technology                                | Role                                       |
| --------- | ----------------------------------------- | ------------------------------------------ |
| Frontend  | React 19                                  | UI and application composition             |
| Language  | TypeScript 5.8                            | Type safety and domain modeling            |
| Build     | Vite 6                                    | Development server and production bundling |
| Styling   | Tailwind CSS 4                            | UI styling                                 |
| Icons     | Lucide React                              | Interface iconography                      |
| Animation | Motion                                    | UI transitions and interaction             |
| Charts    | Recharts                                  | Data visualization                         |
| Backend   | Express 4                                 | API and server runtime                     |
| AI        | Google Gemini 2.5 Flash                   | Generative AI and localization             |
| AI SDK    | `@google/genai`                           | Gemini integration                         |
| Auth      | Firebase Authentication                   | User authentication                        |
| Database  | Cloud Firestore                           | Persistent real-time data                  |
| Maps      | Google Maps / `@vis.gl/react-google-maps` | Geospatial UI                              |
| Runtime   | Node.js + TSX                             | Development server execution               |
| Bundler   | esbuild                                   | Server build/bundling                      |

---

# 14. Environment Variables

Create a `.env` file in the project root.

```env
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> Keep `.env` out of source control. Never commit service-account credentials, private keys, or production API secrets.

### Client-side configuration

The frontend Firebase configuration is handled through:

```text
src/lib/firebase.ts
```

Review the file before deployment and provide the correct Firebase web-app configuration for the target environment.

### Google Maps

The application also supports Google Maps configuration and contains a simulation path when the live Maps API configuration is unavailable.

---

# 15. Local Development

## 15.1 Prerequisites

Install:

* Node.js
* npm
* A Firebase project
* A Gemini API key for generative AI functionality
* A Google Maps API key for live maps, if required

## 15.2 Installation

```bash
git clone <your-repository-url>
cd KisanSetu-main
npm install
```

## 15.3 Configure environment

```bash
copy .env.example .env
```

Then edit `.env` with your credentials.

## 15.4 Start development server

```bash
npm run dev
```

The Express development server starts on:

```text
http://localhost:3000
```

The server also exposes the Vite middleware during development.

## 15.5 Type check

```bash
npm run lint
```

The repository currently uses `tsc --noEmit` as the lint/type-check command.

---

# 16. Production Build

Build both the frontend and server bundle with:

```bash
npm run build
```

The build performs:

```text
vite build
   +
esbuild server.ts
   ↓
dist/
```

Start the compiled server with:

```bash
npm start
```

---

# 17. API Reference

The backend exposes a small HTTP API in `server.ts`.

## 17.1 Health Check

### `GET /api/health`

Used to verify that the server process is available.

### Example

```bash
curl http://localhost:3000/api/health
```

### Response

```json
{
  "status": "ok",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

---

## 17.2 AI Chat

### `POST /api/ai/chat`

Used by the Kisan AI interface.

### Request

```json
{
  "prompt": "Compare tomato prices for 100 kg",
  "language": {
    "code": "en",
    "name": "English",
    "native": "English"
  },
  "context": {},
  "products": []
}
```

### Conceptual response

```json
{
  "reply": "...AI response..."
}
```

The endpoint can route structured price-comparison queries through deterministic logic before falling back to Gemini for general natural-language queries.

---

## 17.3 Price Recommendation

### `POST /api/ai/price-recommendation`

This endpoint accepts product-related market information and requests a structured price recommendation from Gemini.

Expected logical fields include:

```json
{
  "recommendedMin": 0,
  "recommendedMax": 0,
  "confidence": 0,
  "reason": "string",
  "demandLevel": "High",
  "bestSellingWindow": "string"
}
```

Treat the response as **decision support**, not as an authoritative market-price oracle.

---

# 18. Price Intelligence Engine

One of the more important engineering components of KisanSetu is the deterministic market-scoring logic implemented in `server.ts`.

## 18.1 Unit Normalization

Supported units are converted to kilograms using:

```text
Gram      → 0.001 kg
Kilogram  → 1 kg
Quintal   → 100 kg
Tonne     → 1000 kg
```

## 18.2 Effective Price

The engine accounts for transport cost:

```text
Effective Price
= Base Price per kg
+ Transport Cost per kg
```

where:

```text
Transport Cost per kg
= Total Transport Cost / Available Quantity
```

## 18.3 Price Score

The price component is normalized across available options using the minimum and maximum effective price in the comparison set.

Conceptually:

```text
Price Score
= ((Maximum Price - Current Price)
   / (Maximum Price - Minimum Price)) × 100
```

## 18.4 Market Score

The current implementation combines price, quality, and availability:

```text
Market Score
= 60% × Price Score
+ 25% × Quality Score
+ 15% × Availability Score
```

Availability is discretized using stock thresholds.

This model is deliberately transparent and reproducible, which is useful when explaining why a structured recommendation was produced.

---

# 19. Real-Time Synchronization

KisanSetu uses Firestore listeners instead of polling for its major operational data.

## Data synchronization pattern

```text
Firestore change
      │
      ▼
onSnapshot()
      │
      ▼
Firebase service callback
      │
      ▼
AppContext state update
      │
      ▼
React re-render
      │
      ▼
Dashboard / Marketplace / AI context
```

### Main synchronized domains

```text
Products
Orders
Mandi Prices
FPO Pools
Notifications
Reviews
Authentication State
```

### Why this architecture is useful

For a prototype marketplace, real-time synchronization reduces the need for manual refresh and provides a reasonable foundation for event-driven workflows.

For production scale, however, Firestore listener volume, query patterns, indexing, document fan-out, and billing must be profiled carefully.

---

# 20. Authentication & Authorization

Firebase Authentication is used for user identity.

The application also stores application-specific information in the `users` collection, including:

* Role
* Status
* Location
* Verification state
* Business/farm metadata
* Ratings
* Feature flags

## Important security distinction

Authentication answers:

> "Who is this user?"

Authorization answers:

> "What is this user allowed to do?"

The current frontend contains role-aware navigation and workflows, but production security should enforce authorization at the database/server boundary as well.

A secure production design should ensure that, for example:

```text
Farmer
  ├── can manage own products
  └── cannot arbitrarily modify another farmer's products

Buyer
  ├── can create permitted orders
  └── cannot rewrite seller-owned inventory

Admin
  └── privileged operations require explicit server/database authorization
```

---

# 21. Maps & Logistics

## 21.1 Google Maps Integration

The project uses:

```text
@vis.gl/react-google-maps
```

for map-oriented UI.

## 21.2 Browser Geolocation

The application can request browser location information to support location-aware interactions.

## 21.3 Simulation Mode

`GoogleMapsSimulationPage.tsx` provides a simulation-oriented experience when a live Maps integration is not available.

This is useful for:

* Demonstrations
* UI testing
* Hackathon presentations
* Early logistics prototyping

It is not equivalent to real fleet telemetry.

## 21.4 Production Logistics Architecture

A production version should evolve toward:

```text
Vehicle GPS / IoT Device
          │
          ▼
Telemetry Gateway
          │
          ▼
Event / Message Queue
          │
          ▼
Location Processing Service
          │
          ├── ETA engine
          ├── Geofence engine
          ├── Alert engine
          └── Order tracking state
          │
          ▼
Firestore / Operational DB
          │
          ▼
KisanSetu Web / Mobile Clients
```

---

# 22. Resilience & Fallbacks

The prototype intentionally contains fallback paths.

## AI fallback

If the Gemini API key is not configured, the backend can return a fallback advisor response instead of crashing the entire assistant flow.

## Deterministic AI fallback

Structured price comparison can operate through deterministic logic without requiring a generative model for every query.

## Data fallback

Mock/static data exists in:

```text
src/data/mockData.ts
```

Firestore services also contain initial market records used when live collections are empty.

## Maps fallback

A simulation page can represent map functionality when live Google Maps configuration is unavailable.

### Engineering principle

```text
External service unavailable
        │
        ▼
Graceful degradation
        │
        ├── AI → deterministic / fallback response
        ├── Maps → simulation mode
        └── Empty Firestore → controlled seed data
```

---

# 23. Security Considerations

KisanSetu handles data that can become commercially sensitive in a real deployment, including user identity, transaction information, locations, and agricultural pricing.

## 23.1 Secrets

Never commit:

```text
.env
Firebase service-account private keys
Gemini API keys
Production credentials
```

## 23.2 Firestore Rules

Review and harden:

```text
firestore.rules
```

The production rule set should enforce ownership and role restrictions at the database layer rather than trusting client-side UI state.

## 23.3 API Abuse Protection

The current Express API should eventually include:

* Rate limiting
* Request validation
* Payload size limits
* Abuse monitoring
* Authentication for protected endpoints
* Structured logging
* Error sanitization
* AI prompt abuse controls

## 23.4 AI Security

A production AI layer should additionally consider:

* Prompt injection
* Untrusted user-generated context
* Data exfiltration through model prompts
* Tool authorization boundaries
* Output validation
* Cost/rate controls
* Audit logging

---

# 24. Prototype vs Production

The repository is strongest when treated as a **working architectural prototype** rather than as a finished commercial platform.

| Capability              | Current Implementation    | Production Requirement                              |
| ----------------------- | ------------------------- | --------------------------------------------------- |
| Marketplace             | Implemented               | Inventory consistency + scale testing               |
| Firestore sync          | Implemented               | Query/index/cost optimization                       |
| Authentication          | Implemented               | Strict authorization and account lifecycle controls |
| AI chat                 | Implemented               | Rate limits, monitoring, guardrails                 |
| Price comparison        | Implemented               | Real validated market-data pipeline                 |
| AI price recommendation | Implemented               | Model validation and market-data grounding          |
| Multilingual UI         | Implemented               | Translation QA and language coverage                |
| Voice input             | Prototype                 | Production speech service / mobile optimization     |
| FPO aggregation         | Implemented               | Transactional guarantees and operational workflows  |
| Order lifecycle         | Implemented               | Server-enforced state transitions                   |
| Payment / escrow        | Represented in data model | Real payment gateway + settlement service           |
| GPS tracking            | Simulated / UI-level      | Live GPS / IoT telemetry pipeline                   |
| Mandi prices            | Seeded / Firestore-backed | Automated trusted ingestion                         |
| Demand forecasting      | Type/model foundation     | Actual trained forecasting system                   |
| Logistics optimization  | Basic representation      | Routing/ETA optimization service                    |
| Admin controls          | UI                        | Secure privileged backend operations                |

This distinction is important when presenting the repository to reviewers, judges, recruiters, or engineering teams.

---

# 25. Production Roadmap

## Phase 1 — Backend Hardening

* Introduce strict request validation.
* Enforce authorization in Firestore rules/server endpoints.
* Add structured error handling.
* Add rate limiting and abuse protection.
* Introduce server-side logging and observability.
* Separate development seed logic from production data initialization.

## Phase 2 — Real Market Data

```text
Government / Verified Market Sources
            ↓
Data Ingestion Service
            ↓
Validation + Normalization
            ↓
Firestore / Analytics Store
            ↓
Kisan AI
```

Move away from manually seeded mandi data and use a verified data ingestion pipeline.

## Phase 3 — Real Payments

Replace model-only payment/escrow states with:

* Payment gateway integration
* Webhook verification
* Payment ledger
* Refund handling
* Settlement records
* Idempotency keys
* Reconciliation jobs

## Phase 4 — Real Logistics

Introduce:

* Driver mobile application
* GPS/IoT ingestion
* Geofencing
* ETA calculation
* Route optimization
* Delivery proof
* Offline telemetry buffering

## Phase 5 — Advanced AI / ML

Potential evolution:

```text
Market Data
   +
Historical Orders
   +
Seasonality
   +
Weather
   +
Regional Demand
   +
Inventory
        │
        ▼
Feature Engineering
        │
        ▼
Forecasting Model
        │
        ▼
Demand / Price Predictions
        │
        ▼
Kisan AI Decision Support
```

## Phase 6 — Scale Architecture

For larger deployments, consider:

* Event-driven processing
* Queue-based AI jobs
* Read-model optimization
* Analytics warehouse
* Caching
* CDN-backed assets
* Mobile clients
* Observability stack
* Data retention policies
* Multi-region planning where justified

---

# 26. Engineering Guidelines

## Code Organization

Keep responsibilities separated:

```text
UI Components
    ↓
Context / Application State
    ↓
Domain Services
    ↓
Firebase / API Integration
```

Avoid placing database operations directly inside presentational components where a reusable service function is more appropriate.

## Type Safety

Prefer shared interfaces and domain types from:

```text
src/types.ts
```

Avoid unnecessary `any` values in critical business paths.

## AI Design

Use deterministic logic for:

* Arithmetic
* Price ranking
* State transitions
* Financial calculations
* Validation

Use generative AI primarily for:

* Language understanding
* Explanation
* Localization
* Conversational assistance
* Non-deterministic text generation

## State Management

Do not duplicate the same Firestore record across multiple independent state stores unless there is a clear caching reason.

## Production Data

Do not treat `src/data/mockData.ts` or seeded Firestore records as a production data source.

---

# 27. Useful Commands

| Command         | Purpose                        |
| --------------- | ------------------------------ |
| `npm install`   | Install dependencies           |
| `npm run dev`   | Start development server       |
| `npm run build` | Build frontend + server bundle |
| `npm start`     | Run production build           |
| `npm run lint`  | Type-check with TypeScript     |
| `npm run clean` | Remove generated build output  |

---

# 28. Deployment

KisanSetu can be deployed as a Node-compatible full-stack application because the repository contains both the frontend and Express server.

## Deployment model

```text
                        Git Repository
                              │
                              ▼
                       Build Environment
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
             Vite Build              Express Bundle
                 │                         │
                 └────────────┬────────────┘
                              ▼
                       Node.js Runtime
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
           Firebase        Gemini         Google Maps
```

### Recommended deployment requirements

The host should support:

* Node.js runtime
* Environment variables
* Long-enough request execution for AI calls
* HTTPS
* Persistent backend process or compatible serverless execution

Before deployment, configure:

```text
GEMINI_API_KEY
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
Google Maps configuration
```

Also verify:

* Firestore rules
* Firebase Authentication providers
* API key restrictions
* Production origins / CORS policy where applicable
* Error monitoring
* Firestore indexes

---

# 29. Project Status

### Current status

**Prototype / Advanced Demo / Hackathon-ready full-stack application**

### Implemented areas

* Multi-role frontend
* Agricultural marketplace
* Firestore real-time synchronization
* Firebase authentication integration
* FPO aggregation workflow
* Order state model
* Kisan AI assistant
* Deterministic price intelligence
* Gemini API integration
* Multilingual configuration
* Voice input
* Maps and logistics visualization
* Notifications and reviews

### Main production gaps

* Real payment gateway and settlement
* Fully enforced role-based authorization
* Trusted live mandi-data ingestion
* Real GPS/IoT logistics telemetry
* Production-grade demand forecasting
* Strong observability and audit infrastructure
* Enterprise-scale API security and rate control

---

# 30. License

No explicit open-source license is currently defined in the repository.

Unless a license is added, normal copyright restrictions apply to the source code.

---

## 🌾 KisanSetu — Engineering Vision

```text
                 FARM → FPO → MARKET → BUYER
                    \       │       /
                     \      │      /
                      ─── KISANSETU ───
                             │
               ┌─────────────┼─────────────┐
               │             │             │
              DATA          AI        LOGISTICS
               │             │             │
               └─────────────┼─────────────┘
                             │
                      DIGITAL AGRICULTURE
```

> **KisanSetu is built around the idea that agricultural commerce can be treated as a connected software system: structured data provides the state, deterministic algorithms provide explainability, AI provides interaction and intelligence, and logistics connects the digital transaction to the physical supply chain.**
