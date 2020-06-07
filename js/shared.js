//Sélecteurs élements Jquery
const choixMode = "#mode";
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

//Variables localStorage
const question = "question"; //Contient le texte de la question
const reponse = "reponse"; //Réponses entre 0 et 3 (à rajouter à la création), la 0 est la bonne
const nbQuestions = "nbQuestions"; //Nombre de questions de la partie
const qstActuelle = "qstActuelle"; //Index question actuelle
const score = "score";
const nbParties = "nbParties"; //Nombre de parties
const prtActuelle = "prtActuelle"; //Index partie actuelle
const modeDeJeu = "modeDeJeu"; //choix mode de jeu
const typeExercice = "typeExercice"; //choix type exercice
const difficulte = "difficulte"; //choix difficulte
const chrono = "chrono"; //choix chrono
const journee = "journee"; //contient true si mode de jeu journée

//Variables de compte
const nom = "nom";

//Valeurs chrono en millisecondes
const chronoLent = 10000;
const chronoMoyen = 7000;
const chronoRapide = 4000;

//Variables chrono
var idInterval;
var chronoFin;
var chronoActuel;

//variables questions
var additionsFaites = Array();
var soustractionsFaites = Array();
var multiplicationsFaites = Array();
var divisionsFaites = Array();

function setUpSite() {
    idInterval = Array();
    
    let mdj = localStorage.getItem(modeDeJeu);
    let fct;
    let txt;
    
    if(mdj != null)
    {
        switch(mdj) {
            case "chemin":
                fct = deroulementDebutChemin;
                txt = mdj;
                break;
            case "foot":
                fct = deroulementDebutFoot;
                txt = mdj;
                break;
            case "soleil":
                fct = deroulementDebutSoleil;
                txt = "1, 2, 3, soleil";
                break;
        }
        
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
    }
}

function viderVariablesParties() {
    localStorage.removeItem(score);
    localStorage.removeItem(nbQuestions);
    localStorage.removeItem(qstActuelle);
    localStorage.removeItem(nbParties);
    localStorage.removeItem(prtActuelle);
    localStorage.removeItem(modeDeJeu);
    localStorage.removeItem(question);
    localStorage.removeItem(reponse + 0);
    localStorage.removeItem(reponse + 1);
    localStorage.removeItem(reponse + 2);
    localStorage.removeItem(reponse + 3);
}

function viderListesQuestions() {
    additionsFaites = Array();
    soustractionsFaites = Array();
    multiplicationsFaites = Array();
    divisionsFaites = Array();
}

function majNom(val) {
    localStorage.setItem(nom, val);
}

function setUpGame() {
    //Stop chrono si existant
    clearInterval(idInterval);
    
    //Reset journee
    localStorage.setItem(journee, false);
    
    //Enlever focus bouton
    $(bouton).blur();
    
    //Récupère les options et lance une partie en fonction
    let mode = $(choixMode + ' :selected').val();
    let exo = $(choixExo + ' :selected').val();
    let diff = $(choixDiff + ' :selected').val();
    let timer = $(choixChrono + ' :selected').val();
    localStorage.setItem(modeDeJeu, mode);
    localStorage.setItem(typeExercice, exo);
    localStorage.setItem(difficulte, diff);
    localStorage.setItem(chrono, timer);
    
    switch(mode) {
        case "chemin" :
            setUpChemin();
            $(bouton).blur();
            break;
        case "soleil" :
            setUpSoleil();
            $(bouton).blur();
            break;
        case "foot" :
            setUpFoot();
            $(bouton).blur();
            break;
        case "journee" :
            setUpJournee();
            break;
    }
}

//Retur true si bonne réponse donnée
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

        if(reponseChoisie.localeCompare(localStorage.getItem('reponse0')) == 0)
            return true;
        else
            return false;
    }
    else
        return false;
}

//Création question & assignation réponses aux touches
function creerQuestion() {
    let type = localStorage.getItem(typeExercice);
    let diff = localStorage.getItem(difficulte);
    
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
    
    switch(type) {
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
    
    //Affectation des réponses aux touches
    let indexSelect;
    let reponses = Array();
    
    for(let i = 0; i < 4; i++)
    {
        reponses.push(localStorage.getItem(reponse + i));
    }
        
    fleches.forEach(function(fleche) {
        indexSelect = Math.floor(Math.random() * reponses.length);
        $(fleche).text(reponses[indexSelect]);
        reponses.splice(indexSelect, 1);
    });
}

//Compare qstActuelle à nbQuestion, return true si égal (toutes questions faites)
function quizzComplet() {
    let index = parseInt(localStorage.getItem('qstActuelle'));
    let max = parseInt(localStorage.getItem(nbQuestions));
    
    if(index >= max)
        return true;
    else
        return false;
}

function creerAddition(diff) {
    
    let partUne;
    let partDeux;
    let reponseAddition;
    let reponses = Array();
    let stringQuestion;
    
    switch(diff){
        //Un chiffre, pas de retenue
        case "tres-simple":
            //Créer question & réponse juste
            do 
            {
                partUne = Math.ceil(Math.random() * (9 - 1) + 1);
                partDeux = Math.ceil(Math.random() * (9 - 1) + 1);
                reponseAddition = partUne + partDeux;
                stringQuestion = partUne + " + " + partDeux;
            }
            while(reponseAddition >= 10 || additionsFaites.includes(stringQuestion));
            
            reponses[0] = reponseAddition;
            
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
                reponseAddition = partUne + partDeux;
                stringQuestion = partUne + " + " + partDeux;
            }
            while(reponseAddition < 10 || additionsFaites.includes(stringQuestion));
            
            reponses[0] = reponseAddition;
            
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
                reponseAddition = partUne + partDeux;
                stringQuestion = partUne + " + " + partDeux;
            }
            while(reponseAddition > 69 || additionsFaites.includes(stringQuestion));
            
            reponses[0] = reponseAddition;
            
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
            reponseAddition = partUne + partDeux;
            reponses[0] = reponseAddition;
            stringQuestion = partUne + " + " + partDeux;
            }
            while(additionsFaites.includes(stringQuestion));
            
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
                reponseAddition = partUne + partDeux;
                stringQuestion = partUne + " + " + partDeux;
            }
            while(reponseAddition > 999 || additionsFaites.includes(stringQuestion));
            
            reponses[0] = reponseAddition;
            
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
    
    for(let y = 0; y < 4; y++)
    {
        localStorage.setItem(reponse + y, reponses[y]);
    }
    
    if(additionsFaites.length == 5)
    {
        additionsFaites.shift();
    }
    
    additionsFaites.push(stringQuestion);
    
    localStorage.setItem(question, stringQuestion);
    
    
}

function creerSoustraction(diff) {
    
    let partUne;
    let partDeux;
    let reponseSoustraction;
    let reponses = Array();
    let stringQuestion;
    
    switch(diff){
        //un chiffre
        case "tres-simple":
            //Créer question & réponse juste
            do 
            {
                partUne = Math.ceil(Math.random() * (9 - 1) + 1);
                partDeux = Math.ceil(Math.random() * (9 - 1) + 1);
                reponseSoustraction = partUne - partDeux;
                stringQuestion = partUne + " - " + partDeux;
            }
            while(reponseSoustraction < 0 || soustractionsFaites.includes(stringQuestion));
            
            reponses[0] = reponseSoustraction;
            
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
                reponseSoustraction = partUne - partDeux;
                stringQuestion = partUne + " - " + partDeux;
            }
            while((partUne % 10) < partDeux || soustractionsFaites.includes(stringQuestion));
            
            reponses[0] = reponseSoustraction;
            
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
                reponseSoustraction = partUne - partDeux;
                stringQuestion = partUne + " - " + partDeux;
            }
            while((partUne % 10) >= partDeux || soustractionsFaites.includes(stringQuestion));
            
            reponses[0] = reponseSoustraction;
            
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
                reponseSoustraction = partUne - partDeux;
                stringQuestion = partUne + " - " + partDeux;
            }
            while(reponseSoustraction < 0 || soustractionsFaites.includes(stringQuestion));
            
            reponses[0] = reponseSoustraction;
            
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
                reponseSoustraction = partUne - partDeux;
                stringQuestion = partUne + " - " + partDeux;
            }
            while(reponseSoustraction < 0 || soustractionsFaites.includes(stringQuestion));
            
            reponses[0] = reponseSoustraction;
            
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
    
    for(let y = 0; y < 4; y++)
    {
        localStorage.setItem(reponse + y, reponses[y]);
    }
    
    if(soustractionsFaites.length == 5)
        soustractionsFaites.shift();
    
    soustractionsFaites.push(stringQuestion);
    
    localStorage.setItem(question, stringQuestion);
}

function creerMultiplication(diff) {
    
    let partUne;
    let partDeux;
    let reponseSoustraction;
    let reponses = Array();
    let rdm;
    let stringQuestion;
    
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
                reponseSoustraction = partUne * partDeux;
                stringQuestion = partUne + " * " + partDeux;
            }
            while(multiplicationsFaites.includes(stringQuestion));
            
            reponses[0] = reponseSoustraction;
            
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
                reponseSoustraction = partUne * partDeux;
                stringQuestion = partUne + " * " + partDeux;
            }
            while(multiplicationsFaites.includes(stringQuestion));
            
            reponses[0] = reponseSoustraction;
            
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
                reponseSoustraction = partUne * partDeux;
                stringQuestion = partUne + " * " + partDeux;
            }
            while(multiplicationsFaites.includes(stringQuestion));
            
            reponses[0] = reponseSoustraction;
            
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
                reponseSoustraction = partUne * partDeux;
                stringQuestion = partUne + " * " + partDeux;
            }
            while(multiplicationsFaites.includes(stringQuestion));
            
            reponses[0] = reponseSoustraction;
            
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
                reponseSoustraction = partUne * partDeux;
                stringQuestion = partUne + " * " + partDeux;
            }
            while(multiplicationsFaites.includes(stringQuestion));
            
            reponses[0] = reponseSoustraction;
            
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
    
    for(let y = 0; y < 4; y++)
    {
        localStorage.setItem(reponse + y, reponses[y]);
    }
    
    if(multiplicationsFaites.length == 5)
        multiplicationsFaites.shift();
    
    multiplicationsFaites.push(stringQuestion);
    
    localStorage.setItem(question, stringQuestion);
}

function creerDivision(diff) {
    let partUne;
    let partDeux;
    let reponseSoustraction;
    let reponses = Array();
    let rdm;
    let stringQuestion;
    
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
                reponseSoustraction = Math.ceil(Math.random() * (10 - 1) + 1);
                partUne = partDeux * reponseSoustraction;
                stringQuestion = partUne + " / " + partDeux;
            }
            while(divisionsFaites.includes(stringQuestion));
            
            
            
            reponses[0] = reponseSoustraction;
            
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
                reponseSoustraction = Math.ceil(Math.random() * (10 - 1) + 1);
                partUne = partDeux * reponseSoustraction;
                stringQuestion = partUne + " / " + partDeux;
            }
            while(divisionsFaites.includes(stringQuestion));
            
            reponses[0] = reponseSoustraction;
            
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
                reponseSoustraction = Math.ceil(Math.random() * (10 - 1) + 1);
                partUne = partDeux * reponseSoustraction;
                stringQuestion = partUne + " / " + partDeux;
            }
            while(divisionsFaites.includes(stringQuestion));
            
            reponses[0] = reponseSoustraction;
            
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
                reponseSoustraction = Math.ceil(Math.random() * (10 - 1) + 1);
                partUne = partDeux * reponseSoustraction;
                stringQuestion = partUne + " / " + partDeux;
            }
            while(divisionsFaites.includes(stringQuestion));
            
            reponses[0] = reponseSoustraction;
            
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
                reponseSoustraction = Math.ceil(Math.random() * (10 - 1) + 1);
                partUne = partDeux * reponseSoustraction;
                stringQuestion = partUne + " / " + partDeux;
            }
            while(divisionsFaites.includes(stringQuestion));
            
            reponses[0] = reponseSoustraction;
            
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
    
    for(let y = 0; y < 4; y++)
    {
        localStorage.setItem(reponse + y, reponses[y]);
    }
    
    if(divisionsFaites.length == 5)
        divisionsFaites.shift();
    
    divisionsFaites.push(stringQuestion);
    
    localStorage.setItem(question, stringQuestion);
}

function incrementerVariableLocale(nomVariable) {
    let valeur = parseInt(localStorage.getItem(nomVariable));
    localStorage.setItem(nomVariable, valeur + 1);
}

function setChrono() {
    let diffChrono = localStorage.getItem(chrono);
    switch(diffChrono) {
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

function chronometre() {
    $(jeu).clearCanvas({
        x: $(jeu).width() - 20, width: 20,
        y: 0, height: 20
    });
    
    chronoActuel += 10;
    let rad = (chronoActuel / chronoFin) * 360;
    
    $(jeu).drawArc({
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
        let mdj = localStorage.getItem(modeDeJeu);
        switch(mdj) {
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
    $(jeu).clearCanvas({
        x: $(jeu).width() - 20, width: 20,
        y: 0, height: 20
    });
}