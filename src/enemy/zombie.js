function Zombie() {

}

Zombie.prototype = Object.create( Enemy.prototype );
Zombie.prototype.constructor = Zombie;
Zombie.superclass = Enemy.prototype;


Zombie.prototype.isStatic = false;


Zombie.prototype.damage = 10;
Zombie.prototype.acceleration  = 0.06;
// Zombie.prototype.dullness  = 1;
// Zombie.prototype.maxSpeed = 0.4;


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

//Zombie.prototype.tick = function() {
//    var zombiePosition = this.body.GetPosition();
////    console.log(this._infelicityX);
//
//    var self = this;
//    function randomateInfelicity(){
//        // Рандомим погрешность, что бы зомби не шли по прямой на плеера.
//        var infelicity = Math.random() * (self.dullness - 0) + self.dullness;
//        self._radianInfelicity = _.random(- infelicity, infelicity);
//    }
//
//    if (this._changeDirectionCounter >= this._changeDirection){
//        randomateInfelicity();
//
//        this._changeDirectionCounter = 0;
//    }
//    else
//        this._changeDirectionCounter ++;
//
//    var playerPosition = game.player.body.GetPosition();
//    var playerX = playerPosition.x + this._infelicityX,
//        playerY = playerPosition.y + this._infelicityY;
//
//    var radian = Math.atan2(playerY - zombiePosition.y, playerX - zombiePosition.x);
//    this._radianWithInfelicity = radian + this._radianInfelicity;
//
//    var velocity = this.body.GetLinearVelocity();
//
//    var newVelocity = new Box2D.Common.Math.b2Vec2(
//        Math.cos(this._radianWithInfelicity) * this.acceleration,
//        Math.sin(this._radianWithInfelicity) * this.acceleration
//    );
//
//
//    if ((Math.abs(newVelocity.x + velocity.x) > this.maxSpeed) && signum(newVelocity.x) == signum(velocity.x))
//        newVelocity.x = 0;
//
//    if ((Math.abs(newVelocity.y + velocity.y) > this.maxSpeed) && signum(newVelocity.y) == signum(velocity.y))
//        newVelocity.y = 0;
//
//    this.body.ApplyImpulse(
//        newVelocity,
//        this.body.GetWorldCenter()
//    );
//
//    // Rotate in right angle
//    var radian = Math.atan2(velocity.y, velocity.x);
//    var newRotation = radian - (90 * (Math.PI / 180));
//    this.body.SetAngle(newRotation);
//};


Zombie.POLY_FIXTURE = new Box2D.Dynamics.b2FixtureDef();
Zombie.POLY_FIXTURE.shape = new Box2D.Collision.Shapes.b2PolygonShape();
Zombie.POLY_FIXTURE.density = 80;
Zombie.POLY_FIXTURE.shape.SetAsBox(5 / 100, 5 / 100);
Zombie.POLY_FIXTURE.filter.categoryBits = Collisions.CATEGORY_MONSTER;
Zombie.POLY_FIXTURE.filter.maskBits = Collisions.MASK_MONSTER;


function ZombieFast() {

}
ZombieFast.prototype = Object.create( Zombie.prototype );
ZombieFast.prototype.constructor = ZombieFast;

ZombieFast.prototype.hp = 50;
ZombieFast.prototype.acceleration = 0.08;
// ZombieFast.prototype.maxSpeed = 0.6;
// ZombieFast.prototype.dullness = 0.2;


ZombieFast.prototype.createTexture = function(){
    this.view = new PIXI.MovieClip(ZombieFast.TEXTURE);

    this.view.gotoAndPlay(_.random(0,24));
    this.view.animationSpeed = 0.45;
};


function ZombieDamage() {

}
ZombieDamage.prototype = Object.create( Zombie.prototype );
ZombieDamage.prototype.constructor = ZombieDamage;

// ZombieDamage.prototype.dullness = 0.2;
ZombieDamage.prototype.damage = 30;


ZombieDamage.prototype.createTexture = function(){
    this.view = new PIXI.MovieClip(ZombieDamage.TEXTURE);

    this.view.gotoAndPlay(_.random(0,24));
    this.view.animationSpeed = 0.3;
};

