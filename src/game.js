modules.define(
    'GameOptions', [], function(provide) {
    var Game = {};
    Game.WIDTH = 1024;
    Game.HEIGHT = 768;
    Game.box2DMultiplier = 100;
    Game.MAP_PRESETS_FILENAMES = [
        "simple_desert.json",
        "simple_ruins.json"
    ];

    provide(Game);
});

modules.define(
    'Game',
    ['GameOptions', 'SceneMap', 'Sector', 'Zombie', 'ZombieFast', 'ZombieDamage'],
    function(provide, GameOptions, SceneMap, Sector, Zombie, ZombieFast, ZombieDamage) {


    function Game() {

    }

    Game.prototype.constructor = Game;

    Game.prototype.scenesList = [];
    Game.prototype.mapPresets = {};

    Game.prototype.init = function() {
        this.loadAssets();
    };


    Game.prototype.loadAssets = function() {
        this.loadJSON();

        var assetsToLoader = [
            "img/zombieSprite.json",
            "img/zombieLightBlueSprite.json",
            "img/zombieRedSprite.json",
            "img/blue-man.png",
            "img/small-brick.png",
            "img/brick.png",
            "img/bullet.png"
        ];

        // create a new loader
        var loader = new PIXI.AssetLoader(assetsToLoader);
        var self = this;
        loader.onComplete = function(){self.onAssetsLoaded();};
        loader.load();
    };


    Game.prototype.loadJSON = function(){
        // TODO: Нужно подождать пока все загружиться
        for (var i = 0; i < GameOptions.MAP_PRESETS_FILENAMES.length; i++) {
            $.getJSON("assets/map_presets/" + GameOptions.MAP_PRESETS_FILENAMES[i], function(data) {
                this.mapPresets[data.name] = data;
            }.bind(this));
        }
    };


    Game.prototype.onAssetsLoaded = function() {
        this.build();
    };


    Game.prototype.build = function() {
        this.loadSound();
        this.createAnimation();
        // let pixi choose WebGL or canvas
        var renderer = PIXI.autoDetectRenderer(GameOptions.WIDTH, GameOptions.HEIGHT);
        // attach render to page
        document.body.appendChild(renderer.view);
        this.renderer = renderer;

        //TODO: убрать в другое место!! FPS
        this.stats = new Stats();
        $(".viewport").append(this.stats.domElement);
        this.stats.domElement.style.position = "absolute";

        this.createSceneMap();

        this.mainLoop();
    };


    Game.prototype.createSceneMap = function() {
        var sceneMap = new SceneMap();
        sceneMap.addEventListener(
            SceneMap.PLAYER_ENCOUNTERED_ENEMIES,
            this.playerEncounteredEnemiesHandler.bind(this)
        );

        sceneMap.init();

        this.activeScene = sceneMap;

        this.scenesList.push(sceneMap);
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
    };


    Game.prototype.mainLoop = function() {
        var self = this;

        function loop(){
            // TODO Cчитываем кнопки пользователя

            // Считаем таймер для делеев и симуляци
            // TODO Пройтись по всем активным стейджам и запустить их лупы
            self.activeScene && self.activeScene.loop();

            self.stats.update();
            requestAnimFrame(loop);
        }

        loop();
    };


    Game.prototype.createSector = function() {
        var mapPreset = this.getRandomMapPreset();
        var sector = new Sector();
        sector.addEventListener(Sector.SECTOR_BUILDED, this.sectorBuildedHandler.bind(this));
        sector.addEventListener(Sector.SECTOR_CLEARED, this.sectorClearedHandler.bind(this));
        sector.init(mapPreset);

        this.scenesList.push(sector);

        return sector;
    };


    Game.prototype.getRandomMapPreset = function() {
        return this.mapPresets[_.sample(_.keys(this.mapPresets))];
    };


    Game.prototype.changeActiveScene = function(newScene) {
        var oldScene = this.activeScene;
        this.activeScene = newScene;
        this.activeScene.active();
        oldScene.disactive();
    };

    // HANDLERS
    Game.prototype.sectorBuildedHandler = function() {
        this.gameInterface = new GameInterface(game);
    };

    Game.prototype.sectorClearedHandler = function(event) {
        var sector = event.currentTarget;
        this.changeActiveScene(this.scenesList[0]);
        sector.destroy();
        this.scenesList.pop();
    };

    Game.prototype.playerEncounteredEnemiesHandler = function(event) {
        var sector = this.createSector();
        this.changeActiveScene(sector);
    };


    provide(Game);
});

