
modules.define(
    'SectorOptions',
    ['GameOptions'],
    function(provide, GameOptions) {
        Sector = {};
        Sector.TILE_SIZE = 20;
        Sector.TILE_SIZE_BOX2D = Sector.TILE_SIZE / GameOptions.box2DMultiplier;

        provide(Sector);
});

modules.define(
    'Sector',
    ['GameOptions', 'SectorOptions', 'Scene', 'Map', 'Timer', 'Camera', 'EnemyManager', 'LiveObject', 'Player', 'Enemy', 'Zombie', 'Wall', 'Bullet', 'Collisions'],
    function(provide, GameOptions, SectorOptions, Scene, Map, Timer, Camera, EnemyManager, LiveObject, Player, Enemy, Zombie, Wall, Bullet, Collisions) {

    function Sector() {

    }

    Sector.prototype = Object.create(Scene.prototype);
    Sector.prototype.constructor = Sector;
    Sector.superclass = Scene.prototype;

    // Static property
    Sector.SECTOR_CLEARED = "sectorCleared";
    Sector.SECTOR_BUILDED = "sectorBuilded";


    Sector.prototype.killsCounter = 0;

    Sector.prototype.init = function(mapPreset, difficultyLevel) {
        Sector.superclass.init.call(this, arguments);

        this._mapPreset = mapPreset;

        this.destroyList = [];
        this.objects2D = [];
        this.timer = (new Timer()).init();

        this.sceneStage = new PIXI.DisplayObjectContainer();

        this.map = new Map();
        this.map.init(this._mapPreset.map, SectorOptions.TILE_SIZE);

        this.camera = new Camera();
        this.camera.init(this.sceneStage, true, GameOptions.WIDTH, GameOptions.HEIGHT, this.map.width, this.map.height);
        this.stage = this.camera.displayContainer;

        this.createBackground();

        this.box2DWorld = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0),  true);

        // Глобальные столкновения
        var b2Listener = Box2D.Dynamics.b2ContactListener;
        var listener = new b2Listener;
        var self = this;
        listener.PostSolve = function(contact, impulse) {
            self.globalPostSolveHandler(contact, impulse);
        };
        this.box2DWorld.SetContactListener(listener);

        this.createPlayerAt(GameOptions.WIDTH / 2, GameOptions.HEIGHT / 2, this.box2DWorld);

        this.enemyManager = new EnemyManager();
        this.enemyManager.init(this, difficultyLevel);
        this.createSpawnPoints();

        this.createWalls(this.map.giveCopyOfGreed());

        this.dispatchEvent(Sector.SECTOR_BUILDED);
        return this;
    };


    Sector.prototype.start = function() {
        this.enemyManager.nextWave();
    };

    Sector.prototype.destroy = function() {
        this.sceneStage.parent.removeChild(this.sceneStage);
        this.player.inventory.destroy();
    };


    Sector.prototype.createBackground = function() {
        var texture = PIXI.Texture.fromImage("./img/" + this._mapPreset.background);
        this.tilingSprite = new PIXI.TilingSprite(texture, this.map.width, this.map.height);

        this.stage.addChild(this.tilingSprite);
    };


    Sector.prototype.createSpawnPoints = function() {
        var number = 10;
        for (var i = 0; i < number; i++) {
            this.enemyManager.setSpawnPoint(_.random(0, this.map.width), 0);
        }
        for (var i = 0; i < number; i++) {
            this.enemyManager.setSpawnPoint(0, _.random(0, this.map.height));
        }
        for (var i = 0; i < number; i++) {
            this.enemyManager.setSpawnPoint(this.map.width, _.random(0, this.map.height));
        }
        for (var i = 0; i < number; i++) {
            this.enemyManager.setSpawnPoint(_.random(0, this.map.width), this.map.height);
        }
    };


    Sector.prototype.createWalls = function(grid) {
        var self = this;
        var brickTexture = PIXI.Texture.fromFrame("img/small-brick.png");

        function createWall(x, y) {
            self.createObject2DAt(Wall, x, y, brickTexture, true, false);
        }

        function createBorders() {
            var bodyDef = new Box2D.Dynamics.b2BodyDef();
            bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

            function createBorder(width, height, x, y){
                var body = self.box2DWorld.CreateBody(bodyDef);

                var fixture = new Box2D.Dynamics.b2FixtureDef();
                fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
                fixture.shape.SetAsBox(width / GameOptions.box2DMultiplier, height / GameOptions.box2DMultiplier);
                fixture.filter.categoryBits = Collisions.CATEGORY_GAME_BORDER;

                body.CreateFixture(fixture);
                body.SetPosition(new Box2D.Common.Math.b2Vec2(x / GameOptions.box2DMultiplier, y / GameOptions.box2DMultiplier));
            }

            createBorder(self.map.width, 0.01, 0, 0);
            createBorder(0.01, self.map.height, 0, 0);
            createBorder(self.map.width, 0.01, 0, self.map.height);
            createBorder(0.01, self.map.height, self.map.width, 0);
        }

        createBorders();

        for (var x = 0; x < grid.length; x++) {
            for (var y = 0; y < grid[x].length; y++) {
                if (grid[x][y] === 1)
                    createWall(x * SectorOptions.TILE_SIZE + Wall.SIZE, y * SectorOptions.TILE_SIZE + Wall.SIZE);
            }
        }
    };


    Sector.prototype.tickObjects2D = function() {
        for (var i = 0; i < this.objects2D.length; i++) {
            this.objects2D[i].tick();
        }
        return this;
    };


    Sector.prototype.updateViews = function() {
        // Обновляем позиции в PIXI
        for (var i = 0; i < this.objects2D.length; i++) {
            this.objects2D[i].updateView();
        }
        this.camera.refresh();
    };


    Sector.prototype.loop = function() {
        this.timer.tick();
        this.mainLoopDestroyObjectsStep();
        this.tickObjects2D();
        // Симулейтим колижины
        // TODO поставить не 1/60 а реальное время
        this.box2DWorld.Step(1 / 60,  3,  3);
        this.box2DWorld.ClearForces();

        this.updateViews();
    };


    Sector.prototype.createObject2DAt = function(objectClass, x, y, texture, isStatic, isAnimated) {
        var object2D = new objectClass();
        object2D.init(this, x, y, texture, isStatic, isAnimated);
        this.registerObject2D(object2D);

        if (object2D.isLive){
            object2D.addEventListener(LiveObject.DIE, this.liveObjectDieHandler.bind(this));
            object2D.addEventListener(LiveObject.TAKE_DAMAGE, this.liveObjectTakeDamageHandler.bind(this));
        }

        return object2D;
    };


    Sector.prototype.createPlayerAt = function(x, y) {
        var player = this.createObject2DAt(Player, x, y);
        this.registerPlayer(player);
        return player;
    };


    Sector.prototype.registerObject2D = function(obj) {
        this.objects2D.push(obj);
        this.stage.addChild(obj.view);
    };


    Sector.prototype.registerPlayer = function(player) {
        this.player = player;
        // TODO говно же background
        this.player.defineMouseEvents(this.stage);

        var self = this;
        this.player.onShoot = function(vectorFrom, vectorTo, weaponStats){
            self.simpleShoot(vectorFrom, vectorTo, weaponStats);
        };

        player.addEventListener(Player.CHANGE_TILE_POSITION, function(){
            var graph = new AStarGraph(self.map.giveCopyOfGreed());
            var start = graph.nodes[player.tilePosition.x][player.tilePosition.y];

            PathFinder.reset();
            PathFinder.generateMap(graph.nodes, start, true);
            for (var i = 0; i < self.objects2D.length; i++) {
                if (self.objects2D[i].isInstanceOf(Enemy)){
                    self.objects2D[i].targetChangeTilePosition(player.tilePosition);
                }
            }
        });

        this.player.checkChengeTileCoord();

        this.camera.setFolow(this.player.view);
    };


    Sector.prototype.mainLoopDestroyObjectsStep = function() {
        if (this.destroyList.length > 0){
            // Удаляем объекты
            for (var i in this.destroyList) {
                var object = this.destroyList[i];
                this.box2DWorld.DestroyBody(object.body);

                // TODO: Без этого условия часто вылетает, и ругается, что нету парента, похоже в destroyList
                // часто успевает попасть 2 раза один и тот же объект
                if (object.view.parent)
                    this.stage.removeChild(object.view);

                var index = this.objects2D.indexOf(object);
                if (index != -1){
                    this.objects2D.splice(index, 1);
                }

                delete this.destroyList[i];
            }
            this.destroyList = [];
        }
    };


    Sector.prototype.simpleShoot = function(vectorFrom, vectorTo, weaponStats){
        createjs.Sound.play(weaponStats.shotSound, createjs.Sound.INTERRUPT_NONE, 0, 0, false, 0.4);

        for (var i = 0; i < weaponStats.bulletsPerShot; i++){
            this.createSimpleBullet(vectorFrom, vectorTo, weaponStats);
        }
    };


    Sector.prototype.createSimpleBullet = function(vectorFrom, vectorTo, weaponStats) {
        // Погрешность выстрела
        var infelicity = Math.random() * (weaponStats.scatter * 2) - weaponStats.scatter;
        var radian = Math.atan2(vectorTo.y - vectorFrom.y, vectorTo.x - vectorFrom.x) + infelicity;

        var vel = {
            x: Math.cos(radian) * weaponStats.bulletSpeed,
            y: Math.sin(radian) * weaponStats.bulletSpeed
        };
        var pluser = 25;
        var bullet = this.createObject2DAt(Bullet, vectorFrom.x + (vel.x * pluser), vectorFrom.y + (vel.y * pluser));
        bullet.damage = weaponStats.damage;

        bullet.body.ApplyImpulse(
            new Box2D.Common.Math.b2Vec2(vel.x, vel.y),
            bullet.body.GetWorldCenter()
        );

        // self destroy in 10 secs
        var self = this;
        this.timer.delay(function() {
            self.destroyList.push(bullet);
        }, 10 * 1000);
    };


    //---------------------------------------------------------------------------------------------------
    //
    //  Handlers
    //
    //---------------------------------------------------------------------------------------------------
    Sector.prototype.liveObjectDieHandler = function(event) {
        var object2D = event.currentTarget;
        if (object2D.isInstanceOf(Enemy)) {
            this.killsCounter++;
            if (this.killsCounter >= this.enemyManager.enemiesRespawned) {
                if (this.enemyManager.is_waves_finished) {
                    this.dispatchEvent(Sector.SECTOR_CLEARED);
                } else {
                    this.enemyManager.nextWaveRightNow();
                }
            }
        } else if (object2D.isInstanceOf(Player)) {
            alert("YOU LOSE!");
            delete window.game;
        }

        var texture = PIXI.Texture.fromImage("./img/blood-big.png");
        var boodSprite = new PIXI.Sprite(texture);
        boodSprite.x = object2D.getX();
        boodSprite.y = object2D.getY();
        boodSprite.anchor.x = 0.5;
        boodSprite.anchor.y = 0.5;
        boodSprite.rotation = Math.random() * Math.PI * 2;
        this.tilingSprite.addChild(boodSprite);

        this.destroyList.push(object2D);
    };

    Sector.prototype.liveObjectTakeDamageHandler = function(event) {
        var object2D = event.currentTarget;

        var texture = PIXI.Texture.fromImage("./img/blood.png");
        var boodSprite = new PIXI.Sprite(texture);
        boodSprite.x = object2D.getX();
        boodSprite.y = object2D.getY();
        boodSprite.anchor.x = 0.5;
        boodSprite.anchor.y = 0.5;
        boodSprite.rotation = Math.random() * Math.PI * 2;
        this.tilingSprite.addChild(boodSprite);
    };


    Sector.prototype.globalPostSolveHandler = function(contact, impulse) {
        this.timer.delay(function() {
            // Если убрать делей, то при смерти последнего зомби в вейве сработает 
            // nextWaveRightNow, и создаст зомби. Но так как данное событие срабатывает
            // в фазе box2d locked, body не создастся и все рухнет.
            var objectA = contact.GetFixtureA().GetBody().GetUserData();
            var objectB = contact.GetFixtureB().GetBody().GetUserData();

            if(objectA && objectB){
                // Столкновение пули с неживыми предметами
                if (
                    objectA.isInstanceOf(Bullet) && !objectB.isInstanceOf(LiveObject) ||
                    objectB.isInstanceOf(Bullet) && !objectA.isInstanceOf(LiveObject)
                    ){
                    var velocity = objectA.body.GetLinearVelocity();
                    var speed = Number(Math.abs(velocity.x).toFixed(4)) + Number(Math.abs(velocity.y).toFixed(4));

                    if (speed < 5){
                        this.destroyList.push(objectA);
                    }
                }

                if (
                    objectA.isInstanceOf(Bullet) && objectB.isInstanceOf(LiveObject) ||
                    objectB.isInstanceOf(Bullet) && objectA.isInstanceOf(LiveObject)
                    ){
                    var bullet, enemy;
                    // определяем кто из них кто
                    if (objectA.isInstanceOf(Bullet)){
                        bullet = objectA;
                        enemy = objectB;
                    } else {
                        bullet = objectB;
                        enemy = objectA;
                    }

                    this.destroyList.push(bullet);
                    enemy.takeDamage(bullet.damage);
                }

                if ((objectA.isInstanceOf(Zombie) && objectB.isInstanceOf(Player)) ||
                    (objectA.isInstanceOf(Player) && objectB.isInstanceOf(Zombie))){
                    var player, zombie;
                    // определяем кто из них кто
                    if (objectA.isInstanceOf(Player)){
                        player = objectA;
                        zombie = objectB;
                    } else {
                        player = objectB;
                        zombie = objectA;
                    }

                    zombie.attackLiveObjectWithMeleeWeapon(player);
                }
            }
        }.bind(this), 0);
    };

    provide(Sector);
});
