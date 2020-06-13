//Sélecteurs élements Jquery
const choixExo = "#exercice";
const choixDiff = "#difficulte";
const choixChrono = "#chrono";
const bouton = "#jouer";
const jeu =  "#jeu";
const classfleche = ".fleche";
const haut = "#haut";
const gauche = "#gauche";
const bas = "#bas";
const droite = "#droite";
const fleches = [haut, gauche, bas, droite];
const espace = "#espace";

//Variables localStorage (sauvegarde d'urgence)
const LS_enPartie = "enPartie"
const LS_versEnnemie = "versEnnemie";
const LS_nbPhases = "nbPhases";
const LS_indexPhase = "indexPhase";
const LS_scoreAmi = "scoreAmi";
const LS_scoreEnnemie = "scoreEnnemie";
const LS_miTemps = "miTemps";
const LS_typeExercice = "typeExercice";
const LS_difficulte = "difficulte";
const LS_chrono = "chrono";

//Variables de compte
const LS_nom = "nom";
const LS_nbVictoires = "nbVictoires";
const LS_nbButs = "nbButs";
const LS_nbBonnesReponses = "nbBonnesReponses";

//Valeurs chrono en millisecondes
const chronoLent = 10000;
const chronoMoyen = 7000;
const chronoRapide = 4000;

//Variables chrono
var idInterval = Array();
var chronoFin;
var chronoActuel;

//Variables parties
var enPartie;
var versEnnemie;
var nbPhases;
var tailleTerrain;
var indexPhase;
var miTemps;
var scoreAmi;
var scoreEnnemie;
var typeExercice;
var difficulte;
var chrono;
var question;
var bonneReponse;
var reponses = Array();
var obstacle;
var obstaclesFaits = Array();

//Nombre phases et taille terrain selon longueur partie
var phasesCourte = 9;
var phasesLongue = 15;
var tailleCourte = 4;
var tailleLongue = 6;

//Liste questions déjà faites dans la partie
var additionsFaites = Array();
var soustractionsFaites = Array();
var multiplicationsFaites = Array();
var divisionsFaites = Array();

//Var chemins vers images
var imgFoot = "res/foot/";
var icones = "res/icones/";

//TODO
function setUpSite() {
    //TODO
    /*
     * reset chrono
     * récup LS_enPartie
     * si == true
     *   proposer reprendre partie (afficher toutes info)
     *   events reprendre partie
     */
    
    /* EVENTS
        $(jeu).clearCanvas().drawText({
            fillStyle: 'black',
            x: $(jeu).width() /2, y: 100,
            fontSize: 20,
            text: 'Reprise de partie en mode '+ txt
        });
        
        $(document).keypress(function() {
            $(espace).off("click");
            $(document).off("keypress");
            fct();
        });
    */
}

function viderVariablesParties() {
    enPartie = false;
    versEnnemie = null;
    nbPhases = null;
    indexPhase = null;
    miTemps = null;
    scoreAmi = null;
    scoreEnnemie = null;
    typeExercice = null;
    difficulte = null;
    chrono = null;
    question = null;
    bonneReponse = null;
    reponses = Array();
    obstacle = null;
    obstaclesFaits = Array();
    
    localStorage.removeItem(LS_enPartie);
    localStorage.removeItem(LS_versEnnemie);
    localStorage.removeItem(LS_nbPhases);
    localStorage.removeItem(LS_indexPhase);
    localStorage.removeItem(LS_scoreAmi);
    localStorage.removeItem(LS_scoreEnnemie);
    localStorage.removeItem(LS_miTemps);
    localStorage.removeItem(LS_typeExercice);
    localStorage.removeItem(LS_difficulte);
    localStorage.removeItem(LS_chrono);
}

function viderListesQuestions() {
    additionsFaites = Array();
    soustractionsFaites = Array();
    multiplicationsFaites = Array();
    divisionsFaites = Array();
    obstaclesFaits = Array();
}

function resetEventsPartie() {
    $(document).off("keypress");
    $(document).off("keydown");
    $(classfleche).off("click");
    $(espace).off("click");
}

function majNom(val) {
    localStorage.setItem(nom, val);
}

//TODO
function setUpGame() {
    //TODO
    /*
     * reset chrono
     * récupérer les choix
     * lancer partie
     */
}

//TODO : réviser moment utilisé + récupération réponse (quand touche pressée)
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

        if(reponseChoisie.localeCompare(bonneReponse.toString())  == 0)
            return true;
        else
            return false;
    }
    else
        return false;
}

//Création question & assignation réponses aux touches
function creerQuestion() {
    //Reset réponses
    reponses = [];
    
    let diff = difficulte;
    
    if(diff == "aleatoire")
    {
        let rdm = Math.random();
        
        if(rdm > 0.95)
            diff = "tres-difficile";
        else if(rdm > 0.86)
            diff = "difficile";
        else if(rdm > 0.43)
            diff = "moyen";
        else if(rdm > 0.2)
            diff = "simple"
        else
            diff = "tres-simple";
    }
    
    switch(typeExercice) {
        case "+" :
            creerAddition(diff);
            break;
        case "-":
            creerSoustraction(diff);
            break;
        case "/":
            creerDivision(diff);
            break;
        case "*":
            creerMultiplication(diff);
            break;
        case "?":
            let rdm = Math.random();
            if(rdm > 0.75)
                creerAddition(diff);
            else if(rdm > 0.5)
                creerSoustraction(diff);
            else if(rdm > 0.25)
                creerMultiplication(diff);
            else
                creerDivision(diff);
            break;
    }
    
    setTouches();
}

//TODO : enlever chemin + simplifier ?
function setTouches() {
    let indexSelect;
    let flechesTemp = [haut, gauche, bas, droite];
    
    if(modeDeJeu == "chemin")
    {
        let flecheBonne;
        switch(obstacle){
            case 0:
                flecheBonne = haut;
                break;
            case 1:
                flecheBonne = gauche;
                break;
            case 2:
                flecheBonne = bas;
                break;
            case 3:
                flecheBonne = droite;
                break;
        }
        
        $(flecheBonne).text(reponses[0]);
        reponses.shift();
        flechesTemp.splice(flechesTemp.indexOf(flecheBonne), 1);
    }
        
    flechesTemp.forEach(function(fleche) {
        indexSelect = Math.floor(Math.random() * reponses.length);
        $(fleche).text(reponses[indexSelect]);
        reponses.splice(indexSelect, 1);
    });
}

//TODO : actualiser variables
function quizzComplet() {
    if(indexQuestion > nbQuestions)
        return true;
    else
        return false;
}

function creerAddition(diff) {
    let partUne;
    let partDeux;
    let reponseAddition;
    
    switch(diff){
        //Un chiffre, pas de retenue
        case "tres-simple":
            //Créer question & réponse juste
            do 
            {
                partUne = Math.ceil(Math.random() * (9 - 1) + 1);
                partDeux = Math.ceil(Math.random() * (9 - 1) + 1);
                bonneReponse = partUne + partDeux;
                question = partUne + " + " + partDeux;
            }
            while(bonneReponse >= 10 || additionsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    reponseAddition = Math.ceil(Math.random() * (10 - 1) + 1);
                }
                while(reponseAddition >= 10 || reponses.includes(reponseAddition));
                reponses[i] = reponseAddition;
            }
            break;
        
        //un chiffre avec retenue
        case "simple":
            //Créer question & réponse juste
            do 
            {
                partUne = Math.ceil(Math.random() * (9 - 2) + 2);
                partDeux = Math.ceil(Math.random() * (9 - 2) + 2);
                bonneReponse = partUne + partDeux;
                question = partUne + " + " + partDeux;
            }
            while(bonneReponse < 10 || additionsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    reponseAddition = Math.ceil(Math.random() * (20 - 10) + 10);
                }
                while(reponses.includes(reponseAddition));
                reponses[i] = reponseAddition;
            }
            break;
            
        //deux chiffres, total <= 69
        case "moyen":
            do 
            {
                partUne = Math.ceil(Math.random() * (50 - 10) + 10);
                partDeux = Math.ceil(Math.random() * (50 - 10) + 10);
                bonneReponse = partUne + partDeux;
                question = partUne + " + " + partDeux;
            }
            while(bonneReponse > 69 || additionsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    reponseAddition = Math.ceil(Math.random() * (69 - 20) + 20);
                }
                while(reponses.includes(reponseAddition));
                reponses[i] = reponseAddition;
            }
            break;
            
        //deux chiffres quelconques
        case "difficile":
            do
            {
            partUne = Math.ceil(Math.random() * (100 - 10) + 10);
            partDeux = Math.ceil(Math.random() * (100 - 10) + 10);
            bonneReponse = partUne + partDeux;
            reponses[0] = bonneReponse;
            question = partUne + " + " + partDeux;
            }
            while(additionsFaites.includes(question));
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    reponseAddition = Math.ceil(Math.random() * (200 - 20) + 20);
                }
                while(reponses.includes(reponseAddition));
                reponses[i] = reponseAddition;
            }
            break;
            
        //3 chiffres, résultat <= 999
        case "tres-difficile":
            do
            {
                partUne = Math.ceil(Math.random() * (1000 - 100) + 100);
                partDeux = Math.ceil(Math.random() * (1000 - 100) + 100);
                bonneReponse = partUne + partDeux;
                question = partUne + " + " + partDeux;
            }
            while(bonneReponse > 999 || additionsFaites.includes(question));
            
            reponses[0] = bonneReponse;
            
            //Créer réponses fausses
            for(let i = 1; i < 4; i++)
            {
                do
                {
                    reponseAddition = Math.ceil(Math.random() * (999 - 200) + 200);
                }
                while(reponses.includes(reponseAddition));
                reponses[i] = reponseAddition;
            }
            break;
    }
    
    if(additionsFaites.length == 5)
    {
        additionsFaites.shift();
    }
    
    additionsFaites.push(question);
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
                question = partUne + " * " + partDeux;
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
                question = partUne + " * " + partDeux;
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
                question = partUne + " * " + partDeux;
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
                question = partUne + " * " + partDeux;
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
                question = partUne + " * " + partDeux;
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

function incrementerVariableLocale(nomVariable) {
    let valeur = parseInt(localStorage.getItem(nomVariable));
    localStorage.setItem(nomVariable, valeur + 1);
}

function setChrono() {
    switch(chrono) {
        case "lent":
            chronoFin = chronoLent;
            break;
        case "moyen":
            chronoFin = chronoMoyen;
            break;
        case "rapide":
            chronoFin = chronoRapide;
            break;
    }
    
    chronoActuel = 0;
    
    idInterval.push(setInterval(chronometre,10));
}

//TODO : actualiser avec un seul mode
function chronometre() {
    
    chronoActuel += 10;
    let rad = (chronoActuel / chronoFin) * 360;
    
    $(jeu).drawArc({
        layer: true,
        name: 'chrono',
        strokeStyle: 'black',
        strokeWidth: 5,
        x: $(jeu).innerWidth()-15, y: 15,
        radius: 10,
        start: 0, end: rad
    });
    
    if(chronoActuel == chronoFin)
    {
        stopChrono();
        chronoActuel = 0;
        switch(modeDeJeu) {
            case "chemin":
                deroulementFinChemin(0);
                break;
            case "foot":
                deroulementFinFoot(0);
                break;
            case "soleil":
                deroulementFinSoleil(0);
                break;
        }
    }
}

function stopChrono() {
    idInterval.forEach(function(id) {
        clearInterval(id);
    });
    
    idInterval = Array();
}