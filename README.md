# Personal Finance App

A personal finance management application built with Quasar Framework and Firebase. This app helps users track their expenses, manage budgets, organize transactions, and plan recurring bills.

## Features

- User Authentication: Sign up, log in, and anonymous guest access using Firebase Authentication.
- Real-time Data Storage: Securely store and retrieve user data via Firebase Firestore.
- Expense Tracking: Log transactions and categorize spending.
- Budget Management: Set and track budgets for different categories.
- Recurring Bills: Organize and manage recurring bills.
- Data Visualization: View financial data through interactive charts and reports.
- Responsive Design: Optimized for both mobile and desktop.

## Installation

To get started with the Personal Finance App:
 1. Clone the repository:

```sh
git clone https://github.com/thentrsfs/personal-finance-app.git
cd personal-finance-app
```

2. Install Dependencies: Make sure you have Node.js and Quasar CLI installed.

```sh 
npm install
```

3. Set up firebase:
   
- Go to Firebase Console and create a new project.
- Enable Firebase Authentication and Firestore Database.
- Obtain your Firebase project configuration and add it to your Quasar project.

## Configuration

1. Firebase Configuration: Add your Firebase config object in a file at src/firebase/firebase.js:

```sh
// src/firebase/firebase.js
export default {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

2. Environment Variables: Configure any necessary environment variables by creating an .env file in the root of your project. Example:

```sh
VUE_APP_API_KEY=your_api_key
```

## Usage

1. Run the App:

```sh

```

