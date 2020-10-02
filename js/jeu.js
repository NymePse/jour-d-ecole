//JEU.JS
/*
 * Fonctions en rapport avec le déroulement d'une partie
 */

//DEROULEMENT
/*
 * Introduction : texte introduction, renvoie vers Partie()
 * 
 * Partie : 
 * check les mi-temps et indexPhase, 
 *   si indexPhase pas fini envoie DebutBoucle();
 *   si indexPhase fini, incrémente mi-temps et vérifie, si mi-temps pas fini envoie DebutBoucle();
 *   si mi-temps & indexPhase fini, effectue fin partie
 * check fin de partie
 *   affiche score final
 *   maj tableau score compte
 *   affiche texte de fin selon score
 * 
 * DebutBoucle :
 *  check versEnnemie, check indexTerrain; 
 *    selon, choisis obstacle, affiche map + obstacle, créer question + réponses, events renvoie vers FinBoucle(bool)
 * 
 * finBoucle : check réponse juste ou non et indexTerrain; 
 * selon, maj versEnnemie, scoreAmi & scoreEnnemie, indexterrain; affiche résultat; 
 * incrémente indexPhase 
 */

//TODO Modifier et passer en let les variables (voir supprimer pour utiliser objet Partie)

//Nombre phases et taille terrain selon longueur partie
var phasesCourte = 9;
var phasesLongue = 15;
var tailleCourte = 4;
var tailleLongue = 6;
var tmpsPhase;

//TODO Modifier noms, modifier liste map ? + modifier images map longue (enlever 2 index)

//Variables affichage
const VA_balleAuCentre = "res/balleCentre/";
const VA_versEnnemie = "res/versEnnemie/";
const VA_versAmi = "res/versAmi/";
const VA_map_courte = ["res/map/courte/map0.jpg","res/map/courte/map1.jpg","res/map/courte/map2.jpg","res/map/courte/map3.jpg","res/map/courte/map4.jpg"];
const VA_map_longue = ["res/map/longue/map0.jpg","res/map/longue/map1.jpg","res/map/longue/map2.jpg","res/map/longue/map3.jpg","res/map/longue/map4.jpg","res/map/longue/map5.jpg","res/map/longue/map6.jpg","res/map/longue/map7.jpg","res/map/longue/map8.jpg","res/map/longue/map9.jpg"];
var gaucheQuestion;
var droiteQuestion;
var amiVictoire;
var ennemieVictoire;
var amiDefaite;
var ennemieDefaite;

//Variables chrono
var idInterval = Array();
var chronoFin;
var chronoActuel;
const chronoLent = 10000;
const chronoMoyen = 7000;
const chronoRapide = 4000;

//Liste questions déjà faites dans la partie
var additionsFaites = new SizedArray(4);
var soustractionsFaites = new SizedArray(4);
var multiplicationsFaites = new SizedArray(4);
var divisionsFaites = new SizedArray(4);

//Fonctions principales de partie
function debutPartie() {
    //Création et set up des options de la partie
    partie = new Partie();
    
    partie.enPartie = true;
    partie.balleAuCentre = true;
    partie.equipeCentre = Math.round(Math.random());
    if(partie.equipeCentre == 0)
        partie.remiseAllie = true;
    else
        partie.remiseAllie = false;
    
    switch($(choixLongueur + " :selected").val())
    {
        case "courte":
            partie.tailleTerrain = 5;
            partie.indexCentre = 3;
            partie.indexTerrain = 3;
            partie.dureeMiTemps = 9;
            break;
        case "longue":
            partie.tailleTerrain = 7;
            partie.indexCentre = 4;
            partie.indexTerrain = 4;
            partie.dureeMiTemps = 15;
            break;
    }
    
    partie.typeExercice = typeExercice = $(choixExo + " :selected").val();
    partie.difficulte = difficulte = $(choixDiff + " :selected").val();
    partie.dureeChronometre = parseInt($(choixChrono + " :selected").val());
    
    //Remise à zéro des éléments d'anciennes parties possibles
    stopChrono();
    resetEventsPartie();
    viderListesQuestions();
    
    //TODO Modifier la partie graphique du lancement de partie
    //Elements graphiques
    $(jeu).clearCanvas();
    $(jeu).drawText({
        fillStyle: 'black',
        x: 500, y: 250,
        fontSize: 30,
        text: 'Le match va bientôt commencer !'
    });
    $(espace).show();
    $(espace).text("Continuer");
    
    //Perte de focus du bouton (évite les erreurs avec les touches)
    $(bouton).blur();
    
    //Evenement pour lancer la partie
    $(document).keypress(function(event) {
        if(event.keyCode == 32)
        {
            $(espace).hide();
            resetEventsPartie();
            partie();
        }
    });
    
    $(espace).click(function() {
        $(espace).hide();
        resetEventsPartie();
        partie();
    });
}

function avancement() {
    //Fin de mi-temps ?
    if(partie.indexQuestion >= partie.dureeMiTemps)
    {
        //Fin de partie ?
        if(partie.miTemps == 2)
        {
            //TODO Actions de fin de partie
        }
        else
        {
            //Remise à 0 des variables de mi-temps
            partie.miTemps += 1;
            partie.indexTerrain = partie.indexCentre;
            partie.balleAuCentre = true;
            if(partie.equipeCentre == 0)
                partie.versEnnemie = false;
            else
                partie.versEnnemie = true;
            partie.indexQuestion = 1;
            
            //Relance de partie
            debutBoucle();
        }
    }
    else
    {
        debutBoucle();
    }
    
    /*    
    //Match fini ?
    if(miTemps == 2)
    {
        let difference = scoreAmi - scoreEnnemie;
        let txt;
        if(difference > 0)
        {
            txt = "Match gagné";
            incrementerVariableLocale(LS_nbVictoires);
            
            //maj trophés difficulté victoire
            switch(difficulte) {
                case "tres-simple":
                    localStorage.setItem(T_matchTresFacile, true);
                    break;
                case "simple":
                    localStorage.setItem(T_matchFacile, true);
                    break;
                case "moyen":
                    localStorage.setItem(T_matchMoyen, true);
                    break;
                case "difficile":
                    localStorage.setItem(T_matchDifficile, true);
                    break;
                case "tres-difficile":
                    localStorage.setItem(T_matchTresDifficile, true);
                    break;
            }
            
        }
        else if(difference == 0)
            txt = "Match nul.";
        else
            txt = "Match perdu...";
        
        drawBase();
        $(jeu).drawText({
            fillStyle: 'black',
            x: 500, y:100,
            fontSize: 30,
            text: scoreAmi + " à " + scoreEnnemie
        }).drawText({
            fillStyle: 'black',
            x: 500, y: 300,
            fontSize: 30,
            text: txt
        });
        
        enPartie = false;
        localStorage.setItem(LS_enPartie, "false");
        
        resetEventsPartie();
        viderListesQuestions();
        viderVariablesParties();
        
        setUpCompte();*/
}

//TODO Réécrire/maj la fonction debutBoucle avec l'objet Partie, simplifier/séparer la partie choix affichage ?
/*
 * Sélection des assets à afficher
 * Création des questions/réponses
 * Affichage
 * Création event réponse
 */
function debutBoucle() {
    
    //TODO Choix obstacle
    
    //Création question, réponses, set touches
    creerQuestion();
    
    //TODO sélection des visuels pour la manche
    
    //évènements de réponse
    $(document).keydown(function(event) {
        let codes = [37,38,39,40];
        if(codes.includes(event.keyCode))
        {
            stopChrono();
            resetEvents();
            finBoucle(reponseBonne(event.keyCode));
        }
    });
    
    $(classfleche).click(function(event) {
        resetEvents();
        let fleche = event.target.id;
        switch(fleche) {
           case "haut":
               finBoucle(reponseBonne(question.reponseHaut));
               break;
           case "gauche":
               finBoucle(reponseBonne(question.reponseGauche));
               break;
           case "bas":
               finBoucle(reponseBonne(question.reponseBas));
               break;
           case "droite":
               finBoucle(reponseBonne(question.reponseDroite));
               break;
       }
    });
    
    //Chronomètre
    if(partie.dureeChronometre != 0)
        setChrono();
}

function finBoucle(reponseJuste) {
    //Mise à jour variables selon réponse & place sur le terrain
    partie.indexTerrain = partie.indexCentre;
    partie.indexQuestion += 1;
    
    if(reponseJuste)
    {
        compte.nombreBonneReponses += 1;
        
        //Au but adverse
        if(partie.indexTerrain == partie.tailleTerrain)
        {
            compte.nombreButs += 1;
            
            partie.butsAllies += 1;
            partie.balleAuCentre = true;
            partie.versEnnemie = false;
            
        }
        //Ailleur sur le terrain
        else
        {
            partie.indexTerrain += 1;
        }
    }
    else
    {
        //Au but allié
        if(partie.indexTerrain == 1)
        {
            partie.butsEnnemies += 1;
            partie.balleAuCentre = true;
            partie.versEnnemie = false;
        }
        //Ailleur sur le terrain
        else
        {
            partie.indexTerrain -= 1;
        }
    }
    
    //Affichage selon réponse & place sur le terrain
    //TODO Créer affichage post-réponse
    if(reponseJuste)
    {
        
    }
    else
    {
        
    }
    
    //TODO Créer event appuis espace pour continuer
}

//TODO Améliorer, simplifier ? DrawBase
function drawBase() {
    let map;
    if(tailleTerrain == tailleLongue)
        map = VA_map_longue[indexTerrain];
    else
        map = VA_map_courte[indexTerrain];
    
    $(jeu).drawRect({
        //Ciel
        fillStyle: '#3498db',
        x:0, y:0,
        fromCenter: false,
        width:1000, height:500
    }).drawRect({
        //Sol
        fillStyle: 'green',
        x:0 , y:460,
        width: 1000, height: 40,
        fromCenter: false
    }).drawText({
        fillStyle: 'black',
        x: 5, y: 5,
        fontSize: 20,
        text: "Mi-Temps " + (miTemps+1),
        fromCenter: false
    }).drawText({
        fillStyle: 'black',
        x: 5, y: 25,
        fontSize: 20,
        text: (indexPhase * tmpsPhase) + "e minute",
        fromCenter: false
    }).drawText({
        fillStyle: 'black',
        x: 500, y: 10,
        fontSize: 20,
        text: scoreAmi + " à " + scoreEnnemie,
        fromCenter: true
    }).drawImage({
        source: map,
        x: 1000-232, y:0,
        fromCenter: false
    });
}

//-------------------------------------------------------------------------

//Fonctions de création questions & réponses + affectations touches
let question;

//TODO Recréer entièrement création des questions/réponses, simplifier ou clarifier
function creerQuestion() {
    question = new Question();
    
    let diff = partie.difficulte;
    if(diff == "?")
    {
        let hsr = Math.random();
        if(hsr > 0.95)
            diff = ">>";
        else if(hsr > 0.86)
            diff = ">";
        else if(hsr > 0.43)
            diff = "=";
        else if(hsr > 0.2)
            diff = "<";
        else
            diff = "<<";
    }
    
    question.signe = partie.typeExercice;
    switch(partie.typeExercice){
        case "+" :
            creerAddition(diff);
            break;
        case "-":
            creerSoustraction(diff);
            break;
        case "*":
            creerMultiplication(diff);
            break;
        case "/":
            creerDivision(diff);
            break;
        default:
            let rdm = Math.random();
            if(rdm > 0.75)
            {
                question.signe = "+";
                creerAddition(diff);
            }
            else if(rdm > 0.5)
            {
                question.signe = "-";
                creerSoustraction(diff);
            }
            else if(rdm > 0.25)
            {
                question.signe = "*";
                creerMultiplication(diff);
            }
            else
            {
                question.signe = "/";
                creerDivision(diff);
            }
            break;
    }
    
    //Ajouter réponses dans les éléments cliquables
    $(haut).text(question.reponseHaut);
    $(bas).text(question.reponseBas);
    $(gauche).text(question.reponseGauche);
    $(droite).text(question.reponseDroite);
}

function creerAddition(diff) {
    let partieGauche;
    let partieDroite;
    let reponse;
    let enonce;
    let setReponse = new Array();
    let tmpReponse;
    let condition;

    do
    {
        switch(diff)
        {
            case "<<" :
                //Réponse < 10
                partieGauche = getRandomBetween(1,8);
                partieDroite = getRandomBetween(1, 9 - partieGauche);
                break;
            case "<" :
                //10 < Réponse < 19
                partieGauche = getRandomBetween(1,9);
                partieDroite = getRandomBetween(10 - partieGauche ,9);
                break;
            case "=" :
                //20 < Réponse < 69
                partieGauche = getRandomBetween(10, 50);
                partieDroite = getRandomBetween(10, 69 - partieGauche);
                break;
            case ">" :
                //20 < Réponse < 200
                partieGauche = getRandomBetween(10, 100);
                partieDroite = getRandomBetween(10, 100);
                break;
            case ">>" :
                //200 < Réponse < 999
                partieGauche = getRandomBetween(100, 899);
                partieDroite = getRandomBetween(100, 999 - partieGauche);
                break;
        }

        reponse = partieGauche + partieDroite;
        enonce = partieGauche + " + " + partieDroite;
    }
    while(additionsFaites.includes(enonce));

    setReponse.push(reponse);
    question.bonneReponse = reponse;

    for(let i = 0; i < 3; i++)
    {
        do
        {
            switch(diff)
            {
                case "<<" :
                    tmpReponse = getRandomBetween(1, 9);
                    break;
                case "<" :
                    tmpReponse = getRandomBetween(10, 19);
                    break;
                case "=" :
                    tmpReponse = getRandomBetween(Math.round(reponse * 0.75), Math.round(reponse * 1.25));
                    break;
                case ">" :
                    tmpReponse = getRandomBetween(Math.round(reponse * 0.87), Math.round(reponse * 1.13));
                    break;
                case ">>" :
                    tmpReponse = getRandomBetween(Math.round(reponse * 0.95), Math.round(reponse * 1.05));
                    break;
            }
        }
        while(setReponse.includes(tmpReponse))
        setReponse.push(reponse);
    }

    additionsFaites.addFirst(enonce);

    //TODO set up touches
    setTouches(setReponse);
}

function creerSoustraction(diff) {
    let partieGauche;
    let partieDroite;
    let reponse;
    let enonce;
    let setReponse = new Array();
    let tmpReponse;

    do
    {
        switch(diff)
        {
            case "<<" :
                //1 < Réponse < 8
                partieGauche = getRandomBetween(2, 9);
                partieDroite = getRandomBetween(1, partieGauche - 1);
                break;
            case "<" :
                //a > b, unité de a > b
                partieGauche = getRandomBetween(99, 12);
                partieDroite = getRandomBetween(1, partieGauche % 10);
                break;
            case "=" :
                //a > b, unité de a < b
                partieGauche = getRandomBetween(12, 98);
                partieDroite = getRandomBetween((partieGauche + 1) % 10, 9);
                break;
            case ">" :
                //Deux nombres à deux chiffres, réponse >= 0
                partieGauche = getRandomBetween(10, 99);
                partieDroite = getRandomBetween(10, partieGauche);
                break;
            case ">>" :
            //Deux nombres à 3 chiffres, réponse >= 0
                partieGauche = getRandomBetween(101, 999);
                partieDroite = getRandomBetween(100, partieGauche);
                break;
        }
        reponse = partieGauche - partieDroite;
        enonce = partieGauche + " - " + partieDroite;
    }
    while(soustractionsFaites.includes(enonce))

    setReponse.push(reponse);
    question.bonneReponse = reponse;

    for(let i = 0; i < 3; i++)
    {
        do
        {
            switch(diff)
            {
                case "<<" :
                    tmpReponse = getRandomBetween(1, 9);
                    break;
                case "<" :
                    tmpReponse = getRandomBetween(partieGauche - 12, partieGauche - 1);
                    break;
                case "=" :
                    tmpReponse = getRandomBetween(((partieGauche / 10) * 10) - 10, (partieGauche / 10) * 10);
                    break;
                case ">" :
                    tmpReponse = getRandomBetween(reponse * 0.90, reponse * 1.10);
                    break;
                case ">>" :
                    tmpReponse = getRandomBetween(reponse * 0.97, reponse * 1.03);
                    break;
            }
        }
        while(setReponse.includes(tmpReponse))
        setReponse.push(reponse);
    }

    soustractionsFaites.addFirst(enonce);

    //TODO set touches
    setTouches(setReponse);
}

function creerMultiplication(diff) {
    let partieGauche;
    let partieDroite;
    let reponse;
    let enonce;
    let setReponse = new Array();
    let tmpReponse;
    let condition;

    do
    {
        let rdm = Math.random();
        switch(diff)
        {
            case "<<" :
                if(rdm > 0.6)
                    partieGauche = 2;
                else if(rdm > 0.3)
                    partieGauche = 5;
                else
                    partieGauche = 10;
                partieDroite = getRandomBetween(1, 10);
                break;
            case "<" :
                if(rdm > 0.8)
                    partieGauche = 2;
                else if(rdm > 0.6)
                    partieGauche = 3;
                else if(rdm > 0.4)
                    partieGauche = 5;
                else if(rdm > 0.2)
                    partieGauche = 6;
                else
                    partieGauche = 10;
                partieDroite = getRandomBetween(1, 10);
                break;
            case "=" :
                partieGauche = getRandomBetween(1, 10);
                partieDroite = getRandomBetween(1, 10);
                break;
            case ">" :
                partieGauche = getRandomBetween(2, 10);
                partieDroite = getRandomBetween(5, 15);
                break;
            case ">>" :
                partieGauche = getRandomBetween(2, 10);
                partieDroite = getRandomBetween(15, 25);
                break;
        }
        reponse = partieGauche * partieDroite;
        enonce = partieGauche + " x " + partieDroite;
    }
    while(multiplicationsFaites.includes(enonce))

    setReponse.push(reponse);
    question.bonneReponse = reponse;

    for(let i = 0; i < 3; i++)
    {
        do
        {
            switch(diff)
            {
                case "<<" :
                    tmpReponse = gaucheQuestion * getRandomBetween(1, 10);
                    break;
                case "<" :
                    tmpReponse = gaucheQuestion * getRandomBetween(1, 10);
                    break;
                case "=" :
                    tmpReponse = gaucheQuestion * getRandomBetween(1, 10);
                    break;
                case ">" :
                    tmpReponse = gaucheQuestion * getRandomBetween(droiteQuestion - 4, droiteQuestion + 4);
                    break;
                case ">>" :
                    tmpReponse = gaucheQuestion * getRandomBetween(droiteQuestion - 2, droiteQuestion + 2);
                    break;
            }
        }
        while(setReponse.includes(tmpReponse))
        setReponse.push(reponse);
    }

    multiplicationsFaites.addFirst(enonce);

    //TODO set touches
    setTouches(setReponse);
}

function creerDivisionBIS(diff) {
    let partieGauche;
    let partieDroite;
    let reponse;
    let enonce;
    let setReponse = new Set();
    let tmpReponse;
    let rdm;

    do
    {
        rdm = Math.random();
        switch(diff)
        {
            case "<<" :
                if(Math.random() > 0.5)
                    partieDroite = 2;
                else
                    partieDroite = 10;
                break;
            case "<" :
                if(rdm > 0.6)
                    partieDroite = 2;
                else if(rdm > 0.3)
                    partieDroite = 3;
                else
                    partDeux = 10;
                break;
            case "=" :
                if(rdm > 0.8)
                    partieDroite = 2;
                else if(rdm > 0.6)
                    partieDroite = 3;
                else if(rdm > 0.4)
                    partieDroite = 4;
                else if(rdm > 0.2)
                    partieDroite = 5;
                else
                    partieDroite = 10;
                break;
            case ">" :
                if(rdm > 0.84)
                    partieDroite = 2;
                else if(rdm > 0.7)
                    partieDroite = 3;
                else if(rdm > 0.56)
                    partieDroite = 4;
                else if(rdm > 0.42)
                    partieDroite = 5;
                else if(rdm > 0.28)
                    partieDroite = 6;
                else if(rdm > 0.14)
                    partieDroite = 7;
                else
                    partieDroite = 10;
                break;
            case ">>" :
                partieDroite = getRandomBetween(2, 10);
                break;
        }
        partieGauche = getRandomBetween(1, 10) * partieDroite;
        reponse = partieGauche / partieDroite;
        enonce = partieGauche + " / " + partieDroite;
    }
    while(divisionsFaites.includes(enonce))

    setReponse.push(reponse);
    question.bonneReponse = reponse;

    for(let i = 0; i < 3; i++)
    {
        do
        {
            switch(diff)
            {
                case "<<" :
                    tmpReponse = getRandomBetween(1, 10);
                    break;
                case "<" :
                    tmpReponse = getRandomBetween(1, 10);
                    break;
                case "=" :
                    tmpReponse = getRandomBetween(1, 10);
                    break;
                case ">" :
                    tmpReponse = getRandomBetween(max(reponse - 4, 1), min(reponse + 4, 10));
                    break;
                case ">>" :
                    tmpReponse = getRandomBetween(max(reponse - 2, 1), min(reponse + 2, 10));
                    break;
            }
        }
        while(setReponse.includes(tmpReponse))
        setReponse.push(reponse);
    }

    divisionsFaites.addFirst(enonce);

    //TODO set touches blabla
    setTouches(setReponse);
}

//TODO Modifier méthode de vérification des réponses
function reponseBonne(key) {
    if(key != 0)
    {
        //Réponse choisie
        let reponseChoisie;
        switch(key) {
            case 37:
                reponseChoisie = $(gauche).text();
                break;

            case 38:
                reponseChoisie = $(haut).text();
                break;

            case 39:
                reponseChoisie = $(droite).text();
                break;

            case 40:
                reponseChoisie = $(bas).text();
                break;
        }

        if(parseInt(reponseChoisie) == question.bonneReponse)
            return true;
        else
            return false;
    }
}

function setTouches(reponses) {
    //Randomiser les réponses (méthode Durstenfeld)
    for (let i = reponses.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = reponses[i];
        reponses[i] = reponses[j];
        reponses[j] = temp;
    }

    for(let y = 0; y < 4; 0++)
    {
        $(fleches[y]).text(reponses[y]);
    }
    
    question.reponseHaut = reponses[0];
    question.reponseGauche = reponses[1];
    question.reponseBas = reponses[2];
    question.reponseDroite = reponses[3];
} 

//TODO Revoir viderListes avec l'objet SizedArray.
function viderListesQuestions() {
    additionsFaites = SizedArray(1);
    soustractionsFaites = SizedArray(1);
    multiplicationsFaites = SizedArray(1);
    divisionsFaites = SizedArray(1);
    obstaclesFaits = SizedArray(1);
}

function resetEvents()
{
    $(document).off("keydown");
    $(".fleche").off("click");
    $("#espace").off("click");
}

function getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Fonctions de chronomètre
function setChrono() {
    chronoActuel = 0;
    idInterval.push(setInterval(chronometre,10));
}

function chronometre() {
    chronoActuel += 10;
    
    //TODO Visuels du chronomètre
    
    if(chronoActuel == partie.dureeChronometre)
    {
        stopChrono();
        chronoActuel = 0;
        finBoucle(false);
    }
}

//TODO Revoir gestion intervals chrono + fin chrono
function stopChrono() {
    idInterval.forEach(function(id) {
        clearInterval(id);
    });
    
    idInterval = Array();
}