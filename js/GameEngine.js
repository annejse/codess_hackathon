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
    diseaseQuestions: [
        {"question": "What part of the body is seriously affected by Malaria?", 
            "answers": ["Spleen", "Liver", "Lungs", "Heart"],
            "correct_answer": "Liver"},
        {"question": "Malaria is caused by?",  
            "answers": ["Virus", "Bacteria", "Parasite", "Mosquito"],
            "correct_answer": "Parasite"},
        {"question": "Which day is celebrated as World Malaria Day?",  
            "answers": ["25 April", "25 June", "25 July", "16 Sept"],
            "correct_answer" : "Africa"},
        {"question": "In which continent, as per WHO, one in every five childhood death is due to malaria?",  
            "answers": ["Africa", "South America", "North America", "Asia"],
            "correct_answer": "25th April"}
    ],

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
    },


    askDiseaseQuestion: function() {

        randomIndex = Math.floor(Math.random() * this.diseaseQuestions.length)
        randomQuestion = this.diseaseQuestions[randomIndex]
        this.currentQuestion = randomQuestion
        console.log(this.currentQuestion)
        console.log(randomQuestion["question"])

        $('#disease-question .container').append(randomQuestion["question"])
        

        for (i = 0; i < randomQuestion["answers"].length; i++) {
            answer = randomQuestion["answers"][i]
            $('#disease-question .container').append('<div><input type="radio" name="question" value="' + answer + '">' + answer + '</input></div>')
        }

        $('#disease-question .container').append("<div id='submitAnswer' class='btn btn-primary'>Submit</div>")
        $('#submitAnswer').click(this.submitAnswer);
        

        $('#disease-question').modal()
    },

    submitAnswer: function() {
        answer = $('#disease-question input[name=question]:checked').val()

        $('#disease-question .container').empty();
        if (answer === gameEngine.currentQuestion["correct_answer"]) {
            $('#disease-question .container').append("Correct")
        } else {
            $('#disease-question .container').append("Incorrect")
        }

        $('#disease-question .container').append('<div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div>')
    }

};
