function Zombie() {

}

Zombie.prototype = Object.create( LiveObject.prototype );

Zombie.prototype.constructor = Zombie;
Zombie.prototype.isStatic = false;


Zombie.prototype.damage = 10;


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

Zombie.prototype.tick = function() {
    var zombiePosition = this.body.GetPosition();
//    console.log(this._infelicityX);

    var self = this;
    function randomateInfelicity(){
        // Рандомим погрешность, что бы зомби не шли по прямой на плеера.
        var infelicity = Math.random() * (1 - 0) + 1;
        self._radianInfelicity = _.random(- infelicity, infelicity);
    }

    if (this._changeDirectionCounter >= this._changeDirection){
        randomateInfelicity();

        this._changeDirectionCounter = 0;
    }
    else
        this._changeDirectionCounter ++;

    var playerPosition = this.game.player.body.GetPosition();
    var playerX = playerPosition.x + this._infelicityX,
        playerY = playerPosition.y + this._infelicityY;

    var radian = Math.atan2(playerY - zombiePosition.y, playerX - zombiePosition.x);
    this._radianWithInfelicity = radian + this._radianInfelicity;

    var speed = 0.015;


    var MAX_VELOCITY = 0.4;

    var velocity = this.body.GetLinearVelocity();

    var newVelocity = new Box2D.Common.Math.b2Vec2(
        Math.cos(this._radianWithInfelicity) * speed,
        Math.sin(this._radianWithInfelicity) * speed
    );


    if ((Math.abs(newVelocity.x + velocity.x) > MAX_VELOCITY) && signum(newVelocity.x) == signum(velocity.x))
        newVelocity.x = 0;

    if ((Math.abs(newVelocity.y + velocity.y) > MAX_VELOCITY) && signum(newVelocity.y) == signum(velocity.y))
        newVelocity.y = 0;

    this.body.ApplyImpulse(
        newVelocity,
        this.body.GetWorldCenter()
    );

    // Rotate in right angle
    var radian = Math.atan2(velocity.y, velocity.x);
    var newRotation = radian - (90 * (Math.PI / 180));
    this.body.SetAngle(newRotation);
};


Zombie.POLY_FIXTURE = new Box2D.Dynamics.b2FixtureDef();
Zombie.POLY_FIXTURE.shape = new Box2D.Collision.Shapes.b2PolygonShape();
Zombie.POLY_FIXTURE.density = 80;
Zombie.POLY_FIXTURE.shape.SetAsBox(5 / 100, 5 / 100);
Zombie.POLY_FIXTURE.filter.categoryBits = Collisions.CATEGORY_MONSTER;
Zombie.POLY_FIXTURE.filter.maskBits = Collisions.MASK_MONSTER;





