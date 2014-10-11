
function start_game() {
	$('#start-game').remove()

	start_game_div = jQuery('<div/>', {
	    id: 'start-game'
	}).appendTo('#main-container');

	start_game_div.append("<div class='btn btn-primary'>Start Game</div>")
}