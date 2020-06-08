//SECTION : Journée
/*
* Suite des modes de jeu avec des transitions entre chacun.
*
* Déroulement :
*   introduction de la journée   
*   lancer jeu Chemin
*   texte transition avec foot selon score 
*   lancer jeu foot
*   texte transition soleil
*   texte fin de jeu
*/

/*
 * Découpage :
 * 
 * Set up : variables de journée, texte d'intro, lance Chemin
 * pré-foot : texte de transition, lance Foot
 * pré-soleil : texte de transition, lance Soleil
 * conclusion : texte de fin, score total...
 * 
 */

function setUpJournee() {
    journee = true;
    localStorage.setItem(LS_journee, true);
    
    resetEventsPartie();
    
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: $(jeu).height() / 2,
        fontSize: 20,
        text: "Ceci est un début de journée."
    });
    
    $(document).keypress(function(event) {
        if(event.keyCode == 32)
        {
            $(espace).off("click");
            localStorage.setItem(modeDeJeu, "chemin");
            $(document).off("keypress");
            setUpChemin();
        }
    });
    
    $(espace).click(function() {
        $(espace).off("click");
        localStorage.setItem(modeDeJeu, "chemin");
        $(document).off("keypress");
        setUpChemin();
    });
}

function journeePreFoot() {
    resetEventsPartie();
    
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: $(jeu).height() / 2,
        fontSize: 20,
        text: "Ceci est avant le foot."
    });
    
    $(classfleche).off("click");
    
    $(document).keypress(function(event) {
        if(event.keyCode == 32)
        {
            $(espace).off("click");
            $(document).off("keypress");
            localStorage.setItem(modeDeJeu, "foot");
            setUpFoot();
        }
    });
    
    $(espace).click(function() {
        $(espace).off("click");
        $(document).off("keypress");
        localStorage.setItem(modeDeJeu, "foot");
        $(document).off("keypress");
        setUpFoot();
    });
    
    
}

function journeePreSoleil() {
    resetEventsPartie();
    
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: $(jeu).height() / 2,
        fontSize: 20,
        text: "Ceci est avant le 1, 2, 3, Soleil."
    });
    
    $(classfleche).off("click");
    
    $(document).keypress(function(event) {
        if(event.keyCode == 32)
        {
            $(espace).off("click");
            localStorage.setItem(modeDeJeu, "soleil");
            $(document).off("keypress");
            setUpSoleil();
        }
    });
    
    $(espace).click(function() {
        $(espace).off("click");
        $(document).off("keypress");
        localStorage.setItem(modeDeJeu, "soleil");
        $(document).off("keypress");
        setUpSoleil();
    });
}

function conclusionJournee() {
    journee = false;
    localStorage.setItem(LS_journee, false);
    
    resetEventsPartie();
    
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: $(jeu).height() / 2,
        fontSize: 20,
        text: "Bravo, la journée est finie."
    });
}