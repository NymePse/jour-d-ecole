//SECTION : FOOT
/*
* Pas de fin prématurée
* Chaque obstacle donne la réponse
* => type d'obstacle force la réponse sur une touche précise
*
* Variables :
*
* Déroulement :
* bloquer bouton Jouer
* clear canvas
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
*        Début nouvelle partie
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
 *   unbind bouton
 *   bind barre espace => DéroulementDebut
 *   affiche texte "appuyer espace"
 *   créer variable localStorage txtQuestion remplie avec addition au hasard
 *   créer variable localStorage reponseQuestion remplie avec réponse addition
 *   créer variables reponse 1 2 et 3 avec mauvaises réponses
 *   créer variable localStorage nbParties et la remplir avec un random
 *   créer variable localStorage nbQuestions et la remplir avec un random
 *   créer variable localStorage partActuelle
 *   créer variable localStorage qstActuelle à 0
 *   créer variable localStorage score à 0
 * 
 * DéroulementDébut :
 *   nettoyer canvas
 *   créer question
 *   créer bonne réponse & autres réponses
 *   Entrer les réponses dans les divs flèches au hasard
 *   afficher nb partie
 *   Afficher question
 *   bind flèches + divs => DeroulementFin
 * 
 * DéroulementFin :
 *   si bonne réponse
 *     qst++
 *     afficher "bravo"
 *   sinon
 *     qst = 0
 *     prtActuelle++
 *     afficher "dommage"
 * 
 *   si prt > nbPrt
 *     conclusion
 *   si prt == nbPrt && qst > nbQst
 *     conclusion
 *   si prt < nbPart && qst > nbQst
 *     prt++
 *     qst = 0
 *     score++
 * 
 * Conclusion :
 *   nettoyer Canvas
 *   unbind tout
 *   afficher score
 */

function setUpFoot() {
    //création variables LocalStorage de la partie
    nbParties = Math.ceil(Math.random() * (4 - 2) + 2);
    nbQuestions = Math.ceil(Math.random() * (6 - 3) + 3);
    indexPartie = 0;
    indexQuestion = 0;
    score = 0;
    
    localStorage.setItem(LS_nbParties, nbParties);
    localStorage.setItem(LS_nbQuestions, nbQuestions);
    localStorage.setItem(LS_indexPartie, 0);
    localStorage.setItem(LS_indexQuestion, 0);
    localStorage.setItem(LS_score, 0);
    
    resetEventsPartie();
    
    //Gestion events
    $(bouton).off("click");
    $(document).keypress(function(event) {
        if(event.keyCode == 32)
        {
            $(document).off("keypress");
            $(espace).off("click");
            deroulementDebutFoot();
        }
    });
    
    $(espace).click(function() {
        $(document).off("keypress");
        $(espace).off("click");
        deroulementDebutFoot();
    });
    
    //Maj Canvas
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: 100, y: 100,
        fontSize: 20,
        text: "Appuyer sur espace"
    });
}

function deroulementDebutFoot() {
    //stop chrono
    stopChrono();
    
    //Select obstacle
    do
    {
        obstacle = Math.floor(Math.random() * 4);
    }
    while(obstaclesFaits.includes(obstacle));
    
    if(obstaclesFaits.length == 3)
    {
        obstaclesFaits.shift();
    }
    obstaclesFaits.push(obstacle);
    
    creerQuestion();
    
    $(document).keydown(function(event) {
        let codes = [37,38,39,40];
        if(codes.includes(event.keyCode))
        {
            $(document).off("keydown");
            deroulementFinFoot(event.keyCode);
        }
    });
    
    $(classfleche).click(function(event) {
       let fleche = event.target.id;
       $(document).off("keydown");
       $(classfleche).off("click");
       switch(fleche) {
           case "haut":
               deroulementFinFoot(38);
               break;
           case "gauche":
               deroulementFinFoot(37);
               break;
           case "bas":
               deroulementFinFoot(40);
               break;
           case "droite":
               deroulementFinFoot(39);
               break;
       }
    });
    
    //Maj Canvas
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: 20,
        fontSize: 20,
        text: 'Partie ' + indexPartie + " sur " + nbParties
    }).drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: 50,
        fontSize: 20,
        text: 'Question ' + indexQuestion + " sur " + nbQuestions
    }).drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: 80,
        fontSize: 20,
        text: question
    }).drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: 150,
        fontSize: 20,
        text: "Obstacle : " + obstacle
    });
    
    //Set chrono
    if(chrono != "sans")
        setChrono();
}

function deroulementFinFoot(key) {
    //stop chrono
    stopChrono();
    
    resetEventsPartie();
    
    console.log("Fin foot");
    
    $(jeu).clearCanvas();
    
    if(reponseBonne(key))
    {
        indexQuestion++;
        localStorage.setItem(LS_indexQuestion, indexPartie);
        $(jeu).drawText({
            fillStyle: 'black',
            x: $(jeu).width() / 2, y: 50,
            fontSize: 20,
            text: "Bravo !"
        });
    }
    else
    {
        indexQuestion = 0;
        localStorage.setItem(LS_indexQuestion, 0);
        indexPartie++;
        localStorage.setItem(LS_indexPartie, indexPartie);
        $(jeu).drawText({
            fillStyle: 'black',
            x: $(jeu).width() / 2, y: 50,
            fontSize: 20,
            text: "Dommage !"
        });
    }
    
    setTimeout(function() {
        
        if(quizzComplet())
        {
            indexQuestion = 0;
            localStorage.setItem(LS_indexQuestion, 0);
            indexPartie++;
            localStorage.setItem(LS_indexPartie, indexPartie);
            score++;
            localStorage.setItem(LS_score, score);
        }
        
        if(partiesCompletes())
        {
            conclusionFoot();
        }
        else
        {
            deroulementDebutFoot();
        }
    }, 1000);
    
    
}

function conclusionFoot() {
    //Maj Canvas
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: 100, y: 100,
        fontSize: 20,
        text: 'score : ' + score
    });
    
    viderVariablesParties();
    viderListesQuestions();
    resetEventsPartie();
    
    setTimeout(function() {
        if(journee == true)
            journeePreSoleil();
    },2000);
}
    
function partiesCompletes() {
    if(indexPartie > nbParties)
        return true;
    else
        return false;
}