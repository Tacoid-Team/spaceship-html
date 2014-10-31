var SpaceShip = SpaceShip || {};

SpaceShip.Levels = function(){};

//setting game configuration and loading the assets for the loading screen
SpaceShip.Levels.prototype = {
  create: function() {
    this.game.add.image(0, 0, 'background');

	for (i = 0; i < 10; i++) {
		var t = this.game.add.button(66 + (i % 5) * 140, 100 + Math.floor(i / 5) * 140, 'levelbtn'+(i+1), this.start_game, {game: this.game, value: i+1});
		t.value = i+1;
	}

	this.game.add.sprite(0,0,'');
  },
  start_game: function(item) {
	this.game.state.states['Game'].level = this.value;
	this.game.state.start('Game');
  }
};
