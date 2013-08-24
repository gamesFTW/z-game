function Player() {
}


Player.prototype = Object.create( Object2D.prototype );
Player.prototype.constructor = Player;


Player.prototype.defineMouseEvents = function(stage){
//    best way to get the global x y at the moment would be to acces the worldTransform matrix.
//        the x global x position would be
//
//    var globalX = displayObject.worldTransform[2];
//    var globalY = displayObject.worldTransform[5];
    console.log(stage);
    stage.click = function(event){
        console.log("mousedown");
        console.log(event);
        var x = event.global.x,
            y = event.global.y;
        console.log(x+" " + y);
    };
};

Player.prototype.createFixture = function(){
    var self = this;
    this.body.CreateFixture(Player.POLY_FIXTURE);

    var speed = 0.01;

    KeyboardJS.on('a', function() {
        self.body.ApplyImpulse(
            new Box2D.Common.Math.b2Vec2(-speed, 0),
            self.body.GetWorldCenter()
        );
    });

    KeyboardJS.on('d', function() {
        self.body.ApplyImpulse(
            new Box2D.Common.Math.b2Vec2(speed, 0),
            self.body.GetWorldCenter()
        );
    });

    KeyboardJS.on('w', function() {
        self.body.ApplyImpulse(
            new Box2D.Common.Math.b2Vec2(0, -speed),
            self.body.GetWorldCenter()
        );
    });

    KeyboardJS.on('s', function() {
        self.body.ApplyImpulse(
            new Box2D.Common.Math.b2Vec2(0, speed),
            self.body.GetWorldCenter()
        );
    });
};




Player.POLY_FIXTURE = new Box2D.Dynamics.b2FixtureDef();
Player.POLY_FIXTURE.shape = new Box2D.Collision.Shapes.b2PolygonShape();
Player.POLY_FIXTURE.density = 50;
//Player.POLY_FIXTURE.restitution = 0.1;
Player.POLY_FIXTURE.friction = 0.1;
Player.POLY_FIXTURE.shape.SetAsBox(5 / 100, 5 / 100);
Player.POLY_FIXTURE.filter.categoryBits = 1;
Player.POLY_FIXTURE.filter.maskBits = 2;
