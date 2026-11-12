# Northstar Market

A responsive e-commerce demo built with React, Vite, Express, MongoDB, and Mongoose. It includes a product catalog, search and filters, persistent guest/member carts, JWT authentication, cash-on-delivery orders, and an admin dashboard.

## Project structure and file guide

- `.gitignore`: excludes installed packages, build output, and local environment files.
- `README.md`: installation, run instructions, API overview, and this file guide.
- `backend/package.json` and `backend/package-lock.json`: backend scripts/dependencies and their pinned install tree.
- `backend/.env.example`: MongoDB, JWT, CORS, and admin-bootstrap settings.
- `backend/server.js`: Express setup, route mounting, MongoDB startup, and health endpoint.
- `backend/config/db.js`: Mongoose connection helper.
- `backend/middleware/auth.js`: JWT authentication and admin-role authorization.
- `backend/middleware/errors.js`: not-found handling and consistent API error responses.
- `backend/models/User.js`: customer/admin account schema and bcrypt password hashing.
- `backend/models/Product.js`: catalog item schema, price, category, stock, and featured flag.
- `backend/models/Cart.js`: authenticated user's persisted cart schema.
- `backend/models/Order.js`: delivery details, COD payment, item snapshots, totals, and order status.
- `backend/routes/auth.js`: customer registration, login, and current-user endpoint.
- `backend/routes/products.js`: catalog search/filter/sort and admin-only product management.
- `backend/routes/cart.js`: authenticated cart read/write endpoints and quantity/stock validation.
- `backend/routes/orders.js`: COD checkout, stock reservation, customer order history, and admin order list.
- `backend/scripts/createAdmin.js`: creates or promotes the configured administrator account.
- `backend/scripts/seedProducts.js`: inserts a small starter catalog if the database has no products.
- `frontend/package.json` and `frontend/package-lock.json`: frontend scripts/dependencies and their pinned install tree.
- `frontend/.env.example`: API base URL configuration for Vite.
- `frontend/index.html`: document title, viewport, metadata, and font loading.
- `frontend/vite.config.js`: Vite React plugin configuration.
- `frontend/src/main.jsx`: React, router, authentication/cart providers, and global stylesheet entry point.
- `frontend/src/App.jsx`: app shell, navigation/footer, and route table.
- `frontend/src/services/api.js`: shared fetch client, bearer token, JSON handling, and API error messages.
- `frontend/src/context/AuthContext.jsx`: login/register/logout and restored JWT session state.
- `frontend/src/context/CartContext.jsx`: guest local-storage cart, account cart sync, quantities, and totals.
- `frontend/src/components/Header.jsx` and `Header.css`: responsive navigation, search, account, and bag count.
- `frontend/src/components/Footer.jsx` and `Footer.css`: shared footer, links, and newsletter presentation.
- `frontend/src/components/ProductCard.jsx` and `ProductCard.css`: reusable product listing tile and quick add.
- `frontend/src/components/ProtectedRoute.jsx`: sign-in and administrator route guards.
- `frontend/src/pages/HomePage.jsx` and `HomePage.css`: hero, featured products, category collection, and editorial sections.
- `frontend/src/pages/ProductsPage.jsx` and `ProductsPage.css`: catalog, live search query, category filters, and sorting.
- `frontend/src/pages/ProductPage.jsx` and `ProductPage.css`: product detail, stock, quantity selector, and add-to-bag.
- `frontend/src/pages/CartPage.jsx` and `CartPage.css`: cart editing, shipping threshold, and order summary.
- `frontend/src/pages/CheckoutPage.jsx` and `CheckoutPage.css`: delivery form, COD checkout, and order confirmation screen.
- `frontend/src/pages/AuthPage.jsx` and `AuthPage.css`: customer registration and sign-in forms.
- `frontend/src/pages/AdminPage.jsx` and `AdminPage.css`: product CRUD and customer-order dashboard.
- `frontend/src/pages/NotFound.jsx`: friendly fallback for unknown routes.
- `frontend/src/styles/global.css`: color/type tokens, shared controls, and responsive defaults.
- `frontend/src/styles/layout.css`: application-level layout sizing.

## Requirements

- Node.js 18 or newer and npm
- MongoDB running locally, or a MongoDB Atlas connection string

## Install and configure

Open two terminals from the project root.

**Backend terminal**

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Edit `backend/.env` and set `MONGODB_URI` and a long random `JWT_SECRET`. Set `CLIENT_URL=http://localhost:5173` for the local Vite origin. To create an admin, set `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in the same file, then run:

```powershell
npm run create-admin
npm run seed
npm run dev
```

The API is available at `http://localhost:5000`. The seed command adds a starter product collection only when the catalog is empty. Create an administrator with the script before using the admin dashboard; regular registration creates customer accounts only.

**Frontend terminal**

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The frontend calls `VITE_API_URL` (defaults to `http://localhost:5000/api`).

## API overview

- `GET /api/products` — list; supports `search`, `category`, `sort`, and `featured` query parameters
- `GET /api/products/:id` — product detail
- `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` — admin-only catalog management
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` — authentication
- `GET /api/cart`, `PUT /api/cart` — authenticated cart persistence
- `POST /api/orders` — place an authenticated COD order
- `GET /api/orders/mine` — current customer's orders
- `GET /api/orders` — admin order list

Guest carts are kept in the browser's local storage. After sign-in, cart changes are synchronized with the authenticated cart API. Orders and account information are stored in MongoDB; passwords are hashed with bcrypt and API access uses JWT.

## File guide

- `backend/config/db.js`: opens the Mongoose connection.
- `backend/models/`: declares validated MongoDB document structures.
- `backend/middleware/`: validates bearer tokens, admin role, and API errors.
- `backend/routes/`: implements catalog, account, cart, and order APIs.
- `backend/scripts/createAdmin.js`: safely creates or promotes the configured admin account.
- `backend/server.js`: configures Express, CORS, JSON parsing, routes, and startup.
- `frontend/src/services/api.js`: shared fetch client and API error handling.
- `frontend/src/context/`: keeps authentication and cart state available across routes.
- `frontend/src/components/`: reusable header, footer, and product-card UI.
- `frontend/src/pages/`: individual route screens and their page-specific interactions.
- `frontend/src/styles/`: responsive global and component styling.
- `frontend/src/App.jsx`: route definitions and common page shell.
- `frontend/src/main.jsx`: mounts the React application.
- `.env.example` files: document the environment variables each app needs.

Payment is intentionally cash on delivery only; no payment credentials or gateway are required. Product photos use remote Unsplash image URLs, which can be replaced with your own hosted images.
