// استعادة البيانات المحفوظة
let score = parseInt(localStorage.getItem('math_kids_score')) || 0;
let currentLang = localStorage.getItem('math_kids_lang') || 'ar';
let isDarkMode = localStorage.getItem('math_kids_theme') === 'dark';

let currentOp = '+';
let inputVal = "";

const translations = {
    ar: { 
        score: "النقاط", level: "المستوى",
        success: "صح! بطل ✅", fail: "خطأ! حاول ❌", 
        check: "تحقق من الإجابة", lang: "English", dir: "rtl" 
    },
    en: { 
        score: "Score", level: "Level",
        success: "Correct! ✅", fail: "Try Again ❌", 
        check: "Check Answer", lang: "العربية", dir: "ltr" 
    }
};

// حساب المستوى بناءً على النقاط (كل 50 نقطة مستوى جديد)
const getLevel = () => Math.floor(score / 50) + 1;

document.addEventListener('DOMContentLoaded', () => {
    // تطبيق الإعدادات المحفوظة
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-btn').innerText = "☀️";
    }
    applyLanguage();
    updateScoreBoard();
    generate();
});

function applyLanguage() {
    const html = document.getElementById('main-html');
    html.setAttribute('dir', translations[currentLang].dir);
    html.setAttribute('lang', currentLang);
    document.getElementById('lang-btn').innerText = translations[currentLang].lang;
    document.getElementById('score-text').innerText = translations[currentLang].score;
    document.getElementById('level-text').innerText = translations[currentLang].level;
    document.getElementById('check-btn').innerText = translations[currentLang].check;
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('math_kids_lang', currentLang);
    applyLanguage();
    generate();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const dark = document.body.classList.contains('dark-mode');
    localStorage.setItem('math_kids_theme', dark ? 'dark' : 'light');
    document.getElementById('theme-btn').innerText = dark ? "☀️" : "🌙";
}

function generate() {
    const lvl = getLevel();
    // معادلة الصعوبة: المستوى 1 (حتى 10)، المستوى 2 (حتى 15)، وهكذا
    const maxNum = 10 + (lvl - 1) * 5; 
    
    let a = Math.floor(Math.random() * maxNum) + 1;
    let b = Math.floor(Math.random() * maxNum) + 1;

    if (currentOp === '-') {
        if (a < b) [a, b] = [b, a];
    } else if (currentOp === '/') {
        a = a * b; // لضمان قسمة صحيحة
    }

    document.getElementById('n1').innerText = a;
    document.getElementById('n2').innerText = b;
    document.getElementById('op-label').innerText = currentOp === '*' ? '×' : (currentOp === '/' ? '÷' : currentOp);
    document.getElementById('current-level').innerText = lvl;
    
    inputVal = "";
    updateDisplay();
}

function appendNum(n) { if (inputVal.length < 4) { inputVal += n; updateDisplay(); } }
function clearInput() { inputVal = ""; updateDisplay(); }
function deleteLast() { inputVal = inputVal.slice(0, -1); updateDisplay(); }
function updateDisplay() { document.getElementById('user-input').innerText = inputVal; }

function setOp(op, btn) {
    currentOp = op;
    document.querySelectorAll('.op-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    generate();
}

function checkAnswer() {
    if (inputVal === "") return;
    const a = parseInt(document.getElementById('n1').innerText);
    const b = parseInt(document.getElementById('n2').innerText);
    const ans = parseInt(inputVal);
    let correct;
    
    if(currentOp==='+') correct=a+b;
    else if(currentOp==='-') correct=a-b;
    else if(currentOp==='*') correct=a*b;
    else correct=a/b;

    const f = document.getElementById('feedback');
    if (ans === correct) {
        const oldLvl = getLevel();
        score += 10;
        localStorage.setItem('math_kids_score', score);
        
        if (getLevel() > oldLvl) {
            f.innerText = currentLang === 'ar' ? "رائع! مستوى جديد 🚀" : "Level Up! 🚀";
            f.style.color = "#2196F3";
        } else {
            f.innerText = translations[currentLang].success;
            f.style.color = "green";
        }
        setTimeout(generate, 1200);
    } else {
        f.innerText = translations[currentLang].fail;
        f.style.color = "red";
        clearInput();
    }
    updateScoreBoard();
}

function updateScoreBoard() {
    document.getElementById('score').innerText = score;
    document.getElementById('current-level').innerText = getLevel();
}
