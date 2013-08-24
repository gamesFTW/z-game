var assetsToLoader = ["img/zombieSprite.json", "img/blue-man.png"];

// create a new loader
var loader = new PIXI.AssetLoader(assetsToLoader);

 // use callback
loader.onComplete = onAssetsLoaded;
loader.load();


// let pixi choose WebGL or canvas
var renderer = PIXI.autoDetectRenderer(Game.WIDTH, Game.HEIGHT);
// attach render to page
document.body.appendChild(renderer.view);

var game = new Game();
game.init(renderer);

function onAssetsLoaded()
{
    // create an array to store the textures
    var zombieTextures = [];

    for (var i=0; i < 25; i++)
    {
        var texture = PIXI.Texture.fromFrame("zombie_" + (i) + ".png");
        zombieTextures.push(texture);
    }

    // create a texture from an image path
    // add a bunch of aliens
    for (var i = 0; i < 500; i++) {
    
        // create an explosion MovieClip
        var zombie = new Zombie();
        zombie.init(zombieTextures, game.world, false, true);

        zombie.setPosition(Math.random() * Game.WIDTH, Math.random() * Game.HEIGHT);
        zombie.body.SetAngle(Math.random() * Math.PI);

        zombie.view.gotoAndPlay(Math.random() * 24);
        zombie.view.animationSpeed  = 0.3;

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

        game.registerObject2D(zombie);
    }
    var player = new Player();
    //var texture = PIXI.Texture("blue-man.png");
    player.init(zombieTextures, game.world, false, true);
    player.setPosition(Math.random() * Game.WIDTH, Math.random() * Game.HEIGHT);
    player.body.SetAngle(Math.random() * Math.PI);
    game.registerObject2D(player);
    game.registerPlayer(player);



    game.mainLoop();
}
