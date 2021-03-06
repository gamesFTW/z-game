modules.define(
    'Wall', ['Object2D', 'GameOptions'], function(provide, Object2D, GameOptions) {

    function Wall() {
    }


    Wall.prototype = Object.create( Object2D.prototype );
    Wall.prototype.constructor = Wall;


    Wall.prototype.createFixture = function(){
        this.body.CreateFixture(Wall.POLY_FIXTURE);
    };

    // Static
    Wall.SIZE = 10;
    Wall.POLY_FIXTURE = new Box2D.Dynamics.b2FixtureDef();
    Wall.POLY_FIXTURE.shape = new Box2D.Collision.Shapes.b2PolygonShape();
    Wall.POLY_FIXTURE.shape.SetAsBox(Wall.SIZE / GameOptions.box2DMultiplier, Wall.SIZE / GameOptions.box2DMultiplier);
    Wall.POLY_FIXTURE.filter.categoryBits = 3;
    Wall.POLY_FIXTURE.density = 1;
    Wall.POLY_FIXTURE.friction = 0.9;

    provide(Wall);
});
