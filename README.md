# Background Verification Website - README

## 📌 Project Overview

This is a **background verification platform** tailored for individual users to verify hired personnel like domestic helpers, maids, drivers, babysitters, and other service providers. It includes both **admin and user dashboards** and integrates with various **government and third-party verification APIs**.

The platform aims to offer secure, scalable, and responsive background checks for:

* PAN Card
* Aadhaar
* Voter ID
* Driving Licence
* Employment
* GST
* Address Verification
* Profile Lookup
* Liveness Detection
* Bank Account
* Face Match
* Company Info
* Passport
* FSSAI License
* MSME
* Vehicle RC
* Cowin Certificate
* CCRV (Criminal and Court Record)
* FIR/Criminal Check

---

## 🚧 Project Status

✅ **Frontend and backend initialized**
✅ **Authentication implemented (Redux-based login/logout)**
✅ **Basic user dashboard layout created**
🛠️ More features and integrations are under active development.

---

## 🧩 Features (Planned & In Progress)

### ✅ Core Pages

* Home Page (with user purpose messaging)
* Services Page (Add to Cart functionality)
* Pricing Page
* Reviews Page (Post-review after token purchase)

### ✅ User Dashboard

* View verification statuses
* Export reports (table + PDF format)
* Login with Phone, Email, Google

### ✅ Admin Dashboard

* View and manage users
* Manage verification services
* Set offers (5%-10% control)
* View platform analytics
* Newsletter subscription management

### 🔔 Interactive UI Elements

* Live Chat
* Push Notifications
* Popup Alerts
* Offer Sections (Cart & Product Pages)
* WhatsApp Integration
* Sliding Ad Banner
* Visitor Counter

### 🛠️ CMS + Blog

* Blog Management Panel
* Custom Login Panel for CMS/Admin
* Content Management Tools

### 📊 Analytics & SEO

* Google Analytics Setup
* Google Search Console Integration

---

## 📁 Tech Stack

### Frontend

* React.js + Tailwind CSS
* Redux Toolkit (auth and global state)
* React Router DOM
* Responsive layout (mobile/tablet/desktop)

### Backend

* Node.js + Express
* MongoDB (Mongoose)
* JWT Authentication
* RESTful API structure

### Integrations (Planned)

* Government APIs (via third-party KYC services)
* PDFKit / html-pdf for PDF export
* Firebase / OneSignal for Push Notifications
* Chat API (Tawk.to / Crisp / LiveChat)
* WhatsApp API

---

## 📂 Folder Structure (Frontend)

```
client/
├── user/
├── admin/
├── home/
├── component/
├── features/
├── app/
├── pages/
├── redux/
├── services/
├── utils/
├── App.jsx
└── index.js
```



---

## 🔧 Setup Instructions

### 1. Clone Repositories

```bash
git clone https://github.com/aabid2947/eKYC.git
cd eKYC
npm install
npm start
```

```bash
git clone https://github.com/aabid2947/eKYCServer.git
cd eKYCServer
npm install
npm run dev
```

### 2. Create `.env` Files

#### Backend `.env`

```
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret
```

#### Frontend `.env`

```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

---

## 📅 Upcoming Milestones

* 🔐 Implement full API-based verification for all listed services
* 📄 Token purchase and wallet system
* 📬 Email/SMS Notification support
* 📦 Admin analytics and export tools
* 🧠 Smart Matching Suggestions

---

## 🤝 Contribution & Feedback

Want to help or suggest features? Feel free to open an issue or PR.

---

## 📜 License

MIT License

---

## 👤 Author

**Md Aabid Hussain**
For inquiries, reach out via [GitHub](https://github.com/aabidhussain)

---
