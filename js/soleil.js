//SECTION : CHEMIN
/*
* Fin à la première erreur
* entre 4 et 6 questions
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
*      Afficher obstacle & question
* 
*      attendre réponse ou fin de chrono :
*        si chrono et chrono pas fini
*          avancer chrono
* 
*      si chrono fini OU mauvaise réponse
*        afficher défaite obstacle
*        Fin du jeu
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
 *   créer variable localStorage nbQuestions et la remplir avec un random
 *   créer variable localStorage qstActuelle à 0
 *   créer variable localStorage score à 0
 * 
 * DéroulementDébut :
 *   nettoyer canvas
 *   créer question
 *   créer bonne réponse & autres réponses
 *   Entrer les réponses dans les divs flèches au hasard
 *   bind flèches + divs => DéroulementFin(keyCode)
 *   Afficher question
 * 
 * DéroulementFin :
 *   si true
 *     score++
 *     afficher "bravo !"
 *   sinon
 *     afficher "Fin du jeu."
 *     wait 1 sec
 *     Conclusion
 *   si qst == nb
 *     Conclusion
 *   sinon
 *     qst++
 *     DeroulementDebut
 * 
 * Conclusion :
 *   nettoyer Canvas
 *   unbind tout
 *   afficher score
 */

function setUpSoleil() {
    //création variables LocalStorage de la partie
    nbQuestions = Math.ceil(Math.random() * (6 - 3) + 3);
    indexQuestion = 0;
    score = 0;
    
    localStorage.setItem(LS_nbQuestions, nbQuestions);
    localStorage.setItem(LS_indexQuestion, 0);
    localStorage.setItem(LS_score, 0);
    
    
    //Gestion events
    $(bouton).off("click");
    $(document).keypress(function(event) {
        if(event.keyCode == 32)
        {
            $(document).off("keypress");
            $(espace).off("click");
            deroulementDebutSoleil();
        }
    });
    
    $(espace).click(function() {
        $(document).off("keypress");
        $(espace).off("click");
        deroulementDebutSoleil();
    });
    
    //Maj Canvas
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: 100, y: 100,
        fontSize: 20,
        text: "1, 2, 3, Soleil !"
    });
}

function deroulementDebutSoleil()  {
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
    
    //Maj Canvas
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: 20,
        fontSize: 20,
        text: "Question " + indexQuestion + " sur " +  nbQuestions
    }).drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: 50,
        fontSize: 20,
        text: question
    }).drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: 150,
        fontSize: 20,
        text: "Obstacle : " + obstacle
    });
    
     $(document).keydown(function(event) {
        let codes = [37,38,39,40];
        if(codes.includes(event.keyCode))
        {
            $(classfleche).off("click");
            $(document).off("keydown");
            deroulementFinSoleil(event.keyCode);
        }
    });
    
    $(classfleche).click(function(event) {
       let fleche = event.target.id;
       $(document).off("keydown");
       $(classfleche).off("click");
       switch(fleche) {
           case "haut":
               deroulementFinSoleil(38);
               break;
           case "gauche":
               deroulementFinSoleil(37);
               break;
           case "bas":
               deroulementFinSoleil(40);
               break;
           case "droite":
               deroulementFinSoleil(39);
               break;
       }
    });
    
    //Set chrono
    if(chrono != "sans")
        setChrono();
}

function deroulementFinSoleil(key) {
    //stop chrono
    stopChrono();
    
    $(jeu).clearCanvas();
    
    if(reponseBonne(key))
    {
        score++;
        localStorage.setItem(LS_score, score);
        $(jeu).drawText({
            fillStyle: 'black',
            x: $(jeu).width() / 2, y: 50,
            fontSize: 40,
            text: "Bravo !"
        });
        
        $(document).off('keydown');
    
        setTimeout(function() {
            if(quizzComplet())
            {
                conclusionSoleil();
            }
            else
            {
                indexQuestion++;
                localStorage.setItem(LS_indexQuestion, indexQuestion);
                deroulementDebutSoleil();
            }
        }, 1000);
    }
    else
    {
        $(jeu).drawText({
            fillStyle: 'black',
            x: $(jeu).width() / 2, y: 50,
            fontSize: 40,
            text: "Fin du jeu."
        })
        setTimeout(conclusionSoleil, 1000);
    }
}

function conclusionSoleil() {
    //Maj Canvas
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: 100, y: 100,
        fontSize: 20,
        text: 'score : ' + score
    });
    
    viderVariablesParties();
    viderListesQuestions();
    
    setTimeout(function() {
        if(journee == true)
            conclusionJournee();
    },2000);
}