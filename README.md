# Sys Livraison

A full-stack delivery management system for managing products, orders, clients, and delivery personnel. The project is split into a backend (Node.js/Express/MongoDB) and a frontend (React/Vite), supporting admin, client, and delivery (livreur) roles.

---

## Features
- **Admin dashboard**: Manage products, categories, clients, delivery personnel, and orders
- **Client portal**: Browse products, place orders, view order status
- **Livreur portal**: View and manage assigned deliveries
- **Authentication & role-based access**
- **Responsive UI**

---

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Radix UI, react-select
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **API**: RESTful endpoints

---

## Folder Structure
```
sys_livraison/
├── backend/         # Express/MongoDB API
│   ├── config/      # DB config
│   ├── controllers/ # Route controllers
│   ├── middlewares/ # Auth, error handling
│   ├── models/      # Mongoose schemas
│   ├── routes/      # Express routes
│   ├── server.js    # Entry point
│   └── package.json
├── frontend/        # React app
│   ├── src/
│   │   ├── components/  # UI & feature components
│   │   ├── contexts/    # React context providers
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── ...
│   ├── public/
│   ├── index.html
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm, pnpm, or yarn
- MongoDB instance (local or cloud)

### 1. Clone the repository
```bash
git clone <repo-url>
cd sys_livraison
```

### 2. Backend Setup
```bash
cd backend
npm install
# or: pnpm install
```

- Create a `.env` file in `backend/` with:
  ```env
  MONGO_URI=mongodb://localhost:27017/sys_livraison
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```
- Start the backend:
  ```bash
  npm run dev
  # or: node server.js
  ```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
# or: pnpm install
```
- Start the frontend:
  ```bash
  npm run dev
  ```
- The app will be available at [http://localhost:5173](http://localhost:5173)

---

## Usage
- **Admin**: Access admin dashboard to manage products, categories, clients, orders, and delivery personnel.
- **Client**: Browse products, place orders, and track order status.
- **Livreur**: View and manage assigned deliveries.

API endpoints are available under `/api` (see backend/routes for details).

---

## Scripts
### Backend
- `npm run dev` — Start backend in development mode (with nodemon)
- `node server.js` — Start backend in production

### Frontend
- `npm run dev` — Start frontend in development
- `npm run build` — Build frontend for production
- `npm run preview` — Preview production build

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
[MIT](LICENSE) 