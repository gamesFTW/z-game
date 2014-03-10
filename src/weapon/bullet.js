modules.define(
    'Bullet', ['Object2D'], function(provide, Object2D) {

    function Bullet() {
    }

    Bullet.prototype = Object.create( Object2D.prototype );
    Bullet.prototype.constructor = Bullet;


    Bullet.prototype.isStatic = false;
    Bullet.prototype.damage = 100;


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
    Bullet.POLY_FIXTURE.density = 100;
    Bullet.POLY_FIXTURE.friction = 1;
    Bullet.POLY_FIXTURE.restitution = 0.2;
    Bullet.POLY_FIXTURE.shape.SetAsBox(1 / 100, 1 / 100);
    Bullet.POLY_FIXTURE.filter.categoryBits = Collisions.CATEGORY_BULLET;
    Bullet.POLY_FIXTURE.filter.maskBits = Collisions.MASK_BULLET;

    Bullet.DYNAMIC_BODY_DEF = new Box2D.Dynamics.b2BodyDef();
    Bullet.DYNAMIC_BODY_DEF.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    Bullet.DYNAMIC_BODY_DEF.bullet = true;
    //Bullet.DYNAMIC_BODY_DEF.fixedRotation = true;

    provide(Bullet);
});
