# Academia — React Native Stationery Shop

A cute, pastel-themed mobile application prototype created for the Open University of Mauritius, BSc (Hons) Computer Science Year 2 Semester 2, Mobile Technologies assignment.

## Included screens

1. **Login / Sign-up** — switch between login and account creation, validate the email and password fields, or continue as a guest.
2. **Home** — search the stationery collection, browse categories, open product details, save favourites, and filter products by category, brand, and price range.
3. **Product detail** — view a product illustration, category, brand, rating, description and price, then add the product to the bag.
4. **Cart** — change item quantities, remove items, view subtotal, delivery and total, and open a checkout-preview message.
5. **User profile** — view and edit the name and email, see simple account stats, and log out.

## Design and interaction

- Academia branding with blush pink, lavender, cream, mint and soft blue.
- Ten local product illustrations in `assets/products/`; the app does not depend on an external image server.
- React Native core components and hooks (`View`, `Text`, `Image`, `TextInput`, `ScrollView`, `Pressable`, `Modal`, `Animated`, `useState`, `useEffect`, and `useMemo`).
- Animated screen fade, pressed-button feedback, add-to-cart toast, favourite toggles, quantity controls and a filter sheet.
- Currency shown as Mauritian rupees (Rs).

## Requirements

- Node.js 22 LTS (Expo SDK 57 requires Node 22.13+; Node 23 is not supported for this project).
- Visual Studio Code or another code editor.
- Expo Go on an Android or iOS phone, or an Android emulator.
- An internet connection for the first dependency installation.

The project uses Expo SDK 57 and React Native 0.86. Expo documents Node.js LTS as a system requirement and describes Expo as a framework for React Native apps: https://docs.expo.dev/get-started/create-a-project/

## Run the app on Windows

1. Download and extract `Academia_React_Native_Source.zip`.
2. Install Node.js LTS from https://nodejs.org/ and install Visual Studio Code from https://code.visualstudio.com/ if you do not already have them.
3. Open VS Code, choose **File → Open Folder**, and select the extracted `Academia` folder.
4. If you are on Node 23, switch to Node 22 LTS first using nvm-windows, fnm, or Volta. For example:

   ```bash
   nvm install 22.13.0
   nvm use 22.13.0
   ```

5. In VS Code, choose **Terminal → New Terminal**.
6. Run:

   ```bash
   npm install
   ```

7. Start Expo:

   ```bash
   npx expo start
   ```

7. Install **Expo Go** on your Android/iOS phone. Scan the QR code shown in the terminal/browser while your phone and computer are on the same Wi-Fi network.
8. The app opens on the Login / Sign-up screen. You can type a name, email and password, or choose **Continue as guest** to view the shop immediately.

If Expo reports that a package version should be adjusted, run `npx expo install --fix`, then run `npx expo start` again.

## Suggested walkthrough for testing

- Sign in with any valid-looking email (for example, `student@example.com`) and a password of at least four characters. This is a front-end demo, so no account is sent to a server.
- Search for “notebook”, choose a category chip, and open **Refine** to try category, brand and price filtering.
- Open a product and tap **Add to my bag**.
- Open **My bag**, increase/decrease the quantity and remove an item. Compare the subtotal, delivery and total.
- Open **Profile**, edit the name or email, save, then log out.

## Important scope note

This is a **front-end coursework prototype**. Login, sign-up, profile editing, favourites and cart contents are maintained in app memory only. There is no backend database, real authentication, stock integration or payment gateway. The checkout action is intentionally a preview and does not take payment.

## Project structure

```text
Academia/
├── App.js                       # All five screens and interactive app logic
├── app.json                     # Expo app configuration
├── package.json                 # Dependencies and scripts
├── README.md                    # Setup and testing guide
├── assets/products/             # Ten locally stored product illustrations
├── docs/                        # Assignment report and screen preview material
└── screenshots/                 # Illustrative design previews for the report
```
