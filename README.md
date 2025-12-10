# 🚀 PulseBoard — Full-Stack SaaS Analytics Dashboard  
Built with **Next.js 16.0.7, TypeScript, Prisma, PostgreSQL, React Query, JWT Auth, and Real-Time Charts**

PulseBoard is a production-style SaaS dashboard designed to showcase real-world full-stack engineering skills.  
It includes secure email-password authentication, analytics, CRUD modules, charts, database modeling, API routes, React Query data fetching, and a scalable Next.js architecture suitable for professional SaaS applications.

Live Demo → https://pulse-board-dash.vercel.app

---

## 🌟 Features

### 🔐 Authentication (Email/Password)
- Custom credentials-based login  
- Secure password hashing  
- Protected routes  
- Role-based access ready (Admin/User structure)

### 📊 Analytics & Metrics
- Dashboard with charts  
- Traffic overview  
- User activity logs  
- Conversion analytics  
- Real-time UI updates using React Query

### ⚙️ Backend & Full-Stack Features
- **Next.js Route Handlers** for backend APIs  
- Data fetching/mutations using **React Query**  
- CRUD operations for dashboard modules  
- Server-side input validation  
- Clean separation of concerns  

### 🗄 Database & Persistence
- Prisma ORM + PostgreSQL  
- Relational schema with scalable structure  
- Seed scripts & migrations  

### ⚡ Performance Enhancements
- React Query caching & stale-time optimization  
- API response caching strategies  
- Debounced queries for smoother UX  
- SSR + CSR hybrid rendering  

### 🎨 UI/UX
- Clean dashboard layout  
- Built with Tailwind CSS + ShadCN UI  
- Reusable, composable components  
- Fully responsive  

---

## 🧱 Tech Stack

### **Frontend**
- Next.js 14 (App Router)
- React  
- TypeScript  
- Tailwind CSS  
- ShadCN UI  
- React Query  

### **Backend**
- Next.js API Route Handlers  
- Prisma ORM  
- PostgreSQL  

### **Other**
- Vercel Deployment  
- ESLint + Prettier  
- Environment variables  

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/pulseboard.git
cd pulseboard
```
### 2️⃣ install Dependency
```bash
npm install
```
3️⃣ Create .env
```bash
DATABASE_URL="your_postgres_url"
JWT_TOKEN="your_secret_key"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```
4️⃣ Setup Prisma
```bash
npx prisma generate
npx prisma db push
```
5️⃣ Start development server
```bash
npm run dev
```




