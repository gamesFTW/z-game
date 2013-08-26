function Zombie() {
}


Zombie.prototype = Object.create( Object2D.prototype );
Zombie.prototype.constructor = Zombie;


Zombie.prototype.createFixture = function(){
    this.body.CreateFixture(Zombie.POLY_FIXTURE);
};


Zombie.prototype.tick = function() {
//    if(!_.random(0, 100)){
//        this.body.ApplyImpulse(
//            new Box2D.Common.Math.b2Vec2(Math.random(), Math.random()),
//            this.body.GetWorldCenter()
//        );
//    }
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
