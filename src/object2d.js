function Object2D() {
    this.view = null;
    this.body = null;
}


Object2D.prototype.constructor = Object2D;

// Initial methods
Object2D.prototype.init = function(texture, world, isStatic, isAnimated) {
    this.isStatic = isStatic;
    if (isAnimated)
        this.view = new PIXI.MovieClip(texture);
    else
        this.view = new PIXI.Sprite(texture);

    if (isStatic)
        this.body = world.CreateBody(Object2D.STATIC_BODY_DEF);
    else
        this.body = world.CreateBody(Object2D.DYNAMIC_BODY_DEF);

    this.defineProperties();
    this.createFixture();
};


Object2D.prototype.defineProperties = function(){
    this.view.anchor.x = 0.5;
    this.view.anchor.y = 0.5;
};


Object2D.prototype.createFixture = function(){
    this.body.CreateFixture(Object2D.POLY_FIXTURE);
};


Object2D.prototype.setPosition = function(x, y){
    this.body.SetPosition(new Box2D.Common.Math.b2Vec2(x / 100, y / 100));
    var position = this.body.GetPosition();
    this.view.position.x = position.x * 100;
    this.view.position.y = position.y * 100;
};


Object2D.prototype.tick = function() {

};


Object2D.prototype.updateView = function() {
    if (!this.isStatic) {
       var position = this.body.GetPosition();
       this.view.position.x = position.x * 100;
       this.view.position.y = position.y * 100;
       this.view.rotation = this.body.GetAngle();
    }
};

// Static
Object2D.STATIC_BODY_DEF = new Box2D.Dynamics.b2BodyDef();
Object2D.STATIC_BODY_DEF.type = Box2D.Dynamics.b2Body.b2_staticBody;

Object2D.DYNAMIC_BODY_DEF = new Box2D.Dynamics.b2BodyDef();
Object2D.DYNAMIC_BODY_DEF.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
//kinematic

Object2D.POLY_FIXTURE = new Box2D.Dynamics.b2FixtureDef();
Object2D.POLY_FIXTURE.shape = new Box2D.Collision.Shapes.b2PolygonShape();
Object2D.POLY_FIXTURE.density = 1;