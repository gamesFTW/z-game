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


Map.prototype.init = function(grid, tileSize) {
    this.tileSize = tileSize;
    this.grid = grid;

    this.width = grid.length * tileSize;
    this.height = grid[0].length * tileSize;
};


Map.prototype.giveGraphNodes = function() {
    if (this.graphNodes == undefined){
        this.graphNodes = new Graph(this.giveCopyOfGreed());
    }

    return this.graphNodes;
};


Map.prototype.giveCopyOfGreed = function() {
    return this.grid.slice(0);
};


Map.prototype.getTileByCoordinates = function(vector) {
    return {
        x: Math.floor(vector.x / this.tileSize),
        y: Math.floor(vector.y / this.tileSize)
    };
};


Map.prototype.getCoordinatesByTile = function(vector) {
    return {
        x: vector.x * this.tileSize,
        y: vector.y * this.tileSize
    };
};


Map.prototype.getCoordinatesByTileInCenter = function(vector) {
    var coordinate = this.getCoordinatesByTile(vector);
    coordinate.x += this.tileSize / 2;
    coordinate.y += this.tileSize / 2;
    return coordinate;
};
