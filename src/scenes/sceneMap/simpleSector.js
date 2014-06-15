modules.define(
    'SimpleSector', [], function(provide) {

    function SimpleSector() {

    }


    SimpleSector.prototype.constructor = SimpleSector();
    SimpleSector.prototype.texturePath = "img/sector.png";


    SimpleSector.prototype.units = null;


    SimpleSector.prototype.init = function(nodeName, mapGraph) {
        this.units = [];

        mapGraph.getNode(nodeName).model = this;
        this.nodeName = nodeName;
        this.graph = mapGraph.getNode(nodeName);
        this.createView();
        return this;
    };


    SimpleSector.prototype.createView = function() {
        var brickTexture = PIXI.Texture.fromFrame(this.texturePath);
        this.view = new PIXI.Sprite(brickTexture);
        this.view.anchor.x = 0.5;
        this.view.anchor.y = 0.5;
        this.view.position.x = this.graph.positionX;
        this.view.position.y = this.graph.positionY;
    };


    SimpleSector.prototype.addUnit = function(unit) {
        unit.currentSector = this;
        this.units.push(unit);

        this.view.addChild(unit.view);
    };


    SimpleSector.prototype.removeUnit = function(unit) {
        _.without(this.units, unit);
        this.view.removeChild(unit.view);
    };

    provide(SimpleSector);
});
