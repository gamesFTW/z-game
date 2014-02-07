function Game() {

}

Game.prototype.constructor = Game;

Game.WIDTH = 1024;
Game.HEIGHT = 768;
Game.box2DMultiplier = 100;

Game.prototype.init = function() {
    this.loadAssets();
};


Game.prototype.loadAssets = function() {
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
    var self = this;
    loader.onComplete = function(){self.onAssetsLoaded()};
    loader.load();
};


Game.prototype.onAssetsLoaded = function() {
    this.build();
};


Game.prototype.build = function() {
    this.loadSound();
    this.createAnimation();
    // let pixi choose WebGL or canvas
    var renderer = PIXI.autoDetectRenderer(Game.WIDTH, Game.HEIGHT);
    // attach render to page
    document.body.appendChild(renderer.view);
    this.renderer = renderer;

    this.timer = (new GlobalTimer()).init();

    //TODO: убрать в другое место!! FPS
    this.stats = new Stats();
    $(".viewport").append(this.stats.domElement);
    this.stats.domElement.style.position = "absolute";

    //this.activeScene = new Sector();
    //this.activeScene.addEventListener(Sector.SECTOR_BUILDED, this.sectorBuildedHandler.bind(this));
    //this.activeScene.init();
    this.activeScene = new SceneMap();
    this.activeScene.init();

    this.mainLoop();
};


Game.prototype.sectorBuildedHandler = function() {
    this.gameInterface = new GameInterface(game);
};


Game.prototype.loadSound = function() {
    if (!createjs.Sound.initializeDefaultPlugins()) {return;}

    var audioPath = "assets/";
    var manifest = [
        {id:"shoot", src:audioPath+"shoot.mp3"},
        {id:"player_hit", src:audioPath+"player_hit.mp3"},
        {id:"player_die", src:audioPath+"player_die.mp3"},
        {id:"zombie_die", src:audioPath+"zombie_die.mp3"}
    ];

    createjs.Sound.addEventListener("loadComplete", function(){});
    createjs.Sound.registerManifest(manifest);
};


Game.prototype.createAnimation = function() {
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


Game.prototype.mainLoop = function() {
    var self = this;

    function loop(){
        // TODO Cчитываем кнопки пользователя

        // Считаем таймер для делеев и симуляци
        self.timer.tick();
        // TODO Пройтись по всем активным стейджам и запустить их лупы
        self.activeScene.loop();

        self.stats.update();
        requestAnimFrame(loop);
    }

    loop();
};



