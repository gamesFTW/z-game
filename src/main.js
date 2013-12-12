$(function(){
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

    loader.onComplete = onAssetsLoaded;
    loader.load();

    // let pixi choose WebGL or canvas
    var renderer = PIXI.autoDetectRenderer(Game.WIDTH, Game.HEIGHT);
    // attach render to page
    document.body.appendChild(renderer.view);

    window.game = new Game();
    window.game.init(renderer);

    var gameInterface = new GameInterface(game);

    loadSound();
});


function createAnimation() {
    // create an array to store the textures
    var zombiesTexturesData = [
        {
            prefix: "zombie",
            obj: Zombie
        },
        {
            prefix: "zombieLightBlue",
            obj: ZombieFast
        },
        {
            prefix: "zombieRed",
            obj: ZombieDamage
        },
    ];

    zombiesTexturesData.forEach(function(ztd) {
        var zombieTextures = [];
        for (var i=0; i < 25; i++)
        {
            var texture = PIXI.Texture.fromFrame(ztd.prefix + "_" + (i) + ".png");
            zombieTextures.push(texture);
        }
        ztd.obj.TEXTURE = zombieTextures;
    });

}

function onAssetsLoaded() {
    createAnimation();

    var enemyManager= new EnemyManager();
    enemyManager.init();

    game.activeScene.createPlayerAt(Game.WIDTH / 2, Game.HEIGHT / 2, game.activeScene.box2DWorld);

    // for (var i = 0; i < 1; i++) {
    //     enemyManager.spawn({x:0, y:0});
    // }

    var number = 10;
    for (var i = 0; i < number; i++) {
        enemyManager.setSpawnPoint(_.random(0, game.activeScene.map.width), 0);
    }
    for (var i = 0; i < number; i++) {
        enemyManager.setSpawnPoint(0, _.random(0, game.activeScene.map.height));
    }
    for (var i = 0; i < number; i++) {
        enemyManager.setSpawnPoint(game.activeScene.map.width, _.random(0, game.activeScene.map.height));
    }
    for (var i = 0; i < number; i++) {
        enemyManager.setSpawnPoint(_.random(0, game.activeScene.map.width), game.activeScene.map.height);
    }

     enemyManager.setSpawnPoint(0, 0)
         .setSpawnPoint(Game.WIDTH, 0)
         .setSpawnPoint(0, Game.HEIGHT)
         .setSpawnPoint(Game.WIDTH, Game.HEIGHT);


    createWalls(game.activeScene.map.giveCopyOfGreed());
    game.mainLoop();
}


function createWalls(grid){
    var brickTexture = PIXI.Texture.fromFrame("img/brick.png");

    function createWall(x, y) {
        game.activeScene.createObject2DAt(Wall, x, y, brickTexture, true, false);
    }

    function createBorders() {
        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

        function createBorder(width, height, x, y){
            var body = game.activeScene.box2DWorld.CreateBody(bodyDef);

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

   // createBorders();
//    for (var i = 0; i < 20; i++) {
//        createWall(
//            _.random(0, game.withInTile) * Game.TILE_SIZE,
//            _.random(0, game.heightInTile) * Game.TILE_SIZE
//        );
//    }

    for (var x = 0; x < grid.length; x++) {
        for (var y = 0; y < grid.length; y++) {
            if (grid[x][y] === 1)
                createWall(x * Sector.TILE_SIZE + 20, y * Sector.TILE_SIZE + 20);
        }
    }
}

function loadSound() {
    if (!createjs.Sound.initializeDefaultPlugins()) {return;}

    var audioPath = "assets/";
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
