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

//Valeurs chrono en millisecondes
const chronoLent = 10000;
const chronoMoyen = 7000;
const chronoRapide = 4000;

//Variables chrono
var idInterval;
var chronoFin;
var chronoActuel;

function setUpSite() {
    localStorage.clear();
}

function setUpGame() {
    //Stop chrono si existant
    clearInterval(idInterval);
    
    /*
     * Récupère les options
     * et lance une partie en fonction
     */
    
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
    //Création de la question
    let qstPart1 = Math.ceil(Math.random() * (10 - 1) + 1);
    let qstPart2 = Math.ceil(Math.random() * (10 - 1) + 1);
    let qst = qstPart1 + '+' + qstPart2;
    let qstTotal = eval(qst);
    localStorage.setItem('question', qst);
    localStorage.setItem('reponse0', qstTotal);
    
    //Array de réponses + création des réponses fausses
    let reponses = Array(4);
    reponses[0] = qstTotal;
    let part;
    for(let i = 1; i < 4; i++) {
        if(Math.random() < 0.5)
        {
            part = qstTotal + Math.ceil(Math.random() * (5 - 1) + 1);
            while(reponses.includes(part))
                part = qstTotal + Math.ceil(Math.random() * (5 - 1) + 1);
        }
        else
        {
            part = qstTotal - Math.ceil(Math.random() * (5 - 1) + 1);
            while(reponses.includes(part))
                part = qstTotal - Math.ceil(Math.random() * (5 - 1) + 1);
        }
        localStorage.setItem('reponse' + i, part);
        reponses[i] = part;
    }
    
    //Affectation des réponses aux touches
    let indexSelect;
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

function creerAddition() {
    /*
     * si difficulté "facile"
     *   addition sous la dizaine
     * si difficulté "moyen"
     *   addition complément à la dizaine ou jusqu'à 19 max
     * si difficulté "difficile"
     *   addition jusqu'à 40 max
     */
}

function creerSoustraction() {
    /*
     * /!\ JAMAIS DE RESULTAT NEGATIF (nb 1 >= nb 2)
     * si difficulté "facile"
     *   soustraction sous la dizaine
     * si difficulté "moyen"
     *   soustraction au dessus de la dizaine, nb1 < 20
     * si difficulté "difficile"
     *   soustraction avec les dizaines, nb1 < 40
     */
}

function creerMultiplication() {
    /*
     * si difficulté "facile"
     *   
     * si difficulté "moyen"
     *    
     * si difficulté "difficile"
     *   
     */
}

function creerDivision() {
    /*
     * si difficulté "facile"
     *   
     * si difficulté "moyen"
     *   
     * si difficulté "difficile"
     *   
     */
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
    
    idInterval = setInterval(chronometre,10);
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
        clearInterval(idInterval);
        let mdj = localStorage.getItem(modeDeJeu);
        /*<option value="chemin">Chemin pour l'école</option>
                <option value="foot">Foot entre amis</option>
                <option value="soleil">1, 2, 3, Soleil !</option>
                */
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