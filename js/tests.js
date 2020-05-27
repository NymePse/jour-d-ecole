//TESTS
function tests() {
    $(fleche).bind("click", function() {
        $(jeu).clearCanvas();
        $(jeu).drawText({
            fillStyle: 'black',
            x: 150, y: 100,
            fontSize: 48,
            fontFamily: 'Comic Sans MS, sans-serif',
            text: $(this).text()
        });
    });
}

//SECTION : CHEMIN
/*
* Pas de fin prématurée
* Chaque obstacle donne la réponse
* => type d'obstacle force la réponse sur une touche précise
*
* Variables :
* 
*
* Déroulement :
* bloquer bouton Jouer
* clear canvas
* binder évenement clavier & click div
* Afficher texte d'introduction
* Attendre appuis barre espace
* 
* boucle phase de jeu (tant que pas fini) :
*      Quelques secondes, boucle gif personnage & décors
*      Créer une question
*      Créer les réponses
*      Sélectionner type d'obstacle
*      mapper les réponses selon l'obstacle dans les touches
*      Afficher obstacle & question
* 
*      attendre réponse ou fin de chrono :
*        si chrono et chrono pas fini
*          avancer chrono
* 
*      si chrono fini OU mauvaise réponse
*        afficher défaite obstacle
*      sinon
*        afficher réussite obstacle
*        points++
*  
* clear canvas
* afficher fond de fin
* afficher texte fin selon résultat
* afficher score
* débloquer bouton Jouer
*/

/*
 * Découpage :
 * 
 * Set up : Actions pré-boucle de jeu
 * DéroulementDebut : Début de boucle jusqu'à attente input
 * ReponseBonne : récupère les info et renvoie le résultat (true/false)
 * DéroulementFin : post-input
 * Conclusion : post-boucle de jeu 
 * 
 */


/*
 * V1
 * 
 * Set up :
 *   nettoyer canvas
 *   bind barre espace => DéroulementDebut
 *   affiche texte "appuyer espace"
 * 
 * DéroulementDébut :
 *   nettoyer canvas
 *   afficher carré
 *   bind flèches + espace => ReponseBonne
 *   Afficher texte "appuyer touche"
 * 
 * RéponseBonne :
 *   Nettoyer Canvas
 *   Afficher keycode
 *   Attendre 3 sec
 *   DéroulementFin
 * 
 * DéroulementFin :
 *   nettoyer canvas
 *   afficher cercle
 *   unbind tout
 *   bind espace => Conclusion
 * 
 * Conclusion :
 *   nettoyer Canvas
 *   unbind tout
 *   afficher "gg arnaud"
 */

function testSetUpChemin() {
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: 100, y: 100,
        fontSize: 20,
        text: "Appuyer sur espace"
    });
    
    //events
    $(document).keypress(function(event) {
        if(event.keyCode == 32)
            testDeroulementDebutChemin();
    })
}

function testDeroulementDebutChemin() {
    $(jeu).clearCanvas().drawRect({
        fillStyle: 'black',
        x: 100, y: 50,
        height: 50, width: 50
    });
    
    $(document).off("keypress");
    
    $(document).keypress(function(event) {
       if(event.keyCode == 32 || event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40)
       {
           testDeroulementFinChemin(event.keyCode);
       }
    });
}

function testReponseBonneChemin(key) {
    $(document).off("keypress");
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: 100, y: 100,
        fontSize: 20,
        text: key.toString()
    });
    setTimeout(function() { testDeroulementFinChemin(); },3000);
}

function testDeroulementFinChemin() {
    $(jeu).clearCanvas().drawArc({
        strokeStyle: 'black',
        x: 100, y: 100,
        radius: 50
    });
    
    $(document).keypress(function(event) {
        if(event.keyCode == 32)
            testConclusionChemin();
    });
}

function testConclusionChemin() {
    $(document).off("keypress");
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: 100, y: 100,
        fontSize: 20,
        text: 'GG Arnaud'
    });
}