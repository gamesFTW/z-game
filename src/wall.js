function Wall() {
}


Wall.prototype = Object.create( Object2D.prototype );
Wall.prototype.constructor = Wall;


Wall.prototype.createFixture = function(){
    this.body.CreateFixture(Wall.POLY_FIXTURE);
};

//Wall.prototype.defineProperties = function(){
////    this.view.anchor.x = 0;
////    this.view.anchor.y = 0;
//};


// Static
Wall.POLY_FIXTURE = new Box2D.Dynamics.b2FixtureDef();
Wall.POLY_FIXTURE.shape = new Box2D.Collision.Shapes.b2PolygonShape();
Wall.POLY_FIXTURE.shape.SetAsBox(20 / 100, 20 / 100);
Wall.POLY_FIXTURE.filter.categoryBits = 3;
Wall.POLY_FIXTURE.density = 1;