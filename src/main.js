var assetsToLoader = ["img/zombieSprite.json", "img/blue-man.png", "img/brick.png"];

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

function onAssetsLoaded()
{
    // create an array to store the textures
    var zombieTextures = [];
    for (var i=0; i < 25; i++)
    {
        var texture = PIXI.Texture.fromFrame("zombie_" + (i) + ".png");
        zombieTextures.push(texture);
    }

    var zombies = 100;
    // create a texture from an image path
    // add a bunch of aliens
    for (var i = 0; i < zombies; i++) {
        // create an explosion MovieClip
        var zombie = new Zombie();
        zombie.init(zombieTextures, game.world, false, true);

        zombie.setPosition(Math.random() * Game.WIDTH, Math.random() * Game.HEIGHT);
        zombie.body.SetAngle(Math.random() * Math.PI);

        zombie.view.gotoAndPlay(Math.random() * 24);
        zombie.view.animationSpeed  = 0.3;

        game.registerObject2D(zombie);
    }

    createWalls();

    var player = new Player();
    var manTexture = PIXI.Texture.fromFrame("img/blue-man.png");
    console.log(manTexture);
    player.init(manTexture, game.world, false, false);
    player.setPosition(Game.WIDTH / 2, Game.HEIGHT / 2);
//    player.body.SetAngle(Math.random() * Math.PI);
    game.registerObject2D(player);
    game.registerPlayer(player);



    game.mainLoop();
}


function createWalls(){
    var brickTexture = PIXI.Texture.fromFrame("img/brick.png");

    function createWall(x, y){
        var brick = new Wall();
        brick.init(brickTexture, game.world, true, false);
        brick.setPosition(x, y);
        game.registerObject2D(brick);
    }

//    for (var i = 0; i < 50; i++) {
//        createWall(
//            _.random(0, game.withInTile) * Game.TILE_SIZE,
//            _.random(0, game.heightInTile) * Game.TILE_SIZE
//        );
//    }

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


