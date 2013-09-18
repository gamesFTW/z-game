var assetsToLoader = [
    "img/zombieSprite.json",
    "img/blue-man.png",
    "img/brick.png",
    "img/bullet.png"
];

// create a new loader
var loader = new PIXI.AssetLoader(assetsToLoader);

 // use callback
loader.onComplete = onAssetsLoaded;
loader.load();


// let pixi choose WebGL or canvas
var renderer = PIXI.autoDetectRenderer(Game.WIDTH, Game.HEIGHT);
// attach render to page
document.body.appendChild(renderer.view);

var game = new Game();
game.init(renderer);

function createAnimation(){
    // create an array to store the textures
    var zombieTextures = [];
    for (var i=0; i < 25; i++)
    {
        var texture = PIXI.Texture.fromFrame("zombie_" + (i) + ".png");
        zombieTextures.push(texture);
    }

    Zombie.TEXTURE = zombieTextures;
}

function onAssetsLoaded()
{
    createAnimation();

    var zombies = 200;
    for (var i = 0; i < zombies; i++) {
        game.createObject2DAt(Zombie, Math.random() * Game.WIDTH, Math.random() * Game.HEIGHT);
    }

    createWalls();

    game.createPlayerAt(Game.WIDTH / 2, Game.HEIGHT / 2, game.world);
    game.mainLoop();
}


function createWalls(){
    var brickTexture = PIXI.Texture.fromFrame("img/brick.png");

    function createWall(x, y){
        game.createObject2DAt(Wall, x, y, brickTexture, true, false);
    }

    for (var i = 0; i < 50; i++) {
        createWall(
            _.random(0, game.withInTile) * Game.TILE_SIZE,
            _.random(0, game.heightInTile) * Game.TILE_SIZE
        );
    }

    for (i = 0; i < game.withInTile + 1; i++) {
        createWall(
            i * Game.TILE_SIZE, 0
        );
    }

    for (var i = 0; i < game.withInTile + 1; i++) {
        createWall(
            i * Game.TILE_SIZE, Game.TILE_SIZE * game.heightInTile
        );
    }

    for (i = 0; i < game.heightInTile + 1; i++) {
        createWall(
            0, i * Game.TILE_SIZE
        );
    }

    for (i = 0; i < game.withInTile + 1; i++) {
        createWall(
            Game.WIDTH, Game.TILE_SIZE * i
        );
    }
}


