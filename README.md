# 🎨 Lamsat (لمسات)
### Egypt's First Trusted Handmade & Artisan Marketplace

<img width="1920" height="1080" alt="lamsat" src="https://github.com/user-attachments/assets/46ea8e4b-b8f2-4f99-ac5d-80cc3693afda" />

![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=for-the-badge&logo=dotnet)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-Web_API-512BD4?style=for-the-badge&logo=dotnet)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoftsqlserver)
![Paymob](https://img.shields.io/badge/Paymob-Payment_Gateway-00A86B?style=for-the-badge)

> A full-stack e-commerce platform built for Egyptian homemade artists and craftspeople with fraud protection, integrated online payments, and a 10% platform commission model.

---

## 📌 Problem Statement

In Egypt, thousands of talented homemade artists struggle to sell their work online. Existing platforms like Facebook and Instagram offer no buyer or seller protection, leaving both parties vulnerable to fraud. The absence of trusted online payment methods forces transactions into informal cash exchanges, creating friction and distrust. Lamsat solves this by providing a dedicated, trusted marketplace with built-in fraud protection and seamless payment integration.

---

## 🎯 Target Audience

- **Sellers:** Homemade artists and craftspeople looking to sell their creations online
- **Buyers:** Egyptian consumers aged 18–40 seeking unique, personalized, and handmade products as gifts or for personal use

---

## ✨ Core Features

- 🔐 **Role-Based Authentication** — Admin, Buyer, and Seller roles
- 🏪 **Seller Storefront** — Verified artist profiles with custom storefronts
- 🛍️ **Product Listings** — Images, descriptions, categories, and pricing
- 🛒 **Shopping Cart** — Session-managed cart with seamless checkout
- 💳 **Secure Payments** — Paymob API (Sandbox) with EGP support
- 🔒 **Fraud Protection** — Platform-held payments with delivery confirmation before fund release
- 💰 **10% Commission Model** — Lamsat takes 10%, 90% released to seller after delivery
- 📦 **Order Tracking** — Real-time order status for buyers and sellers
- ⭐ **Reviews & Ratings** — Verified purchase reviews for products and sellers
- ⚖️ **Dispute Management** — Admin-mediated conflict resolution with refund support
- ✅ **Seller Verification** — Admin approval system for new seller registrations
- 📊 **Admin Dashboard** — Full platform management, analytics, and reporting
- 💸 **Seller Withdrawals** — Sellers can withdraw balance to bank or Vodafone Cash

---

<!--## 💰 Business Model

```
Buyer pays full amount
        ↓
Lamsat holds payment
        ↓
Seller ships order
        ↓
Buyer confirms delivery
        ↓
Lamsat takes 10% cut → Seller receives 90%

If dispute → Admin reviews → Refund or Release
```

---
-->

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core 8 Web API |
| Frontend | Html + CSS with BootStrap |
| Database | SQL Server + Entity Framework Core |
| Authentication | ASP.NET Identity + JWT |
| Payment Gateway | Paymob API (Sandbox) |
| File Storage | Cloudinary |
| Version Control | Git + GitHub |

---

## 🗃️ Database Entities

- `Users` — Buyers, Sellers, and Admins
- `Sellers` — Storefront info, verification status, and balance
- `Products` — Listings with images, price, stock, and category
- `Categories` — Hierarchical product categories
- `Orders` — Order header with status and payment method
- `OrderItems` — Individual items per order
- `Reviews` — Verified purchase ratings and comments
- `Disputes` — Buyer/seller conflict cases
- `Payments` — Transaction records linked to orders

---

## 🚀 Getting Started

### Prerequisites
- .NET 10 SDK
- SQL Server
- Paymob sandbox account

### Installation

```bash
# Clone the repository
git clone https://github.com/joewaleed/Lamsat_handmade_E-commerce
cd Lamsat_handmade_E-commerce

# Restore dependencies
dotnet restore

# Update database connection string in appsettings.json
# Then run migrations
dotnet ef database update

# Run the API
dotnet run --project Lamsat.API
```

### Environment Variables

Create `appsettings.Development.json` and fill in:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your_sql_server_connection_string"
  },
  "JWT": {
    "SecretKey": "your_secret_key",
    "Issuer": "lamsat",
    "Audience": "lamsat_users"
  },
  "Paymob": {
    "ApiKey": "your_paymob_sandbox_api_key",
    "IntegrationId": "your_integration_id"
  },
  "Cloudinary": {
    "CloudName": "your_cloud_name",
    "ApiKey": "your_api_key",
    "ApiSecret": "your_api_secret"
  }
}
```

---

## 👥 Team

| Name | Role |
|---|---|
| Yousef Waleed | The Project Lead & Architect |
| Ahmed Ahmed | The Database & API Logic (A) |
| Rahma Sherif | The Database & API Logic (B) |
| Ahmed Mohamed | The Identity & Payments Specialist |
| Fathi Mohsen | The Frontend & UI Designers (A) |
| Kyrillos Anis | The Frontend & UI Designers (B) |

---

## 📄 License

This project was developed as a graduation project for **DEPI (Digital Egypt Pioneers Initiative)**.

---

<p align="center">Made with ❤️ in Egypt 🇪🇬</p>
