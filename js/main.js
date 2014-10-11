
function setup_game() {
	gameEngine.create("", "malaria");

	// $('#setup-game').modal();
	// $('#setup-game .btn').click(request_players);
	start_game()	
}


function start_game() {
    $("#endTurn").on('click', function(e) {
       gameEngine.nextTurn();
    });

    $("#treatCity").on('click', function(e) {
       gameEngine.treatCity();
    });

    
	
	gameEngine.addPlayer("player1");
	gameEngine.addPlayer("player2");
	
	gameEngine.start();
}


function request_players() {
	$('#setup-game').modal('hide');

	$('#request-players').modal();
	$('#request-players #add-player').click(add_player);
	$('#request-players #done-adding-players').click(done_adding_players);
}

function add_player() {

	player_name = $('#player-name').val();
	$('#player-name').val('');
	gameEngine.addPlayer(player_name);
	$('#player-list').append("<div>" + player_name + "</div>")
}

function done_adding_players(){
	$('#request-players').modal('hide');
	start_game()
}

