function Bullet() {
}

Bullet.prototype = Object.create( Object2D.prototype );
Bullet.prototype.constructor = Bullet;


Bullet.prototype.isStatic = false;


Bullet.prototype.createFixture = function(){
    this.body.CreateFixture(Bullet.POLY_FIXTURE);
};


Bullet.prototype.createTexture = function(){
    var manTexture = PIXI.Texture.fromFrame("img/bullet.png");
    this.view = new PIXI.Sprite(manTexture);
};


Bullet.prototype.createBody = function(isStatic, world){
    this.body = world.CreateBody(Bullet.DYNAMIC_BODY_DEF);
};


Bullet.POLY_FIXTURE = new Box2D.Dynamics.b2FixtureDef();
Bullet.POLY_FIXTURE.shape = new Box2D.Collision.Shapes.b2PolygonShape();
Bullet.POLY_FIXTURE.density = 500;
Bullet.POLY_FIXTURE.friction = 0.1;
Bullet.POLY_FIXTURE.shape.SetAsBox(1 / 100, 1 / 100);

Bullet.DYNAMIC_BODY_DEF = new Box2D.Dynamics.b2BodyDef();
Bullet.DYNAMIC_BODY_DEF.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
Bullet.DYNAMIC_BODY_DEF.bullet = true;
Bullet.DYNAMIC_BODY_DEF.fixedRotation = false;

//Crafty.c('Bullet', {
//    damage:     0,
//
//    init: function() {
//        var self = this;
//
//        this.requires('Actor, Collision, Color');
//        this.attr({
//                w: 3,
//                h: 2,
//                x: -1000,
//                y: -1000
//            }).color("black");
//
//
//        this.onHit('CanBeShotDown', function(hitted) {
//            if (hitted[0].obj.injure)
//                hitted[0].obj.injure(self.damage);
//
//            this.destroy();
//        });
//
//
//        this.fire = function(startCoords, directionCoords, damage, speed) {
//            self.damage = damage;
//
//            var radian = Math.atan2(directionCoords.y-startCoords.y, directionCoords.x-startCoords.x);
//            var vel = {
//                x: Math.cos(radian) * speed,
//                y: Math.sin(radian) * speed
//            };
//
//            this.origin("center");
//            this.rotation = Crafty.math.radToDeg(radian);
//
//            this.attr(startCoords);
//
//            this.bind("EnterFrame", function() {
//                this.attr({
//                    x: this._x + vel.x,
//                    y: this._y + vel.y
//                });
//            });
//        };
//
//
//        setTimeout(function(){
//            self.destroy();
//        }, 3000);
//    }
//});
//
//
