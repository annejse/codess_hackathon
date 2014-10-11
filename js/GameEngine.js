/**
 * Created by maesierra on 11/10/14.
 */

var gameEngine = {

    players: [],
    map: null,
    disease: null,
    currentPlayer: null,
    nPlayers: 0,

    /**
     * Creates a new game
     */
    create: function(map, disease) {
        this.players = [];
        this.map = map;
        this.disease = disease;
        this.currentPlayer = null;
        this.nPlayers = 0;
    },

    /**
     * Adds a player
     * @param name
     */
    addPlayer: function(name) {
        this.players.push({
            id:this.nPlayers,
            name: name
         });
        this.nPlayers++;
    },



    /**
     * Stars the game
     */
    start: function() {


        var startingPlayer = chance.integer({min: 0, max: this.nPlayers - 1}),
            gameEngine = this;
        if (this.players.length < 2) {
            throw new Error("At least 2 players are required to start a game");
        }
        this.$playerList = $(".player");
        this.setCurrentPlayer(this.players[startingPlayer]);
        //Set up the players names on the board
        gameEngine.$playerList.each(function(){
           var $playerDiv = $(this),
               idPlayer = $playerDiv.data("player-id");
            if (gameEngine.players[idPlayer] !== undefined) {
                $playerDiv.find('button').text(gameEngine.players[idPlayer].name);
            } else {
                $playerDiv.hide();
            }

        });
    },

    setCurrentPlayer : function(player) {
        this.currentPlayer = player;
        this.$playerList.find("button").removeClass('btn-success');
        this.$playerList.filter("[data-player-id = '" + player.id + "']").find("button").addClass('btn-success');


    },

    nextTurn: function() {
        var nextPlayer = (this.currentPlayer.id + 1) % this.nPlayers;
        this.setCurrentPlayer(this.players[nextPlayer]);
    }
};
