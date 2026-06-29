const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth, h = canvas.height = window.innerHeight;
let currentTheme = 'cyber-blue';
let mouse = { x: null, y: null };

window.addEventListener('resize', () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; initTheme(); });
window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

// --- SETTINGS FÜR DEN TEXT-ROTATOR ---
const titleElement = document.getElementById('typingTitle');
const textArray = [
    "Mein Spiel", 
    "Coded by Superdou", 
    "Made with love...",
    "...and a lot of Code",
    "Loading Beta 0.4...", 
    "Welcome to my Webside"
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeAnimation() {
    if (!titleElement) return;
    const currentText = textArray[textIndex];
    
    if (isDeleting) {
        titleElement.innerHTML = currentText.substring(0, charIndex - 1) + '<span class="cursor">|</span>';
        charIndex--;
        typingSpeed = 50;
    } else {
        titleElement.innerHTML = currentText.substring(0, charIndex + 1) + '<span class="cursor">|</span>';
        charIndex++;
        typingSpeed = 120;
    }

    if (!isDeleting && charIndex === currentText.length) {
        typingSpeed = 2000;
        isDeleting = true;
    } 
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        typingSpeed = 400;
    }

    setTimeout(typeAnimation, typingSpeed);
}

// CSS für den Cursor direkt injizieren
const style = document.createElement('style');
style.innerHTML = `.cursor { display: inline-block; margin-left: 2px; color: var(--acc); animation: blink 0.8s infinite steps(2); } @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`;
document.head.appendChild(style);

// Globale Datenstrukturen für die Effekte
let elements = [];
const matrixChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@%&".split("");

function initTheme() {
    elements = [];
    ctx.clearRect(0,0,w,h);
    
    if (currentTheme === 'cyber-blue') {
        for(let i=0; i<70; i++) elements.push({x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2, r: Math.random()*2+1});
    } 
    else if (currentTheme === 'acid-hacker') {
        let columns = Math.floor(w / 16);
        for(let i=0; i<columns; i++) elements.push({x: i*16, y: Math.random() * -h, v: Math.random()*4+2});
    }
    else if (currentTheme === 'synthwave') {
        for(let i=0; i<25; i++) elements.push({x: Math.random()*w, y: Math.random()*h, v: Math.random()*3+1, len: Math.random()*80+40});
    }
    else if (currentTheme === 'crimson') {
        for(let i=0; i<5; i++) elements.push({r: (i+1)*40, pulse: 0, v: 0.02 + (i*0.005)});
    }
    else if (currentTheme === 'wasteland') {
        // Keine feste Vorbereitung nötig
    }
    else if (currentTheme === 'ice-protocol') {
        for(let i=0; i<60; i++) elements.push({x: Math.random()*w, y: Math.random()*h, v: Math.random()*0.8+0.2, r: Math.random()*3+1});
    }
    else if (currentTheme === 'tokyo-neon') {
        for(let i=0; i<40; i++) elements.push({x: Math.random()*w, y: Math.random()*h, v: Math.random()*8+4, len: Math.random()*30+20});
    }
    else if (currentTheme === 'luxury-gold') {
        for(let i=0; i<80; i++) elements.push({x: Math.random()*w, y: Math.random()*h, v: Math.random()*1+0.5, r: Math.random()*2, swing: Math.random()*10});
    }
}

function animate() {
    if (currentTheme === 'acid-hacker') {
        ctx.fillStyle = 'rgba(2, 6, 4, 0.08)';
        ctx.fillRect(0, 0, w, h);
    } else if (currentTheme === 'wasteland') {
        ctx.fillStyle = 'rgba(14, 15, 17, 0.2)';
        ctx.fillRect(0, 0, w, h);
    } else {
        ctx.clearRect(0, 0, w, h);
    }
    
    if (currentTheme === 'cyber-blue') {
        ctx.fillStyle = '#00f2fe';
        elements.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if(p.x<0 || p.x>w) p.vx *= -1; if(p.y<0 || p.y>h) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
        });
        for(let i=0; i<elements.length; i++) {
            for(let j=i+1; j<elements.length; j++) {
                let dx = elements[i].x - elements[j].x, dy = elements[i].y - elements[j].y, dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 100) { ctx.strokeStyle = `rgba(0,242,254,${(1-dist/100)*0.15})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(elements[i].x, elements[i].y); ctx.lineTo(elements[j].x, elements[j].y); ctx.stroke(); }
            }
        }
    }
    else if (currentTheme === 'acid-hacker') {
        ctx.fillStyle = '#39ff14'; ctx.font = '14px "Share Tech Mono"';
        elements.forEach(col => {
            let char = matrixChars[Math.floor(Math.random()*matrixChars.length)];
            ctx.fillText(char, col.x, col.y);
            col.y += col.v; 
            if(col.y > h) { col.y = 0; }
        });
    }
    else if (currentTheme === 'synthwave') {
        ctx.lineWidth = 2; ctx.strokeStyle = '#ff007f';
        elements.forEach(line => {
            line.x -= line.v; if(line.x + line.len < 0) line.x = w + Math.random()*50;
            ctx.beginPath(); ctx.moveTo(line.x, line.y); ctx.lineTo(line.x + line.len, line.y); ctx.stroke();
        });
    }
    else if (currentTheme === 'crimson') {
        let cx = mouse.x ?? w/2, cy = mouse.y ?? h/2;
        ctx.lineWidth = 2; ctx.strokeStyle = '#ff003c';
        elements.forEach(ring => {
            ring.pulse += ring.v;
            let currentRadius = ring.r + Math.sin(ring.pulse)*15;
            ctx.beginPath(); ctx.arc(cx, cy, Math.max(10, currentRadius), 0, Math.PI*2); ctx.stroke();
        });
    }
    else if (currentTheme === 'wasteland') {
        if(Math.random() > 0.6) {
            ctx.fillStyle = Math.random() > 0.5 ? 'rgba(252,238,10,0.3)' : 'rgba(255,0,85,0.2)';
            for(let i=0; i<4; i++) ctx.fillRect(Math.random()*w, Math.random()*h, Math.random()*200+50, Math.random()*15+2);
        }
    }
    else if (currentTheme === 'ice-protocol') {
        ctx.fillStyle = 'rgba(0,255,255,0.4)';
        elements.forEach(flake => {
            flake.y -= flake.v; if(flake.y < -10) { flake.y = h + 10; flake.x = Math.random()*w; }
            ctx.beginPath(); ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI*2); ctx.fill();
        });
    }
    else if (currentTheme === 'tokyo-neon') {
        ctx.lineWidth = 1.5; ctx.strokeStyle = '#ff5e00';
        elements.forEach(streak => {
            streak.x += streak.v; if(streak.x > w) { streak.x = -streak.len; streak.y = Math.random()*h; }
            ctx.beginPath(); ctx.moveTo(streak.x, streak.y); ctx.lineTo(streak.x + streak.len, streak.y); ctx.stroke();
        });
    }
    else if (currentTheme === 'luxury-gold') {
        ctx.fillStyle = '#ffcc00';
        elements.forEach((dust, idx) => {
            dust.y += dust.v; dust.x += Math.sin(dust.y/20 + idx)*0.3;
            if(dust.y > h) { dust.y = -10; dust.x = Math.random()*w; }
            ctx.beginPath(); ctx.arc(dust.x, dust.y, dust.r, 0, Math.PI*2); 
            ctx.fill(); // FIX: Hier fehlte das "ctx." davor!
        });
    }

    requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('themeSelect');
    if (selector) {
        selector.addEventListener('change', (e) => {
            currentTheme = e.target.value;
            document.documentElement.setAttribute('data-theme', currentTheme);
            initTheme();
        });
    }
    initTheme();
    animate();
    typeAnimation();
});
