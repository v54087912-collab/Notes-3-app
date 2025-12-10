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
    renderApp();
};

// Rendering
function renderApp() {
    // Show/Hide Views
    if (appState.currentTab === 'notes') {
        elements.notesView.classList.remove('hidden');
        elements.tasksView.classList.add('hidden');

        elements.tabNotes.classList.add('active');
        elements.tabTasks.classList.remove('active');

        renderNotes();
    } else {
        elements.notesView.classList.add('hidden');
        elements.tasksView.classList.remove('hidden');

        elements.tabTasks.classList.add('active');
        elements.tabNotes.classList.remove('active');

        renderTasks();
    }
    updateStats();
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
            card.className = 'note-card';

            // Map category to badge class
            const badgeClass = `badge badge-${note.category.toLowerCase()}`;

            card.innerHTML = `
                <div class="card-header">
                    <span class="${badgeClass}">${note.category}</span>
                    <div class="card-actions">
                        <button onclick="editItem('${note.id}', 'note')" class="btn-action edit">
                            <i data-feather="edit-2" style="width: 16px; height: 16px;"></i>
                        </button>
                        <button onclick="deleteItem('${note.id}', 'note')" class="btn-action delete">
                            <i data-feather="trash-2" style="width: 16px; height: 16px;"></i>
                        </button>
                    </div>
                </div>
                <h3 class="note-title">${escapeHtml(note.title)}</h3>
                <p class="note-content">${escapeHtml(note.content)}</p>
                <div class="note-footer">
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
            item.className = `task-item ${task.completed ? 'completed' : ''}`;

            const catColorVar = `var(--cat-${task.category.toLowerCase()}-text)`;

            item.innerHTML = `
                <label class="checkbox-wrapper">
                    <input type="checkbox" class="checkbox-input" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                    <div class="checkbox-visual">
                        <i data-feather="check"></i>
                    </div>
                </label>

                <div class="task-content">
                    <p class="task-title">
                        ${escapeHtml(task.title)}
                    </p>
                    <span class="task-category" style="color: ${catColorVar}">${task.category}</span>
                </div>

                <div class="task-actions">
                    <button onclick="editItem('${task.id}', 'task')" class="btn-action edit">
                        <i data-feather="edit-2" style="width: 16px; height: 16px;"></i>
                    </button>
                    <button onclick="deleteItem('${task.id}', 'task')" class="btn-action delete">
                        <i data-feather="trash-2" style="width: 16px; height: 16px;"></i>
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
    elements.modalOverlay.classList.add('open');
}

function closeModal() {
    elements.modalOverlay.classList.remove('open');
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
