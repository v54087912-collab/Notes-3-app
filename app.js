// State Management
const appState = {
    notes: [],
    tasks: [],
    currentTab: 'notes', // 'notes' or 'tasks'
    filter: '',
    darkMode: localStorage.getItem('theme') === 'dark'
};

// DOM Elements
const elements = {
    themeToggle: document.getElementById('theme-toggle'),
    html: document.documentElement,
    notesView: document.getElementById('notes-view'),
    tasksView: document.getElementById('tasks-view'),
    emptyState: document.getElementById('empty-state'),
    tabNotes: document.getElementById('tab-notes'),
    tabTasks: document.getElementById('tab-tasks'),
    searchInput: document.getElementById('search-input'),
    btnAdd: document.getElementById('btn-add-new'),
    modalOverlay: document.getElementById('modal-overlay'),
    modalContent: document.getElementById('modal-content'),
    modalTitle: document.getElementById('modal-title'),
    modalClose: document.getElementById('modal-close'),
    btnCancel: document.getElementById('btn-cancel'),
    itemForm: document.getElementById('item-form'),
    itemId: document.getElementById('item-id'),
    itemType: document.getElementById('item-type'),
    itemTitle: document.getElementById('item-title'),
    itemContent: document.getElementById('item-content'),
    fieldContent: document.getElementById('field-content'),
    stats: {
        totalNotes: document.getElementById('stat-total-notes'),
        totalTasks: document.getElementById('stat-total-tasks'),
        completedTasks: document.getElementById('stat-completed-tasks')
    }
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    applyTheme();
    renderApp();
    setupEventListeners();
    feather.replace();
});

// Event Listeners
function setupEventListeners() {
    // Theme Toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Modal Controls
    elements.btnAdd.addEventListener('click', () => openModal());
    elements.modalClose.addEventListener('click', closeModal);
    elements.btnCancel.addEventListener('click', closeModal);
    elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) closeModal();
    });

    // Form Submission
    elements.itemForm.addEventListener('submit', handleFormSubmit);

    // Search
    elements.searchInput.addEventListener('input', (e) => {
        appState.filter = e.target.value.toLowerCase();
        renderApp();
    });
}

// Data Management
function loadData() {
    const savedNotes = localStorage.getItem('notes');
    const savedTasks = localStorage.getItem('tasks');

    if (savedNotes) appState.notes = JSON.parse(savedNotes);
    if (savedTasks) appState.tasks = JSON.parse(savedTasks);
}

function saveData() {
    localStorage.setItem('notes', JSON.stringify(appState.notes));
    localStorage.setItem('tasks', JSON.stringify(appState.tasks));
    updateStats();
}

// Theme Logic
function toggleTheme() {
    appState.darkMode = !appState.darkMode;
    localStorage.setItem('theme', appState.darkMode ? 'dark' : 'light');
    applyTheme();
}

function applyTheme() {
    if (appState.darkMode) {
        elements.html.classList.add('dark');
    } else {
        elements.html.classList.remove('dark');
    }
}

// Tab Switching
window.switchTab = function(tab) {
    appState.currentTab = tab;

    // Update Tab Styles
    if (tab === 'notes') {
        elements.tabNotes.classList.add('bg-blue-500', 'text-white', 'shadow-sm');
        elements.tabNotes.classList.remove('text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');

        elements.tabTasks.classList.remove('bg-blue-500', 'text-white', 'shadow-sm');
        elements.tabTasks.classList.add('text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');
    } else {
        elements.tabTasks.classList.add('bg-blue-500', 'text-white', 'shadow-sm');
        elements.tabTasks.classList.remove('text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');

        elements.tabNotes.classList.remove('bg-blue-500', 'text-white', 'shadow-sm');
        elements.tabNotes.classList.add('text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');
    }

    renderApp();
};

// Rendering
function renderApp() {
    // Show/Hide Views
    if (appState.currentTab === 'notes') {
        elements.notesView.classList.remove('hidden');
        elements.tasksView.classList.add('hidden');
        renderNotes();
    } else {
        elements.notesView.classList.add('hidden');
        elements.tasksView.classList.remove('hidden');
        renderTasks();
    }
    updateStats();
}

function getCategoryColor(category) {
    const map = {
        'Personal': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        'Work': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        'Study': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        'Ideas': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    };
    return map[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
}

function renderNotes() {
    elements.notesView.innerHTML = '';

    const filteredNotes = appState.notes.filter(note =>
        note.title.toLowerCase().includes(appState.filter) ||
        note.content.toLowerCase().includes(appState.filter)
    );

    if (filteredNotes.length === 0) {
        elements.emptyState.classList.remove('hidden');
    } else {
        elements.emptyState.classList.add('hidden');

        filteredNotes.forEach(note => {
            const date = new Date(note.createdAt).toLocaleDateString();
            const card = document.createElement('div');
            card.className = 'note-card bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full';
            card.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <span class="text-xs font-semibold px-2 py-1 rounded-md ${getCategoryColor(note.category)}">${note.category}</span>
                    <div class="flex gap-1">
                        <button onclick="editItem('${note.id}', 'note')" class="btn-edit p-1.5 rounded-md text-gray-400 hover:text-blue-500 transition-colors">
                            <i data-feather="edit-2" class="w-4 h-4"></i>
                        </button>
                        <button onclick="deleteItem('${note.id}', 'note')" class="btn-delete p-1.5 rounded-md text-gray-400 hover:text-red-500 transition-colors">
                            <i data-feather="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">${escapeHtml(note.title)}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow whitespace-pre-wrap">${escapeHtml(note.content)}</p>
                <div class="mt-auto text-xs text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
                    ${date}
                </div>
            `;
            elements.notesView.appendChild(card);
        });
        feather.replace();
    }
}

function renderTasks() {
    elements.tasksView.innerHTML = '';

    const filteredTasks = appState.tasks.filter(task =>
        task.title.toLowerCase().includes(appState.filter)
    );

    if (filteredTasks.length === 0) {
        elements.emptyState.classList.remove('hidden');
    } else {
        elements.emptyState.classList.add('hidden');

        // Sort tasks: Incomplete first, then Completed
        filteredTasks.sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1);

        filteredTasks.forEach(task => {
            const item = document.createElement('div');
            item.className = `group flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all ${task.completed ? 'opacity-60' : ''}`;

            // Extract text colors specifically for the task view logic, or just reuse the class string
            // For tasks, we want a simpler view, just text color
            // Parse the classes from getCategoryColor to find text colors
            const colorClasses = getCategoryColor(task.category);
            const textColors = colorClasses.split(' ').filter(c => c.startsWith('text-') || c.startsWith('dark:text-')).join(' ');

            item.innerHTML = `
                <label class="relative flex items-center cursor-pointer">
                    <input type="checkbox" class="peer sr-only task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                    <div class="w-5 h-5 border-2 border-gray-300 dark:border-gray-500 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all flex items-center justify-center">
                        <i data-feather="check" class="w-3 h-3 text-white opacity-0 peer-checked:opacity-100"></i>
                    </div>
                </label>

                <div class="flex-grow">
                    <p class="text-sm font-medium text-gray-800 dark:text-gray-200 transition-all ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}">
                        ${escapeHtml(task.title)}
                    </p>
                    <span class="text-xs ${textColors} font-medium mt-0.5 block">${task.category}</span>
                </div>

                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="editItem('${task.id}', 'task')" class="btn-edit p-1.5 rounded-md text-gray-400 hover:text-blue-500 transition-colors">
                        <i data-feather="edit-2" class="w-4 h-4"></i>
                    </button>
                    <button onclick="deleteItem('${task.id}', 'task')" class="btn-delete p-1.5 rounded-md text-gray-400 hover:text-red-500 transition-colors">
                        <i data-feather="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            `;
            elements.tasksView.appendChild(item);
        });
        feather.replace();
    }
}

function updateStats() {
    elements.stats.totalNotes.textContent = appState.notes.length;
    elements.stats.totalTasks.textContent = appState.tasks.length;
    elements.stats.completedTasks.textContent = appState.tasks.filter(t => t.completed).length;
}

// Actions
function openModal(id = null, type = appState.currentTab) {
    // Normalize type from tab names to item types
    if (type === 'notes') type = 'note';
    if (type === 'tasks') type = 'task';

    elements.itemId.value = id || '';
    elements.itemType.value = type;

    // Reset Form
    elements.itemTitle.value = '';
    elements.itemContent.value = '';
    document.querySelector(`input[name="category"][value="Personal"]`).checked = true;

    // Adjust UI based on Type
    if (type === 'task') {
        elements.fieldContent.classList.add('hidden');
        elements.itemContent.removeAttribute('required');
        elements.modalTitle.textContent = id ? 'Edit Task' : 'Add New Task';
    } else {
        elements.fieldContent.classList.remove('hidden');
        elements.itemContent.setAttribute('required', 'true');
        elements.modalTitle.textContent = id ? 'Edit Note' : 'Add New Note';
    }

    // Load Data if Editing
    if (id) {
        const list = type === 'note' ? appState.notes : appState.tasks;
        const item = list.find(i => i.id === id);
        if (item) {
            elements.itemTitle.value = item.title;
            if (type === 'note') elements.itemContent.value = item.content;
            document.querySelector(`input[name="category"][value="${item.category}"]`).checked = true;
        }
    }

    elements.modalOverlay.classList.remove('hidden');
    // Trigger reflow for animation
    void elements.modalOverlay.offsetWidth;
    elements.modalOverlay.classList.add('modal-open');
}

function closeModal() {
    elements.modalOverlay.classList.remove('modal-open');
    setTimeout(() => {
        elements.modalOverlay.classList.add('hidden');
    }, 300);
}

function handleFormSubmit(e) {
    e.preventDefault();

    const id = elements.itemId.value;
    const type = elements.itemType.value;
    const title = elements.itemTitle.value;
    const content = elements.itemContent.value;
    const category = document.querySelector('input[name="category"]:checked').value;

    if (type === 'note') {
        if (id) {
            // Edit Note
            const noteIndex = appState.notes.findIndex(n => n.id === id);
            if (noteIndex > -1) {
                appState.notes[noteIndex] = { ...appState.notes[noteIndex], title, content, category, updatedAt: Date.now() };
            }
        } else {
            // Add Note
            const newNote = {
                id: Date.now().toString(),
                title,
                content,
                category,
                createdAt: Date.now()
            };
            appState.notes.unshift(newNote);
        }
    } else {
        if (id) {
            // Edit Task
            const taskIndex = appState.tasks.findIndex(t => t.id === id);
            if (taskIndex > -1) {
                appState.tasks[taskIndex] = { ...appState.tasks[taskIndex], title, category };
            }
        } else {
            // Add Task
            const newTask = {
                id: Date.now().toString(),
                title,
                category,
                completed: false,
                createdAt: Date.now()
            };
            appState.tasks.unshift(newTask);
        }
    }

    saveData();
    renderApp();
    closeModal();
}

window.deleteItem = function(id, type) {
    if (confirm('Are you sure you want to delete this item?')) {
        if (type === 'note') {
            appState.notes = appState.notes.filter(n => n.id !== id);
        } else {
            appState.tasks = appState.tasks.filter(t => t.id !== id);
        }
        saveData();
        renderApp();
    }
};

window.editItem = function(id, type) {
    openModal(id, type);
};

window.toggleTask = function(id) {
    const task = appState.tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveData();
        renderApp();
    }
};

// Utility
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
