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
    researchInformation: null,
    messages: [],

    drawMap: function (map, done) {
        worldmap.draw(map.initialZoom, map.initialPosition, function () {
            gameEngine.drawConnections();
            gameEngine.drawCities();
            for (var i = 0; i < gameEngine.nPlayers; i++) {
                var player = gameEngine.players[i];
                gameEngine.movePlayer(player, null, player.city);
            }
            done();
        });
    },


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
                gameEngine.researchInformation = data.information

                $('#treatCity').prop( "disabled", false );
                $('#research').prop( "disabled", false );

                $.each(map.cities, function (name, city) {
                    city.players = [];
                    city.infection = 0;
                    city.outbreaked = false;
                });
                gameEngine.infect(map.startingLevel);
                gameEngine.drawMap(map, function() {
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

    infect: function(level) {
        level = level === undefined ? this.map.startingLevel - 1 : level;
        var map = this.map;

        for (var i = 0; i < level; i++) {
            gameEngine.infectCity(map.citiesList[chance.integer({min: 0, max: map.nCities - 1})]);

        }
    },

    infectCity: function(city) {

        if (city.outbreaked) {
            return;
        }
        if (city.infection === 3 && !city.outbreaked) {
            $("#alert-box").text(city.name + " has an outbreak!!!");
            gameEngine.outbreak(city);
        } else {
            city.infection++;
        }
        $("#alert-box").text(city.name + " is been infected!!!");
    },

    outbreak: function(city) {
        var map = this.map;
        city.outbreaked = true;
        for (var i = 0; i < city.connections.length; i++) {
            gameEngine.infect(map.cities[city.connections[i]]);
        };
    },

    movePlayer: function(player, src, dest) {
        var offset = -1;
        if (src !== null) {
            for (var i = 0; i < src.players.length; i++) {
                if (src.players[i].id === player.id) {
                    src.players[i] = undefined;
                    break;
                }
            }
        }
        player.city = dest;
        for (var i = 0; i < dest.players.length; i++) {
            if (dest.players[i].id === player.id) {
                offset = i;
                break;
            }
        }
        if (offset === -1) {
            offset = dest.players.length;
            dest.players.push(player);
        }
        worldmap.drawPlayer(dest.coordinates, player.name, offset);

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
            worldmap.drawCity(city.coordinates, name, city.infection);
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
        gameEngine.infect();
        this.drawMap(this.map, function() {

        });

    },


    treatCity: function() {
        gameEngine.askDiseaseQuestion()
    },

    research: function() {
        gameEngine.showResearchInformation()
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
        $('#submitAnswer').data("city", gameEngine.currentPlayer.city);
        $('#submitAnswer').data("action", 'treat');
        

        $('#generic-modal').modal()
    },

    submitAnswer: function() {
        var answer = $('#generic-modal input[name=question]:checked').val(),
            container = $('#submitAnswer'),
            city = container.data("city"),
            action = container.data("action");

        $('#generic-modal .container').empty();
        if (answer === gameEngine.currentQuestion.correct_answer) {
            $('#generic-modal .container').append("Correct");
            if (action === 'treat') {
                city.infection--;
                city.outbreaked = false;
            }
        } else {
            $('#generic-modal .container').append("Incorrect")
        }

        $('#generic-modal .container').append('<div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div>');
        $('#generic-modal').on('hidden.bs.modal', function () {
            gameEngine.nextTurn();
        });
    },

    showResearchInformation: function() {
        $('#generic-modal .container').empty();

        randomIndex = Math.floor(Math.random() * gameEngine.researchInformation.length)
        information = gameEngine.researchInformation[randomIndex]
        $('#generic-modal .container').append("<div style='width: 500px;'>"+ information + "</div>")
        $('#generic-modal .container').append('<div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div>')
        $('#generic-modal').on('hidden.bs.modal', function () {
            gameEngine.nextTurn();
        });
        $('#generic-modal').modal();

    }

};
