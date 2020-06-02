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
    localStorage.setItem('nbQuestions', (Math.ceil(Math.random() * (6 - 3) + 3)));
    localStorage.setItem('qstActuelle', 0);
    localStorage.setItem('score', 0);
    
    
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
    creerQuestion();
    
    //Maj Canvas
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: 20,
        fontSize: 20,
        text: "Question " + localStorage.getItem(qstActuelle) + " sur " +  localStorage.getItem(nbQuestions)
    }).drawText({
        fillStyle: 'black',
        x: $(jeu).width() / 2, y: 50,
        fontSize: 20,
        text: localStorage.getItem(question)
    });
    
     $(document).keydown(function(event) {
        let codes = [37,38,39,40];
        if(codes.includes(event.keyCode))
        {
            $(document).off("keydown");
            deroulementFinSoleil(event.keyCode);
        }
    });
    
    $(classfleche).click(function(event) {
       let fleche = event.target.id;
       $(document).off("keypress");
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
    let typeChrono = localStorage.getItem(chrono);
    if(typeChrono != "sans")
        setChrono();
}

function deroulementFinSoleil(key) {
    //stop chrono
    clearInterval(idInterval);
    
    $(jeu).clearCanvas();
    
    if(reponseBonne(key))
    {
        incrementerVariableLocale(score);
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
            incrementerVariableLocale(qstActuelle);
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
        text: 'score : ' + localStorage.getItem('score')
    });
    
    setTimeout(function() {
        if(localStorage.getItem(journee) == "true")
            conclusionJournee();
    },2000);
}