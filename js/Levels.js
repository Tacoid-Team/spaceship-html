var SpaceShip = SpaceShip || {};

SpaceShip.Levels = function(){};

//setting game configuration and loading the assets for the loading screen
SpaceShip.Levels.prototype = {
  create: function() {
    this.game.add.image(0, 0, 'background');

    var t = this.game.add.text(400, 20, 'World ' + this.n_world, {align: 'center', fill: '#fff'});
    t.anchor.x = .5;

    for (var i = 0; i < 10; i++) {
        var x = 66 + (i % 5) * 140;
        var y = 100 + Math.floor(i / 5) * 140;
        if (i == 0 || SpaceShip.scores['level' + i]) {
            this.game.add.button(x, y, 'levelbtn'+(i+1), this.start_game, {game: this.game, n_world: this.n_world, value: i+1});

            var score = SpaceShip.scores['level' + (i + 1)];
            var positions = [[x + 26, y + 34], [x + 51, y + 24], [x + 76, y + 33]];
            if (score) {
                for (var j = 0; j < score; j++) {
                    var s = this.game.add.image(positions[j][0], positions[j][1], 'star');
                    s.anchor.x = .5;
                    s.anchor.y = .5;
                }
            }
        } else {
            this.game.add.image(x, y, 'lock');
        }
    }

    this.game.add.sprite(0,0,'');
  },
  start_game: function(item) {
    this.game.state.states['Game'].level = this.value;
    this.game.state.states['Game'].n_world = this.n_world;
    this.game.state.start('Game');
  }
};
