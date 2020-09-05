//Objet de compte utilisateur.
function Compte() {
    //Variables globales
    //String, nom du joueur.
    this.nom = "Nom";
    //Int, nombre de match gagnés.
    this.nombreVictoires = 0;
    //Int, nombre de buts marqués.
    this.nombreButs = 0;
    //Int, nombre de bonnes réponses données.
    this.nombreBonneReponses = 0;
    
    //Variables de trophés
    //Bool, True si débloqués
    //Victoire selon la difficulté
    this.mathTresFacile = false;
    this.mathFacile = false;
    this.matchMoyen = false;
    this.matchDifficile = false;
    this.matchTresDifficile = false;
}