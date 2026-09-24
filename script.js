const tracks = [
  {
    title: 'Midnight Echo',
    artist: 'Nova Bloom',
    genre: 'Synthwave',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    title: 'Sunset Drive',
    artist: 'The Harbor Lights',
    genre: 'Indie Pop',
    cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    title: 'Velvet Waves',
    artist: 'Luna Harbor',
    genre: 'R&B',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    title: 'Neon Pulse',
    artist: 'Circuit Avenue',
    genre: 'Electronic',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    title: 'Golden Hours',
    artist: 'Sora Lane',
    genre: 'Pop',
    cover: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=900&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    title: 'Glass Skyline',
    artist: 'Mirror State',
    genre: 'Alt Rock',
    cover: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=900&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  }
];

const audio = document.getElementById('audioPlayer');
const trackGrid = document.getElementById('trackGrid');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerCover = document.getElementById('playerCover');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const navItems = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.content-panel');

let currentIndex = 0;

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function setActiveSection(sectionName) {
  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.target === sectionName);
  });

  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === sectionName);
  });
}

function initNavigation() {
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const target = item.dataset.target;
      setActiveSection(target);
      window.location.hash = target;
    });
  });

  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById(initialHash)) {
    setActiveSection(initialHash);
  }
}

function renderTracks() {
  if (!trackGrid) return;

  trackGrid.innerHTML = tracks
    .map(
      (track, index) => `
        <article class="track-card ${index === currentIndex ? 'active' : ''}" data-index="${index}">
          <button type="button" aria-label="Reproduzir ${track.title} de ${track.artist}">
            <div class="cover-wrap">
              <img src="${track.cover}" alt="Capa da música ${track.title}" />
              <span class="play-indicator">▶</span>
            </div>
            <h3>${track.title}</h3>
            <p>${track.artist}</p>
          </button>
        </article>
      `
    )
    .join('');

  const cards = document.querySelectorAll('.track-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const index = Number(card.dataset.index);
      loadTrack(index, true);
    });
  });
}

function updatePlayerUI(track) {
  playerTitle.textContent = track.title;
  playerArtist.textContent = track.artist;
  playerCover.src = track.cover;
  playerCover.alt = `Capa de ${track.title}`;

  document.title = `${track.title} • ${track.artist} | PulseWave`;

  document.querySelectorAll('.track-card').forEach((card, index) => {
    card.classList.toggle('active', index === currentIndex);
  });
}

function loadTrack(index, autoplay = false) {
  currentIndex = (index + tracks.length) % tracks.length;
  const track = tracks[currentIndex];
  audio.src = track.src;
  audio.load();
  updatePlayerUI(track);

  if (autoplay) {
    audio.play();
    playPauseBtn.textContent = '❚❚';
  } else {
    playPauseBtn.textContent = '▶';
  }
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = '❚❚';
  } else {
    audio.pause();
    playPauseBtn.textContent = '▶';
  }
}

function nextTrack() {
  loadTrack(currentIndex + 1, true);
}

function prevTrack() {
  loadTrack(currentIndex - 1, true);
}

if (playPauseBtn) {
  playPauseBtn.addEventListener('click', togglePlay);
}

if (nextBtn) {
  nextBtn.addEventListener('click', nextTrack);
}

if (prevBtn) {
  prevBtn.addEventListener('click', prevTrack);
}

if (volume) {
  volume.addEventListener('input', () => {
    audio.volume = Number(volume.value);
  });
}

if (progress) {
  progress.addEventListener('input', () => {
    if (!Number.isFinite(audio.duration) || audio.duration === 0) {
      return;
    }

    const value = Number(progress.value);
    audio.currentTime = (value / 100) * audio.duration;
  });
}

audio.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(audio.duration);
  progress.value = 0;
});

audio.addEventListener('timeupdate', () => {
  if (!Number.isFinite(audio.duration) || audio.duration === 0) {
    return;
  }

  const percent = (audio.currentTime / audio.duration) * 100;
  progress.value = percent;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('play', () => {
  playPauseBtn.textContent = '❚❚';
});

audio.addEventListener('pause', () => {
  playPauseBtn.textContent = '▶';
});

audio.addEventListener('ended', () => {
  nextTrack();
});

initNavigation();
renderTracks();
loadTrack(0, false);
if (volume) {
  audio.volume = Number(volume.value);
}
