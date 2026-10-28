# Student to Student Study App (Peer Learning Platform)

A modern, responsive university peer-learning web application built with **React** and **Tailwind CSS**. Designed specifically for engineering and college students to exchange academic doubts, access verified unit notes, form study circles, and connect with senior peer mentors.

---

## 🎨 Color Palette

| Color | Hex / Tailwind Token | Purpose |
|---|---|---|
| **Navy Blue** | `#0F172A` / `#1E293B` (`navy-900`, `navy-800`) | Primary headers, navbars, cards, and deep contrast accents |
| **Cream** | `#FDFBF7` / `#F8F5EE` (`cream-50`, `cream-100`) | Clean, warm background, card surfaces, and soft containers |
| **Teal** | `#0D9488` / `#14B8A6` (`teal-600`, `teal-500`) | Secondary accent, badges, active indicators, and success states |
| **Orange** | `#F97316` / `#EA580C` (`orange-500`, `orange-600`) | Call-to-actions, "Ask a Doubt" center button, and star ratings |

---

## 🚀 Instant Launch / Preview Options

### Option 1: Instant Browser Preview (Zero Installation Required!)
Simply open `index.html` directly in Google Chrome, Microsoft Edge, or any modern web browser:
1. Double-click [index.html](file:///c:/Users/hp/Downloads/DTI/index.html) in your file explorer.
2. OR run a lightweight Python HTTP server:
   ```bash
   python -m http.server 3000
   ```
   and visit `http://localhost:3000`.

### Option 2: Full React + Vite Development Server (with Node.js)
```bash
npm install
npm run dev
```

---

## 📱 Features & Screen Specifications

### 1. Home / Dashboard
- **Top Navigation Bar:** Desktop header with navigation tabs, branding logo, user profile badge, and peer points counter.
- **Hero Welcome Banner:** Personalized greeting showing student college, semester, quick stats (Active Doubts, Peer Answers, Verified Notes, Study Circles), and quick action buttons.
- **Subject Pills:** Quick filter buttons for course subjects (`Maths`, `C Programming`, `Data Structures`, `Operating Systems`, `Physics`, `Digital Electronics`).
- **Recent Doubts Feed:** Displays newly asked doubts with author details, tags, best answer indicators, view counts, and direct "Discuss & Answer" action.
- **Popular Notes Shelf:** Top downloaded notes with preview/download triggers and star ratings.

### 2. Ask a Doubt Page
- Dropdown selector for **Subject** (Maths, Physics, C Programming, Data Structures, Operating Systems, Digital Electronics, Chemistry).
- Dropdown for **Semester / Level** (Semester 1 to Semester 8).
- Question Summary / One-Liner input.
- Large, spacious text area for typing the complete doubt description.
- Optional Monospace Code / Math Formula snippet box.
- Interactive submission with instant state updates, toast notification, and auto-routing to the newly created thread in the Doubt Board.

### 3. Notes Library Page
- Searchable repository categorized by **Subject** and **Semester**.
- Displays list items such as *"Maths Unit 1"*, *"C Programming: Pointers & Structs"*, *"Physics Unit 3"*, and *"DSA: Trees & Dynamic Programming"*.
- Information displayed: Title, Subject badge, Semester tag, Uploader name & UID, file format (PDF), file size, download count, and star ratings.
- Real-time instant search and dual filter system (Subject + Semester).
- **Preview Modal:** View document outline and unit contents before downloading.
- **Upload Notes Modal:** Allows peers to contribute unit notes to earn +20 peer credits.

### 4. Doubt Board (Forum Interface)
- Discussion forum where students post questions and peers can reply with solutions.
- Filter doubts by search query and subject tags.
- Detailed thread view showing author UID, college, question text, formatted code snippet, and replies.
- **Best Answer Flag:** Highlights verified answers with a special gold/orange badge.
- **Interactive Peer Reply:** Users can submit answers in real time to any doubt.
- **Upvote & Star Rating:** Peers can upvote helpful answers and leave a 1-5 star review.

### 5. Study Groups
- Directory of course-specific study circles (e.g. *"C Programming & DSA Lab Squad"*, *"Calculus Crushers"*).
- Member capacity progress bar and moderator name.
- Meeting schedule indicator (e.g. Discord, Library Hall, Google Meet).
- Interactive **"Join Study Group" / "Leave Group"** toggle with member count updating in real time.
- **Create Study Group Modal:** Launch a new study circle with customizable capacity and meeting times.

### 6. Peer Tutors Directory
- Directory to find seniors and high-achieving classmates offering 1-on-1 academic mentoring.
- Tutor cards with student photo, course/year, subjects taught, average star rating, reviews count, and availability.
- **"Book Free Session"** action with feedback confirmation.
- **"Rate Tutor"** modal to submit 1-5 star rating and feedback text.

### 7. Star Rating System
- Dedicated modal supporting 1 to 5 star ratings with feedback notes.
- Integrated across peer answers and tutor profiles to reward helpful academic contributors.

### 8. Native Mobile Experience
- Responsive bottom navigation bar with tactile touch targets, active state highlighting, and elevated center **"Ask Doubt" (+)** action button.
- Smooth transitions, clean card layouts, and mobile-friendly typography.

---

## 📁 Project Structure

```
c:\Users\hp\Downloads\DTI/
├── index.html                   # Out-of-the-box runnable React 18 + Tailwind SPA
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite bundler configuration
├── tailwind.config.js           # Custom theme colors (Navy, Cream, Teal, Orange)
├── postcss.config.js            # PostCSS configuration
├── README.md                    # Documentation & guide
└── src/
    ├── App.jsx                  # Main application state & screen router
    ├── main.jsx                 # Entry point
    ├── index.css                # Tailwind directives & custom scrollbars
    ├── data/
    │   └── mockData.js          # Mock data (Users, Doubts, Notes, Groups, Ratings)
    └── components/
        ├── Navbar.jsx           # Top desktop & tablet navigation bar
        ├── BottomNav.jsx        # Mobile native app bottom bar
        ├── HomeDashboard.jsx    # Feed of recent doubts & popular notes
        ├── AskDoubt.jsx         # Doubt submission form
        ├── DoubtBoard.jsx       # Forum interface & thread replies
        ├── NotesLibrary.jsx     # Searchable repository by Subject & Semester
        ├── StudyGroups.jsx      # Course study circles & join toggle
        ├── PeerTutors.jsx       # Senior mentor directory
        ├── RatingModal.jsx      # Star rating & feedback dialog
        └── ProfileModal.jsx     # Student profile & stats dialog
```
