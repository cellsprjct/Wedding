/* =========================================================
   UNDANGAN PERNIKAHAN — SCRIPT UTAMA
   ========================================================= */

/* ---------- KONFIGURASI ---------- */
const CONFIG = {
    petalInterval: 1000,
    petalEmojis: ['❦', '✿', '❁', '🌸', '✦', '❋', '❃'],
    musicVolume: 0.35
};

/* ---------- 1. BUNGA JATUH ---------- */
const petalsContainer = document.getElementById('petals');

function createPetal() {
    if (!petalsContainer) return;

    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.textContent = CONFIG.petalEmojis[
        Math.floor(Math.random() * CONFIG.petalEmojis.length)
    ];
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDuration = (Math.random() * 4 + 7) + 's';
    petal.style.fontSize = (Math.random() * 10 + 14) + 'px';
    petal.style.animationDelay = Math.random() * 4 + 's';

    petalsContainer.appendChild(petal);
    setTimeout(() => petal.remove(), 13000);
}

setInterval(createPetal, CONFIG.petalInterval);

/* ---------- 2. BINTIK EMAS BACKGROUND ---------- */
const goldDotsContainer = document.getElementById('goldDots');

function createGoldDots() {
    if (!goldDotsContainer) return;

    for (let i = 0; i < 30; i++) {
        const dot = document.createElement('span');
        const size = Math.random() * 4 + 1;
        dot.style.width = size + 'px';
        dot.style.height = size + 'px';
        dot.style.left = Math.random() * 100 + '%';
        dot.style.top = Math.random() * 100 + '%';
        dot.style.animationDelay = Math.random() * 3 + 's';
        dot.style.animationDuration = (Math.random() * 2 + 2) + 's';
        goldDotsContainer.appendChild(dot);
    }
}

createGoldDots();

/* ---------- 3. BUKA UNDANGAN ---------- */
function openInvitation() {
    const cover = document.getElementById('cover');
    const mainWrapper = document.getElementById('mainWrapper');
    const scrollArea = document.getElementById('scrollArea');

    if (cover) cover.classList.add('hide');
    if (mainWrapper) mainWrapper.classList.add('show');

    playMusic();

    if (scrollArea) scrollArea.scrollTop = 0;

    initScrollHint();
}

/* ---------- 4. MUSIK ---------- */
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');

function playMusic() {
    if (!bgMusic) return;
    bgMusic.volume = CONFIG.musicVolume;
    bgMusic.play()
        .then(() => {
            if (musicBtn) musicBtn.classList.add('playing');
        })
        .catch(err => console.log('Autoplay diblokir:', err));
}

function toggleMusic() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
        bgMusic.play();
        if (musicBtn) musicBtn.classList.add('playing');
    } else {
        bgMusic.pause();
        if (musicBtn) musicBtn.classList.remove('playing');
    }
}

/* ---------- 5. SCROLL HINT ---------- */
function initScrollHint() {
    const scrollArea = document.getElementById('scrollArea');
    const scrollHint = document.getElementById('scrollHint');
    const topBtn = document.getElementById('topBtn');

    if (!scrollArea) return;

    scrollArea.addEventListener('scroll', () => {
        if (scrollHint) {
            if (scrollArea.scrollTop > 30) {
                scrollHint.classList.add('hidden');
            } else {
                scrollHint.classList.remove('hidden');
            }
        }

        if (topBtn) {
            if (scrollArea.scrollTop > 400) {
                topBtn.classList.add('show');
            } else {
                topBtn.classList.remove('show');
            }
        }
    }, { passive: true });
}

/* ---------- 6. SCROLL TO TOP ---------- */
function scrollToTop() {
    const scrollArea = document.getElementById('scrollArea');
    if (scrollArea) {
        scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/* ---------- 7. FORM UCAPAN (WISHES) ---------- */
const wishForm = document.getElementById('wishForm');
const wishList = document.getElementById('wishList');

let wishes = JSON.parse(localStorage.getItem('wishes') || '[]');

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderWishes() {
    if (!wishList) return;
    wishList.innerHTML = '';

    if (wishes.length === 0) {
        wishList.innerHTML = '<p class="wish-empty">Belum ada ucapan. Jadilah yang pertama! 💝</p>';
        return;
    }

    wishes.forEach(w => {
        const div = document.createElement('div');
        div.className = 'wish-item';
        div.innerHTML = `
            <strong>${escapeHtml(w.name)}</strong>
            <p>${escapeHtml(w.message)}</p>
            <small>${escapeHtml(w.attendance || '')} • ${escapeHtml(w.time || '')}</small>
        `;
        wishList.appendChild(div);
    });
}

if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();
        const attendance = document.getElementById('attendance').value;

        if (name && message) {
            wishes.unshift({
                name,
                message,
                attendance,
                time: new Date().toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                })
            });
            localStorage.setItem('wishes', JSON.stringify(wishes));
            renderWishes();
            wishForm.reset();
        }
    });
}

renderWishes();

/* ---------- 8. COPY REKENING ---------- */
function copyAccount(accountNumber) {
    const text = String(accountNumber);

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showCopyFeedback())
            .catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const input = document.createElement('textarea');
    input.value = text;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    try { document.execCommand('copy'); showCopyFeedback(); } catch (e) {}
    document.body.removeChild(input);
}

function showCopyFeedback() {
    const btns = document.querySelectorAll('.copy-button');
    btns.forEach(btn => {
        const original = btn.textContent;
        btn.textContent = '✓ TERSALIN';
        btn.style.background = 'var(--gold)';
        btn.style.color = 'var(--navy)';
        setTimeout(() => {
            btn.textContent = original;
            btn.style.background = 'transparent';
            btn.style.color = 'var(--gold-soft)';
        }, 2000);
    });
}

/* ---------- 9. EXPOSE GLOBAL ---------- */
window.openInvitation = openInvitation;
window.toggleMusic = toggleMusic;
window.scrollToTop = scrollToTop;
window.copyAccount = copyAccount;