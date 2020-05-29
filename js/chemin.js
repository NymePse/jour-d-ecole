//SECTION : CHEMIN
/*
* Pas de fin prématurée
* Chaque obstacle donne la réponse
* => type d'obstacle force la réponse sur une touche précise
*
* Variables :
* 
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
 * V3
 * 
 * Set up :
 *   nettoyer canvas
 *   unbind bouton
 *   bind barre espace => DéroulementDebut
 *   affiche texte "appuyer espace"
 *   créer variable localStorage txtQuestion remplie avec addition au hasard
 *   créer variable localStorage reponseQuestion remplie avec réponse addition
 *   créer variables reponse 1 2 et 3 avec mauvaises réponses
 *   créer variable localStorage nbQuestions et la remplir avec un random
 *   créer variable localStorage qstActuelle à 0
 *   créer variable localStorage score à 0
 * 
 * DéroulementDébut :
 *   nettoyer canvas
 *   créer question
 *   créer bonne réponse & autres réponses
 *   Entrer les réponses dans les divs flèches au hasard
 *   bind flèches + divs => ReponseBonne
 *   Afficher question
 * 
 * RéponseBonne :
 *   récupérer réponse selon touche
 *   si réponse donnée = bonne réponse
 *     DeroulementFin(true)
 *   sinon
 *     DeroulementFin(false)
 * 
 * DéroulementFin :
 *   si true
 *     score++
 *     afficher "bravo !"
 *   sinon
 *     afficher "dommage !"
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

function setUpChemin() {
    //création variables LocalStorage de la partie
    localStorage.setItem(nbQuestions, (Math.ceil(Math.random() * (6 - 3) + 3)));
    localStorage.setItem(qstActuelle, 0);
    localStorage.setItem(score, 0);
    
    //Gestion events
    $(bouton).off("click");
    $(document).keypress(function(event) {
        if(event.keyCode == 32)
            deroulementDebutChemin();
    });
    
    //Maj Canvas
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: 100, y: 100,
        fontSize: 20,
        text: "Appuyer sur espace"
    });
}

function deroulementDebutChemin() {
    creerQuestion();
    
    $(document).keydown(function(event) {
        let codes = [37,38,39,40];
        if(codes.includes(event.keyCode))
        {
            $(document).off("keypress");
            deroulementFinChemin(event.keyCode);
        }
        
    });
    
    //Maj Canvas
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: 50, y: 50,
        fontSize: 20,
        text: 'Question ' + localStorage.getItem(qstActuelle) + ' sur ' + localStorage.getItem(nbQuestions)
    }).drawText({
        fillStyle: 'black',
        x: 50, y: 100,
        fontSize: 20,
        text: localStorage.getItem(question)
    });
}

function deroulementFinChemin(key) {
    $(jeu).clearCanvas();
    
    if(reponseBonne(key))
    {
        localStorage.setItem(score, parseInt(localStorage.getItem(score)) + 1);
        $(jeu).drawText({
            fillStyle: 'black',
            x: 50, y: 50,
            fontSize: 40,
            text: "Bravo !"
        })
    }
    else
    {
        $(jeu).drawText({
            fillStyle: 'black',
            x: 50, y: 50,
            fontSize: 40,
            text: "Dommage !"
        })
    }
    
    $(document).off('keydown');
    
    setTimeout(function() {
        if(quizzComplet())
        {
            conclusionChemin();
        }
        else
        {
            localStorage.setItem(qstActuelle, parseInt(localStorage.getItem(qstActuelle))+1)
            deroulementDebutChemin();
        }
    }, 1000);
    
    
}

function conclusionChemin() {
    //Maj Canvas
    $(jeu).clearCanvas().drawText({
        fillStyle: 'black',
        x: 100, y: 100,
        fontSize: 20,
        text: 'score : ' + localStorage.getItem('score')
    });
    
    $(bouton).click(setUpGame);
}