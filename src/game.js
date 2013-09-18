function Game() {
    this.tileSize = 20;
};

Game.prototype.constructor = Game;


Game.prototype.init = function(renderer) {
    this.destroyList = [];
    this.objects2D = [];

    this.withInTile = Game.WIDTH / Game.TILE_SIZE;
    this.heightInTile = Game.HEIGHT / Game.TILE_SIZE;

    this.renderer = renderer;

    this.stage = new PIXI.Stage(0xEEFFFF, true);
    this.stage.hitArea = new PIXI.Rectangle(0, 0, Game.WIDTH, Game.HEIGHT);
    //TODO: перенести бг
    this.background = PIXI.Sprite.fromImage("./img/bg.jpg");
    this.stage.addChild(this.background);
    this.background.setInteractive(true);

    this.world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0),  true);

    //TODO: убрать в другое место
    const container = document.createElement("div");
    document.body.appendChild(container);
    this.stats = new Stats();
    container.appendChild(this.stats.domElement);
    this.stats.domElement.style.position = "absolute";






    var b2Listener = Box2D.Dynamics.b2ContactListener;
    var listener = new b2Listener;

    var self = this;
    listener.PostSolve = function(contact, impulse) {
        var objectA = contact.GetFixtureA().GetBody().GetUserData();
        var objectB = contact.GetFixtureB().GetBody().GetUserData();

        if (objectA.__proto__.constructor == Bullet){
            var velocity = objectA.body.GetLinearVelocity();
            var speed = Number(Math.abs(velocity.x).toFixed(4)) + Number(Math.abs(velocity.y).toFixed(4));

            if (speed < 2){
                self.destroyList.push(objectA);
            }
        }

        if (objectA.__proto__.constructor == Bullet && objectB.isLive){
            self.destroyList.push(objectA);
            objectB.takeDamage(20);
        }
    };
    this.world.SetContactListener(listener);
};


Game.prototype.createObject2DAt = function(objectClass, x, y, texture, isStatic, isAnimated) {
    var object2D = new objectClass();
    object2D.init(this.world, x, y, texture, isStatic, isAnimated);
    this.registerObject2D(object2D);

    if (object2D.isLive){
        var self = this;
        object2D.onDie = function(object){
            self.onLiveObjectDie(object);
        };
    }

    return object2D;
};


Game.prototype.createPlayerAt = function(x, y) {
    var player = this.createObject2DAt(Player, x, y);
    this.registerPlayer(player);
    return player;
};


Game.prototype.registerObject2D = function(obj) {
    this.objects2D.push(obj);
    // TODO: не скармливать внутрь
    obj.game = this;
    this.stage.addChild(obj.view);
};


Game.prototype.registerPlayer = function(player) {
    this.player = player;
    // TODO говно же background
    this.player.defineMouseEvents(this.background);

    var self = this;
    this.player.onShoot = function(x, y){
        self.playerShootHandler(x, y);
    };
};


Game.prototype.globalTimer = function() {
    // Палит всякие обновления делев
};


Game.prototype.reRender = function() {
    // Обновляем позиции в PIXI
    for (var i = 0; i < this.objects2D.length; i++) {
        this.objects2D[i].updateView();
    }
    // Рендерим
    this.renderer.render(this.stage);
};


Game.prototype.tickObjects2D = function() {
    for (var i = 0; i < this.objects2D.length; i++) {
        this.objects2D[i].tick();
    }
};


Game.prototype.mainLoop = function() {
    var self = this;

    function loop(){
        self.mainLoopDestroyObjectsStep();
        // Cчитываем кнопки пользователя

        // Считаем таймер для делеев и симуляци

        // Тикает все тикающие объекты
        self.tickObjects2D();
        // Эмулейтим колижины TODO поставить не 1/60 а реальное время
        self.world.Step(1 / 60,  3,  3);
        self.world.ClearForces();

        // Резолвим эвенты от колижинов и другие подсчеты
        self.reRender();

        //TODO посмотреть нужно ли это засовывать сюда или можно один раз вызвать
        requestAnimFrame(loop);
        self.stats.update();
    }

    loop();
};


Game.prototype.mainLoopDestroyObjectsStep = function() {
    if (this.destroyList.length > 0){
        // Удаляем объекты
        for (var i in this.destroyList) {
            var object = this.destroyList[i];
            this.world.DestroyBody(object.body);

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



//--------------------------------------------------------------------------------------------------------------
//
//  Handlers
//
//--------------------------------------------------------------------------------------------------------------
Game.prototype.playerShootHandler = function(x, y){
    // TODO: сделать универсальную функцию shootAt, которой можно скармить как Object2d, так и координаты

    var playerX = this.player.getX();
    var playerY = this.player.getY();

    // Погрешность выстрела
    var infelicity = Math.random() * (0.1 * 2) - 0.1;
    var radian = Math.atan2(y - playerY, x - playerX) + infelicity;

    var speed = 1;
    var vel = {
        x: Math.cos(radian) * speed,
        y: Math.sin(radian) * speed
    };

    var bullet = this.createObject2DAt(Bullet, playerX + (vel.x * 10), playerY + (vel.y * 10));

    bullet.body.ApplyImpulse(
        new Box2D.Common.Math.b2Vec2(vel.x, vel.y),
        bullet.body.GetWorldCenter()
    );
};


Game.prototype.onLiveObjectDie = function(object){
    this.destroyList.push(object);
};

// Static property
Game.TILE_SIZE = 40;
Game.WIDTH = 1024;
Game.HEIGHT = 768;
