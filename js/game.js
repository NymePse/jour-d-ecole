var gameArea = {
    canvas : document.getElementsByTagName("canvas");
    start : function() {
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval()
    }
}

function setGame() {
    /*
     * Récupère les options
     * et lance une partie en fonction
     */
    console.log(choixMode.options[choixMode.selected])
}