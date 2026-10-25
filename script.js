const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- light / dark theme ---------- */

document.getElementById('theme-toggle').addEventListener('click', () => {
    const goDark = root.dataset.theme !== 'dark';
    if (goDark) root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    try { localStorage.setItem('muniba-theme', goDark ? 'dark' : 'light'); } catch (e) {}
});

/* ---------- tech marquee: copy the group once so the loop has no gap ---------- */

const track = document.getElementById('marquee-track');
track.appendChild(track.firstElementChild.cloneNode(true));

/* ---------- projects ----------
   Add, remove or edit a project here and both the card and its window update.
   kind: 'iframe' shows the embed placeholder, 'widget' shows the tone demo.
   badge: 'live' | 'try' | 'note' picks the badge colour.                      */

const projects = [
    /*
    {
        title: 'RagDesk', year: '2026', badge: 'live', badgeText: 'live', kind: 'iframe',
        stack: ['FastAPI', 'Pinecone', 'Next.js'], tint: ['#cfe3ef', '#e2ebd8'],
        url: 'ragdesk.example.com', live: '#work', code: '#work', writeup: '#work',
        summary: 'Chat with your own PDFs. Citation-backed answers and a nightly eval run so quality never quietly rots.',
        blurb: 'Upload a folder of PDFs and ask questions across them. Answers carry inline citations back to the source page, and a nightly eval run scores 300 held-out questions so quality regressions show up before users find them.'
    },
    {
        title: 'ToneCheck', year: '2026', badge: 'try', badgeText: 'try it here', kind: 'widget',
        stack: ['PyTorch', 'ONNX', 'React'], tint: ['#f0dcc4', '#e6ead4'],
        url: 'tonecheck.example.com', live: '#work', code: '#work', writeup: '#work',
        summary: 'A tiny classifier that reads the mood of your writing before you send it. Runs entirely in the browser.',
        blurb: 'A distilled classifier quantized to 8-bit and shipped straight to the browser — no server round-trip, no API bill. Try it right here.'
    },
    {
        title: 'LeetTrack', year: '2025', badge: 'live', badgeText: 'live', kind: 'iframe',
        stack: ['Next.js', 'Prisma', 'Postgres'], tint: ['#d8e4ef', '#e9e3d3'],
        url: 'leettrack.example.com', live: '#work', code: '#work', writeup: '#work',
        summary: 'Spaced-repetition tracker for DSA practice. Streaks, auth, and a heatmap that nags you gently.',
        blurb: 'Spaced-repetition scheduling for DSA problems, with auth, streaks, and a contribution-style heatmap. My most-used personal tool.'
    },
    {
        title: 'TinyGPT', year: '2025', badge: 'note', badgeText: 'write-up', kind: 'iframe',
        stack: ['PyTorch', 'Colab', 'W&amp;B'], tint: ['#e3dcef', '#e7e6d6'],
        url: 'github.com/your-username/tinygpt', live: '#work', code: '#work', writeup: '#work',
        summary: 'A 3M-parameter character transformer trained from scratch on my own notes. Built to understand attention, not to win benchmarks.',
        blurb: 'A 3M-parameter character-level transformer trained from scratch on two years of my own notes. The write-up walks through attention, loss curves, and every mistake along the way.'
    },
    {
        title: 'CampusCart', year: '2025', badge: 'live', badgeText: 'live', kind: 'iframe',
        stack: ['MongoDB', 'Express', 'React'], tint: ['#e9dfc8', '#dfe8d6'],
        url: 'campuscart.example.com', live: '#work', code: '#work', writeup: '#work',
        summary: 'A buy-and-sell marketplace for my campus. 300+ signups in month one, all from one WhatsApp group.',
        blurb: 'A buy-and-sell marketplace for my campus — listings, chat, and moderation. 300+ signups in month one, entirely word of mouth.'
    },
    {
        title: 'Snippet Sensei', year: '2025', badge: 'live', badgeText: 'live', kind: 'iframe',
        stack: ['pgvector', 'Node', 'Svelte'], tint: ['#d5e6e2', '#e8e5d2'],
        url: 'snippets.example.com', live: '#work', code: '#work', writeup: '#work',
        summary: 'Semantic search across my own code snippets, behind a keyboard-first palette. p95 under 40ms.',
        blurb: 'Semantic search over my own code snippets, behind a keyboard-first command palette. Embeddings in pgvector with an HNSW index; p95 search under 40ms.'
    }
    */

    {
        title: 'IoT Intrusion Detection', year: '2024', badge: 'note', badgeText: 'ml', kind: 'iframe',
        stack: ['scikit-learn', 'Keras', 'pandas'], tint: ['#e6dcc8', '#d8e4d2'],
        url: 'github.com/Muniba-Manaal/iot-intrusion-detection-ml',
        live: 'https://github.com/Muniba-Manaal/iot-intrusion-detection-ml',
        code: 'https://github.com/Muniba-Manaal/iot-intrusion-detection-ml',
        writeup: 'https://github.com/Muniba-Manaal/iot-intrusion-detection-ml#readme',
        summary: 'Spotting cyberattacks in smart-home network traffic, comparing three ML models on the IoTID20 dataset.',
        blurb: 'Detects whether IoT network flows are normal or malicious, then identifies the attack type (DoS, MITM ARP spoofing, Mirai, scan). Compares a Decision Tree, Gaussian Naive Bayes and a Keras neural network using precision, recall, macro F1 and confusion matrices, with a focus on how class imbalance shapes model behaviour.'
    },
    {
        title: 'Sea Animals Classifier', year: '2025', badge: 'note', badgeText: 'deep learning', kind: 'iframe',
        stack: ['TensorFlow', 'ResNet50V2', 'Keras'], tint: ['#cfe3ef', '#d6ece6'],
        url: 'github.com/Muniba-Manaal/sea-animals-classification-resnet50v2',
        live: 'https://github.com/Muniba-Manaal/sea-animals-classification-resnet50v2',
        code: 'https://github.com/Muniba-Manaal/sea-animals-classification-resnet50v2',
        writeup: 'https://github.com/Muniba-Manaal/sea-animals-classification-resnet50v2#readme',
        summary: 'Classifying 23 sea animal species: transfer learning hits 81% vs 57% for a CNN built from scratch.',
        blurb: 'Compares an ImageNet pre-trained ResNet50V2 with a custom four-block CNN on 13,711 images across 23 marine species. Transfer learning reached 81.3% validation accuracy (macro F1 0.79) while training only 0.53M parameters, converging in under 8 epochs.'
    }
];

document.getElementById('projects').innerHTML = projects.map((p, i) => `
    <article class="project">
        <div class="project-shot" style="--a:${p.tint[0]};--b:${p.tint[1]}">
            <span class="placeholder">[ ${p.title.toLowerCase()} ]</span>
            <span class="project-badge ${p.badge}">${p.badgeText}</span>
        </div>
        <div class="project-body">
            <div class="project-title"><h3>${p.title}</h3><span>${p.year}</span></div>
            <p>${p.summary}</p>
            <div class="tags">${p.stack.map(t => `<span>${t}</span>`).join('')}</div>
            <div class="project-actions">
                <button class="btn btn-cta btn-sm" type="button" data-open="${i}">▸ open<span class="day"> window</span></button>
                <a class="btn btn-ghost btn-sm" href="${p.code}">code</a>
            </div>
        </div>
    </article>`).join('');

// /* ---------- project window ---------- */

// const modal = document.getElementById('modal');
// const byId = (id) => document.getElementById(id);

// function openProject(p) {
//     byId('modal-title').textContent = p.title;
//     byId('modal-stack').innerHTML = p.stack.join(' · ');
//     byId('modal-url').textContent = p.url;
//     byId('modal-embed-url').textContent = p.url;
//     byId('modal-blurb').textContent = p.blurb;
//     byId('modal-live').href = p.live;
//     byId('modal-code').href = p.code;
//     byId('modal-writeup').href = p.writeup;
//     byId('modal-widget').hidden = p.kind !== 'widget';
//     byId('modal-embed').hidden = p.kind === 'widget';
//     modal.hidden = false;
//     document.body.style.overflow = 'hidden';
//     byId('modal-close').focus();
// }

// function closeProject() {
//     modal.hidden = true;
//     document.body.style.overflow = '';
// }

// document.getElementById('projects').addEventListener('click', (e) => {
//     const button = e.target.closest('[data-open]');
//     if (button) openProject(projects[button.dataset.open]);
// });
// byId('modal-close').addEventListener('click', closeProject);
// modal.addEventListener('click', (e) => { if (e.target === modal) closeProject(); });
// modal.querySelector('.modal-actions').addEventListener('click', (e) => { if (e.target.closest('a')) closeProject(); });
// window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeProject(); });

/* ---------- project window (also used for certificates) ---------- */

const modal = document.getElementById('modal');
const byId = (id) => document.getElementById(id);

const modalBrowser = byId('modal-browser');
const modalActions = byId('modal-actions');
const modalBlurb = byId('modal-blurb');
const certViewer = byId('modal-cert');
const certImg = byId('cert-img');
const certPdf = byId('cert-pdf');

// switch the window between a project view and a certificate view
function setModalMode(mode) {
    const isCert = mode === 'cert';
    modalBrowser.hidden = isCert;
    modalActions.hidden = isCert;
    modalBlurb.hidden = isCert;
    certViewer.hidden = !isCert;
}

function showModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    byId('modal-close').focus();
}

function openProject(p) {
    setModalMode('project');
    byId('modal-title').textContent = p.title;
    byId('modal-stack').innerHTML = p.stack.join(' · ');
    byId('modal-url').textContent = p.url;
    byId('modal-embed-url').textContent = p.url;
    byId('modal-blurb').textContent = p.blurb;
    byId('modal-live').href = p.live;
    byId('modal-code').href = p.code;
    byId('modal-writeup').href = p.writeup;
    byId('modal-widget').hidden = p.kind !== 'widget';
    byId('modal-embed').hidden = p.kind === 'widget';
    showModal();
}

function openCertificate(btn) {
    const file = btn.dataset.certFile;
    const isPdf = file.toLowerCase().endsWith('.pdf');

    setModalMode('cert');
    byId('modal-title').textContent = btn.dataset.certTitle || 'Certificate';
    byId('modal-stack').textContent = btn.dataset.certIssuer || '';

    certImg.hidden = isPdf;
    certPdf.hidden = !isPdf;
    if (isPdf) {
        certPdf.src = file;
    } else {
        certImg.src = file;
        certImg.alt = btn.dataset.certTitle || 'Certificate';
    }
    showModal();
}

function closeProject() {
    modal.hidden = true;
    document.body.style.overflow = '';
    // stop the file from loading once the window is closed
    certImg.removeAttribute('src');
    certPdf.src = 'about:blank';
}

document.getElementById('projects').addEventListener('click', (e) => {
    const button = e.target.closest('[data-open]');
    if (button) openProject(projects[button.dataset.open]);
});

document.querySelector('.certs').addEventListener('click', (e) => {
    const button = e.target.closest('.js-view-cert');
    if (button) openCertificate(button);
});

byId('modal-close').addEventListener('click', closeProject);
modal.addEventListener('click', (e) => { if (e.target === modal) closeProject(); });
modal.querySelector('.modal-actions').addEventListener('click', (e) => { if (e.target.closest('a')) closeProject(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeProject(); });

/* ---------- tone demo inside the ToneCheck window ---------- */

function toneScore(text) {
    const s = (text || '').toLowerCase();
    const good = ['love', 'great', 'works', 'shipped', 'excited', 'thanks', 'awesome', 'good', 'happy', 'win', 'proud', 'nice', 'better'];
    const bad = ['broken', 'bug', 'hate', 'sorry', 'fail', 'delay', 'angry', 'bad', 'issue', 'sad', 'stuck', 'worse'];
    const g = good.filter(w => s.includes(w)).length;
    const b = bad.filter(w => s.includes(w)).length;
    const base = 12 + Math.min(30, s.length / 4);
    const pos = Math.max(3, 18 + g * 26 - b * 8);
    const neg = Math.max(3, 14 + b * 28 - g * 6);
    const total = pos + neg + base;
    const P = Math.round(pos / total * 100);
    const N = Math.round(neg / total * 100);
    return { pos: P, neg: N, neu: 100 - P - N };
}

const toneNotes = {
    warm: 'Reads kind. Send it.',
    sharp: 'Sounds sharper than you probably mean.',
    even: 'Flat — add one specific detail.'
};

function updateTone() {
    const sc = toneScore(byId('tone-text').value);
    ['pos', 'neu', 'neg'].forEach(k => {
        byId('tone-' + k).style.width = sc[k] + '%';
        byId('tone-' + k + '-n').textContent = sc[k] + '%';
    });
    const top = sc.pos >= sc.neg && sc.pos >= sc.neu ? 'warm' : (sc.neg >= sc.neu ? 'sharp' : 'even');
    byId('tone-verdict').textContent = top;
    byId('tone-note').textContent = toneNotes[top];
}

byId('tone-text').addEventListener('input', updateTone);
updateTone();

/* ---------- typed terminal ---------- */

const terminalText = '> whoami\nmuniba — ai engineer & full-stack dev\n> cat today.txt\nbuilding small machines that think\n> git log --oneline -1\na7f31c9 feat: rerank before answer\n> ';
const typed = byId('typed');

if (reduceMotion) {
    typed.textContent = terminalText;
} else {
    let i = 0;
    const timer = setInterval(() => {
        i += 1;
        typed.textContent = terminalText.slice(0, i);
        if (i >= terminalText.length) clearInterval(timer);
    }, 26);
}

// /* ---------- commit garden ----------
//    PLACEHOLDER: these squares are made up from a fixed random seed, not real GitHub data. */

// function drawGarden() {
//     const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
//     let seed = 20260903;
//     const random = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
//     let html = '';
//     for (let week = 0; week < 53; week++) {
//         for (let day = 0; day < 7; day++) {
//             const r = random();
//             const weekend = day === 0 || day === 6;
//             const p = r + (week > 40 ? 0.22 : 0) - (weekend ? 0.18 : 0);
//             let level = 0;
//             if (p > 0.42) level = 1;
//             if (p > 0.6) level = 2;
//             if (p > 0.76) level = 3;
//             if (p > 0.9) level = 4;
//             const count = level === 0 ? 0 : level * 2 + Math.floor(r * 3);
//             const month = months[Math.min(11, Math.floor(week / 4.42))];
//             html += `<i class="l${level}" title="${count} contributions · ${month}"></i>`;
//         }
//     }
//     byId('heat').innerHTML = html;
// }
// drawGarden();

/* ---------- commit garden: real GitHub data ----------
   Reads data/github-stats.json, which scripts/fetch-github-stats.py creates.
   Fills every [data-gh] number, the grid, the months, languages and commits
   (light and dark themes share the same elements, so both update at once). */

function timeAgo(isoDate) {
    const days = Math.floor((Date.now() - new Date(isoDate)) / 86400000);
    if (days < 1) return 'today';
    if (days < 7) return `${days}d`;
    if (days < 30) return `${Math.floor(days / 7)}w`;
    if (days < 365) return `${Math.floor(days / 30)}mo`;
    return `${Math.floor(days / 365)}y`;
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function drawGarden(stats) {
    // 1. numbers: total, streak, repos, prs, stars
    document.querySelectorAll('[data-gh]').forEach(el => {
        const value = stats[el.dataset.gh];
        if (typeof value === 'number') el.textContent = value.toLocaleString();
    });

    // 2. the grid: one column per week, Sunday at the top
    const niceDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    let squares = '';
    stats.weeks.forEach((week, index) => {
        if (index === 0) {   // the first week can start mid-week: pad it so days line up
            for (let i = week.length; i < 7; i++) squares += '<i class="l0" style="visibility:hidden"></i>';
        }
        week.forEach(day => {
            const label = `${day.count} contribution${day.count === 1 ? '' : 's'} · ${niceDate(day.date)}`;
            squares += `<i class="l${day.level}" title="${label}"></i>`;
        });
    });
    byId('heat').innerHTML = squares;

    // 3. month labels for the last 12 months, ending with the current month
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(`<span>${d.toLocaleDateString('en-US', { month: 'short' })}</span>`);
    }
    byId('heat-months').innerHTML = months.join('');

    // 4. languages: the bar and the list use the same order, so colours match
    if (stats.languages.length) {
        byId('lang-bar').innerHTML = stats.languages
            .map(lang => `<i style="width:${lang.percent}%"></i>`).join('');
        byId('lang-list').innerHTML = stats.languages
            .map(lang => `<span><i class="dot"></i>${escapeHtml(lang.name)} ${lang.percent}%</span>`).join('');
    } else {
        byId('lang-list').innerHTML = '<span>no public repos yet</span>';
    }

    // 5. recent commits from public repos
    byId('commit-list').innerHTML = stats.commits.length
        ? stats.commits.map(c =>
            `<div><span>${escapeHtml(c.repo)}</span><span>${escapeHtml(c.message)}</span><span>${timeAgo(c.date)}</span></div>`
          ).join('')
        : '<div><span>no public commits yet</span></div>';
}

fetch('data/github-stats.json', { cache: 'no-cache' })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    })
    .then(drawGarden)
    .catch(error => console.warn('GitHub stats could not be loaded:', error));

/* ---------- skill bars fill up when they scroll into view ---------- */

const skills = document.querySelectorAll('.skill');
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    skills.forEach(skill => observer.observe(skill));
} else {
    skills.forEach(skill => skill.classList.add('in'));
}

/* ---------- resume: illustrated / on paper ---------- */

const resumeButtons = document.querySelectorAll('[data-resume]');
resumeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const paper = button.dataset.resume === 'paper';
        byId('resume-web').hidden = paper;
        byId('resume-paper').hidden = !paper;
        resumeButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    });
});
