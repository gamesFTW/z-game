function Camera() {
    if (!Camera.__instance)
        Camera.__instance = this;
    else
        return Camera.__instance;
}

Camera.prototype.constructor = Camera;

Camera.prototype.init = function(stage) {
    this.displayContainer = new PIXI.DisplayObjectContainer();

    this.displayContainer.position.x = 0;
    this.displayContainer.position.y = 0;
    this.displayContainer.hitArea = new PIXI.Rectangle(0, 0, game.map.width, game.map.height);
    this.displayContainer.setInteractive(true);

    stage.addChild(this.displayContainer);

    return this;
}

Camera.prototype.setFolow = function(object2DView) {
    this.folow = object2DView;
}

Camera.prototype.refresh = function() {
    if (this.folow) {
        this.displayContainer.position.x = Math.round(-this.folow.position.x + Game.WIDTH/2);
        this.displayContainer.position.y = Math.round(-this.folow.position.y + Game.HEIGHT/2);
    }
}



