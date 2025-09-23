# 🔐 Auth Toolkit – Plug & Play Authentication System  

A production-ready **authentication toolkit** for modern web applications. Built to save developers from wasting time on repetitive login & role-based access setup. Just plug it in, configure your credentials, and dive straight into your business logic 🚀.  

## ⚡ Tech Stack  

**Frontend**  
- React (Vite)  
- TailwindCSS  
- Context API  
- React Router  

**Backend**  
- Node.js + Express  
- MongoDB  
- JWT (Access + Refresh Tokens)  

**Security & Deployment**  
- HttpOnly Cookies (SameSite, Secure)  
- CORS setup for cross-origin requests  
- Render (Backend Hosting)  
- Netlify (Frontend Hosting)  

---

## 📦 Installation & Setup  

### 1. Clone the Repository  
```bash
git clone https://github.com/your-username/auth-toolkit.git
cd auth-toolkit
```

### 2. Install Dependencies  

- **Frontend**  
```bash
cd auth-frontend
npm install
```

- **Backend**  
```bash
cd auth-backend
npm install
```

### 3. Environment Variables  
#### *These are Sample values, replace the actual values with sample ones

#### Backend (`/backend/.env`)  
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=https://your-frontend-url.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Frontend (`/frontend/.env`)  
```env
GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🔄 Flow of the Application  

1. **User Login**  
   - Either with **Google OAuth** or **Email/Password**.  
   - Backend issues **Access Token** + **Refresh Token**.  

2. **Session Management**  
   - **Access Token** stored in memory (short-lived).  
   - **Refresh Token** stored securely in **HttpOnly cookie**.  

3. **Role-based Access**  
   - Protected routes in React (using `PrivateRoute`).  
   - Role checks for admin/user dashboards.  

4. **Logout**  
   - Clears HttpOnly cookie + invalidates refresh token.  

---

## 🔧 Integration Guide  

If you want to integrate this toolkit into your project:  

1. **Update API Endpoints**  
   - Change `VITE_API_URL` in `frontend/.env` to point to your backend.  

2. **Google OAuth Setup**  
   - Add your own **Google Client ID & Secret** in backend `.env`.  
   - Update **Authorized Redirect URIs** in Google Cloud Console.  

3. **Database**  
   - Replace `MONGO_URI` with your own MongoDB connection string.  

4. **Customize Auth Flow**  
   - Modify `AuthContext` (frontend) if you want to integrate with Redux or another state manager.  
   - Adjust user schema in `backend/models/User.js` if you need additional fields.  

---

## 🚀 Future Upgrades  

- 🔑 Magic Link Authentication  
- 📱 Social Logins (GitHub, LinkedIn, Twitter)  
- 🛡️ Multi-Factor Authentication (MFA)  
- 🔄 Refresh Token Rotation  
- 📊 Admin Dashboard for managing users/roles  
- 📝 Full documentation site with API reference  

---

## 🤝 Contributing  

Contributions are **welcome and appreciated** 🎉.  

1. Fork the repo  
2. Create a new branch (`feature/your-feature-name`)  
3. Commit changes  
4. Push branch and create a Pull Request  

If you have ideas for improvements, feel free to **open an issue** or reach out!  

---

## 🌐 Live Demo  

- **Frontend:** [https://auth-toolkit-frontend.netlify.app](https://auth-toolkit-frontend.netlify.app)  
- **Backend API:** Hosted on Render  

---

## 📩 Let’s Connect  

Built with ❤️ by [Karthik Balli](https://www.linkedin.com/in/karthik-balli/)  
Open to feedback, ideas, and collaboration opportunities.  
