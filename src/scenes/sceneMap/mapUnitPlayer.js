modules.define(
    'MapUnitPlayer', ['MapUnit'], function(provide, MapUnit) {

    function MapUnitPlayer() {
    }


    MapUnitPlayer.prototype = Object.create( MapUnit.prototype );
    MapUnitPlayer.prototype.constructor = MapUnitPlayer;
    MapUnitPlayer.superclass = MapUnit.prototype;


    MapUnitPlayer.prototype.init = function() {
        MapUnitPlayer.superclass.init.call(this);

        this.createView();
    };


    MapUnitPlayer.prototype.createView = function() {
        var playerTexture = PIXI.Texture.fromFrame("img/blue-man.png");
        this.view = new PIXI.Sprite(playerTexture);
        this.view.anchor.x = 0.5;
        this.view.anchor.y = 0.5;
    };

    provide(MapUnitPlayer);
});
