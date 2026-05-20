// lista delle squadre
let squadre = [
    "San Bernardo", "CincioniFc", "Juventus", "Sbronzi di Riacee",
    "Foggia", "Ac Tua", "Fully Burger", "Hello Kitty FC", "Cannoli", "Igor Miti"
];

// CALENDARIO: ogni numero indica una squadra della lista sopra
let calendario = [
    [[0,1],[2,3],[4,5],[6,7],[8,9]],
    [[0,2],[1,4],[3,6],[5,8],[7,9]],
    [[0,3],[2,5],[1,6],[4,9],[7,8]],
    [[0,4],[3,5],[2,7],[1,8],[6,9]],
    [[0,5],[4,6],[3,8],[2,9],[1,7]],
    [[0,6],[5,7],[4,2],[3,9],[1,8]],
    [[0,7],[6,8],[5,9],[1,2],[3,4]],
    [[0,8],[7,9],[1,3],[2,6],[4,5]],
    [[0,9],[1,5],[2,8],[3,7],[4,6]]
];

// --- CARICA DAL LOCALSTORAGE (se esiste), altrimenti parte da zero ---
// localStorage salva i dati nel browser: rimangono anche cambiando pagina

function caricaDati() {
    let salvato = localStorage.getItem("vbucks365");
    if (salvato != null) {
        let dati = JSON.parse(salvato);
        giornata      = dati.giornata;
        classifica    = dati.classifica;
        ultimePartite = dati.ultimePartite;
        scommesse     = dati.scommesse;
    }
}

function salvaDati() {
    let dati = {
        giornata:      giornata,
        classifica:    classifica,
        ultimePartite: ultimePartite,
        scommesse:     scommesse
    };
    localStorage.setItem("vbucks365", JSON.stringify(dati));
}

//parte iniziale dove viene settato tutto a zero
let giornata = 0;
let classifica = [];
let ultimePartite = [];
let scommesse = [];
let scelta = "";

// CREA LA CLASSIFICA INIZIALE
for (let i = 0; i < squadre.length; i++) {
    classifica.push({
        nome: squadre[i],
        giocate: 0,
        vinte: 0,
        pari: 0,
        perse: 0,
        punti: 0
    });
}

// sovrascrive i valori di default con quelli salvati (se esistono)
caricaDati();

function nomeSquadra(numero) {
    return squadre[numero];
}

//forza delle squadre:
function forzaSquadra(numero) {
    if (numero == 0 || numero == 1) return 3;
    if (numero == 2 || numero == 3) return 1;
    return 2;
}

// parte dove vengono ""fatte" le partite tenendo conto della forza della squadra utilizzando la funzione math.random
function generaGol(forza) {
    let gol = Math.floor(Math.random() * 3);
    if (forza == 3) gol = gol + Math.floor(Math.random() * 2);
    if (forza == 1) gol = gol - 1;
    if (gol < 0) gol = 0;
    return gol;
}

// si fanno le quote ( già predefinite), facendo la differenza tra la forza delle 2 squadre
function calcolaQuote(casa, ospite) {
    let differenza = forzaSquadra(casa) - forzaSquadra(ospite);
    if (differenza > 0) return ["1.60", "3.20", "4.50"];
    if (differenza < 0) return ["4.50", "3.20", "1.60"];
    return ["2.40", "3.00", "2.40"];
}

//risultato finale 
function risultatoPartita(golCasa, golOspite) {
    if (golCasa > golOspite) return "1";
    if (golCasa < golOspite) return "2";
    return "X";
}

function preparaScommesse() {
    let menu = document.getElementById("partita-select");
    if (menu == null) return;

    //viene selezionata la giornata corrente e se è finito il campionato scrive finito
    let testoGiornata = document.getElementById("giornata-attuale");

    if (giornata >= calendario.length) {
        menu.innerHTML = "<option>Campionato finito</option>";
        testoGiornata.innerHTML = "Tutte le giornate sono state giocate.";
        return;
    }

    testoGiornata.innerHTML = "Giornata " + (giornata + 1) + " di " + calendario.length;
    menu.innerHTML = "";

    let partite = calendario[giornata];
    for (let i = 0; i < partite.length; i++) {
        let casa = partite[i][0];
        let ospite = partite[i][1];
        menu.innerHTML += "<option value='" + i + "'>" + nomeSquadra(casa) + " - " + nomeSquadra(ospite) + "</option>";
    }

    // cambio di partite per scommettere, si usa onchange per far
    // si che viene applicato lo stesso codice in una partita divera 
    menu.onchange = function() {
        scelta = "";
        togliSelezione();
        aggiornaQuote();
    };

    scelta = "";
    togliSelezione();
    aggiornaQuote();
}

// vengono aggiornate le quote in base alla partita
function aggiornaQuote() {
    let menu = document.getElementById("partita-select");
    if (menu == null) return;
    if (giornata >= calendario.length) return;

    let numeroPartita = parseInt(menu.value);
    let partita = calendario[giornata][numeroPartita];
    let quote = calcolaQuote(partita[0], partita[1]);

    document.getElementById("q1").innerHTML = quote[0];
    document.getElementById("qx").innerHTML = quote[1];
    document.getElementById("q2").innerHTML = quote[2];
}

// funzione grafica dove il bottone dopo essere selzionato viene 
// evidenziato e dopo viene tolta la parte in evidenza 
function togliSelezione() {
    let bottoni = document.querySelectorAll(".bottoni-quota button");
    for (let i = 0; i < bottoni.length; i++) {
        bottoni[i].classList.remove("scelto");
    }
}

// prende il valore in base al bottone selezionato e la salva
function selezionaEsito(bottone, valore) {
    togliSelezione();
    bottone.classList.add("scelto");
    scelta = valore;
}

function salvaScommessa() {
    // controlla se se il campionato è finito 
    if (giornata >= calendario.length) {
        alert("Il campionato è finito!");
        return;
    }
    // controlla se l'utente seleziona una scommessa tra tutte 
    if (scelta == "") {
        alert("Scegli prima 1, X oppure 2.");
        return;
    }

    // prende la partita selezionata e controlla se ci sono altre scommesse uguali 
    let menu = document.getElementById("partita-select");
    let numeroPartita = parseInt(menu.value);
    let giaPresente = false;

    for (let i = 0; i < scommesse.length; i++) {
        if (scommesse[i].partita == numeroPartita) {
            scommesse[i].scelta = scelta;
            giaPresente = true;
        }
    }

    if (giaPresente == false) {
        scommesse.push({ partita: numeroPartita, scelta: scelta });
    }

    scelta = "";
    togliSelezione();
    salvaDati(); // salva nel browser
    mostraScommesse();
}

// mostra all'utente le scommesse che ha fatto 
function mostraScommesse() {
    let box = document.getElementById("lista-bet");
    if (box == null) return;
    // fa vedere se non c'è nessuna scommessa 
    if (scommesse.length == 0) {
        box.innerHTML = "<p class='testo-grigio'>Nessuna scommessa salvata.</p>";
        return;
    }

    box.innerHTML = "<b>Scommesse salvate:</b>";
    let partite = calendario[giornata];

    for (let i = 0; i < scommesse.length; i++) {
        let partita = partite[scommesse[i].partita];
        box.innerHTML += "<div class='riga-scommessa'><span>" + nomeSquadra(partita[0]) + " - " + nomeSquadra(partita[1]) + "</span><span class='etichetta etichetta-neutra'>" + scommesse[i].scelta + "</span></div>";
    }
}

function giocaGiornata() {
    // controlla se il campionato è finito
    if (giornata >= calendario.length) {
        alert("Il campionato è finito!");
        return;
    }
    // segnala all'utente di inserire almeno una scommessa 
    if (scommesse.length == 0) {
        alert("Salva almeno una scommessa prima di giocare.");
        return;
    }

    let partite = calendario[giornata];
    ultimePartite = [];
    let vinte = 0;

    // ciclo su tutte le partite, viene presa ogni squadra e la si fa giocare
    // una contro l'altra
    for (let i = 0; i < partite.length; i++) {
        let casa = partite[i][0];
        let ospite = partite[i][1];
        let golCasa = generaGol(forzaSquadra(casa));
        let golOspite = generaGol(forzaSquadra(ospite));
        let esito = risultatoPartita(golCasa, golOspite);

        aggiornaClassifica(casa, ospite, golCasa, golOspite);

        // viene aggiornata la classifica tenendo conto delle bet
        let sceltaTrovata = "";
        let eraScommessa = false;
        let vinta = false;

        // controlla la scommessa e guarda se hai vinto o perso 
        for (let j = 0; j < scommesse.length; j++) {
            if (scommesse[j].partita == i) {
                sceltaTrovata = scommesse[j].scelta;
                eraScommessa = true;
                if (sceltaTrovata == esito) {
                    vinta = true;
                    vinte++;
                }
            }
        }

        // mostra le ultime partite 
        ultimePartite.push({
            giornata: giornata + 1,
            casa: nomeSquadra(casa),
            ospite: nomeSquadra(ospite),
            golCasa: golCasa,
            golOspite: golOspite,
            scelta: sceltaTrovata,
            eraScommessa: eraScommessa,
            vinta: vinta
        });
    }

    // salva le scommesse della giornata 
    let totale = scommesse.length;
    //passa alla prossima giornata
    giornata++;
    //resetta le scommesse e le scelte fatte
    scommesse = [];
    scelta = "";

    salvaDati(); // salva tutto nel browser prima di aggiornare la pagina

    // aggiorna calendario, partite ecc... e prepara le prossime scommesse
    mostraRisultato(vinte, totale);
    renderClassifica();
    renderUltime();
    renderCalendario();
    preparaScommesse();
    mostraScommesse();
}

function aggiornaClassifica(casa, ospite, golCasa, golOspite) {
    //le squadre aumentano di una partita 
    classifica[casa].giocate++;
    classifica[ospite].giocate++;
    // se vince la squadra in casa aggiunge 3 punti 
    if (golCasa > golOspite) {
        classifica[casa].vinte++;
        classifica[ospite].perse++;
        classifica[casa].punti += 3;
        //stessa cosa se vincono gli ospiti
    } else if (golCasa < golOspite) {
        classifica[ospite].vinte++;
        classifica[casa].perse++;
        classifica[ospite].punti += 3;
    } else {
        // pareggio
        classifica[casa].pari++;
        classifica[ospite].pari++;
        classifica[casa].punti++;
        classifica[ospite].punti++;
    }
}

function mostraRisultato(vinte, totale) {
    // prende il risultato 
    let box = document.getElementById("box-risultato");
    if (box == null) return;
    // fa vedere quante scommesse hai vinto 
    box.style.display = "block";
    box.innerHTML = "Hai vinto " + vinte + " scommesse su " + totale + ".";
}

function renderClassifica() {
    // viene messa in ordine la classifica in base ai punti
    let corpo = document.getElementById("corpo-classifica");
    if (corpo == null) return;

    let ordinata = [];
    for (let i = 0; i < classifica.length; i++) {
        ordinata.push(classifica[i]);
    }

    ordinata.sort(function(a, b) {
        return b.punti - a.punti;
    });

    // svuota la vecchia classifica
    corpo.innerHTML = "";
    for (let i = 0; i < ordinata.length; i++) {
        // costruisce la riga html con posizione partite ecc..
        corpo.innerHTML += "<tr><td>" + (i + 1) + "</td><td>" + ordinata[i].nome + "</td><td>" + ordinata[i].giocate + "</td><td>" + ordinata[i].vinte + "</td><td>" + ordinata[i].pari + "</td><td>" + ordinata[i].perse + "</td><td><b>" + ordinata[i].punti + "</b></td></tr>";
    }
}

function renderUltime() {
    // fa vedere le ultime partite con il risultato delle scommesse scelte 
    let lista = document.getElementById("lista-ultime");
    if (lista == null) return;

    if (ultimePartite.length == 0) {
        lista.innerHTML = "<p class='testo-grigio'>Nessuna giornata giocata.</p>";
        return;
    }

    lista.innerHTML = "<p class='testo-grigio'>Giornata " + ultimePartite[0].giornata + "</p>";

    for (let i = 0; i < ultimePartite.length; i++) {
        let p = ultimePartite[i];
        let badge = "<span class='etichetta etichetta-neutra'>nessuna bet</span>";

        if (p.eraScommessa == true && p.vinta == true) {
            badge = "<span class='etichetta etichetta-ok'>bet " + p.scelta + ": vinta</span>";
        }

        if (p.eraScommessa == true && p.vinta == false) {
            badge = "<span class='etichetta etichetta-no'>bet " + p.scelta + ": persa</span>";
        }

        lista.innerHTML += "<div class='riga-partita'><span>" + p.casa + " " + p.golCasa + " - " + p.golOspite + " " + p.ospite + "</span>" + badge + "</div>";
    }
}

function renderCalendario() {
    // stessa cosa delle ultime partite ma per il calendario 
    let lista = document.getElementById("lista-calendario");
    if (lista == null) return;

    lista.innerHTML = "";

    for (let i = 0; i < calendario.length; i++) {
        let stato = "da giocare";
        if (i < giornata) stato = "giocata";
        if (i == giornata) stato = "prossima";

        lista.innerHTML += "<h3>Giornata " + (i + 1) + " - " + stato + "</h3>";

        for (let j = 0; j < calendario[i].length; j++) {
            let partita = calendario[i][j];
            lista.innerHTML += "<div class='riga-calendario'><span>" + nomeSquadra(partita[0]) + " - " + nomeSquadra(partita[1]) + "</span><span class='etichetta etichetta-neutra'>" + stato + "</span></div>";
        }
    }
}

function resetCampionato() {
    // fa scegliere all'utente se vuole resettare il campionato e cancella tutto 
    if (confirm("Vuoi ricominciare il campionato?")) {
        giornata = 0;
        ultimePartite = [];
        scommesse = [];
        scelta = "";
        classifica = [];

        for (let i = 0; i < squadre.length; i++) {
            classifica.push({ nome: squadre[i], giocate: 0, vinte: 0, pari: 0, perse: 0, punti: 0 });
        }

        salvaDati(); // azzera anche il localStorage
        renderClassifica();
        renderUltime();
        renderCalendario();
        preparaScommesse();
        mostraScommesse();
    }
}

// avvio del sito 
renderClassifica();
renderUltime();
renderCalendario();
preparaScommesse();
mostraScommesse();
