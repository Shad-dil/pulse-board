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
Screen Shots

<img width="1889" height="901" alt="image" src="https://github.com/user-attachments/assets/b00fbc93-4d9b-4e49-a8be-8ec59f459c76" />
<img width="1890" height="905" alt="Image" src="https://github.com/user-attachments/assets/9357e8b7-cba1-400d-a24f-3116a732ce4a" />

<img width="1877" height="895" alt="Image" src="https://github.com/user-attachments/assets/cdd2f944-608b-45f2-8f6d-f0de03fc1990" />

<img width="1883" height="910" alt="Image" src="https://github.com/user-attachments/assets/25eb2c5e-0ec4-4495-97e1-028c92e710f4" />

<img width="1889" height="901" alt="Image" src="https://github.com/user-attachments/assets/bddb7b74-f242-49d3-8845-b8ecc2a45632" />





