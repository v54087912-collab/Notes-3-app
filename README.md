# NoteFlow - Notes & Tasks Manager

A modern, responsive, and feature-rich application to manage your notes, tasks, and habits. Built with pure HTML, CSS, and JavaScript for maximum performance and simplicity.

## 🚀 Features

### Core Functionality
- **Notes & Tasks**: Create, edit, and delete notes and tasks.
- **Unified Search**: Search across notes and tasks instantly.
- **Categories**: Organize content with color-coded labels (Work, Study, Personal, Ideas).
- **Data Persistence**: All data is automatically saved to LocalStorage.

### Productivity Tools
- **Focus Timer (Pomodoro)**: Built-in timer with presets (25m, 15m, 5m) to boost productivity.
- **Habit Tracker**: Track daily habits and build streaks.
- **Calendar View**: Visualize your tasks and habits on a monthly calendar.
- **Priority Levels**: Mark tasks as High, Medium, or Low priority.
- **Due Dates & Reminders**: Set due dates for tasks and get visual cues for overdue items.

### User Experience
- **Advanced Themes**:
  - Light / Dark Mode
  - Neon Theme (Cyberpunk style)
  - Gradient Theme
  - AMOLED Black (Battery saver)
- **Voice Input**: Use your microphone to dictate titles and content.
- **Swipe Actions**: Swipe right on mobile to delete items.
- **App Lock**: Secure your data with a 4-digit PIN.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile.

## 🛠 Tech Stack

- **HTML5**: Semantic structure.
- **CSS3**: Custom styling with CSS Variables, Flexbox, and Grid. No external frameworks required.
- **JavaScript (ES6+)**: Modular logic for state management, DOM manipulation, and LocalStorage interaction.
- **Feather Icons**: Lightweight and clean SVG icons.

## 📦 Setup Instructions

### Local Development

1. **Clone or Download** this repository.
2. **Open the Project**:
   - Simply double-click `index.html` to open it in your browser.
   - OR run a local server (recommended for best experience, especially for features like Voice Input):
     ```bash
     # Python 3
     python3 -m http.server 8080
     ```
     Then navigate to `http://localhost:8080`.

## 🌐 Hosting Guide

### Vercel (Recommended)

1. Create a [Vercel account](https://vercel.com).
2. Install Vercel CLI: `npm i -g vercel` (or use the web dashboard).
3. Run `vercel` in the project root directory.
4. Follow the prompts. Your site will be live in seconds!

**Manual Upload via Dashboard:**
1. Go to your Vercel Dashboard.
2. Click "Add New Project".
3. Import from your Git repository.
4. Keep the default settings.
5. Click "Deploy".

### Netlify

1. Create a [Netlify account](https://netlify.com).
2. Go to "Sites" -> "Add new site" -> "Deploy manually".
3. **Drag and drop** the project folder containing `index.html`, `style.css`, and `app.js` into the upload area.
4. Your site is now live!

## 📂 Project Structure

- `index.html`: Main application structure.
- `style.css`: All styles, themes, and animations.
- `app.js`: Application logic, event listeners, and data management.
- `vercel.json`: Configuration for Vercel deployment.
