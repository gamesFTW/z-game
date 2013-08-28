function Zombie() {
}


Zombie.prototype = Object.create( Object2D.prototype );
Zombie.prototype.constructor = Zombie;


Zombie.prototype.createFixture = function(){
    this.body.CreateFixture(Zombie.POLY_FIXTURE);
};

Zombie.prototype._changeDirectionCounter = 200;
Zombie.prototype._changeDirection = 200;
Zombie.prototype._radianInfelicity = 0;
Zombie.prototype._radianWithInfelicity = 0;

Zombie.prototype.tick = function() {
    var zombiePosition = this.body.GetPosition();

    function randomateInfelicity(){
        // Рандомим погрешность, что бы зомби не шли по прямой на плеера.
        var infelicity = _.random(0, 4);
        self._radianInfelicity = _.random(- infelicity, infelicity);
    }

    if (this._changeDirectionCounter >= this._changeDirection){
//        console.log("Всем смотреть!");
        var playerPosition = this.game.player.body.GetPosition();
        var playerX = playerPosition.x,
            playerY = playerPosition.y;
//        console.log(playerX, playerY);
        randomateInfelicity();

        var radian = Math.atan2(playerY - zombiePosition.y, playerX - zombiePosition.x);
        this._radianWithInfelicity = radian + this._radianInfelicity;

        var newRotation = this._radianWithInfelicity - (90 * (Math.PI / 180));

        this.body.SetAngle(newRotation);

//        self.rotation = self.rotation % 360;
//        var rotation = this.body.GetAngle() % 360;
//        newRotation = newRotation % 360;

//        if (self.rotation < newRotation){
//            var difference = Math.abs(newRotation - self.rotation);
//            if (difference > 180){
//                newRotation = self.rotation - (360 - difference);
//            }
//        }
//        else{
//            difference = Math.abs(self.rotation - newRotation);
//            if (difference > 180){
//                newRotation = self.rotation + (360 - difference);
//            }
//        }

//        var speedOfTurn = Math.round(difference / 4);
//        if (speedOfTurn == 0)
//            speedOfTurn = 1;

//        this.tween({rotation: newRotation}, speedOfTurn);

        this._changeDirectionCounter = 0;
    }
    else
        this._changeDirectionCounter ++;

    var speed = 0.005;
//    this.x += Math.cos(self._radianWithInfelicity) * speed;
//    this.y += Math.sin(self._radianWithInfelicity) * speed;

    this.body.SetPosition(new Box2D.Common.Math.b2Vec2(
        zombiePosition.x + (Math.cos(this._radianWithInfelicity) * speed),
        zombiePosition.y + (Math.sin(this._radianWithInfelicity) * speed)
    ));

//    console.log(zombiePosition);
//    console.log(zombiePosition.x);
//    console.log(zombiePosition.y);
//    this.body.SetPosition(
//        zombiePosition.x,
//        zombiePosition.y
//    );
};


Zombie.POLY_FIXTURE = new Box2D.Dynamics.b2FixtureDef();
Zombie.POLY_FIXTURE.shape = new Box2D.Collision.Shapes.b2PolygonShape();
Zombie.POLY_FIXTURE.density = 80;
Zombie.POLY_FIXTURE.shape.SetAsBox(5 / 100, 5 / 100);
Zombie.POLY_FIXTURE.filter.categoryBits = 2;
Zombie.POLY_FIXTURE.filter.maskBits = 1;





//        zombie.body.ApplyImpulse(
//            new Box2D.Common.Math.b2Vec2(Math.random(), Math.random()),
//            new Box2D.Common.Math.b2Vec2(Math.random(), Math.random())
//        );

//        zombie._rotationTick =          0;
//        zombie._changeDirectionCounter = 0;
//        zombie._changeDirection =      0;
//        zombie._radianWithInfelicity = 0;
//        zombie._speed = 0.5;
//        zombie._changeDirection = _.random(50, 200);

//        zombie.tick = function() {
//            var playerY = 300,
//                playerX = 400;
//            var self = this;
//            function randomateInfelicity(){
//                var infelicity = _.random(0, 4);
//                self._radianInfelicity = _.random(- infelicity, infelicity);
//            }
//            randomateInfelicity();
//
//            if (self._changeDirectionCounter >= self._changeDirection){
//                var radian = Math.atan2(playerY - this.position.y, playerX - this.position.x);
//                self._radianWithInfelicity = radian + this._radianInfelicity;
//
//                var newRotation = (self._radianWithInfelicity * (180/PI)) - 90;
//
//                //self.rotation = self.rotation % 360;
//                newRotation = newRotation % 360;
//
//                if (self.rotation < newRotation){
//                    var difference = Math.abs(newRotation - self.rotation);
//                    if (difference > 180){
//                        newRotation = self.rotation - (360 - difference);
//                    }
//                }
//                else{
//                    var difference = Math.abs(self.rotation - newRotation);
//                    if (difference > 180){
//                        newRotation = self.rotation + (360 - difference);
//                    }
//                }
//
//                var speedOfTurn = Math.round(difference / 4);
//                if (speedOfTurn == 0)
//                    speedOfTurn = 1;
//
//                self.rotation = newRotation;
//
//                self._changeDirectionCounter = 0;
//            }
//            else
//                self._changeDirectionCounter ++;
//
//            this.position.x += Math.cos(self._radianWithInfelicity) * this._speed;
//            this.position.y += Math.sin(self._radianWithInfelicity) * this._speed;
//        };
