# Academia

Academia is a React Native stationery-shop prototype for the Open University of Mauritius, BSc (Hons) Computer Science Year 2 Semester 2 Mobile Technologies assignment. It runs with Expo on Android, iOS, and web.

## Features

- **Sign in and sign up:** Basic form validation and a guest option. Authentication is a local demo; no account is sent to a server.
- **Shop:** Browse the stationery catalog, search by product name or category, and filter by category and price.
- **Product details:** View product information, save favourites, and add products to the bag.
- **Bag:** Change quantities, remove products, and review subtotal, delivery, and total. Delivery is free for orders of Rs 500 or more.
- **Profile:** Edit the displayed name and email, view account counts, and log out.
- **Navigation:** A shared bottom navbar stays mounted while moving between the shop, product details, bag, and profile.

## Requirements

- Node.js `22.13.x` (the project accepts `>=22.13.0 <23`; `.nvmrc` specifies `22.13.0`). Node 23 is not supported.
- npm and an internet connection for installing dependencies.
- For mobile testing, Expo Go or an Android emulator. iOS native builds require macOS; Expo Go can also be used on an iPhone.

## Install and run

From the project directory, install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm start
```

Available platform commands:

```bash
npm run web
npm run android
npm run ios
```

For Expo Go, scan the QR code printed by Expo while the phone and computer are on the same network. The app opens to the sign-in screen; choose **Continue as guest** to browse without entering details.

## Tests

Run the Jest logic and store tests with:

```bash
npm test
```

The tests cover filtering, auth validation, cart updates, favourites, filter state, profile/navigation state, and toast notifications. They do not automate the native UI.

## Project structure

```text
Academia/
├── App.js                      # App shell, screen routing, shared navbar, and derived cart data
├── app.json                    # Expo app configuration
├── products.js                 # Product catalog data
├── assets/products/            # Product image assets
├── src/
│   ├── screens/                # Auth, Home, Detail, Cart, and Profile screens
│   ├── components/             # Shared navbar, product cards, buttons, and other UI
│   ├── helpers/                # Auth validation and product filtering
│   ├── lib/                    # Catalog exports, formatters, and theme
│   ├── store/                  # Zustand app state and actions
│   └── styles/                 # Shared React Native styles
├── __tests__/                  # Jest feature-flow tests
├── docs/                       # Assignment reports
├── package.json                # Dependencies and scripts
└── README.md
```

## Demo limitations

This is a front-end coursework prototype. User details, favourites, and bag contents are kept in app memory and are not persisted to a backend. There is no real authentication, inventory service, or payment gateway; checkout is a preview only.
