modules.define(
    'Zombie', ['Enemy', 'Collisions'], function (provide, Enemy, Collisions) {

    function Zombie() {

    }

    Zombie.prototype = Object.create( Enemy.prototype );
    Zombie.prototype.constructor = Zombie;
    Zombie.superclass = Enemy.prototype;


    Zombie.prototype.isStatic = false;


    Zombie.difficulty = 1;
    Zombie.prototype.damage = 10;
    Zombie.prototype.acceleration  = 0.06;


    Zombie.prototype.soundDie = "zombie_die";


    Zombie.prototype.init = function(world, x, y, texture, isStatic, isAnimated) {
        Zombie.superclass.init.call(this, world, x, y, texture, isStatic, isAnimated);

        this.acceleration += Math.random() / 100;
    };


    Zombie.prototype.createFixture = function(){
        this.body.CreateFixture(Zombie.POLY_FIXTURE);
    };


    Zombie.prototype.createTexture = function(){
        this.view = new PIXI.MovieClip(Zombie.TEXTURE);

        this.view.gotoAndPlay(_.random(0,24));
        this.view.animationSpeed = 0.3;
    };


    Zombie.prototype._changeDirectionCounter = 100;
    Zombie.prototype._changeDirection = 100;
    Zombie.prototype._radianInfelicity = 0;
    Zombie.prototype._radianWithInfelicity = 0;
    Zombie.prototype._infelicityX = 0;
    Zombie.prototype._infelicityY = 0;


    Zombie.POLY_FIXTURE = new Box2D.Dynamics.b2FixtureDef();
    Zombie.POLY_FIXTURE.shape = new Box2D.Collision.Shapes.b2PolygonShape();
    Zombie.POLY_FIXTURE.density = 80;
    Zombie.POLY_FIXTURE.shape.SetAsBox(5 / 100, 5 / 100);
    Zombie.POLY_FIXTURE.filter.categoryBits = Collisions.CATEGORY_MONSTER;
    Zombie.POLY_FIXTURE.filter.maskBits = Collisions.MASK_MONSTER;

    provide(Zombie);
});

modules.define(
    'ZombieFast', ['Zombie'], function (provide, Zombie) {

    function ZombieFast() {

    }
    ZombieFast.prototype = Object.create( Zombie.prototype );
    ZombieFast.prototype.constructor = ZombieFast;

    ZombieFast.difficulty = 2;
    ZombieFast.prototype.hp = 50;
    ZombieFast.prototype.acceleration = 0.08;
    // ZombieFast.prototype.maxSpeed = 0.6;
    // ZombieFast.prototype.dullness = 0.2;


    ZombieFast.prototype.createTexture = function(){
        this.view = new PIXI.MovieClip(ZombieFast.TEXTURE);

        this.view.gotoAndPlay(_.random(0,24));
        this.view.animationSpeed = 0.45;
    };

    provide(ZombieFast);
});


modules.define(
    'ZombieDamage', ['Zombie'], function (provide, Zombie) {

    function ZombieDamage() {

    }
    ZombieDamage.prototype = Object.create( Zombie.prototype );
    ZombieDamage.prototype.constructor = ZombieDamage;

    // ZombieDamage.prototype.dullness = 0.2;
    ZombieDamage.difficulty = 1.5;
    ZombieDamage.prototype.damage = 30;
    ZombieDamage.prototype.hp = 200;


    ZombieDamage.prototype.createTexture = function(){
        this.view = new PIXI.MovieClip(ZombieDamage.TEXTURE);

        this.view.gotoAndPlay(_.random(0,24));
        this.view.animationSpeed = 0.18;
    };

    provide(ZombieDamage);
});


modules.define(
    'ZombieJump', ['Zombie', 'AbilityJump'], function (provide, Zombie, AbilityJump) {

    function ZombieJump() {

    }
    ZombieJump.prototype = Object.create( Zombie.prototype );
    ZombieJump.prototype.constructor = ZombieJump;
    ZombieJump.prototype.superclass = Zombie.prototype;

    ZombieJump.difficulty = 2.5;
    ZombieJump.prototype.damage                 = 30;
    ZombieJump.prototype.hp                     = 100;
    ZombieJump.prototype.distanceDesideToJump   = 150;
    ZombieJump.prototype.abilityList            = null;

    ZombieJump.prototype.createTexture = function() {
        this.view = new PIXI.MovieClip(ZombieJump.TEXTURE);

        this.view.gotoAndPlay(_.random(0,24));
        this.view.animationSpeed = 0.45;
    };

    ZombieJump.prototype.init = function() {
        this.abilityList = [
            (new AbilityJump()).init(3 * 1000, 2)
        ];

        this.superclass.init.apply(this, arguments);
    };

    ZombieJump.prototype.abilityTick = function() {
        // can i Jump?
        if (this.canSeePlayer) {
            if (! this.isJumping) {
                if (this.calcDistance(game.activeScene.player) < this.distanceDesideToJump) {
                    var position = game.activeScene.player.getPosition('box2D');
                    this.abilities.jump(position);
                }
            }
        }
    };

    provide(ZombieJump);
});
