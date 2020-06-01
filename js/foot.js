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
    localStorage.setItem(nbParties, (Math.ceil(Math.random() * (4 - 2) + 2)))
    localStorage.setItem(nbQuestions, (Math.ceil(Math.random() * (6 - 3) + 3)));
    localStorage.setItem(prtActuelle, 0);
    localStorage.setItem(qstActuelle, 0);
    localStorage.setItem(score, 0);
    
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
    creerQuestion();
    
    $(document).keydown(function(event) {
        let codes = [37,38,39,40];
        if(codes.includes(event.keyCode))
        {
            $(document).off("keypress");
            deroulementFinFoot(event.keyCode);
        }
    });
    
    $(classfleche).click(function(event) {
       let fleche = event.target.id;
       $(document).off("keypress");
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
        x: 50, y: 20,
        fontSize: 20,
        text: 'Partie ' + localStorage.getItem(prtActuelle) + " sur " + localStorage.getItem(nbParties)
    }).drawText({
        fillStyle: 'black',
        x: 50, y: 50,
        fontSize: 20,
        text: 'Question ' + localStorage.getItem(qstActuelle) + " sur " + localStorage.getItem(nbQuestions)
    }).drawText({
        fillStyle: 'black',
        x: 50, y: 80,
        fontSize: 20,
        text: localStorage.getItem(question)
    });
}

function deroulementFinFoot(key) {
    $(jeu).clearCanvas();
    
    if(reponseBonne(key))
    {
        localStorage.setItem(nbQuestions, parseInt(localStorage.getItem(nbQuestions)) + 1);
        $(jeu).drawText({
            fillStyle: 'black',
            x: 50, y: 50,
            fontSize: 20,
            text: "Bravo !"
        })
    }
    else
    {
        localStorage.setItem(qstActuelle, 0);
        localStorage.setItem(prtActuelle, parseInt(localStorage.getItem(prtActuelle)) + 1);
        $(jeu).drawText({
            fillStyle: 'black',
            x: 50, y: 50,
            fontSize: 20,
            text: "Dommage !"
        })
    }
    
    setTimeout(function() {
        //si toutes parties jouées
        if(parseInt(localStorage.getItem(prtActuelle)) > parseInt(localStorage.getItem(nbParties)))
        {
            conclusionFoot();
        }
        //si dernière question de dernière partie jouée
        else if(parseInt(localStorage.getItem(prtActuelle)) == parseInt(localStorage.getItem(nbParties)) && parseInt(localStorage.getItem(qstActuelle)) > parseInt(localStorage.getItem(nbQuestions)))
        {
            conclusionFoot();
        }
        //si toutes questions partie faites mais pas dernière partie
        else if(parseInt(localStorage.getItem(prtActuelle)) < parseInt(localStorage.getItem(nbParties)) && parseInt(localStorage.getItem(qstActuelle)) > parseInt(localStorage.getItem(nbQuestions)))
        {
            localStorage.setItem(prtActuelle, parseInt(localStorage.getItem(prtActuelle)) + 1);
            localStorage.setItem(qstActuelle, 0);
            localStorage.setItem(score, parseInt(localStorage.getItem(score)) + 1);
            deroulementDebutFoot();
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
        text: 'score : ' + localStorage.getItem('score')
    });
    
    $(bouton).click(setUpGame);
}