//Déroulement
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

function introduction() {
    //Dessin introduction
    $(jeu).drawText({
        fillStyle: 'black',
        x: 400, y: 200,
        fontSize: 30,
        text: 'Début de partie, appuyer sur espace'
    });
    
    //Set Up variables partie
    enPartie = true;
    indexPhase = 0;
    miTemps = 0;
    scoreAmi = 0;
    scoreEnnemie = 0;
    
    //Set up sauvegarde locale
    localStorage.setItem(LS_enPartie, enPartie);
    localStorage.setItem(LS_indexPhase, indexPhase);
    localStorage.setItem(LS_miTemps, miTemps);
    localStorage.setItem(LS_scoreAmi, scoreAmi);
    localStorage.setItem(LS_scoreEnnemie, LS_scoreEnnemie);
    
    //event lancer partie
    $(espace).text("Continuer");
    $(document).keypress(function(event) {
        if(event.keyCode == 32)
        {
            resetEventsPartie();
            partie();
        }
    });
    
    $(espace).click(function() {
        resetEventsPartie();
        partie();
    });
}

function partie() {}

function debutBoucle() {}

function finBoucle() {}




//-------------------------------------------------------------------------

function setUpFoot() {
    //création variables LocalStorage de la partie
    nbParties = Math.ceil(Math.random() * (4 - 2) + 2);
    nbQuestions = Math.ceil(Math.random() * (6 - 3) + 3);
    indexPartie = 0;
    indexQuestion = 0;
    score = 0;
    
    localStorage.setItem(LS_nbParties, nbParties);
    localStorage.setItem(LS_nbQuestions, nbQuestions);
    localStorage.setItem(LS_indexPartie, 0);
    localStorage.setItem(LS_indexQuestion, 0);
    localStorage.setItem(LS_score, 0);
    
    resetEventsPartie();
    
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
    $(jeu).clearCanvas();
    dessinerBaseFoot();
    $(jeu).drawImage({
        source: imgFoot + 'base_foot.png',
        x: 10, y:120,
        fromCenter: false
    }).drawText({
        fillStyle: 'black',
        x: 400, y: 170,
        fontSize: 30,
        text: 'Début du foot'
    }).drawText({
        fillStyle: 'black',
        x: 400, y: 230,
        fontSize: 30,
        text: 'Appuyez sur espace'
    });
}

function deroulementDebutFoot() {
    //stop chrono
    stopChrono();
    
    //Select obstacle
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
    
    creerQuestion();
    
    $(document).keydown(function(event) {
        let codes = [37,38,39,40];
        if(codes.includes(event.keyCode))
        {
            $(document).off("keydown");
            deroulementFinFoot(event.keyCode);
        }
    });
    
    $(classfleche).click(function(event) {
       let fleche = event.target.id;
       $(document).off("keydown");
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
    $(jeu).clearCanvas();
    dessinerBaseFoot();
    $(jeu).drawImage({
        source: imgFoot + 'base_foot.png',
        x: 10, y:120,
        fromCenter: false
    }).drawText({
        fillStyle: 'black',
        x: 400, y: 200,
        fontSize: 30,
        text: "Question : " + question
    });
    
    if(indexQuestion == nbQuestions)
    {
        $(jeu).drawImage({
            source: imgFoot + 'cage.png',
            x: 600, y:110,
            fromCenter: false
        });
    }
    else
    {
        switch(obstacle){
            case 0:
                $(jeu).drawImage({
                    source: imgFoot + 'obstacle1.png',
                    x: 600, y:110,
                    fromCenter: false
                });
                break;
            case 1:
                $(jeu).drawImage({
                    source: imgFoot + 'obstacle2.png',
                    x: 600, y:110,
                    fromCenter: false
                });
                break;
            case 2:
                $(jeu).drawImage({
                    source: imgFoot + 'obstacle3.png',
                    x: 600, y:110,
                    fromCenter: false
                });
                break;
            case 3:
                $(jeu).drawImage({
                    source: imgFoot + 'obstacle4.png',
                    x: 600, y:110,
                    fromCenter: false
                });
                break;
        }
    }
    
    //Set chrono
    if(chrono != "sans")
        setChrono();
}

function deroulementFinFoot(key) {
    //stop chrono
    stopChrono();
    
    resetEventsPartie();
    
    console.log("Fin foot");
    
    $(jeu).clearCanvas();  
    dessinerBaseFoot();
    $(jeu).drawImage({
        source: imgFoot + 'base_foot.png',
        x: 10, y:120,
        fromCenter: false
    });
    
    if(reponseBonne(key))
    {
        indexQuestion++;
        localStorage.setItem(LS_indexQuestion, indexPartie);
        $(jeu).drawText({
            fillStyle: 'black',
            x: 400, y: 200,
            fontSize: 30,
            text: "Bravo !"
        });
    }
    else
    {
        indexQuestion = 0;
        localStorage.setItem(LS_indexQuestion, 0);
        indexPartie++;
        localStorage.setItem(LS_indexPartie, indexPartie);
        $(jeu).drawText({
            fillStyle: 'black',
            x: 400, y: 200,
            fontSize: 30,
            text: "Dommage !"
        });
    }
    
    setTimeout(function() {
        
        if(quizzComplet())
        {
            indexQuestion = 0;
            localStorage.setItem(LS_indexQuestion, 0);
            indexPartie++;
            localStorage.setItem(LS_indexPartie, indexPartie);
            score++;
            localStorage.setItem(LS_score, score);
        }
        
        if(partiesCompletes())
        {
            conclusionFoot();
        }
        else
        {
            deroulementDebutFoot();
        }
    }, 1000);
    
    
}

function conclusionFoot() {
    //Maj Canvas
    $(jeu).clearCanvas();
    dessinerBaseFoot();
    $(jeu).drawImage({
        source: imgFoot + 'base_foot.png',
        x: 400, y:240,
        fromCenter: true
    }).drawText({
        fillStyle: 'black',
        x: 400, y: 50,
        fontSize: 30,
        text: 'score : ' + score
    });
    
    viderVariablesParties();
    viderListesQuestions();
    resetEventsPartie();
    
    setTimeout(function() {
        if(journee == true)
            journeePreSoleil();
    },2000);
}

function dessinerBaseFoot() {
    $(jeu).clearCanvas().drawRect({
        fillStyle: 'grey',
        x:0, y:0,
        fromCenter: false,
        width:800, height:400
    }).drawRect({
        fillStyle: 'green',
        x:0 , y:360,
        width: 800, height: 40,
        fromCenter: false
    }).drawText({
        fillStyle: 'black',
        x: 5, y: 5,
        fontSize: 20,
        text: indexPartie + " sur " + nbParties,
        fromCenter: false
    }).drawText({
        fillStyle: 'black',
        x: 5, y: 25,
        fontSize: 20,
        text: indexQuestion + " sur " + nbQuestions,
        fromCenter: false
    });
}

//-------------------------------------------------------------------------

//Fonctions de création questions & réponses + affectations touches
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

//Fonctions de vérification
//TODO : actualiser variables + nom
function quizzComplet() {
    if(indexQuestion > nbQuestions)
        return true;
    else
        return false;
}

//TODO : actualiser variables + nom
function partiesCompletes() {
    if(indexPartie > nbParties)
        return true;
    else
        return false;
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

//Fonctions de chronomètre
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

//TODO : actualiser avec un seul mode + fin renvoie false
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

//Autres fonctions
function incrementerVariableLocale(nomVariable) {
    let valeur = parseInt(localStorage.getItem(nomVariable));
    localStorage.setItem(nomVariable, valeur + 1);
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