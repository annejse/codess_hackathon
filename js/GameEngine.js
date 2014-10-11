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
    create: function(map, disease, done) {
        this.players = [];
        this.currentPlayer = null;
        this.nPlayers = 0;

        $.getJSON('map/' + map + '/map.json').done(function( map ) {
            gameEngine.map = map;
            gameEngine.map.citiesList = $.map(map.cities, function(city, name) {return city;});
            gameEngine.map.nCities = map.citiesList.length;
            $.getJSON("diseases/" + disease + ".json", function(data) {
                gameEngine.diseaseQuestions = data.questions;
                $('#treatCity').prop( "disabled", false );
                worldmap.draw(map.initialZoom, map.initialPosition, function() {
                    $.each(map.cities, function (name, city) {
                        city.players = [];
                    });
                    gameEngine.drawConnections();
                    gameEngine.drawCities();
                    done();
                });
            });

        });
        


    },

    /**
     * Adds a player
     * @param name
     */
    addPlayer: function(name) {
        this.players.push({
            id:this.nPlayers,
            name: name,
            city: null
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
        //Set up the starting city for each player
        for (var i = 0; i < this.nPlayers; i++) {
            var player = this.players[i],
                startingCity = this.map.citiesList[chance.integer({min: 0, max: this.map.nCities - 1})];
            this.movePlayer(player, null, startingCity);
        }

    },

    movePlayer: function(player, src, dest) {
        if (src !== null) {
            for (var i = 0; i < src.players.length; src++) {
                if (src.players[i].id === player.id) {
                    src.players[i] = undefined;
                    break;
                }
            }
        }
        worldmap.drawPlayer(dest.coordinates, player.name, dest.players.length);
        player.city = dest;
        dest.players.push(player);
    },

    availableMoves: function(player) {
        var map = this.map;
        player = player === undefined ? this.currentPlayer : player;
        this.drawConnections();
        $.each(player.city.connections, function(pos, cityName) {
            var city = map.cities[cityName];
            worldmap.drawConnection(player.city.coordinates, city.coordinates, '#00ff00');
        })
        this.drawCities();

    },

    drawCities: function() {
        $.each(this.map.cities, function (name, city) {
            worldmap.drawCity(city.coordinates, name);
        });
    },

    drawConnections: function() {
        var map = this.map;
        $.each(map.cities, function (name, city) {
            var dest;
            for (var i = 0; i < city.connections.length; i++) {
                dest = map.cities[city.connections[i]];
                worldmap.drawConnection(city.coordinates, dest.coordinates);
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


    treatCity: function() {
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
