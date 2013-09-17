function Object2D() {
    this.view = null;
    this.body = null;
    this.game = null;
}


Object2D.prototype.constructor = Object2D;

// Initial methods
Object2D.prototype.init = function(world, x, y, texture, isStatic, isAnimated) {
    if (this.isStatic == undefined)
        this.isStatic = isStatic;

    if (this.isAnimated == undefined)
        this.isAnimated = isAnimated;

    this.initFunctions = [this.defineProperties, this.createFixture];

    this.createTexture(isAnimated, texture);
    this.createBody(isStatic, world);

    this.body.SetUserData(this);

    for (var i = 0; i < this.initFunctions.length; i++){
        this.initFunctions[i].apply(this);
    }

    this.setPosition(x, y);
};


Object2D.prototype.defineProperties = function(){
    this.view.anchor.x = 0.5;
    this.view.anchor.y = 0.5;
};


Object2D.prototype.createFixture = function(){
    this.body.CreateFixture(Object2D.POLY_FIXTURE);
};


Object2D.prototype.createTexture = function(isAnimated, texture){
    if (isAnimated)
        this.view = new PIXI.MovieClip(texture);
    else
        this.view = new PIXI.Sprite(texture);
};


Object2D.prototype.createBody = function(isStatic, world){
    if (isStatic)
        this.body = world.CreateBody(Object2D.STATIC_BODY_DEF);
    else
        this.body = world.CreateBody(Object2D.DYNAMIC_BODY_DEF);
};


Object2D.prototype.setPosition = function(x, y){
    this.body.SetPosition(new Box2D.Common.Math.b2Vec2(x / 100, y / 100));
    var position = this.body.GetPosition();
    this.view.position.x = position.x * 100;
    this.view.position.y = position.y * 100;
};


Object2D.prototype.getX = function(){
    var position = this.body.GetPosition();
    return position.x * 100;
};


Object2D.prototype.getY = function(){
    var position = this.body.GetPosition();
    return position.y * 100;
};


Object2D.prototype.getPosition = function(){
    var position = this.body.GetPosition();
    return {
        x:position.x * 100,
        y:position.y * 100
    }
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
Object2D.DYNAMIC_BODY_DEF.fixedRotation = true;
//kinematic

Object2D.POLY_FIXTURE = new Box2D.Dynamics.b2FixtureDef();
Object2D.POLY_FIXTURE.shape = new Box2D.Collision.Shapes.b2PolygonShape();
Object2D.POLY_FIXTURE.density = 1;
