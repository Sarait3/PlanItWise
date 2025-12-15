# PlanItWise - Savings Goal Planner (MVP)

PlanItWise is a personal finance web application designed to help users plan and track savings goals.
This MVP allows users to create a savings goal, add contributions, monitor progress over time, and visualize savings growth through an interactive dashboard.

The project was developed using Angular 20 (standalone components), Node.js, and MongoDB, following modern frontend and backend practices.

---

## Live Application (Deployed)

The application is fully deployed and accessible online.

**Frontend (Vercel):**  
https://plan-it-wise.vercel.app

**Backend (Render):**  
https://planitwise-backend.onrender.com

Users can access the app directly through the browser without any local installation.

---

## Features (MVP)

### User Authentication
- User registration and login using a secure backend API
- JWT-based authentication
- Authentication state stored in browser storage
- Route protection for authenticated pages (Dashboard)

### Savings Goal Management
- Create a savings goal with title, target amount, and deadline
- View goal summary including total saved, progress percentage, and monthly required amount
- Edit existing goal details directly from the dashboard
- Delete a goal if needed

### Interactive Dashboard
- Savings progress chart showing contribution history
- Goal summary card with progress and key metrics
- Contribution panel for adding and reviewing contributions
- Contribution summary panel displaying:
  - Total saved amount
  - Average contribution
  - Number of active months
  - Status feedback (ahead, on track, or behind)
- Fully responsive layout for desktop use

### Contribution Tracking
- Add contributions with amount and date
- Delete contributions
- Automatic recalculation of totals and progress
- Instant UI updates using Angular change detection

### Milestone System
- Automatic milestones at 25%, 50%, and 75%
- Support for custom milestones
- Visual indicators for completed milestones
- Milestones stored in MongoDB

---

## Technology Stack

### Frontend
- Angular 20 (standalone components)
- TypeScript
- RxJS
- Chart.js
- HTML and CSS

### Backend
- Node.js
- Express.js REST API
- JWT authentication
- MongoDB with Mongoose

### Deployment
- Frontend hosted on Vercel
- Backend hosted on Render
- CI/CD enabled via GitHub main branch


## Project Structure (Frontend)

```
src/app/
  components/
    footer/
    header/
  interceptors/
  pages/
    dashboard/
      charts/ 
      contributions/
      goal/
      milestones/
    goal-wizard/
    home/
    login/
    signup/
```
The application uses fully standalone components, following Angular’s modern module-less architecture.

## Project Structure (Backend)

```
backend/
  config/
    auth.js
  middleware/
    auth.js
  models/
    Contribution.js
    Goal.js
    Milestone.js
    SavingsPlan.js
    User.js
  routes/api/
    auth.js
    contributions.js
    goals.js
    milestones.js
    savingPlans.js
    users.js
```

The backend is built using Node.js, Express.js, JWT authentication, and MongoDB (Mongoose).  
Routes are organized by feature, and data models follow a clean schema-based structure.

## Setup & Installation (Local development)

### 1. Clone the repository
git clone https://github.com/Sarait3/PlanItWise
cd PlanItWise

### 2. Install dependencies
npm install

### 3. Run the Angular frontend
ng serve

Frontend available at:  
http://localhost:4200

### 4. Start the backend
npm start

Backend available at:  
http://localhost:4000

## Running the Deployed Application

The application is also available as a live web application and does not require any local setup.

The frontend is deployed on Vercel and can be accessed directly through a browser.
The backend API is deployed on Render and is consumed by the frontend using an environment-based API URL configuration.

This setup allows the same codebase to work in both local development and production environments without changes to the source code.

## Limitations (MVP)

- Only one savings goal is supported
- Basic authentication only (no OAuth or third-party login)
- The application is not fully optimized for mobile screen sizes

## Future Enhancements

- Support multiple savings goals per user
- Smart Tips to guide users when they fall behind their savings plan
- Goal Notes to allow users to store personal reminders
- Integration with real-world data such as exchange rates or financial APIs
- Mobile Optimization: improve responsiveness and layout for smaller screens to ensure a smooth user experience on mobile devices