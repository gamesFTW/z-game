var PathFinder = {
    search: function(start) {
        return this.calcRoad(start);
    },
    calcRoad: function(curr) {
        var ret = [];
        curr = this.grid[curr.x][curr.y];

        while(curr.parent) {
            ret.push(curr);
            curr = curr.parent;
        }
        return ret;
    },
    generateMap: function(grid, center, diagonal){
        this.grid = grid;

        var mapArray = [];
        center.d = 0;
        mapArray.push(center);

        while(mapArray.length > 0) {
            var currentNode = mapArray.shift();

            currentNode.closed = true;

            var neighbors = PathFinder.neighbors(grid, currentNode, false);
            var neighborsDiagonal = PathFinder.neighbors(grid, currentNode, true);

            this.calcDist(currentNode, neighbors, mapArray, 1);
            this.calcDist(currentNode, neighborsDiagonal, mapArray, 1.3);
        }
    },
    calcDist: function(currentNode, neighbors, mapArray, cost){
        for(var i=0, il = neighbors.length; i < il; i++) {
            var neighbor = neighbors[i];

            if(neighbor.closed || neighbor.isWall()) {
                continue;
            }

            if (neighbor.d === undefined){
                neighbor.d = currentNode.d + cost;
                neighbor.parent = currentNode;
            } else{
                var d = currentNode.d + cost;

                if (d < currentNode.d){
                    neighbor.d = d;
                    neighbor.parent = currentNode;
                }
            }

            if (!neighbor.visited) {
                neighbor.visited = true;
                mapArray.push(neighbor);
            }
        }
    },
    neighbors: function(grid, node, diagonals) {
        var ret = [];
        var x = node.x;
        var y = node.y;

        if (!diagonals){
            // West
            if(grid[x-1] && grid[x-1][y]) {
                ret.push(grid[x-1][y]);
            }

            // East
            if(grid[x+1] && grid[x+1][y]) {
                ret.push(grid[x+1][y]);
            }

            // South
            if(grid[x] && grid[x][y-1]) {
                ret.push(grid[x][y-1]);
            }

            // North
            if(grid[x] && grid[x][y+1]) {
                ret.push(grid[x][y+1]);
            }
        }

        if (diagonals) {
            // Southwest
            if(grid[x-1] && grid[x-1][y-1]) {
                // Нужно чтобы враги не пытались пройти по диагонали сквозь стенку
                if (grid[x][y-1].type == 0 && grid[x-1][y].type == 0) {
                    ret.push(grid[x-1][y-1]);
                }
            }

            // Southeast
            if(grid[x+1] && grid[x+1][y-1]) {
                if (grid[x][y-1].type == 0 && grid[x+1][y].type == 0) {
                    ret.push(grid[x+1][y-1]);
                }
            }

            // Northwest
            if(grid[x-1] && grid[x-1][y+1]) {
                if (grid[x][y+1].type == 0 && grid[x-1][y].type == 0) {
                    ret.push(grid[x-1][y+1]);
                }
            }

            // Northeast
            if(grid[x+1] && grid[x+1][y+1]) {
                if (grid[x][y+1].type == 0 && grid[x+1][y].type == 0) {
                    ret.push(grid[x+1][y+1]);
                }
            }

        }

        return ret;
    },
    reset:function(){
        this.grid = undefined;
    },
};
