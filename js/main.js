
function setup_game() {
	$('#setup-game').modal();
	$('#setup-game .btn').click(request_players)
}


function start_game() {
	start_game_div.append("<div class='btn btn-primary'>Start Game</div>")

    $("#endTurn").on('click', function(e) {
       gameEngine.nextTurn();
    });
    gameEngine.addPlayer('John');
    gameEngine.addPlayer('Matti');
    gameEngine.addPlayer('Elaine');
    gameEngine.start();
}


function request_players() {
	$('#start-game').modal('hide');

	game["players"] = []
	$('#request-players').modal();

	$('#request-players #add-player').click(add_player)
}

function add_player() {
	game["players"].push("added")
	$('#player-list').append("added")

	
}

>>>>>>> Stashed changes
