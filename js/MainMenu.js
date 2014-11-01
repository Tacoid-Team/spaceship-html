var SpaceShip = SpaceShip || {};

SpaceShip.MainMenu = function(){};

//setting game configuration and loading the assets for the loading screen
SpaceShip.MainMenu.prototype = {
  create: function() {
    this.game.add.image(0, 0, 'background');

    var t = this.game.add.button(this.game.width/2, this.game.height/2, 'startbtn', this.start_game, this);
    t.anchor.set(0.5, 0.5);

    this.game.add.sprite(0,0,'');
  },
  start_game: function() {
    this.game.state.start('Levels');
  }
};
