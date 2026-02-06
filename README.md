# PropVerse — Real Estate Operating System

PropVerse is a modern, responsive, and robust B2B SaaS platform designed to streamline real estate operations. It empowers builders and property managers to efficiently track projects, manage units, automate rent collections, and gain actionable insights through a powerful executive dashboard.

## 🚀 Features

- **Executive Dashboard**: Real-time business insights, financial tracking, and occupancy statistics.
- **Project Management**: Comprehensive tracking of construction projects and their respective inventories.
- **Unit Management**: Detailed inventory control for units including status tracking (Available, Booked, Sold, Rented).
- **Rent Automation**: Intelligent rent cycle tracking, payment history logging, and automated overdue alerts.
- **Tenant & Staff Management**: Dedicated portals for managing tenant details and staff access controls.
- **Reporting System**: Generate and export detailed reports for financials and inventory status.
- **Secure Authentication**: Robust login and verification system powered by Firebase.

## 🛠 Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend Service**: [Firebase](https://firebase.google.com/) (Authentication, Firestore, Functions)
- **Utilities**: 
  - `date-fns` for date manipulation
  - `jspdf` & `html2canvas` for PDF generation
  - `sonner` for toast notifications
  - `react-router-dom` for navigation

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (v8 or higher)

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harsh-Shrivastava1/PropVerse.git
   cd PropVerse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory. You can duplicate a `.env.example` if available or use the following template. Fill in your Firebase credentials:
   
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

- `npm run dev`: Starts the development server with hot-reload.
- `npm run build`: Bundles the app for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to identify and fix code quality issues.

## 🤝 Contributing

Contributions are always welcome!
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.
