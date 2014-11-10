modules.define(
    'MapUnit', ['EventDispatcher'], function(provide, EventDispatcher) {
    function MapUnit() {
    }


    MapUnit.prototype = Object.create( EventDispatcher.prototype );
    MapUnit.prototype.constructor = MapUnit;


    MapUnit.prototype.currentSector = null;


    MapUnit.prototype.init = function() {
    };

    provide(MapUnit);
});
