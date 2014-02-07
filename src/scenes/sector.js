function Sector() {

}

Sector.prototype = Object.create(Scene.prototype);
Sector.prototype.constructor = Sector;
Sector.superclass = Scene.prototype;

// Static property
Sector.SECTOR_CLEARED = "sectorCleared";
Sector.SECTOR_BUILDED = "sectorBuilded";

Sector.TILE_SIZE = 40;
Sector.TILE_SIZE_BOX2D = Sector.TILE_SIZE / Game.box2DMultiplier;

Sector.prototype.killsCounter = 0;

Sector.prototype.init = function() {
    Sector.superclass.init.call(this, arguments);

    this.destroyList = [];
    this.objects2D = [];
    this.timer = (new Timer()).init();

    this.pixiStage = new PIXI.Stage(0xEEFFFF, true);

    this.map = new Map();
    this.map.init([
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,0,1,1,0],
        [0,1,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],
        [0,1,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0],
        [0,1,1,0,1,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,1,1,1,1,1,0,1,1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,0,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1],
        [0,1,0,0,0,1,0,0,1,0,0,0,0,1,0,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,0,1],
        [0,1,1,1,0,1,0,0,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,1,0,1,1,1,1,1,0,0,0,0,1,0,0,0,1,0,0,1,1,0,1,1,1,1,1,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,1,1,0,0,0],
        [0,1,1,0,1,1,1,1,1,1,0,0,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],
        [0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
        [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0],
        [0,0,0,0,0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],
        [1,1,1,0,0,1,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,1,0,0,1,1,1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,1,1,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,1,1,0,1],
        [1,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0],
        [0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,1,0,0,1,1,0,1,1,1,1,1,0,0,0,0,1,0,0,0,1,0,0,1,1,0,1,1,1,1,1,0,0,0,0],
    ],
    Sector.TILE_SIZE);

    //TODO убрать this
    this.camera = new Camera();
    this.camera.init(this.pixiStage, Game.WIDTH, Game.HEIGHT);
    this.stage = this.camera.displayContainer;

    //TODO: перенести бг, но куда?
    this.background = PIXI.Sprite.fromImage("./img/bg.jpg");
    this.stage.addChild(this.background);

    this.background2 = PIXI.Sprite.fromImage("./img/bg.jpg");
    this.background2.position.x = 1366;
    this.stage.addChild(this.background2);

    this.background3 = PIXI.Sprite.fromImage("./img/bg.jpg");
    this.background3.position.y = 768;
    this.stage.addChild(this.background3);

    this.background4 = PIXI.Sprite.fromImage("./img/bg.jpg");
    this.background4.position.x = 1366;
    this.background4.position.y = 768;
    this.stage.addChild(this.background4);

    this.box2DWorld = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0),  true);

    // Глобальные столкновения
    var b2Listener = Box2D.Dynamics.b2ContactListener;
    var listener = new b2Listener;
    var self = this;
    listener.PostSolve = function(contact, impulse) {
        self.globalPostSolveHandler(contact, impulse);
    };
    this.box2DWorld.SetContactListener(listener);

    this.createPlayerAt(Game.WIDTH / 2, Game.HEIGHT / 2, this.box2DWorld);

    this.enemyManager = new EnemyManager();
    this.enemyManager.init(this);
    this.createSpawnPoints();

    this.createWalls(this.map.giveCopyOfGreed());

    this.dispatchEvent(Sector.SECTOR_BUILDED);
    return this;
};

Sector.prototype.destroy = function() {

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

    this.enemyManager.setSpawnPoint(0, 0)
        .setSpawnPoint(Game.WIDTH, 0)
        .setSpawnPoint(0, Game.HEIGHT)
        .setSpawnPoint(Game.WIDTH, Game.HEIGHT);

};


Sector.prototype.createWalls = function(grid) {
    var self = this;
    var brickTexture = PIXI.Texture.fromFrame("img/brick.png");

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
};


Sector.prototype.tickObjects2D = function() {
    for (var i = 0; i < this.objects2D.length; i++) {
        this.objects2D[i].tick();
    }
    return this;
};


Sector.prototype.render = function() {
    // Обновляем позиции в PIXI
    for (var i = 0; i < this.objects2D.length; i++) {
        this.objects2D[i].updateView();
    }
    this.camera.refresh();
    // Рендерим
    game.renderer.render(this.pixiStage);
};


Sector.prototype.loop = function() {
    this.timer.tick();
    this.mainLoopDestroyObjectsStep();
    this.tickObjects2D();
    // Симулейтим колижины
    // TODO поставить не 1/60 а реальное время
    this.box2DWorld.Step(1 / 60,  3,  3);
    this.box2DWorld.ClearForces();

    this.render();
};


Sector.prototype.createObject2DAt = function(objectClass, x, y, texture, isStatic, isAnimated) {
    var object2D = new objectClass();
    object2D.init(this, x, y, texture, isStatic, isAnimated);
    this.registerObject2D(object2D);

    if (object2D.isLive){
        object2D.addEventListener(LiveObject.DIE, this.liveObjectDieHandler.bind(this));
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
        if (this.killsCounter >= 100) {
            this.dispatchEvent(Sector.SECTOR_CLEARED);
        }
    }

    this.destroyList.push(object2D);
};


Sector.prototype.globalPostSolveHandler = function(contact, impulse) {
    var objectA = contact.GetFixtureA().GetBody().GetUserData();
    var objectB = contact.GetFixtureB().GetBody().GetUserData();

    if(objectA && objectB){
        if (objectA.isInstanceOf(Bullet)){
            var velocity = objectA.body.GetLinearVelocity();
            var speed = Number(Math.abs(velocity.x).toFixed(4)) + Number(Math.abs(velocity.y).toFixed(4));

            if (speed < 5){
                this.destroyList.push(objectA);
            }
        }

        if (objectA.isInstanceOf(Bullet) && objectB.isInstanceOf(LiveObject)){
            this.destroyList.push(objectA);
            objectB.takeDamage(objectA.damage);
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
};
