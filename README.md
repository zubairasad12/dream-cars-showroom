# DREAM CARS - Exclusive Luxury Car Showroom Website

A complete, production-ready, dark-themed luxury automotive showroom website and dealership management system branded as **DREAM CARS**. Inspired by premier automotive design aesthetics, crafted with modern Next.js 14 App Router, Tailwind CSS, Prisma ORM, and full SQLite database backing.

---

## 🌟 Key Features

### 1. Public Visitor Experience (Zero Friction - No Customer Account Required)
- **High-End Hero Section**: Animated typography, bold automotive tagline *"Find the Car You've Been Dreaming Of"*, stat badges, and flagship vehicle spotlight.
- **Quick Find / Filter Matrix**: Instant search filtering by Brand, Model, Price Range, Year, Fuel Type, and Transmission.
- **Featured Collection**: Database-driven showcase of handpicked supercars and luxury sedans.
- **Car Inventory (`/cars`)**: 3-column responsive grid with advanced sidebar filters (Brand, Body Type, Price Range, Model Year, Fuel, Transmission, Condition), sorting (Newest, Price Low-to-High, Price High-to-Low, Mileage), and pagination.
- **Vehicle Detail Page (`/cars/[id]`)**:
  - Interactive multi-photo gallery with thumbnail strip, navigation controls, and fullscreen lightbox view.
  - Complete technical specifications (Horsepower, Drivetrain, Engine, Mileage, Condition, Colors).
  - Luxury options & packages checklist (Bowers & Wilkins audio, panoramic roofs, carbon packages).
  - One-click **WhatsApp Direct Inquiry** button with pre-filled vehicle details.
  - Interactive on-page Showroom Inquiry submission form.
- **Luxury Brands (`/brands` & `/brands/[slug]`)**: Database-backed marque directory (Porsche, BMW M, Mercedes-AMG, Audi RS, Range Rover, Land Cruiser, Honda Type R, Tesla, etc.).
- **Vehicle Trade-In (`/trade-in`)**: 3-step appraisal process and interactive trade-in evaluation form saving directly to the database.
- **About Dream Cars (`/about`)**: Brand heritage, 150-point inspection criteria, climate-controlled pavilion, and satisfaction metrics.
- **Showroom Concierge (`/contact`)**: Showroom location on Main Boulevard Gulberg, Lahore, direct hotline, opening hours, interactive contact form, and Google Maps embed.

---

## 💬 WhatsApp Direct API Integration
Integrated with direct contact number: **`03099491835`** (International WhatsApp format: **`+923099491835`** / **`923099491835`**):
- **Floating WhatsApp Pulse Button**: Bottom-right floating radar button on all public pages.
- **Navbar & Footer Hotline**: Instant one-click chat triggers.
- **Car Detail Direct Inquire**: Pre-populates the vehicle make, model, year, and asking price in WhatsApp chat.
- **Admin Lead WhatsApp Outreach**: Showroom managers can click one button to open a pre-filled WhatsApp response to any customer lead.

---

## 🛡️ Protected Admin Portal (`/admin`)

Access the management dashboard at:
- **URL**: `http://localhost:3000/admin`
- **Default Email**: `admin@dreamcars.com`
- **Default Password**: `admin123456`

### Admin Capabilities:
1. **Overview Dashboard (`/admin`)**: Live database statistics for Total Vehicles, Featured Cars, Sold Cars, Active Brands, and New Inquiries.
2. **Vehicle Inventory (`/admin/cars`)**: Search, filter by status (Available, Reserved, Sold), toggle featured status, and delete vehicles.
3. **Add Vehicle (`/admin/cars/new`)**:
   - **Multiple Car Image Upload**: Drag-and-drop or select multiple photos at once. Stored in `/public/uploads/` with unique hash names. Also supports external image URLs.
   - **Gallery Management**: Reorder photos with Left/Right controls, set primary Cover Image with one click, or delete photos.
   - **Comprehensive Attributes**: Specifications, technical metrics, description, and custom package tags.
4. **Edit Vehicle (`/admin/cars/[id]/edit`)**: Modify specifications, add or reorder photos, and update status.
5. **Brand Management (`/admin/brands`)**: Add new marques, edit logos and descriptions, and toggle active visibility.
6. **Inquiry & Lead Management (`/admin/inquiries`)**: View client messages, filter by type (Car Inquiry, Trade-In, General), update status (`New`, `Contacted`, `Closed`), and contact directly via WhatsApp.
7. **Showroom Settings (`/admin/settings`)**: Update showroom name, logo, hotline phone, WhatsApp API number, address, opening hours, and social media links.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2 (App Router with Server & Client Components)
- **Styling**: Tailwind CSS with custom luxury automotive tokens
- **Database**: SQLite via Prisma ORM (`prisma/schema.prisma`)
- **Authentication**: JWT tokens + HTTP-only secure cookies with bcryptjs password hashing
- **Icons**: Lucide React
- **Image Uploads**: Native multipart file uploads to `/public/uploads/`

---

## 🚀 Running the Project

### Development:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Production Build & Start:
```bash
npm run build
npm start
```

### Database Management:
```bash
# Push schema changes
npx prisma db push

# Re-seed sample luxury fleet & default admin
node prisma/seed.js
```
