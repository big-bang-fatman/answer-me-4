// ===== بنك الأسئلة =====
const questionBank = {
    "قرآن": [{q:"أطول سورة؟",a:"البقرة",v:100},{q:"سورة فيها بسملتين؟",a:"النمل",v:200},{q:"أطول آية؟",a:"آية الدَّين",v:300},{q:"صحابي ذُكر اسمه في القرآن؟",a:"زيد",v:400},{q:"أخت الطويلتين؟",a:"الأعراف",v:500}],
    "تاريخ": [{q:"أول خليفة؟",a:"أبو بكر",v:100},{q:"فتح مكة؟",a:"8 هـ",v:200},{q:"الثورة الفرنسية؟",a:"1789",v:300},{q:"توحيد المملكة؟",a:"1351 هـ",v:400},{q:"عاصمة الدولة العباسية؟",a:"بغداد",v:500}],
    "علوم": [{q:"رمز الماء؟",a:"H2O",v:100},{q:"أصلب مادة في الطبيعة؟",a:"الألماس",v:200},{q:"عدد عظام جسم الإنسان البالغ؟",a:"206",v:300},{q:"غاز التنفس؟",a:"الأكسجين",v:400},{q:"فصيلة الدم المعطاء العام؟",a:"O-",v:500}],
    "رياضة": [{q:"عدد لاعبي كرة القدم في الفريق؟",a:"11",v:100},{q:"أول بطولة مونديال؟",a:"الأوروغواي 1930",v:200},{q:"مسافة سباق الماراثون؟",a:"42.195 كم",v:300},{q:"لقب ميسي؟",a:"البرغوث",v:400},{q:"عدد حلقات الأولمبياد؟",a:"5",v:500}],
    "عامة": [{q:"لون حجر الزمرد؟",a:"أخضر",v:100},{q:"صوت الأسد؟",a:"زئير",v:200},{q:"عملة بريطانيا؟",a:"الجنيه الإسترليني",v:300},{q:"أقرب كوكب للشمس؟",a:"عطارد",v:400},{q:"أكبر محيط في العالم؟",a:"الهادي",v:500}],
    "حيوانات": [{q:"أسرع حيوان؟",a:"الفهد",v:100},{q:"يغير لونه؟",a:"الحرباء",v:200},{q:"أطول رقبة؟",a:"الزرافة",v:300},{q:"أصغر طائر؟",a:"الطنان",v:400},{q:"أقوى عضة؟",a:"التمساح",v:500}],
    "جغرافيا": [{q:"أكبر قارة؟",a:"آسيا",v:100},{q:"أطول نهر؟",a:"النيل",v:200},{q:"عاصمة اليابان؟",a:"طوكيو",v:300},{q:"مضيق هرمز يربط؟",a:"عمان بالخليج",v:400},{q:"أكبر جزيرة؟",a:"جرينلاند",v:500}],
    "أدب": [{q:"شاعر الرسول؟",a:"حسان بن ثابت",v:100},{q:"أمير الشعراء؟",a:"أحمد شوقي",v:200},{q:"كاتب البؤساء؟",a:"فيكتور هوجو",v:300},{q:"اسم المتنبي؟",a:"أحمد بن الحسين",v:400},{q:"كتاب الحيوان؟",a:"الجاحظ",v:500}],
    "فلك": [{q:"أكبر كوكب؟",a:"المشتري",v:100},{q:"كوكب أحمر؟",a:"المريخ",v:200},{q:"وحدة المسافات؟",a:"السنة الضوئية",v:300},{q:"أول إنسان بالفضاء؟",a:"يوري غاغارين",v:400},{q:"مذنب يظهر كل 76 عام؟",a:"هالي",v:500}],
    "اختراعات": [{q:"المصباح؟",a:"إديسون",v:100},{q:"الهاتف؟",a:"غراهام بيل",v:200},{q:"الطائرة؟",a:"الرايت",v:300},{q:"الراديو؟",a:"ماركوني",v:400},{q:"المحرك البخاري؟",a:"جيمس واط",v:500}]
};

// ===== الحالة العامة =====
let scores = [0, 0];
let turn = 0;
let usedCats = [];
let currentCats = [];
let roundNumber = 1;
let round1Winner = null;
let deleteMode = false;
let deletesLeft = 0;

// perks: true = متاح، false = مستخدم
let perks = [
    { double: true, wheel: true, half: true, silence: true, delete: false },
    { double: true, wheel: true, half: true, silence: true, delete: false }
];

let activeP = null;   // الميزة المفعّلة حالياً
let activeV = 0;
let activeCard = null;
let activeCat = '';
let qLeft = 0;
let teamNames = ["الفريق 1", "الفريق 2"];

// ===== الأصوات =====
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) audioCtx = new AudioCtx();
    return audioCtx;
}

function playSound(type) {
    try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'select') {
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            osc.start(); osc.stop(ctx.currentTime + 0.2);
        } else if (type === 'correct') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523, ctx.currentTime);
            osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
            osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            osc.start(); osc.stop(ctx.currentTime + 0.4);
        } else if (type === 'wrong') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.start(); osc.stop(ctx.currentTime + 0.3);
        } else if (type === 'open') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(330, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
            osc.start(); osc.stop(ctx.currentTime + 0.25);
        } else if (type === 'perk') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            osc.start(); osc.stop(ctx.currentTime + 0.15);
        } else if (type === 'steal') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(220, ctx.currentTime);
            osc.frequency.setValueAtTime(440, ctx.currentTime + 0.1);
            osc.frequency.setValueAtTime(220, ctx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
            osc.start(); osc.stop(ctx.currentTime + 0.35);
        } else if (type === 'silence') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            osc.start(); osc.stop(ctx.currentTime + 0.4);
        } else if (type === 'wheel') {
            // صوت دوران العجلة
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
            osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
            osc.start(); osc.stop(ctx.currentTime + 0.6);
        } else if (type === 'win') {
            [523, 659, 784, 1047].forEach((f, i) => {
                const o2 = ctx.createOscillator();
                const g2 = ctx.createGain();
                o2.connect(g2); g2.connect(ctx.destination);
                o2.type = 'sine';
                o2.frequency.setValueAtTime(f, ctx.currentTime + i * 0.12);
                g2.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.12);
                g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
                o2.start(ctx.currentTime + i * 0.12);
                o2.stop(ctx.currentTime + i * 0.12 + 0.3);
            });
        } else if (type === 'delete') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.start(); osc.stop(ctx.currentTime + 0.3);
        }
    } catch(e) {}
}

// ===== التنقل =====
function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// ===== شاشة الأسماء =====
function startToCats() {
    teamNames[0] = document.getElementById('t1-input').value.trim() || "الفريق 1";
    teamNames[1] = document.getElementById('t2-input').value.trim() || "الفريق 2";
    document.getElementById('name-0').innerText = teamNames[0];
    document.getElementById('name-1').innerText = teamNames[1];
    playSound('select');
    switchScreen('screen-cats');
    renderCatSelection();
}

// ===== شاشة التصنيفات =====
function renderCatSelection() {
    const list = document.getElementById('cats-list');
    list.innerHTML = '';
    currentCats = [];
    document.getElementById('btn-confirm-cats').disabled = true;

    const allCats = Object.keys(questionBank);
    const available = allCats.filter(c => !usedCats.includes(c));

    if (available.length < 5) { showGameEnd(); return; }

    document.getElementById('cats-title').innerText = `اختر 5 تصانيف للجولة ${roundNumber}`;
    document.getElementById('cats-subtitle').innerText = roundNumber > 1
        ? 'التصانيف المستخدمة في الجولة الأولى معتمة ولا يمكن اختيارها'
        : 'اختر 5 تصانيف تريدها للجولة';

    allCats.forEach(cat => {
        const played = usedCats.includes(cat);
        const btn = document.createElement('button');
        btn.className = 'cat-btn' + (played ? ' played' : '');
        btn.innerText = cat;
        if (!played) {
            btn.onclick = () => {
                playSound('select');
                if (currentCats.includes(cat)) {
                    currentCats = currentCats.filter(c => c !== cat);
                    btn.classList.remove('selected');
                } else if (currentCats.length < 5) {
                    currentCats.push(cat);
                    btn.classList.add('selected');
                }
                document.getElementById('btn-confirm-cats').disabled = currentCats.length !== 5;
            };
        }
        list.appendChild(btn);
    });
}

function confirmAndPlay() {
    usedCats.push(...currentCats);
    qLeft = 25;
    playSound('open');
    switchScreen('screen-game');
    renderBoard();
    updateUI();
}

// ===== لوحة اللعبة =====
function renderBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    currentCats.forEach(cat => {
        const col = document.createElement('div');
        col.className = 'column';
        const header = document.createElement('div');
        header.className = 'col-header';
        header.innerText = cat;
        col.appendChild(header);
        [100, 200, 300, 400, 500].forEach(v => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerText = v;
            card.dataset.cat = cat;
            card.dataset.v = v;
            card.onclick = () => {
                if (deleteMode) handleDeleteCard(card);
                else openQ(cat, v, card);
            };
            col.appendChild(card);
        });
        board.appendChild(col);
    });
}

// ===== فتح السؤال =====
function openQ(cat, v, card) {
    playSound('open');
    activeCard = card;
    activeV = v;
    activeCat = cat;
    activeP = null;

    const qData = questionBank[cat].find(x => x.v === v);

    document.getElementById('q-team-label').innerText = `دور: ${teamNames[turn]}`;
    document.getElementById('q-value-badge').innerText = `${v} نقطة`;
    document.getElementById('q-display').innerText = qData.q;
    document.getElementById('a-display').innerText = "الإجابة: " + qData.a;
    document.getElementById('a-display').classList.add('hidden');

    document.getElementById('ans-controls').style.display = 'flex';
    document.getElementById('steal-controls').classList.add('hidden');
    document.getElementById('steal-ans-controls').classList.add('hidden');
    // تهيئة أزرار المزايا داخل المودال للفريق الحالي
    renderModalPerks();

    document.getElementById('q-modal').classList.add('show');
}

// ===== رسم أزرار المزايا داخل المودال =====
function renderModalPerks() {
    const perkDefs = [
        { id: 'm-double', key: 'double', label: '✕2 تدبيل' },
        { id: 'm-wheel',  key: 'wheel',  label: '🎡 عجلة'  },
        { id: 'm-half',   key: 'half',   label: '½ نصف'    },
        { id: 'm-silence',key: 'silence',label: '🤫 تسكيت' },
    ];

    perkDefs.forEach(({ id, key, label }) => {
        const btn = document.getElementById(id);
        btn.innerText = label;
        btn.className = 'perk-btn';
        if (!perks[turn][key]) {
            btn.classList.add('used');
        }
        // إزالة active-perk عند فتح سؤال جديد
        btn.classList.remove('active-perk');
    });

    // زر الحذف داخل المودال
    const delBtn = document.getElementById('m-delete');
    if (perks[turn]['delete'] && deletesLeft > 0) {
        delBtn.classList.remove('hidden');
        delBtn.className = 'perk-btn delete-perk';
    } else {
        delBtn.classList.add('hidden');
    }
}

// ===== تفعيل الميزة (من داخل المودال) =====
function activatePerk(p) {
    if (!perks[turn][p]) return; // مستخدمة مسبقاً

    // العجلة تعمل فوراً عند الضغط - تدور وتعرض النتيجة
    if (p === 'wheel') {
        spinWheel();
        return;
    }

    playSound(p === 'silence' ? 'silence' : 'perk');

    const btnId = 'm-' + p;

    // إلغاء إذا نفس الميزة
    if (activeP === p) {
        activeP = null;
        document.getElementById(btnId).classList.remove('active-perk');
        return;
    }

    // إلغاء أي ميزة سابقة
    ['m-double','m-half','m-silence'].forEach(id => {
        document.getElementById(id).classList.remove('active-perk');
    });

    activeP = p;
    document.getElementById(btnId).classList.add('active-perk');
}

// ===== وضع الحذف من الهيدر =====
function activateDelete(teamIdx) {
    // فقط الفريق الفائز يمكنه الحذف
    if (!perks[teamIdx]['delete'] || deletesLeft <= 0) return;

    deleteMode = !deleteMode;
    const btn = document.getElementById('delete' + teamIdx);
    btn.classList.toggle('active-perk', deleteMode);

    if (deleteMode) {
        document.getElementById('turn-indicator').innerText =
            `🗑️ وضع الحذف: انقر على سؤال لحذفه (متبقي: ${deletesLeft})`;
        document.querySelectorAll('.card:not(.disabled)').forEach(c => c.classList.add('delete-mode'));
    } else {
        document.querySelectorAll('.card').forEach(c => c.classList.remove('delete-mode'));
        updateUI();
    }
}

function handleDeleteCard(card) {
    if (deletesLeft <= 0) { deleteMode = false; updateUI(); return; }
    playSound('delete');
    card.classList.add('disabled');
    card.classList.remove('delete-mode');
    card.innerText = '🗑️';
    qLeft--;
    deletesLeft--;

    // تحديث العداد في الزر
    [0,1].forEach(i => {
        const span = document.getElementById('del-left-' + i);
        if (span) span.innerText = deletesLeft;
    });

    if (deletesLeft <= 0) {
        deleteMode = false;
        [0,1].forEach(i => {
            perks[i]['delete'] = false;
            const btn = document.getElementById('delete' + i);
            if (btn) btn.classList.add('hidden');
        });
        document.querySelectorAll('.card').forEach(c => c.classList.remove('delete-mode'));
    }
    updateUI();
    if (qLeft <= 0) endRound();
}

// ===== متغير لحفظ قيمة العجلة =====
let wheelFinalVal = null;

// ===== العجلة: تدور وتعرض النتيجة قبل أزرار الإجابة =====
function spinWheel() {
    if (!perks[turn]['wheel']) return;
    playSound('wheel');

    const multipliers = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
    const chosen = multipliers[Math.floor(Math.random() * multipliers.length)];
    wheelFinalVal = Math.floor(activeV * chosen);

    // استهلاك الميزة فوراً
    perks[turn]['wheel'] = false;
    document.getElementById('m-wheel').classList.add('used');
    document.getElementById('m-wheel').classList.remove('active-perk');
    activeP = 'wheel_done';

    // عرض النتيجة بشكل بارز قبل أزرار الإجابة
    const wr = document.getElementById('wheel-result');
    wr.classList.remove('hidden');
    wr.innerHTML = `🎡 العجلة: <strong>×${chosen}</strong> &nbsp;→&nbsp; <strong style="color:#fbbf24">${wheelFinalVal} نقطة</strong>`;

    // إخفاء بقية المزايا، إبقاء أزرار الإجابة ظاهرة
    document.getElementById('modal-perks').style.display = 'none';
    updateUI();
}

// ===== معالجة الإجابة =====
function handleAnswer(correct) {
    let finalVal = activeV;

    if (activeP === 'double') {
        finalVal = activeV * 2;
    } else if (activeP === 'half') {
        finalVal = Math.floor(activeV * 0.5);
    } else if (activeP === 'wheel_done') {
        finalVal = wheelFinalVal;
        wheelFinalVal = null;
    }

    const silenced = (activeP === 'silence');

    // استهلاك الميزة (عدا wheel_done لأنها استُهلكت مسبقاً في spinWheel)
    if (activeP && activeP !== 'wheel_done') {
        perks[turn][activeP] = false;
        document.getElementById('m-' + activeP).classList.add('used');
        document.getElementById('m-' + activeP).classList.remove('active-perk');
    }
    activeP = null;

    document.getElementById('modal-perks').style.display = 'none';
    document.getElementById('wheel-result').classList.add('hidden');

    if (correct) {
        playSound('correct');
        scores[turn] += finalVal;
        document.getElementById('ans-controls').style.display = 'none';
        showAnswer();
        closeModalAfterDelay();
    } else {
        playSound('wrong');
        scores[turn] -= finalVal;
        updateUI();

        // التسكيت: عند الخطأ لا تظهر خيار السرقة للفريق الآخر
        if (silenced) {
            document.getElementById('ans-controls').style.display = 'none';
            showAnswer();
            closeModalAfterDelay();
        } else {
            showStealOption();
        }
    }
}

function showStealOption() {
    const otherTeam = turn === 0 ? 1 : 0;
    document.getElementById('ans-controls').style.display = 'none';
    document.getElementById('steal-controls').classList.remove('hidden');
    document.getElementById('steal-team-name').innerText = teamNames[otherTeam];
    playSound('steal');
}

function handleSteal(doSteal) {
    const otherTeam = turn === 0 ? 1 : 0;
    document.getElementById('steal-controls').classList.add('hidden');
    if (!doSteal) {
        showAnswer();
        closeModalAfterDelay();
    } else {
        document.getElementById('steal-ans-controls').classList.remove('hidden');
        document.getElementById('steal-ans-label').innerText = `${teamNames[otherTeam]} يسرق السؤال!`;
        document.getElementById('q-team-label').innerText = `دور: ${teamNames[otherTeam]}`;
    }
}

function handleStealAnswer(correct) {
    const otherTeam = turn === 0 ? 1 : 0;
    document.getElementById('steal-ans-controls').classList.add('hidden');
    if (correct) {
        playSound('correct');
        scores[otherTeam] += activeV;
    } else {
        playSound('wrong');
    }
    updateUI();
    showAnswer();
    closeModalAfterDelay(otherTeam);
}

function showAnswer() {
    document.getElementById('a-display').classList.remove('hidden');
    updateUI();
}

function closeModalAfterDelay(nextTurn = null) {
    setTimeout(() => {
        document.getElementById('q-modal').classList.remove('show');
        document.getElementById('modal-perks').style.display = '';
        if (activeCard) { activeCard.classList.add('disabled'); activeCard = null; }
        qLeft--;
        turn = (nextTurn !== null) ? nextTurn : (turn === 0 ? 1 : 0);
        if (qLeft <= 0) endRound();
        else updateUI();
    }, 2200);
}

// ===== نهاية الجولة =====
function endRound() {
    playSound('win');
    const winner = scores[0] > scores[1] ? 0 : scores[1] > scores[0] ? 1 : -1;
    round1Winner = winner;

    document.getElementById('round-winner-text').innerText =
        winner === -1 ? `🤝 تعادل في الجولة ${roundNumber}!` : `🏆 ${teamNames[winner]} فاز في الجولة ${roundNumber}!`;

    document.getElementById('round-scores').innerHTML = `
        <div class="score-display ${winner === 0 ? 'winner' : ''}">
            <div class="team-name">${teamNames[0]}</div>
            <div class="team-score">${scores[0]}</div>
        </div>
        <div class="score-display ${winner === 1 ? 'winner' : ''}">
            <div class="team-name">${teamNames[1]}</div>
            <div class="team-score">${scores[1]}</div>
        </div>`;

    const deleteInstr = document.getElementById('delete-instruction');
    if (roundNumber === 1 && winner !== -1) {
        deletesLeft = 3;
        perks[winner]['delete'] = true;
        const delBtn = document.getElementById('delete' + winner);
        if (delBtn) delBtn.classList.remove('hidden');
        const span = document.getElementById('del-left-' + winner);
        if (span) span.innerText = 3;
        deleteInstr.classList.remove('hidden');
        deleteInstr.innerText = `🗑️ جائزة لـ ${teamNames[winner]}: يمكنه حذف 3 أسئلة من الجولة القادمة!`;
    } else {
        deleteInstr.classList.add('hidden');
    }

    const available = Object.keys(questionBank).filter(c => !usedCats.includes(c));
    if (available.length < 5) {
        document.getElementById('next-round-btn').innerText = 'انتهت اللعبة 🏁';
        document.getElementById('next-round-btn').onclick = showGameEnd;
    }

    document.getElementById('round-end-modal').classList.add('show');
}

function goToNextRound() {
    document.getElementById('round-end-modal').classList.remove('show');
    const available = Object.keys(questionBank).filter(c => !usedCats.includes(c));
    if (available.length < 5) { showGameEnd(); return; }
    roundNumber++;
    // إعادة جميع المزايا لكل جولة (مرة واحدة لكل جولة)
    perks = [
        { double: true, wheel: true, half: true, silence: true, delete: perks[0].delete },
        { double: true, wheel: true, half: true, silence: true, delete: perks[1].delete }
    ];
    wheelFinalVal = null;
    switchScreen('screen-cats');
    renderCatSelection();
}

function showGameEnd() {
    document.getElementById('round-end-modal').classList.remove('show');
    const winner = scores[0] > scores[1] ? 0 : scores[1] > scores[0] ? 1 : -1;
    document.getElementById('final-winner-text').innerText =
        winner === -1 ? '🤝 تعادل! كلا الفريقين متساويان!' : `🎉 الفائز الكلي: ${teamNames[winner]}!`;
    document.getElementById('final-scores').innerHTML = `
        <div class="score-display ${winner === 0 ? 'winner' : ''}">
            <div class="team-name">${teamNames[0]}</div>
            <div class="team-score">${scores[0]}</div>
        </div>
        <div class="score-display ${winner === 1 ? 'winner' : ''}">
            <div class="team-name">${teamNames[1]}</div>
            <div class="team-score">${scores[1]}</div>
        </div>`;
    playSound('win');
    document.getElementById('game-end-modal').classList.add('show');
}

// ===== تحديث الواجهة =====
function updateUI() {
    document.getElementById('score-0').innerText = scores[0];
    document.getElementById('score-1').innerText = scores[1];
    document.getElementById('team-box-0').classList.toggle('active-turn', turn === 0);
    document.getElementById('team-box-1').classList.toggle('active-turn', turn === 1);

    // مؤشرات المزايا في الهيدر
    [0, 1].forEach(i => {
        const el = document.getElementById('perks-status-' + i);
        if (!el) return;
        const p = perks[i];
        el.innerHTML = [
            p.double  ? '✕2' : '<s style="opacity:.3">✕2</s>',
            p.wheel   ? '🎡' : '<s style="opacity:.3">🎡</s>',
            p.half    ? '½'  : '<s style="opacity:.3">½</s>',
            p.silence ? '🤫' : '<s style="opacity:.3">🤫</s>',
            p.delete && deletesLeft > 0 ? `🗑️×${deletesLeft}` : ''
        ].filter(Boolean).join(' ');
    });

    if (!deleteMode) {
        document.getElementById('turn-indicator').innerText =
            `دور: ${teamNames[turn]} | الأسئلة المتبقية: ${qLeft}`;
    }
}

// ===== القائمة الجانبية =====
function toggleMenu() { document.getElementById('side-menu').classList.toggle('open'); }

function restartGame() {
    scores = [0, 0]; turn = 0; usedCats = []; currentCats = [];
    roundNumber = 1; round1Winner = null; deleteMode = false; deletesLeft = 0;
    perks = [
        { double: true, wheel: true, half: true, silence: true, delete: false },
        { double: true, wheel: true, half: true, silence: true, delete: false }
    ];
    toggleMenu();
    switchScreen('screen-names');
}

function goHome() { location.reload(); }

function showInstructions() {
    alert(
        "🏆 جاوب مع راشد\n\n" +
        "• اختر 5 تصانيف لكل جولة\n" +
        "• افتح السؤال واختر ميزتك قبل الإجابة\n" +
        "• الإجابة الصحيحة = كسب النقاط | الخطأ = خصم\n" +
        "• عند الخطأ: الفريق الآخر يختار يسرق أو لا\n\n" +
        "المزايا (مرة واحدة لكل جولة):\n" +
        "✕2 تدبيل: يضاعف قيمة السؤال\n" +
        "🎡 عجلة: 0x حتى 4x عشوائي\n" +
        "½ نصف: ينصف قيمة السؤال\n" +
        "🤫 تسكيت: يمنع السرقة من الطرف الآخر\n" +
        "🗑️ حذف: جائزة فائز الجولة الأولى - يحذف 3 أسئلة"
    );
    toggleMenu();
}
