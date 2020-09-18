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
    let setReponse = new Set();
    let tmpReponse;
    
    switch(diff){
        //Un chiffre, pas de retenue
        case "<<":
            //Créer question & réponse juste
            do 
            {
                partieGauche = getRandomBetween(1,9);
                partieDroite = getRandomBetween(1,9);
                reponse = partieGauche + partieDroite;
                enonce = partieGauche + " + " + partieDroite;
            }
            while(reponse >= 10 || additionsFaites.includes(enonce));
            
            setReponse.add(reponse);
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    tmpReponse = getRandomBetween(1, 10);
                }
                while(setReponse.has(tmpReponse));
                setReponse.add(tmpReponse);
            }
            break;
        
        //un chiffre avec retenue
        case "simple":
            //Créer question & réponse juste
            do 
            {
                partieGauche = getRandomBetween(1, 9);
                partieDroite = getRandomBetween(1, 9);
                reponse = partieGauche + partieDroite;
                enonce = partieGauche + " + " + partieDroite;
            }
            while(reponse < 10 || additionsFaites.includes(enonce));
            
            setReponse.add(reponse);
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    tmpReponse = getRandomBetween(1, 19);
                }
                while(setReponse.add(tmpReponse));
                setReponse.add(tmpReponse);
            }
            break;
            
        //deux chiffres, total <= 69
        case "moyen":
            do 
            {
                partieGauche = getRandomBetween(10, 50);
                partieDroite = getRandomBetween(10, 50);
                reponse = partieGauche + partieDroite;
                enonce = partieGauche + " + " + partieDroite;
            }
            while(bonneReponse > 69 || additionsFaites.includes(enonce));
            
            setReponse.add(reponse);
            
            //Créer réponses fausses
            //TODO Créer mauvaises réponses selon bonne réponse &/Ou énoncé
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    tmpReponse = getRandomBetween(20, 69);
                }
                while(setReponse.has(tmpReponse));
                setReponse.add(tmpReponse);
            }
            break;
            
        //deux chiffres quelconques
        case "difficile":
            do
            {
                partieGauche = getRandomBetween(10, 100);
                partieDroite = getRandomBetween(10, 100);
                reponse = partieGauche + partieDroite;
                enonce = partieGauche + " + " + partieDroite;
            }
            while(additionsFaites.includes(enonce));
            
            setReponse.add(reponse);
            
            //Créer réponses fausses
            //TODO Créer mauvaises réponses selon bonne réponse &/Ou énoncé
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    tmpReponse = getRandomBetween(20, 200);
                }
                while(setReponse.has(tmpReponse));
                setReponse.add(tmpReponse);
            }
            break;
            
        //3 chiffres, résultat <= 999
        case "tres-difficile":
            do
            {
                partieGauche = getRandomBetween(100, 1000);
                partieDroite = getRandomBetween(100, 1000);
                reponse = partieGauche + partieDroite;
                enonce = partieGauche + " + " + partieDroite;
            }
            while(reponse > 999 || additionsFaites.includes(enonce));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            //TODO Créer mauvaises réponses selon bonne réponse &/Ou énoncé
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    tmpReponse = getRandomBetween(200, 999);
                }
                while(setReponse.has(tmpReponse));
                setReponse.add(tmpReponse);
            }
            break;
    }
    
    additionsFaites.addFirst(enonce);
}

function creerSoustraction(diff) {
    
    let partUne;
    let partDeux;
    let reponseSoustraction;
    
    switch(diff){
        //un chiffre
        case "tres-simple":
            //Créer question & réponse juste
            do 
            {
                partUne = Math.ceil(Math.random() * (9 - 1) + 1);
                partDeux = Math.ceil(Math.random() * (9 - 1) + 1);
                bonneReponse = partUne - partDeux;
                question = partUne + " - " + partDeux;
            }
            while(bonneReponse < 0 || soustractionsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    reponseSoustraction = Math.ceil(Math.random() * (9 - 0) + 0);
                }
                while(reponses.includes(reponseSoustraction));
                reponses[i] = reponseSoustraction;
            }
            break;
        
        //a - b, deux chiffres pour a et un pour b, le dernier chiffre de a est plus grand que b
        case "simple":
            //Créer question & réponse juste
            do 
            {
                partUne = Math.ceil(Math.random() * (99 - 12) + 12);
                partDeux = Math.ceil(Math.random() * (9 - 1) + 1);
                bonneReponse = partUne - partDeux;
                question = partUne + " - " + partDeux;
            }
            while((partUne % 10) < partDeux || soustractionsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    if(Math.random() > 0.5)
                        reponseSoustraction = reponses[0] + Math.ceil(Math.random() * (10 - 1) + 1);
                    else
                        reponseSoustraction = reponses[0] - Math.ceil(Math.random() * (10 - 1) + 1);
                }
                while(reponses.includes(reponseSoustraction));
                reponses[i] = reponseSoustraction;
            }
            break;
            
        //idem, sauf que le dernier chiffre de a est plus petit que b
        case "moyen":
            //Créer question & réponse juste
            do 
            {
                partUne = Math.ceil(Math.random() * (99 - 12) + 12);
                partDeux = Math.ceil(Math.random() * (9 - 1) + 1);
                bonneReponse = partUne - partDeux;
                question = partUne + " - " + partDeux;
            }
            while((partUne % 10) >= partDeux || soustractionsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    if(Math.random() > 0.5)
                        reponseSoustraction = reponses[0] + Math.ceil(Math.random() * (15 - 1) + 1);
                    else
                        reponseSoustraction = reponses[0] - Math.ceil(Math.random() * (15 - 1) + 1);
                }
                while(reponses.includes(reponseSoustraction));
                reponses[i] = reponseSoustraction;
            }
            break;
            
        //deux chiffres
        case "difficile":
            //Créer question & réponse juste
            do 
            {
                partUne = Math.ceil(Math.random() * (99 - 10) + 10);
                partDeux = Math.ceil(Math.random() * (99 - 10) + 10);
                bonneReponse = partUne - partDeux;
                question = partUne + " - " + partDeux;
            }
            while(bonneReponse < 0 || soustractionsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    if(Math.random() > 0.5)
                        reponseSoustraction = reponses[0] + Math.ceil(Math.random() * (10 - 1) + 1);
                    else
                        reponseSoustraction = reponses[0] - Math.ceil(Math.random() * (10 - 1) + 1);
                }
                while(reponses.includes(reponseSoustraction));
                reponses[i] = reponseSoustraction;
            }
            break;
            
        //a - b, 3 chiffres pour a et 2 pour b
        case "tres-difficile":
            //Créer question & réponse juste
            do 
            {
                partUne = Math.ceil(Math.random() * (999 - 100) + 100);
                partDeux = Math.ceil(Math.random() * (99 - 10) + 10);
                bonneReponse = partUne - partDeux;
                question = partUne + " - " + partDeux;
            }
            while(bonneReponse < 0 || soustractionsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    if(Math.random() > 0.5)
                        reponseSoustraction = reponses[0] + Math.ceil(Math.random() * (15 - 1) + 1);
                    else
                        reponseSoustraction = reponses[0] - Math.ceil(Math.random() * (15 - 1) + 1);
                }
                while(reponses.includes(reponseSoustraction));
                reponses[i] = reponseSoustraction;
            }
            break;
    }
    
    if(soustractionsFaites.length == 5)
        soustractionsFaites.shift();
    
    soustractionsFaites.push(question);
}

function creerMultiplication(diff) {
    let partUne;
    let partDeux;
    let reponseSoustraction;
    let rdm;
    
    switch(diff){
        // table de 2 et 10
        case "tres-simple":
            //Créer question & réponse juste
            do
            {
                if(Math.random() > 0.5)
                    partUne = 2;
                else
                    partUne = 10;
                partDeux = Math.ceil(Math.random() * (10 - 0) + 0);
                bonneReponse = partUne * partDeux;
                question = partUne + " x " + partDeux;
            }
            while(multiplicationsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    reponseSoustraction = partUne * Math.ceil(Math.random() * (10 - 0) + 0);
                }
                while(reponses.includes(reponseSoustraction));
                reponses[i] = reponseSoustraction;
            }
            break;
        
        //2, 3 et 10
        case "simple":
            //Créer question & réponse juste
            do
            {
                rdm = Math.random();
                if(rdm > 0.6)
                    partUne = 2;
                else if(rdm > 0.3)
                    partUne = 3;
                else
                    partUne = 10;
                partDeux = Math.ceil(Math.random() * (10 - 0) + 0);
                bonneReponse = partUne * partDeux;
                question = partUne + " x " + partDeux;
            }
            while(multiplicationsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    reponseSoustraction = partUne * Math.ceil(Math.random() * (10 - 0) + 0);
                }
                while(reponses.includes(reponseSoustraction));
                reponses[i] = reponseSoustraction;
            }
            break;
            
        //2, 3, 4, 5, 10
        case "moyen":
            //Créer question & réponse juste
            do
            {
                rdm = Math.random();
                if(rdm > 0.8)
                    partUne = 2;
                else if(rdm > 0.6)
                    partUne = 3;
                else if(rdm > 0.4)
                    partUne = 4;
                else if(rdm > 0.2)
                    partUne = 5;
                else
                    partUne = 10;
                partDeux = Math.ceil(Math.random() * (10 - 0) + 0);
                bonneReponse = partUne * partDeux;
                question = partUne + " x " + partDeux;
            }
            while(multiplicationsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    reponseSoustraction = partUne * Math.ceil(Math.random() * (10 - 0) + 0);
                }
                while(reponses.includes(reponseSoustraction));
                reponses[i] = reponseSoustraction;
            }
            break;
            
        //2, 3, 4, 5, 6, 7, 10
        case "difficile":
            //Créer question & réponse juste
            do
            {
                rdm = Math.random();
                if(rdm > 0.84)
                    partUne = 2;
                else if(rdm > 0.7)
                    partUne = 3;
                else if(rdm > 0.56)
                    partUne = 4;
                else if(rdm > 0.42)
                    partUne = 5;
                else if(rdm > 0.28)
                    partUne = 6;
                else if(rdm > 0.14)
                    partUne = 7;
                else
                    partUne = 10;
                partDeux = Math.ceil(Math.random() * (10 - 0) + 0);
                bonneReponse = partUne * partDeux;
                question = partUne + " x " + partDeux;
            }
            while(multiplicationsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    reponseSoustraction = partUne * Math.ceil(Math.random() * (10 - 0) + 0);
                }
                while(reponses.includes(reponseSoustraction));
                reponses[i] = reponseSoustraction;
            }
            break;
            
        //toutes les tables
        case "tres-difficile":
            //Créer question & réponse juste
            do
            {
                rdm = Math.random();
                if(rdm > 0.88)
                    partUne = 2;
                else if(rdm > 0.77)
                    partUne = 3;
                else if(rdm > 0.66)
                    partUne = 4;
                else if(rdm > 0.55)
                    partUne = 5;
                else if(rdm > 0.44)
                    partUne = 6;
                else if(rdm > 0.33)
                    partUne = 7;
                else if(rdm > 0.22)
                    partUne = 8;
                else if(rdm > 0.11)
                    partUne = 9;
                else
                    partUne = 10;
                partDeux = Math.ceil(Math.random() * (10 - 0) + 0);
                bonneReponse = partUne * partDeux;
                question = partUne + " x " + partDeux;
            }
            while(multiplicationsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    reponseSoustraction = partUne * Math.ceil(Math.random() * (10 - 0) + 0);
                }
                while(reponses.includes(reponseSoustraction));
                reponses[i] = reponseSoustraction;
            }
            break;
    }
    
    if(multiplicationsFaites.length == 5)
        multiplicationsFaites.shift();
    
    multiplicationsFaites.push(question);
}

function creerDivision(diff) {
    let partUne;
    let partDeux;
    let reponseSoustraction;
    let rdm;
    
    switch(diff){
        // table de 2 et 10
        case "tres-simple":
            //Créer question & réponse juste
            do
            {
                if(Math.random() > 0.5)
                    partDeux = 2;
                else
                    partDeux = 10;
                bonneReponse = Math.ceil(Math.random() * (10 - 1) + 1);
                partUne = partDeux * bonneReponse;
                question = partUne + " / " + partDeux;
            }
            while(divisionsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    reponseSoustraction = Math.ceil(Math.random() * (10 - 1) + 1);
                }
                while(reponses.includes(reponseSoustraction));
                reponses[i] = reponseSoustraction;
            }
            break;
        
        //2, 3 et 10
        case "simple":
            //Créer question & réponse juste
            do
            {
                rdm = Math.random();
                if(rdm > 0.6)
                    partDeux = 2;
                else if(rdm > 0.3)
                    partDeux = 3;
                else
                    partDeux = 10;
                bonneReponse = Math.ceil(Math.random() * (10 - 1) + 1);
                partUne = partDeux * bonneReponse;
                question = partUne + " / " + partDeux;
            }
            while(divisionsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    reponseSoustraction = Math.ceil(Math.random() * (10 - 1) + 1);
                }
                while(reponses.includes(reponseSoustraction));
                reponses[i] = reponseSoustraction;
            }
            break;
            
        //2, 3, 4, 5, 10
        case "moyen":
            //Créer question & réponse juste
            do
            {
                rdm = Math.random();
                if(rdm > 0.8)
                    partDeux = 2;
                else if(rdm > 0.6)
                    partDeux = 3;
                else if(rdm > 0.4)
                    partDeux = 4;
                else if(rdm > 0.2)
                    partDeux = 5;
                else
                    partDeux = 10;
                bonneReponse = Math.ceil(Math.random() * (10 - 1) + 1);
                partUne = partDeux * bonneReponse;
                question = partUne + " / " + partDeux;
            }
            while(divisionsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    reponseSoustraction = Math.ceil(Math.random() * (10 - 1) + 1);
                }
                while(reponses.includes(reponseSoustraction));
                reponses[i] = reponseSoustraction;
            }
            break;
            
        //2, 3, 4, 5, 6, 7, 10
        case "difficile":
            //Créer question & réponse juste
            do
            {
                rdm = Math.random();
                if(rdm > 0.84)
                    partDeux = 2;
                else if(rdm > 0.7)
                    partDeux = 3;
                else if(rdm > 0.56)
                    partDeux = 4;
                else if(rdm > 0.42)
                    partDeux = 5;
                else if(rdm > 0.28)
                    partDeux = 6;
                else if(rdm > 0.14)
                    partDeux = 7;
                else
                    partDeux = 10;
                bonneReponse = Math.ceil(Math.random() * (10 - 1) + 1);
                partUne = partDeux * bonneReponse;
                question = partUne + " / " + partDeux;
            }
            while(divisionsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    reponseSoustraction = Math.ceil(Math.random() * (10 - 1) + 1);
                }
                while(reponses.includes(reponseSoustraction));
                reponses[i] = reponseSoustraction;
            }
            break;
            
        //toutes les tables
        case "tres-difficile":
            //Créer question & réponse juste
            do
            {
                rdm = Math.random();
                if(rdm > 0.88)
                    partDeux = 2;
                else if(rdm > 0.77)
                    partDeux = 3;
                else if(rdm > 0.66)
                    partDeux = 4;
                else if(rdm > 0.55)
                    partDeux = 5;
                else if(rdm > 0.44)
                    partDeux = 6;
                else if(rdm > 0.33)
                    partDeux = 7;
                else if(rdm > 0.22)
                    partDeux = 8;
                else if(rdm > 0.11)
                    partDeux = 9;
                else
                    partDeux = 10;
                bonneReponse = Math.ceil(Math.random() * (10 - 1) + 1);
                partUne = partDeux * bonneReponse;
                question = partUne + " / " + partDeux;
            }
            while(divisionsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    reponseSoustraction = Math.ceil(Math.random() * (10 - 1) + 1);
                }
                while(reponses.includes(reponseSoustraction));
                reponses[i] = reponseSoustraction;
            }
            break;
    }
    
    if(divisionsFaites.length == 5)
        divisionsFaites.shift();
    
    divisionsFaites.push(question);
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