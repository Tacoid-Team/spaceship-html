var SpaceShip = SpaceShip || {};

/*
var w = window.innerWidth * window.devicePixelRatio,
h = window.innerHeight * window.devicePixelRatio,
width = (h > w) ? h : w,
height = (h > w) ? w : h;

// Hack to avoid iPad Retina and large Android devices. Tell it to scale up.
if (window.innerWidth >= 1024 && window.devicePixelRatio >= 2)
{
	width = Math.round(width / 2);
	height = Math.round(height / 2);
}
// reduce screen size by one 3rd on devices like Nexus 5
if (window.devicePixelRatio === 3)
{
	width = Math.round(width / 3) * 2;
	height = Math.round(height / 3) * 2;
}*/
width = 800;
height = 480;

SpaceShip.game = new Phaser.Game(width, height, Phaser.AUTO, '');

SpaceShip.game.state.add('Boot', SpaceShip.Boot, true);
SpaceShip.game.state.add('Preload', SpaceShip.Preload);
SpaceShip.game.state.add('MainMenu', SpaceShip.MainMenu);
SpaceShip.game.state.add('Levels', SpaceShip.Levels);
SpaceShip.game.state.add('Game', SpaceShip.Game);

