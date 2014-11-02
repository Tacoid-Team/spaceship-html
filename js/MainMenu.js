var SpaceShip = SpaceShip || {};

SpaceShip.MainMenu = function(){};

function dist2alpha(dist) {
    return Math.max(0, 1 - Math.abs(dist) / 300)  + .1;
}

//setting game configuration and loading the assets for the loading screen
SpaceShip.MainMenu.prototype = {
  create: function() {
    this.game.add.image(0, 0, 'background');

    this.buttons = this.game.add.group();
    for (var i = 0; i < 5; i++) {
        var t = this.game.add.button(this.game.width/2 + 350 * i, this.game.height/2, 'startbtn', this.start_game, this);
        t.anchor.set(0.5, 0.5);
        if (i == 0) {
            t.alpha = 1;
        } else {
            t.alpha = .1;
        }
        this.buttons.add(t);
    }

    this.game.input.onDown.add(function(pointer) {
        this.startPointX = pointer.position.x;
        this.pointerDown = true;
        this.pointer = pointer;
    }, this);

    this.game.input.onUp.add(function(pointer) {
        this.pointerDown = false;
        var min = {};
        this.buttons.forEachAlive(function(b) {
                if (this.value === undefined || Math.abs(this.value) > Math.abs(b.position.x - 400)) {
                    this.value = b.position.x - 400;
                    this.button = b;
                }
        }, min);
        this.buttons.forEachAlive(function(b) {
            var pos = b.position.x - min.value;
            this.game.add.tween(b).to({x: pos}, Math.abs(min.value), Phaser.Easing.Linear.None, true);
            this.game.add.tween(b).to({alpha: dist2alpha(pos - 400)}, Math.abs(min.value), Phaser.Easing.Linear.None, true);
        }, this);
    }, this);

    this.game.add.sprite(0,0,'');
  },
  update: function() {
      if (this.pointerDown) {
          this.buttons.forEachAlive(this.move, this);
          this.startPointX = this.pointer.position.x;
      }
  },
  move: function(button) {
    var deltaX = this.pointer.position.x - this.startPointX;
    button.position.x += deltaX;
    button.alpha = dist2alpha(button.position.x - 400);
  },
  start_game: function(button) {
    if (button.position.x == 400) {
        this.game.state.start('Levels');
    }
  }
};
