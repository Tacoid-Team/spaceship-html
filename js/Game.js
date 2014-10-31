var SpaceShip = SpaceShip || {};

SpaceShip.Game = function(){};

//setting game configuration and loading the assets for the loading screen
SpaceShip.Game.prototype = {
  create: function() {
	console.log("Create level " + this.level)

	this.game.physics.startSystem(Phaser.Physics.P2JS);

	// Background
	this.game.add.image(0, 0, 'background');	

	// Map
	var map = this.game.add.tilemap('map' + this.level);
	var layer = map.createLayer('Tile Layer 1');

	map.addTilesetImage('ground');
	
	layer.resizeWorld();

	map.setCollisionBetween(1, 17);

    this.game.physics.p2.convertTilemap(map, layer);
	this.game.physics.p2.restitution = .2;
	this.game.physics.p2.gravity.y = 200;
	// ---

	// Gauge
	var gaugebg = this.game.add.sprite(760, 140, 'gaugebg');
	gaugebg.fixedToCamera = true;
	this.gauge = this.game.add.sprite(760, 140, 'gauge');
	this.gauge.fixedToCamera = true;
	this.gaugeCrop = new Phaser.Rectangle(0, 0, this.gauge.width, this.gauge.height);
	this.gauge.crop(this.gaugeCrop);

	// Restart button
	this.restartbtn = this.game.add.button(744, 360, 'restartbtn', this.restart, this, 1, 1, 0, 1);
	this.homebtn = this.game.add.button(744, 420, 'homebtn', this.home, this, 1, 1, 0, 1);

	//  An explosion pool
	this.explosions = this.game.add.group();
	var explosionAnimation = this.explosions.create(0, 0, 'explode', [0], false);
	explosionAnimation.anchor.setTo(0.5, 0.5);
	explosionAnimation.animations.add('explode');

	// Stars
	this.game.add.image(755, 30, 'nostar');
	this.game.add.image(755, 62, 'nostar');
	this.game.add.image(755, 94, 'nostar');
	this.star_group = this.game.add.group();
	map.createFromObjects('stars', 1, 'star', 0, true, false, this.star_group);


	// Flag
	this.flag = this.game.add.sprite(map.objects['flag'][0]['x'], map.objects['flag'][0]['y'], 'flag');
	this.flag.y -= this.flag.height;
	this.flag.animations.add('flag', [1, 2, 3, 4, 5, 6, 7, 8]);

	// Score
	this.score = 0;
	this.scoreMax = this.star_group.children.length;
	this.landed = false;


	// Ship
	this.ship = this.game.add.sprite(map.objects['ship'][0]['x'], map.objects['ship'][0]['y'], 'ship');
	this.ship.y -= this.ship.height;
	this.ship.animations.add('propulse', [1, 2, 3]);
	this.game.physics.p2.enable(this.ship, false);
	this.ship.body.addPolygon({}, 30, 30  ,  0, 30  ,  14, 8);
	this.ship.body.onBeginContact.add(this.hitWall, this);
	// ---

	this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

	this.pointerDown = false;
	this.startPoint = {};

	this.life = 100;
	this.last_impact = 0;
	this.captured_stars = [];
	this.game_paused = false;

	this.game.input.onDown.add(function(pointer) {
		if (pointer.position.x < 740 && !this.game_paused) {
			this.startPoint.x = pointer.position.x;
			this.startRot = this.ship.body.rotation;
			this.pointerDown = true;
			this.pointer = pointer;
			this.ship.animations.play('propulse', 10, true);
		}
	}, this);

	this.game.input.onUp.add(function(pointer) {
		this.pointerDown = false;
		this.ship.animations.stop();
		this.ship.frame = 0;
	}, this);

	this.game.add.sprite(0,0,'');

  },
  update: function() {
	this.star_group.forEachAlive(this.starOverlap, this);
	this.ship.body.setZeroRotation();

	if (this.pointerDown) {
		this.ship.body.thrust(400);
		if (this.pointerDown) {
			var deltaX = this.pointer.position.x - this.startPoint.x;
			this.ship.body.rotation = this.startRot + deltaX / 500;
		}
		this.landed = false;
		this.last_landed = 0;
	} else if (!this.landed && this.nearFlag() && this.isLanded()) {
		if (this.score > 0) {
			this.landed = true;
			console.log('Landed!');
			this.success_popup();
		}
	}
  },
  success_popup: function() {
	this.restartbtn.input.enabled = false;
	this.homebtn.input.enabled = false;
	this.game_paused = true;


	this.popup = this.game.add.image(400, 240, 'success');

	this.popup.anchor.x = .5;
	this.popup.anchor.y = .5;
	var nextlvlbtn = this.game.add.button(490, 270, 'nextlvlbtn', this.nextlevel, this);
	nextlvlbtn.anchor.x = 0.5;
	nextlvlbtn.anchor.y = 0.5;

	this.game.add.tween(nextlvlbtn.scale).to({ x: 1.1, y: 1.1}, 200, Phaser.Easing.Linear.None, true, 0, 0, true);

	this.game.add.button(230, 265, 'retrybtn', this.restart, this);
	this.game.add.button(295, 265, 'menubtn', this.home, this);
  },
  home: function() {
	this.state.start('MainMenu');
  },
  restart: function() {
	this.state.start('Game');
  },
  nextlevel: function() {
	// todo gerer cas last level.
	this.game.state.states['Game'].level = this.level + 1;
	this.state.start('Game');
  },
  starOverlap: function(star) {
	var boundsA = this.ship.getBounds();
	var boundsB = star.getBounds();

	if (Phaser.Rectangle.intersects(boundsA, boundsB)) {
		for (var i = 0; i < this.captured_stars.length; i++) {
			if (star == this.captured_stars[i]) {
				return;
			}
		}
		if (this.score == 0) {
			this.flag.animations.play('flag', 10, true);
		}
		this.captured_stars.push(star);

		this.game.add.tween(star)
			.to({x: 755}, 1000, Phaser.Easing.Linear.None)
			.start();
		this.game.add.tween(star)
			.to({y: 30 + this.score * 32}, 1000, Phaser.Easing.Exponential.Out)
			.start();

		this.game.add.tween(star.scale).to({ x: 2, y: 2}, 500, Phaser.Easing.Linear.None, true, 0, 0, true);
		this.score += 1;
	}
  },
  nearFlag: function() {
	var distx = Math.abs(this.flag.x - this.ship.x);
	var disty = Math.abs(this.flag.y - this.ship.y + this.flag.height);
	return (disty < 20 && distx < 60);
  },
  isLanded: function() {
	var rot = this.ship.body.rotation % (2 * Math.PI);
	if (rot > Math.PI) {
		rot -= 2 * Math.PI;
	} else if (rot < -Math.PI) {
		rot += 2 * Math.PI;
	}

	var force = this.ship.body.velocity.x * this.ship.body.velocity.x + this.ship.body.velocity.y * this.ship.body.velocity.y;
	if (force < .01 && Math.abs(rot) < .01) {
		if (this.last_landed == 0) {
			this.last_landed = this.game.time.now;
		} else if (this.game.time.now - this.last_landed > 200) {
			return true;
		}
	} else {
		this.last_landed = 0;
	}
	return false;
  },
  hitWall: function(wall, shapeWall, shapeShip, equation) {
	if (this.game.time.now - this.last_impact < 1000) {
		return;
	}
	var force = this.ship.body.velocity.x * this.ship.body.velocity.x + this.ship.body.velocity.y * this.ship.body.velocity.y;
	var impact = force / 2500;
	if (impact > 10) {
		this.life -= impact;
		if (this.life < 0) {
			this.life = 0;
			var explosionAnimation = this.explosions.getFirstExists(false);
			if (explosionAnimation) {
				explosionAnimation.reset(this.ship.x, this.ship.y);
				explosionAnimation.play('explode', 30, false, true);
				this.ship.kill();
			}
		} else {
			this.last_impact = this.game.time.now;
			this.game.add.tween(this.ship).from({alpha: 0.2}, 200, Phaser.Easing.Linear.None, true, 0, 4, true);
		}

		// update gauge
		this.gauge.cameraOffset.y = 140 + 200 - this.life * 2;
		this.gaugeCrop.y = 200 - this.life * 2;
		this.gaugeCrop.height = this.life * 2;
		this.gauge.updateCrop();
	}
  }
};
