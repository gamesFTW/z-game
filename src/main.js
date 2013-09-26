var assetsToLoader = [
    "img/zombieSprite.json",
    "img/zombieLightBlueSprite.json",
    "img/zombieRedSprite.json",
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

var gameInterface = new GameInterface(game);

function createAnimation(){
    // create an array to store the textures
    var zombieTextures = [];
    for (var i=0; i < 25; i++)
    {
        var texture = PIXI.Texture.fromFrame("zombie_" + (i) + ".png");
        zombieTextures.push(texture);
    }
    Zombie.TEXTURE = zombieTextures;


    zombieTextures = [];
    for (i=0; i < 25; i++)
    {
        texture = PIXI.Texture.fromFrame("zombieLightBlue_" + (i) + ".png");
        zombieTextures.push(texture);
    }
    ZombieFast.TEXTURE = zombieTextures;


    zombieTextures = [];
    for (i=0; i < 25; i++)
    {
        texture = PIXI.Texture.fromFrame("zombieRed_" + (i) + ".png");
        zombieTextures.push(texture);
    }
    ZombieDamage.TEXTURE = zombieTextures;
}

function onAssetsLoaded()
{
    createAnimation();

//    var zombies = 1;
//    for (var i = 0; i < zombies; i++) {
//        game.createObject2DAt(ZombieFast, Math.random() * Game.WIDTH, Math.random() * Game.HEIGHT);
//    }
    var zombieManager = new ZombieManager();
    zombieManager.init();
    zombieManager.setSpawnPoint(0, 0);
    zombieManager.setSpawnPoint(Game.WIDTH, 0);
    zombieManager.setSpawnPoint(0, Game.HEIGHT);
    zombieManager.setSpawnPoint(Game.WIDTH, Game.HEIGHT);

    createWalls();

    game.createPlayerAt(Game.WIDTH / 2, Game.HEIGHT / 2, game.world);
    game.mainLoop();
}


function createWalls(){
    var brickTexture = PIXI.Texture.fromFrame("img/brick.png");

    function createWall(x, y){
        game.createObject2DAt(Wall, x, y, brickTexture, true, false);
    }

    function createBorders(){
        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

        function createBorder(width, height, x, y){
            var body = game.world.CreateBody(bodyDef);

            var fixture = new Box2D.Dynamics.b2FixtureDef();
            fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
            fixture.shape.SetAsBox(width, height);
            fixture.filter.categoryBits = Collisions.CATEGORY_GAME_BORDER;

            body.CreateFixture(fixture);
            body.SetPosition(new Box2D.Common.Math.b2Vec2(x, y));
        }

        createBorder(Game.WIDTH / 100, 0.01, 0, 0);
        createBorder(0.01, Game.HEIGHT / 100, 0, 0);
        createBorder(Game.WIDTH / 100, 0.01, 0, Game.HEIGHT / 100);
        createBorder(0.01, Game.HEIGHT / 100, Game.WIDTH / 100, 0);
    }

    createBorders();
    for (var i = 0; i < 20; i++) {
        createWall(
            _.random(0, game.withInTile) * Game.TILE_SIZE,
            _.random(0, game.heightInTile) * Game.TILE_SIZE
        );
    }

//    for (i = 0; i < game.withInTile + 1; i++) {
//        createWall(
//            i * Game.TILE_SIZE, 0
//        );
//    }
//
//    for (var i = 0; i < game.withInTile + 1; i++) {
//        createWall(
//            i * Game.TILE_SIZE, Game.TILE_SIZE * game.heightInTile
//        );
//    }
//
//    for (i = 0; i < game.heightInTile + 1; i++) {
//        createWall(
//            0, i * Game.TILE_SIZE
//        );
//    }
//
//    for (i = 0; i < game.withInTile + 1; i++) {
//        createWall(
//            Game.WIDTH, Game.TILE_SIZE * i
//        );
//    }
}

function loadSound() {
    if (!createjs.Sound.initializeDefaultPlugins()) {return;}

    var audioPath = "../assets/";
    var manifest = [
        {id:"shoot", src:audioPath+"shoot.mp3"},
        {id:"player_hit", src:audioPath+"player_hit.mp3"},
        {id:"player_die", src:audioPath+"player_die.mp3"},
        {id:"zombie_die", src:audioPath+"zombie_die.mp3"}
    ];

    createjs.Sound.addEventListener("loadComplete", handleLoad);
    createjs.Sound.registerManifest(manifest);
}

function handleLoad(event) {

}

loadSound();
