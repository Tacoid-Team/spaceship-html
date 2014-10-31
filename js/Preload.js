var SpaceShip = SpaceShip || {};

SpaceShip.Preload = function(){};

//setting game configuration and loading the assets for the loading screen
SpaceShip.Preload.prototype = {
  preload: function() {
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.image('ground', 'assets/ground.png');
    this.load.spritesheet('flag', 'assets/flag.png', 40, 64, 9);
    this.load.image('background', 'assets/background.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('nostar', 'assets/nostar.png');
    this.load.image('gauge', 'assets/gauge.png');
    this.load.image('gaugebg', 'assets/gaugebg.png');
    this.load.spritesheet('explode', 'assets/explode.png', 64, 64, 16);
    this.load.spritesheet('ship', 'assets/ship.png', 29, 32, 4);

    this.load.image('startbtn', 'assets/startbtn.png');
    this.load.spritesheet('restartbtn', 'assets/restartbtn.png', 48, 48, 2);
    this.load.spritesheet('homebtn', 'assets/homebtn.png', 48, 48, 2);

	for (i = 1; i <= 10; i++) {
    	this.load.tilemap('map'+i, 'assets/maps/level'+i+'.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('levelbtn'+i, 'assets/levelbtn'+i+'.png');
	}

	this.load.image('success', 'assets/success.png');
	this.load.image('nextlvlbtn', 'assets/nextlvlbtn.png');
	this.load.image('menubtn', 'assets/menubtn.png');
	this.load.image('retrybtn', 'assets/retrybtn.png');

  },
  create: function() {
    this.state.start('MainMenu');
  }
};
