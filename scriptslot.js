const symbols = ["🍒", "🍋", "🍉", "⭐", "🔔", "💎"];

let credit = 100;
let spinning = false;

function randomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateCredit() {
    document.getElementById("credit").textContent = credit;
}

function spin() {
    if (spinning) return;

    const bet = parseInt(document.getElementById("bet").value);

    if (bet <= 0 || isNaN(bet)) {
        document.getElementById("result").textContent = "❌ Puntata non valida!";
        return;
    }

    if (credit < bet) {
        document.getElementById("result").textContent = "❌ Credito insufficiente!";
        return;
    }

    credit -= bet;
    updateCredit();

    spinning = true;
    document.getElementById("spinBtn").disabled = true;

    const r1 = document.getElementById("r1");
    const r2 = document.getElementById("r2");
    const r3 = document.getElementById("r3");

    let interval = setInterval(() => {
        r1.textContent = randomSymbol();
        r2.textContent = randomSymbol();
        r3.textContent = randomSymbol();
    }, 100);

    setTimeout(() => {
        clearInterval(interval);

        const s1 = randomSymbol();
        const s2 = randomSymbol();
        const s3 = randomSymbol();

        r1.textContent = s1;
        r2.textContent = s2;
        r3.textContent = s3;

        let win = 0;

        // 🎯 combinazioni
        if (s1 === s2 && s2 === s3) {
            win = bet * 10;
            document.getElementById("result").textContent = "🔥 JACKPOT x10!";
        }
        else if (s1 === s2 || s2 === s3 || s1 === s3) {
            win = bet * 3;
            document.getElementById("result").textContent = "🎉 DOPPIA COMBO x3!";
        }
        else if (symbols.indexOf(s1) >= 3) {
            win = bet * 2;
            document.getElementById("result").textContent = "✨ QUASI JACKPOT x2!";
        }
        else {
            document.getElementById("result").textContent = "😢 Hai perso!";
        }

        credit += win;
        updateCredit();

        spinning = false;
        document.getElementById("spinBtn").disabled = false;

    }, 1500);
}