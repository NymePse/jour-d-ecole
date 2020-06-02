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
    localStorage.setItem(journee, true);
    
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: $(jeu).height() / 2,
        fontSize: 20,
        text: "Ceci est un début de journée."
    });
    
    $(document).keypress(function(event) {
        if(event.keyCode == 32)
        {
            localStorage.setItem(modeDeJeu, "chemin");
            $(document).off("keypress");
            setUpChemin();
        }
    });
}

function journeePreFoot() {
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: $(jeu).height() / 2,
        fontSize: 20,
        text: "Ceci est avant le foot."
    });
    
    $(document).keypress(function(event) {
        if(event.keyCode == 32)
        {
            $(document).off("keypress");
            localStorage.setItem(modeDeJeu, "foot");
            setUpFoot();
        }
    });
}

function journeePreSoleil() {
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: $(jeu).height() / 2,
        fontSize: 20,
        text: "Ceci est avant le 1, 2, 3, Soleil."
    });
    
    $(document).keypress(function(event) {
        if(event.keyCode == 32)
        {
            localStorage.setItem(modeDeJeu, "soleil");
            $(document).off("keypress");
            setUpSoleil();
        }
    });
}

function conclusionJournee() {
    localStorage.setItem(journee, false);
    
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: $(jeu).height() / 2,
        fontSize: 20,
        text: "Bravo, la journée est finie."
    });
}