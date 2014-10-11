/**
 * Created by maesierra on 11/10/14.
 */

var gameEngine = {

    players: [],
    map: null,
    disease: null,
    currentPlayer: null,
    currentQuestion: null,
    nPlayers: 0,
    diseaseQuestions: null,

    /**
     * Creates a new game
     */
    create: function(map, disease) {
        this.players = [];
        this.map = map;
        this.disease = disease;
        this.currentPlayer = null;
        this.nPlayers = 0;

        disease_json = "diseases/" + disease + ".json";
        response = $.getJSON(disease_json, function(data) {
            gameEngine.diseaseQuestions = data.questions;
        });
        
        
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
        console.log("starting 2");
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

        gameEngine.runTurn();
    },

    setCurrentPlayer : function(player) {
        this.currentPlayer = player;
        this.$playerList.find("button").removeClass('btn-success');
        this.$playerList.filter("[data-player-id = '" + player.id + "']").find("button").addClass('btn-success');


    },

    nextTurn: function() {
        var nextPlayer = (this.currentPlayer.id + 1) % this.nPlayers;
        this.setCurrentPlayer(this.players[nextPlayer]);
        this.runTurn();
    },

    runTurn: function() {

        modalContainer = $("#generic-modal .container");
        modalContainer.empty();
        
        modalContainer.append("<h1>" + this.currentPlayer.name + "</h1>");

        modalContainer.append("<h3>Do you want to?</h3>");
        modalContainer.append("<div id='option-row' class='row'></div>");
        $('#option-row').append("<div id='research_option' class='col-sm-1 btn btn-primary'>Research</div>");
        $('#option-row').append("<div id='contain_option' class='col-sm-1 col-sm-offset-1 btn btn-primary'>Contain</div>");
        $('#option-row').append("<div id='treat_option' class='col-sm-1 col-sm-offset-1 btn btn-primary'>Treat</div>");


        $('#contain_option').click(this.containCity);
        $("#generic-modal").modal();
    },

    containCity: function() {
        gameEngine.askDiseaseQuestion()
    },

    askDiseaseQuestion: function() {
        $('#generic-modal .container').empty();

        randomIndex = Math.floor(Math.random() * this.diseaseQuestions.length)
        randomQuestion = this.diseaseQuestions[randomIndex]
        this.currentQuestion = randomQuestion

        $('#generic-modal .container').append(randomQuestion.question)
        

        for (i = 0; i < randomQuestion.answers.length; i++) {
            answer = randomQuestion.answers[i]
            $('#generic-modal .container').append('<div><input type="radio" name="question" value="' + answer + '">' + answer + '</input></div>')
        }

        $('#generic-modal .container').append("<div id='submitAnswer' class='btn btn-primary'>Submit</div>")
        $('#submitAnswer').click(this.submitAnswer);
        

        $('#generic-modal').modal()
    },

    submitAnswer: function() {
        answer = $('#generic-modal input[name=question]:checked').val()

        $('#generic-modal .container').empty();
        if (answer === gameEngine.currentQuestion.correct_answer) {
            $('#generic-modal .container').append("Correct")
        } else {
            $('#generic-modal .container').append("Incorrect")
        }

        $('#generic-modal .container').append('<div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div>')
    }

};
