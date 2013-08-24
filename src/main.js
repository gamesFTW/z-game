
 /*
test.js
 * User: ak
 * Date: 8/23/13
 * Time: 2:17 AM
 * Description: 
**/
var WIDTH = 800;
var HEIGHT = 600;
var PI = 3.14;
var assetsToLoader = [ "img/zombieSprite.json"];

// create a new loader
var loader = new PIXI.AssetLoader(assetsToLoader);
var stage = new PIXI.Stage(0xEEFFFF);

 // use callback
loader.onComplete = onAssetsLoaded

	//begin load
loader.load();



// let pixi choose WebGL or canvas
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

// attach render to page
document.body.appendChild(renderer.view);







function onAssetsLoaded()
{
    // create an array to store the textures
    var zombieTextures= [];

    for (var i=0; i < 25; i++)
    {
        var texture = PIXI.Texture.fromFrame("zombie_" + (i) + ".png");
        zombieTextures.push(texture);
    }

    // create a texture from an image path
    // add a bunch of aliens
    for (var i = 0; i < 500; i++)
    {
        // create an explosion MovieClip
        var zombie = new PIXI.MovieClip(zombieTextures);


        zombie.position.x = Math.random() * 800;
        zombie.position.y = Math.random() * 600;
        zombie.anchor.x = 0.5;
        zombie.anchor.y = 0.5;

        zombie.rotation = Math.random() * Math.PI;

        zombie.gotoAndPlay(Math.random() * 24);
        zombie.animationSpeed  = 0.3;

        zombie._rotationTick =          0;
        zombie._changeDirectionCounter = 0;
        zombie._changeDirection =      0;
        zombie._radianWithInfelicity = 0;
        zombie._speed = 0.5;
        zombie._changeDirection = _.random(50, 200);

        zombie.tick = function() {
            var playerY = 300,
                playerX = 400;
            var self = this;
            function randomateInfelicity(){
                var infelicity = _.random(0, 4);
                self._radianInfelicity = _.random(- infelicity, infelicity);
            }
            randomateInfelicity();

            if (self._changeDirectionCounter >= self._changeDirection){
                var radian = Math.atan2(playerY - this.position.y, playerX - this.position.x);
                self._radianWithInfelicity = radian + this._radianInfelicity;

                var newRotation = (self._radianWithInfelicity * (180/PI)) - 90;

                //self.rotation = self.rotation % 360;
                newRotation = newRotation % 360;

                if (self.rotation < newRotation){
                    var difference = Math.abs(newRotation - self.rotation);
                    if (difference > 180){
                        newRotation = self.rotation - (360 - difference);
                    }
                }
                else{
                    var difference = Math.abs(self.rotation - newRotation);
                    if (difference > 180){
                        newRotation = self.rotation + (360 - difference);
                    }
                }

                var speedOfTurn = Math.round(difference / 4);
                if (speedOfTurn == 0)
                    speedOfTurn = 1;

                self.rotation = newRotation;

                self._changeDirectionCounter = 0;
            }
            else
                self._changeDirectionCounter ++;

            this.position.x += Math.cos(self._radianWithInfelicity) * this._speed;
            this.position.y += Math.sin(self._radianWithInfelicity) * this._speed;
        };

        stage.addChild(zombie);
    }

    // start animating
    requestAnimFrame( gameLoop );


}



function gameLoop() {
    stage.children.forEach(function (c) {
        c.tick && c.tick();
    });
    renderer.render(stage);
    requestAnimFrame(gameLoop);
}

