/*
* Все работает с координатами из PIXI
*
*/
function Map() {
    if (!Map.__instance)
        Map.__instance = this;
    else
        return Map.__instance;
}


Map.prototype.constructor = Map;


Map.prototype.init = function(grid) {
    this.grid = grid;
};


Map.prototype.giveCopyOfGreed = function() {
    return this.grid.slice(0);
};


Map.prototype.getTileByCoordinates = function(vector) {
    return {
        x: Math.floor(vector.x / Game.TILE_SIZE),
        y: Math.floor(vector.y / Game.TILE_SIZE)
    };
};


Map.prototype.getCoordinatesByTile = function(vector) {
    return {
        x: vector.x * Game.TILE_SIZE,
        y: vector.y * Game.TILE_SIZE
    };
};


Map.prototype.getCoordinatesByTileInCenter = function(vector) {
    var coordinate = this.getCoordinatesByTile(vector);
    coordinate.x += Game.TILE_SIZE / 2;
    coordinate.y += Game.TILE_SIZE / 2;
    return coordinate;
};
