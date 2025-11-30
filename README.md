# PlanItWise – Savings Goal Planner (MVP)

PlanItWise is a personal finance web application designed to help users plan and track savings goals.  
This MVP allows users to create one goal, add contributions, monitor progress over time, and visualize savings growth through an interactive dashboard.

This project was developed using Angular 20 (standalone components), Node.js 22, and MongoDB, following modern front-end architecture and clean component organization.


## Features (MVP)

### User Authentication
- Register and log in using a secure backend API  
- Authentication state stored in browser storage  
- Route protection for the dashboard  

### Single Savings Goal Management
- Create one goal (title, target amount, deadline)  
- View summary information (total saved, progress %, monthly required amount)  
- Delete goal if needed  

### Interactive Dashboard
- Savings Chart: Line chart showing cumulative growth  
- Goal Summary Card: Displays progress and key metrics  
- Contribution Panel: Add contributions and view history  
- Milestones Panel: Auto-generated (25%, 50%, 75%) and custom milestones  
- Milestone popup when milestones are reached  
- Fully responsive layout  

### Milestone System
- Automatically generate default milestones  
- Add custom milestones  
- Track achieved milestones  
- Visual indicators for completed milestones  
- Stored in MongoDB  

### Contribution Tracking
- Add contributions with amount, date, and optional note  
- Delete contributions  
- History modal with full list of entries  
- Instant UI refresh through Angular change detection  


## Technology Stack

### Frontend
- Angular 20.3 (standalone components)  
- TypeScript 5.9  
- RxJS 7.8  
- Chart.js  
- Responsive HTML/CSS  

### Backend
- Node.js 22  
- Express.js REST API  
- JWT-based authentication  
- MongoDB + Mongoose  

### Development Tools
- Angular CLI 20.3  
- npm 10.9  
- Git + GitHub  


## Project Structure (Frontend)

```
src/app/
  components/
    footer/
    header/
  interceptors/
  pages/
    dashboard/
      chart/
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

## Setup & Installation

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


## Limitations (MVP)
- Only one savings goal is supported  
- Goal details cannot be edited after creation  
- Basic authentication (no OAuth integration)   


## Future Enhancements
- Support multiple goals per user  
- Editing and updating goals
- Smart Tips: personalized suggestions, such as increasing contributions if progress is falling behind, or offer brief educational insights
- Goal Notes: simple notes section for each goal where users can record reminders or personal comments  
- Real-World Data Integration: Connect with external APIs to fetch live information, such as currency exchange rates for travel-related goals or market data for investment tracking.  

