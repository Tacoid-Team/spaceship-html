
var game = new Phaser.Game(1000, 600, Phaser.AUTO, "", { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground', 'assets/ground.png');
    game.load.spritesheet('flag', 'assets/flag.png', 40, 64, 8);
    game.load.image('background', 'assets/background.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('gauge', 'assets/gauge.png');
    game.load.image('gaugebg', 'assets/gaugebg.png');
    game.load.spritesheet('explode', 'assets/explode.png', 128, 128, 16);
    game.load.spritesheet('ship', 'assets/ship.png', 29, 29, 4);

}

var ship;
var map;
var layer;
var cursors;
var gauge;
var gaugeCrop;

var life;



function hitWall(wall) {
    var rot = ship.body.rotation % (2 * Math.PI);
    if (rot > Math.PI) {
        rot -= 2 * Math.PI;
    } else if (rot < -Math.PI) {
        rot += 2 * Math.PI;
    }
    console.log(ship.body.rotation);
    console.log(rot);

    if (rot > -.7 && rot < .7 && ship.body.velocity.y < 150 && ship.body.velocity.y >= 0) {
        console.log("landed !");
    } else {
        force = Math.max(Math.abs(ship.body.velocity.x), Math.abs(ship.body.velocity.y));
        impact = force * force * force / 100000;
        if (impact > 10) {
            life -= impact;
        }
        gauge.cameraOffset.y = 50 + 200 - life * 2;
        gaugeCrop.y = 200 - life * 2;
        gaugeCrop.height = life * 2;
        gauge.updateCrop();

        if (life < 0) {
            var explosionAnimation = explosions.getFirstExists(false);
			if (explosionAnimation) {
            	explosionAnimation.reset(ship.x, ship.y);
            	explosionAnimation.play('explode', 30, false, true);
			}
        }
    }

    console.log(life);
}

function create() {

    game.physics.startSystem(Phaser.Physics.P2JS);

    game.stage.backgroundColor = '#3d3d3d';

    game.add.image(0, 0, 'background');

    map = game.add.tilemap('map');

    layer = map.createLayer('Tile Layer 1');

    map.addTilesetImage('ground');
    map.addTilesetImage('star');
    
    layer.resizeWorld();

    //  Set the tiles for collision.
    //  Do this BEFORE generating the p2 bodies below.
    map.setCollisionBetween(1, 17);



    //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
    //  This call returns an array of body objects which you can perform addition actions on if
    //  required. There is also a parameter to control optimising the map build.
    game.physics.p2.convertTilemap(map, layer);
    game.physics.p2.restitution = 0.1;
    game.physics.p2.gravity.y = 2000;
    game.physics.p2.friction=1;


    ship = game.add.sprite(200, 200, 'ship');
	ship.animations.add('propulse', [1, 2, 3]);

    game.physics.p2.enable(ship, false);
    ship.body.addPolygon({}, 30, 35  ,  0, 35  ,  14, 5);
    ship.body.onBeginContact.add(hitWall, this);

    game.camera.follow(ship);


    var gaugebg = game.add.sprite(975, 50, 'gaugebg');
    gaugebg.fixedToCamera = true;
    gauge = game.add.sprite(975, 50, 'gauge');
    gauge.fixedToCamera = true;
    gaugeCrop = new Phaser.Rectangle(0, 0, gauge.width, gauge.height);
    gauge.crop(gaugeCrop);

    //  An explosion pool
    explosions = game.add.group();
    var explosionAnimation = explosions.create(0, 0, 'explode', [0], false);
    explosionAnimation.anchor.setTo(0.5, 0.5);
    explosionAnimation.animations.add('explode');


	var collectibles = load_objects_from_tiled_map("assets/map.json", "stars");
	coins_group = game.add.group();
	for(var i = 0; i < collectibles.length; i++){
		console.log(collectibles[i]['x'], collectibles[i]['y']);
		var t = game.add.sprite(collectibles[i]['x'] , collectibles[i]['y'] - 24, 'star');
		//t.animations.add('coin');
		//t.animations.play('coin', 5 + i, true);
		coins_group.add(t);
	}

	var t = game.add.sprite(800, 100, 'flag');
	t.animations.add('flag');
	t.animations.play('flag', 10, true);



    //  By default the ship will collide with the World bounds,
    //  however because you have changed the size of the world (via layer.resizeWorld) to match the tilemap
    //  you need to rebuild the physics world boundary as well. The following
    //  line does that. The first 4 parameters control if you need a boundary on the left, right, top and bottom of your world.
    //  The final parameter (false) controls if the boundary should use its own collision group or not. In this case we don't require
    //  that, so it's set to false. But if you had custom collision groups set-up then you would need this set to true.
    game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    //  Even after the world boundary is set-up you can still toggle if the ship collides or not with this:
    // ship.body.collideWorldBounds = false;

    cursors = game.input.keyboard.createCursorKeys();

    life = 100;
}

function update() {
    if (cursors.left.isDown)
    {
        ship.body.rotateLeft(100);
    }
    else if (cursors.right.isDown)
    {
        ship.body.rotateRight(100);
    }
    else
    {
        ship.body.setZeroRotation();
    }

    if (cursors.up.isDown || game.input.pointer1.isDown)
    {
        ship.body.thrust(400);
		ship.animations.play('propulse', 10, true);
    } else {
		ship.animations.stop();
		ship.frame = 0;
	}

}

function render() {

}
