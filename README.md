**Payme: A Full-Stack P2P Payment Application**
===============================================

_A modern, secure, and intuitive peer-to-peer payment wallet built with the MERN stack and integrated with Razorpay for real-world transaction capabilities._

**\[VIDEO/GIF DEMO HERE\]**_(Suggestion: Add a short screen recording showing the user flow: sign up, log in, send money, and withdraw.)_

⭐ Features
----------

*   **Secure User Authentication:** Complete auth system with email/password login, OTP verification for sign-ups, and a robust JWT (Access + Refresh Token) based session management.
    
*   **Instant P2P Wallet Transfers:** Seamlessly send money from your wallet to any other registered user on the platform. All transfers are atomic and secure.
    
*   **Add Money to Wallet:** Easily add funds to your wallet using Razorpay's secure checkout (supports UPI, Cards, etc.).
    
*   **Withdraw to Bank Account:** A clever "cash out" feature that uses Razorpay Payment Links to allow users to withdraw their wallet balance to any UPI ID.
    
*   **Real-time User Search:** Find other users on the platform instantly by searching for their name or email address.
    
*   **Complete Transaction History:** A detailed log of all account activity, including payments sent, received, added, and withdrawn.
    
*   **User Profile Management:** Users can update their personal information and change their password.
    
*   **Notifications:** A real-time notification system alerts users when they receive money.
    
*   **API Security:** Endpoints are protected with authentication middleware, rate limiting on sensitive routes, and sanitization to prevent common vulnerabilities like XSS and NoSQL injection.
    

🚀 Tech Stack
-------------

### **Backend**

*   **Node.js & Express.js**
    
*   **MongoDB & Mongoose**
    
*   **JSON Web Tokens (JWT)**
    
*   **Razorpay API**
    
*   **Bcrypt.js**
    

### **Frontend**

*   **React & Vite**
    
*   **Tailwind CSS**
    
*   **shadcn/ui**
    
*   **Zustand** (for state management)
    
*   **Axios** (for API calls)
    
*   **react-router-dom** (for routing)
    

🔗 Live Demo
------------

**\[LINK TO YOUR DEPLOYED WEBSITE\]**

🛠️ Installation & Setup
------------------------

### **Prerequisites**

*   Node.js (v18.x or higher)
    
*   npm
    
*   MongoDB Atlas account
    
*   Razorpay account
    

### **Backend Setup**

1.  Clone the repository: git clone \[your-repo-link\]
    
2.  Navigate to the backend directory: cd backend
    
3.  Install dependencies: npm install
    
4.  Create a .env file and add the required environment variables.
    
5.  Start the server: npm run dev
    

### **Frontend Setup**

1.  Navigate to the frontend directory: cd frontend
    
2.  Install dependencies: npm install
    
3.  Create a .env file and add VITE\_BACKEND\_URL.
    
4.  Start the client: npm run dev
    

✍️ Author
---------

*   **Sudhanshu Jha**
    
*   **LinkedIn:** \[YOUR\_LINKEDIN\_URL\]
    
*   **GitHub:** \[YOUR\_GITHUB\_URL\]