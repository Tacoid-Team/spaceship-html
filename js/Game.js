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
	map.addTilesetImage('star');
	
	layer.resizeWorld();

	map.setCollisionBetween(1, 17);

    this.game.physics.p2.convertTilemap(map, layer);
	this.game.physics.p2.restitution = .2;
	this.game.physics.p2.gravity.y = 200;
	// ---

	var gaugebg = this.game.add.sprite(760, 140, 'gaugebg');
	gaugebg.fixedToCamera = true;
	this.gauge = this.game.add.sprite(760, 140, 'gauge');
	this.gauge.fixedToCamera = true;
	this.gaugeCrop = new Phaser.Rectangle(0, 0, this.gauge.width, this.gauge.height);
	this.gauge.crop(this.gaugeCrop);

	// Restart button
	this.game.add.button(744, 360, 'restartbtn', this.restart, this, 1, 1, 0, 1);
	this.game.add.button(744, 420, 'homebtn', this.home, this, 1, 1, 0, 1);

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
//	this.star_group.callAll('animations.add', 'animations', 'disappear', [1, 2, 3, 4, 5, 6, 7, 8]);


	// Flag
	this.flag = this.game.add.sprite(map.objects['flag'][0]['x'], map.objects['flag'][0]['y'], 'flag');
	this.flag.y -= this.flag.height;
	this.flag.animations.add('flag', [1, 2, 3, 4, 5, 6, 7, 8]);

	// Score
	this.score = 0;
	this.scoreMax = this.star_group.children.length;
	//this.scoreText = this.game.add.text(850, 50, '0/' + this.scoreMax, { align: 'right', fontSize: '32px', fill: '#FFF' });


	// Ship
	this.ship = this.game.add.sprite(map.objects['ship'][0]['x'], map.objects['ship'][0]['y'], 'ship');
	this.ship.y -= this.ship.height;
	this.ship.animations.add('propulse', [1, 2, 3]);
	this.game.physics.p2.enable(this.ship, false);
	this.ship.body.addPolygon({}, 30, 30  ,  0, 30  ,  14, 8);
	this.ship.body.onBeginContact.add(this.hitWall, this);
	// ---



	//  By default the ship will collide with the World bounds,
	//  however because you have changed the size of the world (via layer.resizeWorld) to match the tilemap
	//  you need to rebuild the physics world boundary as well. The following
	//  line does that. The first 4 parameters control if you need a boundary on the left, right, top and bottom of your world.
	//  The final parameter (false) controls if the boundary should use its own collision group or not. In this case we don't require
	//  that, so it's set to false. But if you had custom collision groups set-up then you would need this set to true.
	this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

	//  Even after the world boundary is set-up you can still toggle if the ship collides or not with this:
	// ship.body.collideWorldBounds = false;

	this.pointerDown = false;
	this.startPoint = {};

	this.life = 100;
	this.last_impact = 0;
	this.captured_stars = [];

	this.game.input.onDown.add(function(pointer) {
		this.startPoint.x = pointer.clientX;
		this.startPoint.y = pointer.clientY;
		this.startRot = this.ship.body.rotation;
		this.pointerDown = true;
		this.pointer = pointer;
		this.ship.animations.play('propulse', 10, true);
	}, this);

	this.game.input.onUp.add(function(pointer) {
		this.startPoint.x = pointer.clientX;
		this.startPoint.y = pointer.clientY;
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
			var deltaX = this.pointer.clientX - this.startPoint.x;
			this.ship.body.rotation = this.startRot + deltaX / 500;
		}
	}
  },
  home: function() {
	this.state.start('MainMenu');
  },
  restart: function() {
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
  hitWall: function(wall) {
	if (this.game.time.now - this.last_impact < 1000) {
		return;
	}

	var rot = this.ship.body.rotation % (2 * Math.PI);
	if (rot > Math.PI) {
		rot -= 2 * Math.PI;
	} else if (rot < -Math.PI) {
		rot += 2 * Math.PI;
	}
	console.log(rot, this.ship.body.velocity.x, this.ship.body.velocity.y);

    if (rot > -.1 && rot < .1 && this.ship.body.velocity.y > -5 && this.ship.body.velocity.y <= 0 && Math.abs(this.ship.body.velocity.x) < 1) {
		console.log("landed !");
	} else {
		var force = Math.max(Math.abs(this.ship.body.velocity.x), Math.abs(this.ship.body.velocity.y));
		var impact = force * force * force / 100000;
		console.log(impact);
		if (impact > 10) {
			this.last_impact = this.game.time.now;
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
				this.game.add.tween(this.ship).from({alpha: 0.2}, 200, Phaser.Easing.Linear.None, true, 0, 4, true);
			}

			// update gauge
			this.gauge.cameraOffset.y = 140 + 200 - this.life * 2;
			this.gaugeCrop.y = 200 - this.life * 2;
			this.gaugeCrop.height = this.life * 2;
			this.gauge.updateCrop();

			console.log(this.life);

		}
	}
  }
};
