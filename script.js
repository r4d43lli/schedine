// ── DATI ──────────────────────────────────────────────
const squadre = [
    "San Bernardo", "CincioniFc", "Juventus", "Sbronzi di Riacee",
    "Foggia", "Ac Tua", "Fully Burger", "Hello Kitty FC", "Cannoli", "Igor Miti"
];

// Forza squadre: 0/1 = forti (3), 2/3 = deboli (1), resto = normali (2)
function getForza(index) {
    if (index === 0 || index === 1) return 3;
    if (index === 2 || index === 3) return 1;
    return 2;
}

function generaGol(forza) {
    let base = Math.floor(Math.random() * 3); // 0-2
    if (forza === 3) base += Math.floor(Math.random() * 3);
    if (forza === 1) base -= 1;
    return Math.max(0, base);
}

// Genera quote semplici in base alla forza delle squadre
function calcolaQuote(i, j) {
    const f1 = getForza(i);
    const f2 = getForza(j);
    const diff = f1 - f2;
    let q1, qx, q2;
    if (diff > 0) {
        q1 = (1.3 + Math.random() * 0.4).toFixed(2);
        qx = (3.0 + Math.random() * 0.5).toFixed(2);
        q2 = (4.0 + Math.random() * 1.5).toFixed(2);
    } else if (diff < 0) {
        q1 = (4.0 + Math.random() * 1.5).toFixed(2);
        qx = (3.0 + Math.random() * 0.5).toFixed(2);
        q2 = (1.3 + Math.random() * 0.4).toFixed(2);
    } else {
        q1 = (2.5 + Math.random() * 0.5).toFixed(2);
        qx = (2.8 + Math.random() * 0.4).toFixed(2);
        q2 = (2.5 + Math.random() * 0.5).toFixed(2);
    }
    return { q1, qx, q2 };
}

// ── STATO ─────────────────────────────────────────────
let scelta = null;
let classifica = {};
let ultime = [];

// ── INIT ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // Classifica iniziale
    squadre.forEach((s, i) => {
        classifica[i] = { nome: s, g: 0, v: 0, p: 0, pts: 0 };
    });

    popolaSelect();
    aggiornaQuote();
    renderClassifica();
    renderCalendario();
    renderUltime();
});

// ── SELECT SQUADRE ─────────────────────────────────────
function popolaSelect() {
    const sq1 = document.getElementById("sq1");
    const sq2 = document.getElementById("sq2");

    squadre.forEach((s, i) => {
        sq1.innerHTML += `<option value="${i}">${s}</option>`;
        sq2.innerHTML += `<option value="${i}">${s}</option>`;
    });

    // default diversi
    sq2.value = "1";

    sq1.addEventListener("change", aggiornaQuote);
    sq2.addEventListener("change", aggiornaQuote);
}

function aggiornaQuote() {
    const i = parseInt(document.getElementById("sq1").value);
    const j = parseInt(document.getElementById("sq2").value);
    if (isNaN(i) || isNaN(j) || i === j) {
        document.getElementById("q1").textContent = "—";
        document.getElementById("qx").textContent = "—";
        document.getElementById("q2").textContent = "—";
        return;
    }
    const { q1, qx, q2 } = calcolaQuote(i, j);
    document.getElementById("q1").textContent = q1;
    document.getElementById("qx").textContent = qx;
    document.getElementById("q2").textContent = q2;
}

// ── SELEZIONE ESITO ────────────────────────────────────
function selezionaEsito(el, valore) {
    document.querySelectorAll(".bet-opcion").forEach(b => b.classList.remove("selected"));
    el.classList.add("selected");
    scelta = valore;
}

// ── CLASSIFICA ────────────────────────────────────────
function renderClassifica() {
    const ordine = Object.values(classifica).sort((a, b) => b.pts - a.pts || b.v - a.v);
    const tbody = document.getElementById("corpo-classifica");
    tbody.innerHTML = "";
    ordine.forEach((sq, idx) => {
        const rank = idx + 1;
        const cls = rank <= 3 ? `rank-${rank}` : "";
        tbody.innerHTML += `
            <tr class="${cls}">
                <td class="rank-num">${rank}</td>
                <td>${sq.nome}</td>
                <td>${sq.g}</td>
                <td>${sq.v}</td>
                <td>${sq.p}</td>
                <td class="pts">${sq.pts}</td>
            </tr>`;
    });
}

// ── ULTIME PARTITE ────────────────────────────────────
function renderUltime() {
    const lista = document.getElementById("lista-ultime");
    if (ultime.length === 0) {
        lista.innerHTML = `<div style="padding:12px 14px; font-size:0.8rem; color:var(--testo-dim)">Nessuna partita ancora giocata.</div>`;
        return;
    }
    lista.innerHTML = "";
    // mostra le ultime 10 in ordine inverso
    [...ultime].reverse().slice(0, 10).forEach(p => {
        const c1 = p.gol1 > p.gol2 ? "score-win" : p.gol1 < p.gol2 ? "score-lose" : "score-draw";
        const c2 = p.gol2 > p.gol1 ? "score-win" : p.gol2 < p.gol1 ? "score-lose" : "score-draw";
        lista.innerHTML += `
            <div class="risultato-card">
                <span class="team-name">${p.sq1}</span>
                <div class="score-box">
                    <span class="${c1}">${p.gol1}</span>
                    <span class="score-sep">-</span>
                    <span class="${c2}">${p.gol2}</span>
                </div>
                <span class="team-name right">${p.sq2}</span>
            </div>`;
    });
}

// ── CALENDARIO ────────────────────────────────────────
function renderCalendario() {
    const lista = document.getElementById("lista-calendario");
    lista.innerHTML = "";
    const today = new Date();
    let counter = 0;
    for (let i = 0; i < squadre.length && counter < 15; i++) {
        for (let j = i + 1; j < squadre.length && counter < 15; j++) {
            const d = new Date(today);
            d.setDate(today.getDate() + counter * 3 + 1);
            const data = d.toLocaleDateString("it-IT", { day: "2-digit", month: "short" });
            lista.innerHTML += `
                <div class="match-card">
                    <span>${squadre[i]}</span>
                    <span class="match-vs">VS</span>
                    <span>${squadre[j]}</span>
                    <span class="match-date">${data}</span>
                </div>`;
            counter++;
        }
    }
}

// ── SVOLGI PARTITE ────────────────────────────────────
function svolgiPartite() {
    const sq1Val = document.getElementById("sq1").value;
    const sq2Val = document.getElementById("sq2").value;

    if (sq1Val === "" || sq2Val === "" || sq1Val === sq2Val) {
        alert("Seleziona due squadre diverse!");
        return;
    }
    if (!scelta) {
        alert("Seleziona un esito su cui scommettere!");
        return;
    }

    const squadra1Index = parseInt(sq1Val);
    const squadra2Index = parseInt(sq2Val);
    let vinto = false;

    // Gioca tutte le partite del turno
    for (let i = 0; i < squadre.length; i++) {
        for (let j = i + 1; j < squadre.length; j++) {
            const f1 = getForza(i);
            const f2 = getForza(j);
            const gol1 = generaGol(f1);
            const gol2 = generaGol(f2);

            // aggiorna classifica
            classifica[i].g++;
            classifica[j].g++;
            if (gol1 > gol2) {
                classifica[i].v++;
                classifica[j].p++;
                classifica[i].pts += 3;
            } else if (gol1 < gol2) {
                classifica[j].v++;
                classifica[i].p++;
                classifica[j].pts += 3;
            } else {
                classifica[i].pts += 1;
                classifica[j].pts += 1;
            }

            // salva nei risultati
            ultime.push({ sq1: squadre[i], sq2: squadre[j], gol1, gol2 });

            // controlla la partita scommessa
            if (i === squadra1Index && j === squadra2Index) {
                let esito;
                if (gol1 > gol2) esito = "1";
                else if (gol1 < gol2) esito = "2";
                else esito = "X";

                if (scelta === "1"  && esito === "1") vinto = true;
                if (scelta === "2"  && esito === "2") vinto = true;
                if (scelta === "X"  && esito === "X") vinto = true;
                if (scelta === "1X" && (esito === "1" || esito === "X")) vinto = true;
                if (scelta === "2X" && (esito === "2" || esito === "X")) vinto = true;
            }
        }
    }

    // mostra risultato
    const el = document.getElementById("risultato");
    el.className = "";
    void el.offsetWidth; // reflow per animazione
    if (vinto) {
        el.textContent = "✅ Hai vinto!";
        el.className = "vinto";
    } else {
        el.textContent = "❌ Hai perso!";
        el.className = "perso";
    }

    // aggiorna UI
    renderClassifica();
    renderUltime();
    aggiornaQuote();
}

// ── NAVIGAZIONE MOBILE (opzionale) ────────────────────
function mostraSezione(nome) {
    // evidenzia il box attivo nel menu
    document.querySelectorAll(".box").forEach(b => b.classList.remove("active"));
    const boxes = document.querySelectorAll(".box");
    const map = { classifica: 0, calend: 1, ultime: 2, bet: 3 };
    if (map[nome] !== undefined) boxes[map[nome]].classList.add("active");
}
