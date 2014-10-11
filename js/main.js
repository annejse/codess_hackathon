
function start_game() {
	$('#start-game').remove()

	start_game_div = jQuery('<div/>', {
	    id: 'start-game'
	}).appendTo('#main-container');

	start_game_div.append("<div class='btn btn-primary'>Start Game</div>")

    $("#endTurn").on('click', function(e) {
       gameEngine.nextTurn();
    });
    gameEngine.addPlayer('John');
    gameEngine.addPlayer('Matti');
    gameEngine.addPlayer('Elaine');
    gameEngine.start();
}