# Dental Clinic Management App

A modern, simulated dental clinic management system for Admin (Dentist) and Patient roles. Built with React and localStorage for demonstration, learning, and evaluation—no backend or external libraries required.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo Data](#demo-data)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Technical Details](#technical-details)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [FAQ](#faq)
- [License](#license)

## Overview

The Dental Clinic Management App is designed to help dental clinics manage patient records, appointments, and treatments efficiently. It simulates realistic workflows for both admin (dentist) and patient roles, focusing on code quality, structure, and user experience.

**⚠️ This app is for demonstration and educational use only. Do not use for real patient data.**

## Features

### Authentication & Authorization

- **Role-based login:** Hardcoded Admin and Patient users.
- **Session persistence:** User remains logged in via localStorage.
- **Role-based UI:** Admins and Patients see different features.

### Patient Management (Admin Only)

- **CRUD operations:** Add, view, edit, and delete patients.
- **Patient details:** Name, DOB, contact info, health info.
- **Patient search/filter:** Quickly find patients.

### Incident & Appointment Management (Admin Only)

- **Appointment tracking:** Schedule, update, or delete appointments.
- **Incident details:** Title, description, comments, date, cost, status.
- **File attachments:** Attach invoices, x-rays, and other files (simulated).

### Patient Portal (Patient Only)

- **View appointments:** See upcoming and past visits.
- **Download documents:** Access invoices and treatment files.
- **Profile management:** View and update personal info.

### Dashboard

- **Quick stats:** Patient count, upcoming appointments, revenue summary.
- **Recent activity:** Latest appointments and changes.

### General

- **Responsive UI:** Works on desktop and mobile.
- **State management:** React hooks and context.
- **Data persistence:** All data stored in localStorage.

## Demo Data

### Users

```json
[
  { "id": "1", "role": "Admin", "email": "admin@entnt.in", "password": "admin123" },
  { "id": "2", "role": "Patient", "email": "john@entnt.in", "password": "patient123", "patientId": "p1" }
]
```

### Patients

```json
[
  {
    "id": "p1",
    "name": "John Doe",
    "dob": "1990-05-10",
    "contact": "1234567890",
    "healthInfo": "No allergies"
  }
]
```

### Incidents/Appointments

```json
[
  {
    "id": "i1",
    "patientId": "p1",
    "title": "Toothache",
    "description": "Upper molar pain",
    "comments": "Sensitive to cold",
    "appointmentDate": "2025-07-01T10:00:00",
    "cost": 80,
    "status": "Completed",
    "files": [
      { "name": "invoice.pdf", "url": "base64string-or-blob-url" },
      { "name": "xray.png", "url": "base64string-or-blob-url" }
    ]
  }
]
```

## Installation & Setup

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- Git

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/dental-clinic-management-app.git
   cd dental-clinic-management-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the app:**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open in browser:**  
   Go to [http://localhost:3000](http://localhost:3000)

### Demo Login

- **Admin:**  
  Email: `admin@entnt.in`  
  Password: `admin123`

- **Patient:**  
  Email: `john@entnt.in`  
  Password: `patient123`

## Usage Guide

### For Admin (Dentist)

- **Dashboard:** See stats and activity.
- **Patients:** Add, edit, or remove patient records.
- **Appointments:** Schedule, update, or delete incidents/appointments.
- **Files:** Attach and view files for each appointment.
- **Search:** Quickly find patients or incidents.

### For Patient

- **My Appointments:** View upcoming and past appointments.
- **My Profile:** View and update personal info.
- **Documents:** Download invoices and treatment files.

## Project Structure

```
src/
  components/    # UI components (Login, PatientList, IncidentList, etc.)
  data/          # Mock data (users, patients, incidents)
  utils/         # Helper functions (auth, validation, storage)
  context/       # React context for auth/data
  pages/         # Main app pages (Dashboard, Patients, Incidents)
  App.js         # Routing and state management
  index.js       # Entry point
  styles/        # CSS files
```

## Technical Details

- **No backend/API:** All data is simulated and stored in localStorage.
- **No external libraries:** Only React and core dependencies.
- **Authentication:** Simulated with hardcoded users.
- **Access Control:** UI and actions restricted by role.
- **UI/UX:** Simple, clean, and responsive.
- **Testing:** Add your own tests using Jest and React Testing Library.

## Contributing

1. **Fork** the repo and create a new branch.
2. **Write clear, well-structured code.**
3. **Add tests** for new features.
4. **Document** your changes.
5. **Open a pull request** with a detailed description.

## Troubleshooting

- **Login not working?**  
  Clear your browser's localStorage and try again.
- **Data not saving?**  
  Make sure your browser allows localStorage.
- **App not starting?**  
  Check Node.js and npm versions, reinstall dependencies.

## Future Improvements

- Real backend integration (Node.js, Express, MongoDB)
- Real file uploads and downloads
- Email/SMS notifications
- Advanced analytics and reporting
- Multi-user and multi-role support
- Accessibility (WCAG) and internationalization

## FAQ

**Q: Can I use this app for a real clinic?**  
A: No. This is for demo and educational use only.

**Q: How do I reset all data?**  
A: Clear your browser's localStorage.

**Q: Can I add more users?**  
A: Yes, by editing the mock data in `src/data/users.json`.

**Q: How do I deploy this app?**  
A: Build with `npm run build` and deploy to Netlify, Vercel, or GitHub Pages.

## License

MIT License.  
**For demonstration and educational use only. Not for real patient data.**

**Questions?**  
Open an issue on GitHub or contact the maintainer.
