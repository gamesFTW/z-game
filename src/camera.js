modules.define(
    'Camera', [], function(provide) {

    function Camera() {
        if (!Camera.__instance)
            Camera.__instance = this;
        else
            return Camera.__instance;
    }

    Camera.prototype.constructor = Camera;

    Camera.prototype.init = function(stage, isStickToBorders, width, height, mapWidth, mapHeight) {
        this._mapWidth = mapWidth;
        this._mapHeight = mapHeight;
        this._isStickToBorders = isStickToBorders;

        this.displayContainer = new PIXI.DisplayObjectContainer();

        this.displayContainer.position.x = 0;
        this.displayContainer.position.y = 0;
        this.width = width;
        this.height = height;
        this.displayContainer.hitArea = new PIXI.Rectangle(0, 0, mapWidth, mapHeight);
        this.displayContainer.setInteractive(true);

        stage.addChild(this.displayContainer);

        return this;
    };

    Camera.prototype.setFolow = function(object2DView) {
        this.folow = object2DView;
    };

    Camera.prototype.refresh = function() {
        if (this.folow) {
            this.displayContainer.position.x = Math.round(-this.folow.position.x + this.width/2);
            this.displayContainer.position.y = Math.round(-this.folow.position.y + this.height/2);
        }

        if (this._isStickToBorders) {
            if (this.displayContainer.position.x > 0) {
                this.displayContainer.position.x = 0;
            }

            if (this.displayContainer.position.y > 0) {
                this.displayContainer.position.y = 0;
            }

            if (this.displayContainer.position.x < - this._mapWidth + this.width) {
                this.displayContainer.position.x = - this._mapWidth + this.width;
            }

            if (this.displayContainer.position.y < - this._mapHeight + this.height) {
                this.displayContainer.position.y = - this._mapHeight + this.height;
            }
        }
    };

    provide(Camera);
});