var SpaceShip = SpaceShip || {};

SpaceShip.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
SpaceShip.Boot.prototype = {
  init: function () {
	this.input.maxPointers = 1;
	this.stage.disableVisibilityChange = true;
	if (this.game.device.desktop) {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.scale.setScreenSize(true);
		this.scale.refresh();
	} else {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.forceLandscape = true;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.scale.forceOrientation(true, false);
		this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
		this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
		this.scale.setScreenSize(true);
		this.scale.refresh();
	}
  },
  preload: function() {
	//assets we'll use in the loading screen
	this.load.image('preloadbar', 'assets/preloader-bar.png');
  },
  create: function() {
	//have the game centered horizontally
	this.scale.pageAlignHorizontally = true;

	//screen size will be set automatically
	this.scale.setScreenSize(true);

    this.game.stage.backgroundColor = '#000';

	this.state.start('Preload');

  },
  enterIncorrectOrientation: function () {
    this.game.paused = true;
	document.getElementById('orientation').style.display = 'block';
  },
  leaveIncorrectOrientation: function () {
    this.game.paused = false;
	document.getElementById('orientation').style.display = 'none';
  }
};
