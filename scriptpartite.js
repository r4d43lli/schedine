const squadre = ["San Bernardo", "CincioniFc", "Juventus", "Sbronzi di Riacee", "Foggia", 
    "Ac Tua", "Fully Burger", "Hello Kitty FC", "Cannoli ", "Igor Miti" ]
    

    
    // assegna forza
    function getForza(index) {
      if (index === 0 || index === 1) return 3; // forti
      if (index === 2 || index === 3) return 1; // deboli
      return 2; // normali
    }
    
    // genera gol
    function generaGol(forza) {
      let base = Math.floor(Math.random() * 3); // 0-2
    
      if (forza === 3) base += Math.floor(Math.random() * 3);
      if (forza === 1) base -= 1;
    
      if (base < 0) base = 0;
    
      return base;
    }
    
    // funzione principale (da collegare al bottone)
    function svolgiPartite() {
    
      // 👉 partita scelta (esempio)
      let squadra1Index = 0;
      let squadra2Index = 1;
    
      // 👉 scommessa utente (poi la prenderai da HTML)
      let scelta = "1X";
    
      let vinto = false;
    
      // tutte le partite
      for (let i = 0; i < squadre.length; i++) {
        for (let j = i + 1; j < squadre.length; j++) {
    
          let forza1 = getForza(i);
          let forza2 = getForza(j);
    
          let gol1 = generaGol(forza1);
          let gol2 = generaGol(forza2);
    
          // controlla solo la partita scelta
          if (i === squadra1Index && j === squadra2Index) {
    
            let esito;
    
            if (gol1 > gol2) esito = "1";
            else if (gol1 < gol2) esito = "2";
            else esito = "X";
    
            if (scelta === "1" && esito === "1") vinto = true;
            if (scelta === "2" && esito === "2") vinto = true;
            if (scelta === "X" && esito === "X") vinto = true;
            if (scelta === "1X" && (esito === "1" || esito === "X")) vinto = true;
            if (scelta === "2X" && (esito === "2" || esito === "X")) vinto = true;
          }
        }
      }
    
      // output (solo quello che vede l'utente)
      const risultato = document.getElementById("risultato");
    
      if (vinto) {
        risultato.textContent = "Hai vinto!";
      } else {
        risultato.textContent = "Hai perso!";
      }
    }