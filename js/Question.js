//Objet de question avec ses divers éléments
function Question() {
    //variables de question
    //String (char), quel type de question ?
    this.signe = "?";
    //Int, élément de gauche de la question.
    this.gauche = 0;
    //Int, élément de droite de la question.
    this.droite = 0;
    //String, énoncé complet de la question.
    this.enonce = "0 ? 0 ?";
    
    //Variables de réponses
    //Int, bonne réponse.
    this.bonneReponse = 0;
    //Int, réponse donnée en appuyant sur haut.
    this.reponseHaut = 0;
    //Int, réponse donnée en appuyant sur bas.
    this.reponseBas = 0;
    //Int, réponse donnée en appuyant sur gauche.
    this.reponseGauche = 0;
    //Int, réponse donnée en appuyant sur droite.
    this.reponseDroite = 0;
}