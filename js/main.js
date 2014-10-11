
function start_game() {

	$('#start-game').remove()

	start_game_div = jQuery('<div/>', {
	    id: 'start-game'
	}).appendTo('#main-container');

	start_game_div.append("<div class='btn btn-primary'>Start Game</div>")

    $("#endTurn").on('click', function(e) {
       gameEngine.nextTurn();
    });
    $("#move").on('click', function(e) {
        gameEngine.availableMoves();
    });
    $.getJSON('map/south-europe/map.json').done(function( map ) {
        gameEngine.create(map, null, function() {
            gameEngine.addPlayer('John');
            gameEngine.addPlayer('Matti');
            gameEngine.addPlayer('Elaine');
            gameEngine.start();
        });
    });

}
