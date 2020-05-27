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
 * V2
 * 
 * Set up :
 *   nettoyer canvas
 *   unbind bouton
 *   bind barre espace => DéroulementDebut
 *   affiche texte "appuyer espace"
 *   créer variable localeStorage nbQuestions et la remplir avec un random
 *   créer variable localStorage qstActuelle à 0
 * 
 * DéroulementDébut :
 *   nettoyer canvas
 *   bind flèches + espace => ReponseBonne
 *   Afficher texte "question [qst] sur [nb]"
 * 
 * RéponseBonne :
 *   Nettoyer Canvas
 *   Afficher keycode
 *   Attendre 1 sec
 *   DéroulementFin
 * 
 * DéroulementFin :
 *   si qst == nb
 *     Conclusion
 *   si qst < nb
 *     qst++
 *     DeroulementDebut
 * 
 * Conclusion :
 *   nettoyer Canvas
 *   unbind tout
 *   afficher "gg arnaud"
 */

function testSetUpChemin() {
    //création variables LocalStorage de la partie
    localStorage.setItem('nbQuestionsChemin', (Math.ceil(Math.random() * (6 - 3) + 3)));
    localStorage.setItem('qstActuelleChemin', 0);
    
    //Gestion events
    $(bouton).off("click");
    $(document).keypress(function(event) {
        if(event.keyCode == 32)
            testDeroulementDebutChemin();
    });
    
    //Maj Canvas
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: 100, y: 100,
        fontSize: 20,
        text: "Appuyer sur espace"
    });
    
    //LOGS
    console.log(localStorage.getItem('nbQuestionsChemin'));
    console.log(localStorage.getItem('qstActuelleChemin'));
}

function testDeroulementDebutChemin() {
    //Gestion Events
    $(document).keypress(function(event) {
       if(event.keyCode == 32 || event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40)
       {
           $(document).off("keypress");
           testReponseBonneChemin(event.keyCode);
       }
    });
    
    //Maj Canvas
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: 100, y: 100,
        fontSize: 20,
        text: 'Question ' + localStorage.getItem('qstActuelleChemin') + ' sur ' + localStorage.getItem('nbQuestionsChemin')
    });
    
    //LOG
    console.log("DeroulementDebut");
}

function testReponseBonneChemin(key) {
    //Maj Canvas
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: 100, y: 100,
        fontSize: 20,
        text: key.toString()
    });
    
    setTimeout(function() { testDeroulementFinChemin(); },3000);
}

function testDeroulementFinChemin() {
    if(parseInt(localStorage.getItem('qstActuelleChemin')) < parseInt(localStorage.getItem('nbQuestionsChemin')))
    {
        localStorage.setItem('qstActuelleChemin', parseInt(localStorage.getItem('qstActuelleChemin'))+1)
        testDeroulementDebutChemin();
    }
    else
    {
        testConclusionChemin();
    }
}

function testConclusionChemin() {
    //Maj Canvas
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: 100, y: 100,
        fontSize: 20,
        text: 'GG Arnaud'
    });
}