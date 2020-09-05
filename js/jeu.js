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

//Variables parties
var enPartie;
var versEnnemie;
var balleAuCentre;
var balleCentreMT1;
var nbPhases;
var tailleTerrain;
var indexPhase;
var indexTerrain;
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

//TODO Update les liste questions avec des SizedArray
//Liste questions déjà faites dans la partie
var additionsFaites = Array();
var soustractionsFaites = Array();
var multiplicationsFaites = Array();
var divisionsFaites = Array();

//TODO Réecrire/maj la fonction introduction (fusion fonction setUpGame ?) avec objet Partie
/*
 * (si fusion)
 * Créer un objet Partie
 * Récupérer les valeurs d'options de partie
 * Mettre à jour l'objet Partie
 * Sauvegarder l'objet Partie
 * 
 * (en tout cas)
 * Afficher début de partie
 * Créer event touches lancer la partie
 */
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
            partie.indexTerrain = 3;
            partie.dureeMiTemps = 9;
            break;
        case "longue":
            partie.tailleTerrain = 7;
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

//TODO Réecrire/maj la fonction partie avec l'objet Compte et Partie
/*
 * Vérifier fin de mi-temps
 * Vérifier fin de match
 *  si oui :
 *      maj scores compte
 *      maj trophés
 *      affichage fin de partie
 *      supprimer objet Partie
 *      maj compte, events, vider questions...
 *  si non :
 *      debutBoucle()
 */
function avancement() {
    /*
     * si indexPhase > nbPhases
     *   miTemps++;
     *   indexPhase = 0;
     * si miTemps < 2
     *   debutBoucle();
     * sinon
     *   afficher score final;
     *   afficher texte selon score;
     *   maj compte;
     *   setUpCompte();
     */
    
    //Mi-temps finie ?
    if(indexPhase > nbPhases)
    {
        miTemps++;
        indexPhase = 0;
        
        if(balleCentreMT1 == 0)
            balleAuCentre = 1;
        else
            balleAuCentre = 0;
        
        localStorage.setItem(LS_miTemps, miTemps);
        localStorage.setItem(LS_indexPhase, indexPhase);
    }
    
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
        
        setUpCompte();
    }
    else
        debutBoucle();
}

//TODO Réécrire/maj la fonction debutBoucle avec l'objet Partie, simplifier/séparer la partie choix affichage ?
/*
 * Sélection des assets à afficher
 * Création des questions/réponses
 * Affichage
 * Création event réponse
 */
function debutBoucle() {
    /*
     * choisis obstacle
     * créer question, réponses, set touches
     * affichage selon place dans le terrain
     * event réponse
     */
    
    //Choix obstacle
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
    
    //Création question, réponses, set touches
    creerQuestion();
    
    //Sélection éléments affichage (pendant question, victoire et échec)
    //Balle au centre ?
    if(balleAuCentre != 2)
    {
        //Balle à ami ?
        if(balleAuCentre == 0)
        {
            gaucheQuestion = VA_balleAuCentre + "centre_ami_ballon.png";
            droiteQuestion = VA_balleAuCentre + "centre_ennemie.png";
        }
        else
        {
            gaucheQuestion = VA_balleAuCentre + "centre_ami.png";
            droiteQuestion = VA_balleAuCentre + "centre_ennemie_ballon.png";
        }
        
        ennemieVictoire = VA_balleAuCentre + "centre_ennemie.png";
        amiVictoire = VA_balleAuCentre + "victoire_ami.png";
                
        ennemieDefaite = VA_balleAuCentre + "defaite_ennemie.png";
        amiDefaite = VA_balleAuCentre + "centre_ami.png";
        
        balleAuCentre = 2;
    }
    else
    {
        //Vers buts ennemies ? 
        if(versEnnemie)
        {
            //Devant le but ennemie ?
            if(indexTerrain == tailleTerrain)
            {
                gaucheQuestion = VA_versEnnemie + "ami_run.png";
                droiteQuestion = VA_versEnnemie + "but.png";
                
                amiVictoire = VA_versEnnemie + "but_marque.png";
                ennemieVictoire = VA_versEnnemie + "but.png";
                
                amiDefaite = VA_versEnnemie + "defaite_ami.png";
                ennemieDefaite = VA_versEnnemie + "but.png";
            }
            else
            {
                gaucheQuestion = VA_versEnnemie + "ami_run.png";
                droiteQuestion = VA_versEnnemie + "ennemie_run.png";
                
                ennemieVictoire = VA_versEnnemie + "defaite_ennemie.png";
                amiVictoire = VA_versEnnemie + "ami_run.png";
                
                ennemieDefaite = VA_versEnnemie + "victoire_ennemie.png";
                amiDefaite = VA_versEnnemie + "defaite_ami.png";
            }
        }
        else
        {
            //Devant le but ami ?
            if(indexTerrain == 0)
            {
                gaucheQuestion = VA_versAmi + "but.png";
                droiteQuestion = VA_versAmi + "ennemie_run.png";
                
                ennemieDefaite = VA_versAmi + "but_marque.png";
                amiDefaite = VA_versAmi + "but.png";
                
                ennemieVictoire = VA_versAmi + "defaite_ennemie.png";
                amiVictoire = VA_versAmi + "but.png";
            }
            else
            {
                droiteQuestion = VA_versAmi + "ami_run.png";
                gaucheQuestion = VA_versAmi + "ennemie_run.png";
                
                amiVictoire = VA_versAmi + "victoire_ami.png";
                ennemieVictoire = VA_versAmi + "defaite_ennemie.png";
                
                amiDefaite = VA_versAmi + "defaite_ami.png";
                ennemieDefaite = VA_versAmi + "ennemie_run.png";
            }
        }
    }
    
    //Affichage
    drawBase(); 
    
    $(jeu).drawImage({
        source: gaucheQuestion,
        x: 0, y: 260,
        fromCenter: false
    }).drawImage({
        source: droiteQuestion,
        x: 800, y: 260,
        fromCenter: false
    }).drawText({
        fillStyle: 'black',
        x: 500, y: 250,
        fontSize: 20,
        text: question + "",
        fromCenter: true
    });
    
    //évènements de réponse
    $(document).keydown(function(event) {
        let codes = [37,38,39,40];
        if(codes.includes(event.keyCode))
        {
            $(document).off("keydown");
            finBoucle(reponseBonne(event.keyCode));
        }
    });
    
    $(classfleche).click(function(event) {
       let fleche = event.target.id;
       $(document).off("keydown");
       $(classfleche).off("click");
       switch(fleche) {
           case "haut":
               finBoucle(reponseBonne(38));
               break;
           case "gauche":
               finBoucle(reponseBonne(37));
               break;
           case "bas":
               finBoucle(reponseBonne(40));
               break;
           case "droite":
               finBoucle(reponseBonne(39));
               break;
       }
    });
    
    //Chronomètre
    if(chrono != "sans")
        setChrono();
}

//TODO : Réécrire/maj la fonction finBoucle avec l'objet Partie, revoir gestion réponse donnée ?
/*
 * Vérifier réponse et avancer match selon
 * Afficher état match selon
 * relancer vers partie()
 */
function finBoucle(bonne) {
    /*
     *  si reponse bonne
     *    si indexTerrain = terrain
     *      balleAuCentre = 1
     *      indexTerrain = terrain / 2
     *      affichage
     *    sinon
     *      indexTerrain++
     *      affichage
     *  sinon
     *    si indexTerrain = 0
     *      balleAuCentre = 0
     *      indexTerrain = terrain / 2
     *      affichage
     *    sinon
     *      indexTerrain--
     *      affichage
     * 
     *   affichage
     * 
     *   partie()
     */
    
    stopChrono();
    
    drawBase();
    
    if(bonne)
    {
        incrementerVariableLocale(LS_nbBonnesReponses);
        
        if(indexTerrain == tailleTerrain)
        {
            balleAuCentre = 1;
            indexTerrain = tailleTerrain /2;
            scoreAmi++;
            incrementerVariableLocale(LS_nbButs);
            
            $(jeu).drawImage({
                source: amiVictoire,
                x: 200, y: 260,
                fromCenter: false
            }).drawImage({
                source: ennemieVictoire,
                x: 800, y: 260,
                fromCenter: false
            });
        }
        else
        {
            indexTerrain++;
            
            $(jeu).drawImage({
                source: amiVictoire,
                x: 600, y: 260,
                fromCenter: false
            }).drawImage({
                source: ennemieVictoire,
                x: 400, y: 260,
                fromCenter: false
            });
        }
        
        versEnnemie = true;
    }
    else
    {
        if(indexTerrain == 0)
        {
            balleAuCentre = 0;
            indexTerrain = tailleTerrain / 2;
            scoreEnnemie++;
            
            $(jeu).drawImage({
                source: ennemieDefaite,
                x: 600, y: 260,
                fromCenter: false
            }).drawImage({
                source: amiDefaite,
                x: 0, y: 260,
                fromCenter: false
            });
        }
        else
        {
            if(indexTerrain == tailleTerrain)
            {
                $(jeu).drawImage({
                    source: ennemieDefaite,
                    x: 800, y: 260,
                    fromCenter: false
                }).drawImage({
                    source: amiDefaite,
                    x: 40, y: 260,
                    fromCenter: false
                });
            }
            else
            {
                $(jeu).drawImage({
                    source: ennemieDefaite,
                    x: 400, y: 260,
                    fromCenter: false
                }).drawImage({
                    source: amiDefaite,
                    x: 600, y: 260,
                    fromCenter: false
                });
            }
            
            indexTerrain--; 
        }
        
        versEnnemie = false;
    }
    
    indexPhase++;
    
    //Maj variables locales
    localStorage.setItem(LS_balleAuCentre, balleAuCentre);
    localStorage.setItem(LS_indexTerrain, indexTerrain);
    localStorage.setItem(LS_scoreAmi, scoreAmi);
    localStorage.setItem(LS_scoreEnnemie, scoreEnnemie);
    localStorage.setItem(LS_indexPhase, indexPhase);
    
    //maj trophés
    majTrophes();
    
    setTimeout(partie, 2000);
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

//TODO Recréer entièrement création des questions/réponses, simplifier ou clarifier
function creerQuestion() {
    //Reset réponses
    reponses = [];
    
    let diff = difficulte;
    
    console.log(diff);
    
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

function setTouches() {
    let indexSelect;
    let flechesTemp = [haut, gauche, bas, droite];
        
    flechesTemp.forEach(function(fleche) {
        indexSelect = Math.floor(Math.random() * reponses.length);
        $(fleche).text(reponses[indexSelect]);
        reponses.splice(indexSelect, 1);
    });
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

        if(reponseChoisie.localeCompare(bonneReponse.toString())  == 0)
            return true;
        else
            return false;
    }
    else
        return false;
}

//TODO Revoir viderListes avec l'objet SizedArray.
function viderListesQuestions() {
    additionsFaites = SizedArray(1);
    soustractionsFaites = SizedArray(1);
    multiplicationsFaites = SizedArray(1);
    divisionsFaites = SizedArray(1);
    obstaclesFaits = SizedArray(1);
}

//Fonctions de chronomètre
//TODO Recréer le chronomètre entièrement + déplacer à jeu.js
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

function chronometre() {
    
    chronoActuel += 10;
    let rad = (chronoActuel / chronoFin) * 360;
    
    $(jeu).drawRect({
        fillStyle: '#3498db',
        x: 500, y: 100,
        height: 20, width: 20
    });
    $(jeu).drawArc({
        strokeStyle: 'black',
        strokeWidth: 5,
        x: 500, y: 100,
        radius: 10,
        start: 0, end: rad
    });
    
    if(chronoActuel == chronoFin)
    {
        stopChrono();
        chronoActuel = 0;
        finBoucle(false);
    }
}

function stopChrono() {
    idInterval.forEach(function(id) {
        clearInterval(id);
    });
    
    idInterval = Array();
}


//TODO Revoir et déplacer vers jeu.js la fonction resetEvents.
function resetEventsPartie() {
    $(document).off("keypress");
    $(document).off("keydown");
    $(classfleche).off("click");
    $(espace).off("click");
}