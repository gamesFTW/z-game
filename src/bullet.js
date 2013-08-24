function Bullet() {
}


Bullet.prototype = Object.create( Object2D.prototype );
Bullet.prototype.constructor = Bullet;


Bullet.prototype.createFixture = function(){
    this.body.CreateFixture(Bullet.POLY_FIXTURE);
};




Bullet.POLY_FIXTURE = new Box2D.Dynamics.b2FixtureDef();
Bullet.POLY_FIXTURE.shape = new Box2D.Collision.Shapes.b2PolygonShape();
Bullet.POLY_FIXTURE.density = 10;
Bullet.POLY_FIXTURE.shape.SetAsBox(5 / 100, 5 / 100);
Bullet.POLY_FIXTURE.filter.categoryBits = 2;
Bullet.POLY_FIXTURE.filter.maskBits = 1;
