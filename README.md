# NoteFlow - Notes & Tasks Manager

A modern, responsive application to manage your notes and tasks efficiently. Built with Vanilla HTML, CSS, and JavaScript.

## 🚀 Features

- **Notes Management**: Add, edit, delete notes.
- **Task Management**: Add tasks, mark as completed, delete.
- **Search**: integrated search bar filtering both notes and tasks.
- **Categories**: Organize content by tags (Work, Study, Personal, Ideas).
- **Dark/Light Mode**: Toggle themes for comfortable viewing.
- **Local Storage**: Data persists automatically in your browser.
- **Responsive Design**: Works on Desktop and Mobile.
- **Dashboard**: Quick view of total notes, tasks, and completion status.

## 🛠 Tech Stack

- **HTML5**: Semantic structure.
- **CSS3**: Custom styling with CSS Variables for theming (No frameworks).
- **JavaScript (ES6+)**: Logic for DOM manipulation and LocalStorage.
- **Feather Icons**: Simple and clean icons.

## 📦 Setup Instructions

### Local Development

1. **Clone or Download** the repository.
2. **Open the Project**:
   - Simply double-click `index.html` to open it in your browser.
   - OR run a local server (recommended for best experience):
     ```bash
     # Python 3
     python3 -m http.server 8080
     ```
     Then navigate to `http://localhost:8080`.

## 🌐 How to Host

### Vercel (Recommended)

1. Create a [Vercel account](https://vercel.com).
2. Install Vercel CLI: `npm i -g vercel` (or use the web dashboard).
3. Run `vercel` in the project root directory.
4. Follow the prompts. Your site will be live in seconds!

**Manual Upload:**
1. Go to your Vercel Dashboard.
2. Click "Add New Project".
3. Import from your Git repository.
4. Keep the default settings (Root Directory is `./`).
5. Click "Deploy".

### Netlify

1. Create a [Netlify account](https://netlify.com).
2. Go to "Sites" -> "Add new site" -> "Deploy manually".
3. **Drag and drop** the project folder containing `index.html`, `style.css`, and `app.js` into the upload area.
4. Your site is now live!
