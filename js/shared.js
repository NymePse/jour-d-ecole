//Sélecteurs élements Jquery
const choixMode = "#mode";
const choixExo = "#exercice";
const choixDiff = "#difficulte";
const choixChrono = "#chrono";
const bouton = "#jouer";
const jeu =  "#jeu";
const fleches = [haut, gauche, bas, droite];
const classfleche = ".fleche";
const haut = "#haut";
const gauche = "#gauche";
const bas = "#bas";
const droite = "#droite";
const espace = "#espace";

//Variables localStorage
const question = 'question';
const reponse = 'reponse'; //doit être suivi d'un nombre entre 0 et 3
const nbQuestion = 'nbQuestions';
const qstActuelle = 'qstActuelle';
const score = 'score';
const nbParties = 'nbParties';

function setUpSite() {
    $(bouton).bind("click", creerQuestion());
    localStorage.clear();
}

function setUpGame() {
    /*
     * Récupère les options
     * et lance une partie en fonction
     */
    
    let mode = $(choixMode + ' :selected').val();
    let exo = $(choixExo + ' :selected').val();
    let diff = $(choixDiff + ' :selected').val();
    let chrono = $(choixChrono + ' :selected').val();
    console.log(mode + exo + diff + chrono);
}

function reponseBonne(key) {
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