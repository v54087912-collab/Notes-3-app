// Global Variables
let currentSongIndex = 0;
let isPlaying = false;
let audio = new Audio();
let currentPlaylist = []; // Current list of songs being played (Trending, Playlist, Search results)
let userPlaylists = JSON.parse(localStorage.getItem('userPlaylists')) || {};
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Constants
const songListElement = document.getElementById('trending-list');
const recentListElement = document.getElementById('recent-list');
const categoriesListElement = document.getElementById('categories-list');
const searchInput = document.getElementById('search-input');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadSongs(songDatabase);
    loadCategories();
    loadRecent();
    setupTheme();
    updateGreeting();

    // Default to trending
    currentPlaylist = [...songDatabase];

    // Hide spinner
    setTimeout(() => {
        document.getElementById('loading-spinner').classList.add('hidden');
    }, 1000);
});

// Navigation
window.navigateTo = function(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Highlight nav item
    const navMap = {'home': 0, 'library': 1, 'profile': 2};
    if (navMap[pageId] !== undefined) {
        document.querySelectorAll('.nav-item')[navMap[pageId]].classList.add('active');
    }

    if (pageId === 'library') loadLibrary();
}

// Load Songs into DOM
function loadSongs(songs, targetElement = songListElement) {
    targetElement.innerHTML = '';
    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'song-item';

        const img = document.createElement('img');
        img.src = song.cover;
        img.className = 'song-img';
        img.loading = 'lazy';

        const info = document.createElement('div');
        info.className = 'song-info';

        const title = document.createElement('div');
        title.className = 'song-title';
        title.textContent = song.title;

        const artist = document.createElement('div');
        artist.className = 'song-artist';
        artist.textContent = song.artist;

        info.appendChild(title);
        info.appendChild(artist);

        const actions = document.createElement('div');
        actions.className = 'song-actions';
        actions.innerHTML = '<i class="fas fa-play"></i>'; // Static icon is safe

        item.appendChild(img);
        item.appendChild(info);
        item.appendChild(actions);

        item.onclick = () => playSong(song.id, songs);
        targetElement.appendChild(item);
    });
}

// Categories
function loadCategories() {
    const categories = ['All', 'LoFi', 'Pop', 'Chill', 'Bollywood', 'Anime', 'Rock'];
    categoriesListElement.innerHTML = '';
    categories.forEach(cat => {
        const pill = document.createElement('div');
        pill.className = 'category-pill';
        pill.innerText = cat;
        pill.onclick = () => filterByCategory(cat, pill);
        if(cat === 'All') pill.classList.add('active');
        categoriesListElement.appendChild(pill);
    });
}

function filterByCategory(category, element) {
    document.querySelectorAll('.category-pill').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    if (category === 'All') {
        loadSongs(songDatabase);
    } else {
        const filtered = songDatabase.filter(s => s.category === category);
        loadSongs(filtered);
    }
}

// Audio Player Logic
function playSong(id, playlistContext = songDatabase) {
    currentPlaylist = playlistContext;
    const index = currentPlaylist.findIndex(s => s.id === id);
    if (index !== -1) {
        currentSongIndex = index;
        loadAudio(currentPlaylist[currentSongIndex]);
        audio.play();
        isPlaying = true;
        updatePlayerUI();
        addToRecent(currentPlaylist[currentSongIndex]);
    }
}

function loadAudio(song) {
    audio.src = song.url;
    audio.load();

    // Error Handling
    audio.onerror = () => {
        alert(`Error playing: ${song.title}. The stream might be offline.`);
        isPlaying = false;
        updatePlayerUI();
    };

    // Update Media Session
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: song.artist,
            artwork: [{ src: song.cover, sizes: '512x512', type: 'image/jpeg' }]
        });

        navigator.mediaSession.setActionHandler('play', togglePlay);
        navigator.mediaSession.setActionHandler('pause', togglePlay);
        navigator.mediaSession.setActionHandler('previoustrack', playPrev);
        navigator.mediaSession.setActionHandler('nexttrack', playNext);
    }
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        isPlaying = true;
    } else {
        audio.pause();
        isPlaying = false;
    }
    updatePlayerUI();
}

function playNext() {
    currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
    playSong(currentPlaylist[currentSongIndex].id, currentPlaylist);
}

function playPrev() {
    currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    playSong(currentPlaylist[currentSongIndex].id, currentPlaylist);
}

// UI Updates
function updatePlayerUI() {
    const song = currentPlaylist[currentSongIndex];

    // Mini Player
    document.getElementById('mini-title').innerText = song.title;
    document.getElementById('mini-artist').innerText = song.artist;
    document.getElementById('mini-art').src = song.cover;

    // Full Player
    document.getElementById('player-title').innerText = song.title;
    document.getElementById('player-artist').innerText = song.artist;
    document.getElementById('player-art').src = song.cover;

    // Icons
    const playIcons = document.querySelectorAll('.fa-play, .fa-pause');
    const miniIcon = document.querySelector('#play-btn-mini i');
    const largeIcon = document.querySelector('#play-btn-large i');

    if (isPlaying) {
        miniIcon.className = 'fas fa-pause';
        largeIcon.className = 'fas fa-pause';
        document.getElementById('player-art').classList.add('rotating');
    } else {
        miniIcon.className = 'fas fa-play';
        largeIcon.className = 'fas fa-play';
        document.getElementById('player-art').classList.remove('rotating');
    }
}

// Seek Bar
audio.ontimeupdate = () => {
    const seek = document.getElementById('seek-bar');
    const currentTime = document.getElementById('current-time');
    const duration = document.getElementById('duration');

    if (audio.duration) {
        seek.value = (audio.currentTime / audio.duration) * 100;
        currentTime.innerText = formatTime(audio.currentTime);
        duration.innerText = formatTime(audio.duration);
    }
};

document.getElementById('seek-bar').oninput = (e) => {
    const seekTime = (audio.duration / 100) * e.target.value;
    audio.currentTime = seekTime;
};

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Volume
document.getElementById('volume-slider').oninput = (e) => {
    audio.volume = e.target.value;
};

// Full Player Toggle
window.toggleFullPlayer = function() {
    document.getElementById('full-player').classList.toggle('active');
};

// Controls Event Listeners
document.getElementById('play-btn-mini').onclick = (e) => {
    e.stopPropagation();
    togglePlay();
};
document.getElementById('play-btn-large').onclick = togglePlay;
document.getElementById('next-btn-large').onclick = playNext;
document.getElementById('prev-btn-large').onclick = playPrev;

// Search
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = songDatabase.filter(s =>
        s.title.toLowerCase().includes(term) ||
        s.artist.toLowerCase().includes(term)
    );
    loadSongs(filtered);
});

// Voice Search
const voiceBtn = document.getElementById('voice-search-btn');
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        voiceBtn.style.color = 'var(--secondary-neon)';
    };

    recognition.onend = () => {
        voiceBtn.style.color = 'var(--text-muted)';
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        searchInput.dispatchEvent(new Event('input'));
    };

    voiceBtn.onclick = () => {
        recognition.start();
    };
} else {
    voiceBtn.style.display = 'none';
}

// Recent Plays
function addToRecent(song) {
    let recent = JSON.parse(localStorage.getItem('recent')) || [];
    recent = recent.filter(s => s.id !== song.id); // Remove if exists
    recent.unshift(song); // Add to top
    if (recent.length > 5) recent.pop(); // Keep max 5
    localStorage.setItem('recent', JSON.stringify(recent));
    loadRecent();
}

function loadRecent() {
    const recent = JSON.parse(localStorage.getItem('recent')) || [];
    loadSongs(recent, recentListElement);
    if(recent.length === 0) recentListElement.innerHTML = '<p style="color:var(--text-muted); padding:10px;">No recently played songs.</p>';
}

// Library / Playlists
window.createNewPlaylist = function() {
    const name = prompt("Enter playlist name:");
    if (name) {
        if (!userPlaylists[name]) {
            userPlaylists[name] = [];
            localStorage.setItem('userPlaylists', JSON.stringify(userPlaylists));
            loadLibrary();
        } else {
            alert("Playlist already exists!");
        }
    }
}

window.addToPlaylistCurrent = function() {
    const song = currentPlaylist[currentSongIndex];
    if(!song) return;

    // Simple UI for selection (for demo purposes using prompt, a modal would be better)
    const names = Object.keys(userPlaylists);
    if(names.length === 0) {
        alert("Create a playlist first in the Library tab.");
        return;
    }

    const choice = prompt(`Add "${song.title}" to which playlist?\n${names.join('\n')}`);
    if (userPlaylists[choice]) {
        // Check if exists
        if(!userPlaylists[choice].find(s => s.id === song.id)){
             userPlaylists[choice].push(song);
             localStorage.setItem('userPlaylists', JSON.stringify(userPlaylists));
             alert("Added!");
        } else {
            alert("Song already in playlist.");
        }
    } else if (choice) {
        alert("Playlist not found.");
    }
}

function loadLibrary() {
    const container = document.getElementById('playlists-container');
    container.innerHTML = '';
    const names = Object.keys(userPlaylists);

    if (names.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-muted); margin-top:20px;">No playlists created yet.</p>';
        return;
    }

    names.forEach(name => {
        const div = document.createElement('div');
        div.className = 'song-item'; // Reuse style

        const img = document.createElement('div');
        img.className = 'song-img';
        img.style.background = '#333';
        img.style.display = 'flex';
        img.style.alignItems = 'center';
        img.style.justifyContent = 'center';
        img.innerHTML = '<i class="fas fa-music"></i>';

        const info = document.createElement('div');
        info.className = 'song-info';

        const title = document.createElement('div');
        title.className = 'song-title';
        title.textContent = name;

        const count = document.createElement('div');
        count.className = 'song-artist';
        count.textContent = `${userPlaylists[name].length} songs`;

        info.appendChild(title);
        info.appendChild(count);

        const actions = document.createElement('div');
        actions.className = 'song-actions';

        const trash = document.createElement('i');
        trash.className = 'fas fa-trash';
        trash.onclick = (e) => deletePlaylist(name, e);
        actions.appendChild(trash);

        div.appendChild(img);
        div.appendChild(info);
        div.appendChild(actions);

        div.onclick = () => {
            if(userPlaylists[name].length > 0) {
                playSong(userPlaylists[name][0].id, userPlaylists[name]);
                navigateTo('home'); // Go to home/player view essentially
                toggleFullPlayer();
            } else {
                alert("Playlist is empty.");
            }
        };
        container.appendChild(div);
    });
}

window.deletePlaylist = function(name, e) {
    e.stopPropagation();
    if(confirm(`Delete playlist "${name}"?`)) {
        delete userPlaylists[name];
        localStorage.setItem('userPlaylists', JSON.stringify(userPlaylists));
        loadLibrary();
    }
}

// Theme
function setupTheme() {
    const toggle = document.getElementById('theme-toggle');
    toggle.checked = localStorage.getItem('theme') !== 'light';

    toggle.addEventListener('change', (e) => {
        if (!e.target.checked) {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Apply on load
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }
}

function updateGreeting() {
    // Simple greeting
    const hour = new Date().getHours();
    // Could update UI title based on time if needed
}

// Loop & Shuffle
let isLooping = false;
let isShuffle = false;

document.getElementById('loop-btn').onclick = (e) => {
    isLooping = !isLooping;
    e.target.style.color = isLooping ? 'var(--primary-neon)' : 'var(--text-color)';
    audio.loop = isLooping;
};

let originalPlaylist = [];

document.getElementById('shuffle-btn').onclick = (e) => {
    isShuffle = !isShuffle;
    e.target.style.color = isShuffle ? 'var(--primary-neon)' : 'var(--text-color)';

    if(isShuffle) {
        // Save current order
        originalPlaylist = [...currentPlaylist];
        // Shuffle
        currentPlaylist = currentPlaylist.sort(() => Math.random() - 0.5);
    } else {
        // Restore original order
        if(originalPlaylist.length > 0) {
            currentPlaylist = [...originalPlaylist];
        }
    }
};

// Auto play next when ended
audio.onended = () => {
    if (!isLooping) {
        playNext();
    }
};
