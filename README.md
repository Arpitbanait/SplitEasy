# 💸 SplitEasy — Intelligent Expense Settlement Platform

SplitEasy is a **full-stack collaborative expense management platform** that simplifies shared expenses between friends, roommates, and teams. It enables users to create groups, track expenses, calculate balances, and intelligently simplify debt settlements to minimize unnecessary transactions.

🔗 **Live Demo:** https://split-easy-8l5b.vercel.app/
🔗 **Frontend Repository:** https://github.com/Arpitbanait/SplitEasy

---

## ✨ Features

### 🔐 Authentication & Security

* JWT-based secure authentication
* User signup/login system
* Protected routes & authorization

### 👥 Group Expense Management

* Create and manage expense groups
* Add/remove members
* Track shared expenses within groups

### 💰 Smart Expense Splitting

* Add expenses with custom split logic
* Automatic balance calculations
* Track who owes whom

### ⚡ Intelligent Debt Simplification

* Optimized settlement algorithm to reduce redundant transactions
* Computes net balances between users
* Minimizes payment chains for easier settlement

### 🔔 Real-Time Notifications

* Notifications for:

  * Added expenses
  * Group activity
  * Settlements
  * Payment updates

### 💳 Payment Module

* Mock payment integration for settlement simulation
* Payment tracking workflow

---

## 🛠 Tech Stack

### Frontend

* React.js
* TypeScript
* TanStack Query
* Tailwind CSS
* React Router

### Backend

* FastAPI
* Python
* JWT Authentication
* REST APIs
* WebSockets

### Database

* PostgreSQL (Supabase)

### Deployment

* Vercel (Frontend)
* Render/Railway *(Update based on deployment)*

---

## 🧠 Debt Simplification Algorithm

SplitEasy uses an **optimized debt settlement algorithm** to reduce the number of transactions required between group members.

### How it works

1. Calculate each user's **net balance**
2. Separate:

   * **Debtors** → users who owe money
   * **Creditors** → users who should receive money
3. Use a **greedy + two-pointer approach** to settle maximum possible debt efficiently

### Time Complexity

```text
O(n + m)
```

Where:

* `n` = number of debtors
* `m` = number of creditors

### Data Structures Used

* **Hash Map (`defaultdict`)** → Net balance tracking
* **Lists** → Debtors & creditors storage
* **Two Pointer Technique** → Efficient settlement traversal
* **Greedy Algorithm** → Minimize redundant transactions

---

## 📂 Project Structure

```bash
SplitEasy/
│── frontend/          # React + TypeScript frontend
│── backend/           # FastAPI backend
  │── routes/            # API routes
  │── models/            # Database models
  │── services/          # Business logic
  │── auth/              # JWT authentication
  │── notifications/     # Notification system
  │── database/          # Supabase/PostgreSQL config
```

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/Arpitbanait/SplitEasy.git
cd SplitEasy
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔮 Future Improvements

* Real payment gateway integration
* Expense analytics dashboard
* Recurring expenses
* Mobile responsiveness improvements
* Email notifications

---

## 👨‍💻 Author

**Arpit Banait**

* GitHub: https://github.com/Arpitbanait
* LinkedIn: https://www.linkedin.com/in/arpit-banait-350238283


## 🤝 Contributors

Thanks to everyone who contributed to SplitEasy.

* **Arpit Banait**
  GitHub: https://github.com/Arpitbanait

* **Arpita Kalbande**
  GitHub: https://github.com/Arpitakalbande
