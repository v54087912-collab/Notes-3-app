// State Management
const appState = {
    notes: [],
    tasks: [],
    habits: [],
    currentTab: 'notes', // 'notes', 'tasks', 'habits', 'calendar'
    filter: '',
    theme: localStorage.getItem('theme') || 'light',
    pin: localStorage.getItem('app-pin'),
    streak: 0
};

// DOM Elements
const elements = {
    btnSettings: document.getElementById('btn-settings'),
    settingsModal: document.getElementById('settings-modal'),
    settingsClose: document.getElementById('settings-close'),
    themeGrid: document.getElementById('theme-grid'),
    btnSetupPin: document.getElementById('btn-setup-pin'),
    pinModal: document.getElementById('pin-modal'),
    pinInput: document.getElementById('pin-input'),
    pinSubmit: document.getElementById('pin-submit'),
    pinTitle: document.getElementById('pin-title'),
    pinError: document.getElementById('pin-error'),

    html: document.documentElement,
    notesView: document.getElementById('notes-view'),
    tasksView: document.getElementById('tasks-view'),
    habitsView: document.getElementById('habits-view'),
    calendarView: document.getElementById('calendar-view'),
    emptyState: document.getElementById('empty-state'),

    tabNotes: document.getElementById('tab-notes'),
    tabTasks: document.getElementById('tab-tasks'),
    tabHabits: document.getElementById('tab-habits'),
    tabCalendar: document.getElementById('tab-calendar'),

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
    },
    streakCounter: document.getElementById('streak-counter'),
    streakValue: document.getElementById('streak-value')
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    applyTheme();
    calculateStreak();
    renderApp();
    setupEventListeners();
    checkPinOnStart();
    feather.replace();
});

// Event Listeners
function setupEventListeners() {
    // Settings & Theme
    if(elements.btnSettings) {
        elements.btnSettings.addEventListener('click', () => {
            elements.settingsModal.classList.remove('hidden');
            elements.settingsModal.classList.add('open');
        });
        elements.settingsClose.addEventListener('click', () => {
            elements.settingsModal.classList.remove('open');
            setTimeout(() => elements.settingsModal.classList.add('hidden'), 300);
        });

        elements.themeGrid.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => setTheme(e.target.dataset.theme));
        });

        elements.btnSetupPin.addEventListener('click', setupPin);
        elements.pinSubmit.addEventListener('click', verifyPin);
    }

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
    const savedHabits = localStorage.getItem('habits');

    if (savedNotes) appState.notes = JSON.parse(savedNotes);
    if (savedTasks) appState.tasks = JSON.parse(savedTasks);
    if (savedHabits) appState.habits = JSON.parse(savedHabits);
}

function saveData() {
    localStorage.setItem('notes', JSON.stringify(appState.notes));
    localStorage.setItem('tasks', JSON.stringify(appState.tasks));
    localStorage.setItem('habits', JSON.stringify(appState.habits));
    updateStats();
    calculateStreak();
}

// Theme Logic
function setTheme(themeName) {
    appState.theme = themeName;
    localStorage.setItem('theme', themeName);
    applyTheme();
}

function applyTheme() {
    elements.html.className = appState.theme; // Replaces 'light', 'dark', 'theme-neon', etc.
    // Update active state in modal
    if(elements.themeGrid) {
        elements.themeGrid.querySelectorAll('.theme-btn').forEach(btn => {
            if(btn.dataset.theme === appState.theme) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }
}

// Security / PIN
function checkPinOnStart() {
    if(appState.pin) {
        elements.pinModal.classList.remove('hidden');
        elements.pinTitle.textContent = "Enter PIN to Unlock";
        elements.pinInput.value = '';
        elements.pinInput.focus();
    }
}

function verifyPin() {
    const input = elements.pinInput.value;
    if(elements.pinTitle.textContent.includes("Set")) {
        // Setting new PIN
        localStorage.setItem('app-pin', input);
        appState.pin = input;
        elements.pinModal.classList.add('hidden');
        alert("PIN Set Successfully!");
    } else {
        // Unlocking
        if(input === appState.pin) {
            elements.pinModal.classList.add('hidden');
        } else {
            elements.pinError.classList.remove('hidden');
        }
    }
}

function setupPin() {
    elements.settingsModal.classList.remove('open');
    setTimeout(() => elements.settingsModal.classList.add('hidden'), 300);

    elements.pinModal.classList.remove('hidden');
    elements.pinTitle.textContent = "Set New PIN";
    elements.pinInput.value = '';
    elements.pinInput.focus();
}

// Tab Switching
window.switchTab = function(tab) {
    appState.currentTab = tab;
    renderApp();
};

// Rendering
function renderApp() {
    // Hide all views first
    elements.notesView.classList.add('hidden');
    elements.tasksView.classList.add('hidden');
    elements.habitsView.classList.add('hidden');
    elements.calendarView.classList.add('hidden');
    elements.emptyState.classList.add('hidden');

    // Deactivate all tabs
    elements.tabNotes.classList.remove('active');
    elements.tabTasks.classList.remove('active');
    elements.tabHabits.classList.remove('active');
    elements.tabCalendar.classList.remove('active');

    if (appState.currentTab === 'notes') {
        elements.notesView.classList.remove('hidden');
        elements.tabNotes.classList.add('active');
        renderNotes();
    } else if (appState.currentTab === 'tasks') {
        elements.tasksView.classList.remove('hidden');
        elements.tabTasks.classList.add('active');
        renderTasks();
    } else if (appState.currentTab === 'habits') {
        elements.habitsView.classList.remove('hidden');
        elements.tabHabits.classList.add('active');
        renderHabits();
    } else if (appState.currentTab === 'calendar') {
        elements.calendarView.classList.remove('hidden');
        elements.tabCalendar.classList.add('active');
        renderCalendar();
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
        filteredNotes.forEach(note => {
            const date = new Date(note.createdAt).toLocaleDateString();
            const card = document.createElement('div');
            card.className = 'note-card';

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
            setupSwipeHandlers(card, note.id, 'note');
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
        filteredTasks.sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1);

        filteredTasks.forEach(task => {
            const item = document.createElement('div');
            const priorityClass = task.priority ? `priority-${task.priority.toLowerCase()}` : 'priority-medium';
            item.className = `task-item ${task.completed ? 'completed' : ''} ${priorityClass} task-card`;

            const catColorVar = `var(--cat-${task.category.toLowerCase()}-text)`;
            const priorityIcon = task.priority === 'High' ? '🔥' : (task.priority === 'Low' ? '🌙' : '⚡');

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
                        <span class="priority-indicator" title="Priority: ${task.priority || 'Medium'}">${priorityIcon}</span>
                    </p>
                    <span class="task-category" style="color: ${catColorVar}">${task.category}</span>
                    ${task.dueDate ? `
                        <div class="task-due-date ${new Date() > new Date(task.dueDate) && !task.completed ? 'overdue' : ''}">
                            <i data-feather="clock" style="width: 12px; height: 12px;"></i>
                            ${new Date(task.dueDate).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}
                        </div>
                    ` : ''}
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
            setupSwipeHandlers(item, task.id, 'task');
            elements.tasksView.appendChild(item);
        });
        feather.replace();
    }
}

function renderHabits() {
    elements.habitsView.innerHTML = '';
    const filteredHabits = appState.habits.filter(habit => habit.title.toLowerCase().includes(appState.filter));

    if (filteredHabits.length === 0) {
        elements.emptyState.classList.remove('hidden');
    } else {
        const today = new Date().toISOString().split('T')[0];

        filteredHabits.forEach(habit => {
            const isDoneToday = habit.history && habit.history[today];
            const item = document.createElement('div');
            item.className = 'habit-item';

            item.innerHTML = `
                <div>
                    <h4 class="task-title">${escapeHtml(habit.title)}</h4>
                    <span class="habit-streak">🔥 ${habit.streak} days</span>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <div class="habit-check ${isDoneToday ? 'done' : ''}" onclick="toggleHabit('${habit.id}')">
                        ${isDoneToday ? '<i data-feather="check"></i>' : ''}
                    </div>
                    <button onclick="editItem('${habit.id}', 'habit')" class="btn-action edit">
                        <i data-feather="edit-2" style="width: 16px; height: 16px;"></i>
                    </button>
                    <button onclick="deleteItem('${habit.id}', 'habit')" class="btn-action delete">
                        <i data-feather="trash-2" style="width: 16px; height: 16px;"></i>
                    </button>
                </div>
            `;
            elements.habitsView.appendChild(item);
        });
        feather.replace();
    }
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';

    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    document.getElementById('calendar-month').textContent = currentMonth;

    // Simple calendar logic for current month
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    // Empty slots
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        if (day === now.getDate()) dayEl.classList.add('today');

        dayEl.textContent = day;

        // Check for tasks due this day
        const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const hasTask = appState.tasks.some(t => t.dueDate && t.dueDate.startsWith(dateStr));

        if (hasTask) dayEl.classList.add('has-task');

        calendarGrid.appendChild(dayEl);
    }
}

function updateStats() {
    elements.stats.totalNotes.textContent = appState.notes.length;
    elements.stats.totalTasks.textContent = appState.tasks.length;
    elements.stats.completedTasks.textContent = appState.tasks.filter(t => t.completed).length;
}

function calculateStreak() {
    // Simple global streak logic: if any habit was done yesterday, increment, else reset.
    // This is a simplified version. Ideally per habit.
    // For global streak, let's just count total habits done today for visual.
    // Or, show max streak among habits.
    let maxStreak = 0;
    appState.habits.forEach(h => {
        if (h.streak > maxStreak) maxStreak = h.streak;
    });

    elements.streakValue.textContent = maxStreak;
    if (maxStreak > 0) elements.streakCounter.classList.remove('hidden');
    else elements.streakCounter.classList.add('hidden');
}

// Actions
function openModal(id = null, type = appState.currentTab) {
    // Normalize type from tab names to item types
    if (type === 'notes') type = 'note';
    if (type === 'tasks') type = 'task';
    if (type === 'habits') type = 'habit';
    if (type === 'calendar') type = 'task'; // Default to task for calendar

    elements.itemId.value = id || '';
    elements.itemType.value = type;

    // Reset Form
    elements.itemTitle.value = '';
    elements.itemContent.value = '';
    document.querySelector(`input[name="category"][value="Personal"]`).checked = true;

    // Adjust UI based on Type
    const priorityField = document.getElementById('field-priority');
    const dueDateField = document.getElementById('field-duedate');

    // Reset Visibility
    elements.fieldContent.classList.add('hidden');
    if(priorityField) priorityField.classList.add('hidden');
    if(dueDateField) dueDateField.classList.add('hidden');

    if (type === 'note') {
        elements.fieldContent.classList.remove('hidden');
        elements.itemContent.setAttribute('required', 'true');
        elements.modalTitle.textContent = id ? 'Edit Note' : 'Add New Note';
    } else if (type === 'task') {
        if(priorityField) priorityField.classList.remove('hidden');
        if(dueDateField) dueDateField.classList.remove('hidden');
        elements.itemContent.removeAttribute('required');
        elements.modalTitle.textContent = id ? 'Edit Task' : 'Add New Task';
    } else if (type === 'habit') {
        elements.itemContent.removeAttribute('required');
        elements.modalTitle.textContent = id ? 'Edit Habit' : 'Add New Habit';
    }

    // Load Data if Editing
    if (id) {
        let list;
        if (type === 'note') list = appState.notes;
        else if (type === 'task') list = appState.tasks;
        else if (type === 'habit') list = appState.habits;

        const item = list.find(i => i.id === id);
        if (item) {
            elements.itemTitle.value = item.title;
            if (type === 'note') elements.itemContent.value = item.content;
            document.querySelector(`input[name="category"][value="${item.category}"]`).checked = true;

            if (type === 'task') {
                if (item.priority) {
                    const prioInput = document.querySelector(`input[name="priority"][value="${item.priority}"]`);
                    if (prioInput) prioInput.checked = true;
                }
                if (item.dueDate) {
                    document.getElementById('item-duedate').value = item.dueDate;
                } else {
                    document.getElementById('item-duedate').value = '';
                }
            }
        }
    } else {
        // Reset inputs
        const defaultPrio = document.querySelector(`input[name="priority"][value="Medium"]`);
        if (defaultPrio) defaultPrio.checked = true;
        document.getElementById('item-duedate').value = '';
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
    const dueDate = document.getElementById('item-duedate').value;

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
    } else if (type === 'task') {
        const priority = document.querySelector('input[name="priority"]:checked').value;
        if (id) {
            // Edit Task
            const taskIndex = appState.tasks.findIndex(t => t.id === id);
            if (taskIndex > -1) {
                appState.tasks[taskIndex] = { ...appState.tasks[taskIndex], title, category, priority, dueDate, reminderSent: false };
            }
        } else {
            // Add Task
            const newTask = {
                id: Date.now().toString(),
                title,
                category,
                priority,
                dueDate,
                reminderSent: false,
                completed: false,
                createdAt: Date.now()
            };
            appState.tasks.unshift(newTask);
        }
    } else if (type === 'habit') {
        if (id) {
            const index = appState.habits.findIndex(h => h.id === id);
            if (index > -1) appState.habits[index] = { ...appState.habits[index], title, category };
        } else {
            const newHabit = {
                id: Date.now().toString(),
                title,
                category,
                streak: 0,
                history: {}, // Format: "YYYY-MM-DD": true
                createdAt: Date.now()
            };
            appState.habits.push(newHabit);
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
        } else if (type === 'task') {
            appState.tasks = appState.tasks.filter(t => t.id !== id);
        } else if (type === 'habit') {
            appState.habits = appState.habits.filter(h => h.id !== id);
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

window.toggleHabit = function(id) {
    const habit = appState.habits.find(h => h.id === id);
    if (habit) {
        const today = new Date().toISOString().split('T')[0];
        if (habit.history && habit.history[today]) {
            // Uncheck
            delete habit.history[today];
            if (habit.streak > 0) habit.streak--;
        } else {
            // Check
            if (!habit.history) habit.history = {};
            habit.history[today] = true;
            habit.streak++;
        }
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

// Voice Input Logic
window.startVoiceInput = function(targetId) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Your browser does not support voice input. Please try Chrome or Edge.");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US'; // Default to English
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const btn = document.querySelector(`button[onclick="startVoiceInput('${targetId}')"]`);
    const icon = btn.querySelector('i');

    // UI Feedback
    btn.classList.add('listening');
    icon.classList.add('animate-pulse');

    recognition.start();

    recognition.onresult = function(event) {
        const speechResult = event.results[0][0].transcript;
        const inputField = document.getElementById(targetId);

        // Append or Replace? Let's append if there's text, with a space.
        if (inputField.value) {
            inputField.value += ' ' + speechResult;
        } else {
            inputField.value = speechResult;
        }
    };

    recognition.onspeechend = function() {
        recognition.stop();
        btn.classList.remove('listening');
        icon.classList.remove('animate-pulse');
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error: ' + event.error);
        btn.classList.remove('listening');
        icon.classList.remove('animate-pulse');
        alert('Voice input error: ' + event.error);
    };
};

// Focus Timer Logic
let timerInterval;
let timerTime = 25 * 60;
let isTimerRunning = false;

const timerElements = {
    modal: document.getElementById('focus-modal'),
    btnOpen: document.getElementById('btn-focus-mode'),
    btnClose: document.getElementById('focus-close'),
    minutes: document.getElementById('timer-minutes'),
    seconds: document.getElementById('timer-seconds'),
    startBtn: document.getElementById('timer-start'),
    resetBtn: document.getElementById('timer-reset')
};

// Setup Timer Events
if (timerElements.btnOpen) {
    timerElements.btnOpen.addEventListener('click', () => {
        timerElements.modal.classList.remove('hidden');
        timerElements.modal.classList.add('open');
    });

    timerElements.btnClose.addEventListener('click', () => {
        timerElements.modal.classList.remove('open');
        setTimeout(() => timerElements.modal.classList.add('hidden'), 300);
    });

    timerElements.startBtn.addEventListener('click', toggleTimer);
    timerElements.resetBtn.addEventListener('click', resetTimer);
}

function updateTimerDisplay() {
    const m = Math.floor(timerTime / 60);
    const s = timerTime % 60;
    timerElements.minutes.textContent = m.toString().padStart(2, '0');
    timerElements.seconds.textContent = s.toString().padStart(2, '0');
}

function toggleTimer() {
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timerElements.startBtn.textContent = 'Start';
    } else {
        isTimerRunning = true;
        timerElements.startBtn.textContent = 'Pause';
        timerInterval = setInterval(() => {
            if (timerTime > 0) {
                timerTime--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isTimerRunning = false;
                timerElements.startBtn.textContent = 'Start';
                alert("Time's up! Focus session complete.");
                if (Notification.permission === "granted") {
                    new Notification("Focus Timer", { body: "Great job! Time to take a break." });
                }
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerElements.startBtn.textContent = 'Start';
    timerTime = 25 * 60;
    updateTimerDisplay();
}

window.setTimer = function(minutes) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerElements.startBtn.textContent = 'Start';
    timerTime = minutes * 60;
    updateTimerDisplay();
};

// Reminder Logic
function checkReminders() {
    const now = new Date();
    appState.tasks.forEach(task => {
        if (!task.completed && task.dueDate && !task.reminderSent) {
            const due = new Date(task.dueDate);
            // Check if due time is passed (within the last minute to avoid spam on reload)
            // Or just check if passed and not sent
            if (now >= due) {
                // Trigger notification
                if (Notification.permission === "granted") {
                    new Notification("Task Reminder", {
                        body: `It's time for: ${task.title}`,
                        icon: '/favicon.ico'
                    });
                }
                alert(`Reminder: ${task.title} is due!`);

                // Mark as sent to avoid loop
                task.reminderSent = true;
                saveData();
            }
        }
    });
}

// Request Notification Permission
if ("Notification" in window) {
    Notification.requestPermission();
}

// Check every minute
setInterval(checkReminders, 60000);

// Swipe Actions (Delete, Complete, Edit)
let touchStartX = 0;
let touchCurrentX = 0;
let swipedElement = null;
const SWIPE_THRESHOLD = 100;
let longPressTimer;

function setupSwipeHandlers(element, id, type) {
    // Long Press for Edit
    element.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        swipedElement = element;
        element.style.transition = 'none';

        longPressTimer = setTimeout(() => {
            editItem(id, type);
            navigator.vibrate(50); // Haptic feedback
        }, 600);
    }, {passive: true});

    element.addEventListener('touchmove', (e) => {
        if (!swipedElement) return;
        clearTimeout(longPressTimer); // Cancel long press on move
        touchCurrentX = e.touches[0].clientX;
        const diff = touchCurrentX - touchStartX;

        // Allow Left (Delete) and Right (Complete - Tasks Only)
        if (type === 'task' || diff < 0) {
            element.style.transform = `translateX(${diff}px)`;

            // Visual opacity
            if (Math.abs(diff) > 20) {
                element.style.opacity = Math.max(0.3, 1 - Math.abs(diff) / 300);

                // Green background for Right Swipe (Complete)
                if (diff > 0 && type === 'task') {
                    element.style.background = `rgba(16, 185, 129, ${Math.min(0.2, diff/500)})`;
                }
            }
        }
    }, {passive: true});

    element.addEventListener('touchend', (e) => {
        clearTimeout(longPressTimer);
        if (!swipedElement) return;
        const diff = touchCurrentX - touchStartX;

        element.style.transition = 'transform 0.3s ease-out, opacity 0.3s, background 0.3s';
        element.style.background = ''; // Reset bg

        if (diff < -SWIPE_THRESHOLD) {
            // Swipe Left -> Delete
            element.style.transform = `translateX(-100%)`;
            element.style.opacity = '0';
            setTimeout(() => deleteItem(id, type), 300);
        } else if (diff > SWIPE_THRESHOLD && type === 'task') {
            // Swipe Right -> Complete
            element.style.transform = `translateX(100%)`;
            element.style.opacity = '0';
            setTimeout(() => {
                toggleTask(id);
                // The re-render will handle the visual state
            }, 300);
        } else {
            // Snap back
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        }

        swipedElement = null;
        touchStartX = 0;
        touchCurrentX = 0;
    });
}
