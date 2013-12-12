function Object2D() {
    this.view = null;
    this.body = null;
}


Object2D.prototype = Object.create( EventDispatcher.prototype );
Object2D.prototype.constructor = Object2D;

// Initial methods
Object2D.prototype.init = function(world, x, y, texture, isStatic, isAnimated) {
    if (this.isStatic == undefined)
        this.isStatic = isStatic;

    if (this.isAnimated == undefined)
        this.isAnimated = isAnimated;

    this.createTexture(isAnimated, texture);
    this.createBody(isStatic, world);

    this.body.SetUserData(this);

    this.defineProperties();
    this.createFixture();

    this.setPosition(x, y);
};


Object2D.prototype.setInitFunctions  = function(){
    this.initFunctions = [, this.createFixture];
};


Object2D.prototype.isInstanceOf = function(cls){
    return this instanceof cls;
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
    this.body.SetPosition(new Box2D.Common.Math.b2Vec2(x / Game.box2DMultiplier, y / Game.box2DMultiplier));
    this.view.position.x = x;
    this.view.position.y = y;
};


Object2D.prototype.getX = function() {
    var position = this.body.GetPosition();
    return position.x * Game.box2DMultiplier;
};


Object2D.prototype.getY = function() {
    var position = this.body.GetPosition();
    return position.y * Game.box2DMultiplier;
};


Object2D.prototype.getRadianBetweenMeAnd = function(object2d) {
   return Math.atan2(this.getY() - object2d.getY(), this.getX() - object2d.getX());
};


Object2D.prototype.getPosition = function(body, map) {
    var position = this.body.GetPosition();

    if (body == "box2D" || body == "box2d"){
        return { x: position.x, y: position.y };
    } else if (body == undefined || body == "pixi"){
        return {
            x: position.x * Game.box2DMultiplier,
            y: position.y * Game.box2DMultiplier
        };
    } else if (body == "vector"){
        return new Box2D.Common.Math.b2Vec2(
            position.x, position.y
        );
    } else if (body == "map" || body == "tile") {
        return map.getTileByCoordinates({
            x: position.x * Game.box2DMultiplier,
            y: position.y * Game.box2DMultiplier
        });
    }
};


Object2D.prototype.isVisibleTo = function(object2D) {
    var myVect = this.getPosition('vector'),
        targerVect = object2D.getPosition('vector'),
        isVisible = true;

    function filterCollisions(fixture, normal, fraction) {
        if (fixture.m_body.GetUserData().isInstanceOf(Wall)) {
            // you've got the fraction of the original length of the raycast!
            // you can use this to determine the distance
            // between the character and the ground
            isVisible = false;
            return 0;
        } else {
            // continue looking
            return 1;
        }
    }

    game.box2DWorld.RayCast(filterCollisions, myVect, targerVect);
    return isVisible;
};


Object2D.prototype.tick = function() {
};


Object2D.prototype.updateView = function() {
    if (!this.isStatic && this.view.visible) {
       var position = this.body.GetPosition();
       this.view.position.x = position.x * Game.box2DMultiplier;
       this.view.position.y = position.y * Game.box2DMultiplier;
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
