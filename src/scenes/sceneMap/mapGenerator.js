modules.define(
    'MapGenerator', [], function(provide) {

    function MapGenerator() {

    }


    MapGenerator.generateMap = function(
        width, 
        height, 
        numberOfNodesToRemove, 
        numberOfConnectionsToRemove
        ) {
        var Graph = require('data-structures').Graph;
        var mapGraph = new Graph();

        // TODO: Выпилить уже этот грязный хак
        mapGraph.getAllBros = function(nodeName) {
            return _.keys(this.getNode(nodeName)._outEdges);
        };

        MapGenerator._generateGrid(mapGraph, width, height);
        MapGenerator._removeRandomNodes(mapGraph, numberOfNodesToRemove);
        MapGenerator._removeRandomConnections(mapGraph, numberOfConnectionsToRemove);

        return mapGraph;
    };


    MapGenerator._removeRandomNodes = function(mapGraph, numberOfremoves) {
        var allNodes = _.keys(mapGraph._nodes),
            i = 0;

        while(i != numberOfremoves){
            var nodeNameForRemove = _.sample(allNodes);
            if (MapGenerator._checkConnectionsAllToAllWithoutOneNode(mapGraph, nodeNameForRemove)) {
                mapGraph.removeNode(nodeNameForRemove);
                i++;
                _.without(allNodes, nodeNameForRemove);
            }
        }
    };


    MapGenerator._removeRandomConnections = function(mapGraph, numberOfremoves) {
        var allNodes = _.keys(mapGraph._nodes),
            i = 0;

        while(i != numberOfremoves){
            var nodeNameA = _.sample(allNodes);
            var nodeNameB = _.sample(mapGraph.getAllBros(nodeNameA));

            if (MapGenerator._hasConnectionToAll(
                mapGraph, nodeNameA, null, [nodeNameA, nodeNameB])) {
                mapGraph.removeEdge(nodeNameA, nodeNameB);
                mapGraph.removeEdge(nodeNameB, nodeNameA);
                i++;
            }
        }
    };


    MapGenerator._checkConnectionsAllToAllWithoutOneNode = function(mapGraph, checkedNodeName) {
        var verificationNodeName = null;

        for (var nodeName in mapGraph._nodes) {
            if (nodeName != checkedNodeName){
                verificationNodeName = nodeName;
                break;
            }
        }

        return this._hasConnectionToAll(mapGraph, verificationNodeName, checkedNodeName);
    };


    // @nodesWhoseConnectionsAreIgnored - массив из двух стрингов обозначающих связанные ноды
    MapGenerator._hasConnectionToAll = function(
        mapGraph,
        startNodeName,
        nodeNameToIgnore,
        nodesWhoseConnectionsAreIgnored
        ){
        var visitedNodes    = {},
            notVisitedNodes = {};

        if(nodeNameToIgnore) {
            visitedNodes[nodeNameToIgnore] = true;
        }

        notVisitedNodes[startNodeName] = true;

        while (_.keys(notVisitedNodes).length) {
            var currentNodeName = _.keys(notVisitedNodes)[0];

            var nodes = mapGraph.getAllBros(currentNodeName);

            _.each(nodes, function(node){
                if (nodesWhoseConnectionsAreIgnored) {
                    if (currentNodeName == nodesWhoseConnectionsAreIgnored[0] && node == nodesWhoseConnectionsAreIgnored[1]
                        || currentNodeName == nodesWhoseConnectionsAreIgnored[1] && node == nodesWhoseConnectionsAreIgnored[0]) {
                        return;
                    }
                }

                if (!visitedNodes[node]) {
                    notVisitedNodes[node] = true;
                }
            })

            visitedNodes[currentNodeName] = true;
            delete notVisitedNodes[currentNodeName];
        }

        return _.keys(visitedNodes).length == _.keys(mapGraph._nodes).length;
    };


    MapGenerator._generateGrid = function(mapGraph, width, height) {
        var mapArray = [];
        id = 0;

        for (var x = 0; x < width; x++) {
            mapArray[x] = [];

            for (var y = 0; y < height; y++) {
                var nodeName = id.toString();
                mapArray[x][y] = nodeName;

                var node = mapGraph.addNode(nodeName);
                node.positionX = x;
                node.positionY = y;

                id ++;
            }
        }

        for (x = 0; x < mapArray.length; x++) {
            var isConnectNorthEastConnection = false;

            for (y = 0; y < mapArray[x].length; y++) {
                var nodeName = mapArray[x][y];
                
                // West
                if (mapArray[x - 1] !== undefined){
                    if (mapArray[x - 1][y] !== undefined){
                        mapGraph.addEdge(nodeName, mapArray[x - 1][y]);
                    }
                }

                // East
                if (mapArray[x + 1] !== undefined){
                    if (mapArray[x + 1][y] !== undefined){
                        mapGraph.addEdge(nodeName, mapArray[x + 1][y]);
                    }
                }

                // North
                if (mapArray[x] !== undefined){
                    if (mapArray[x][y - 1] !== undefined){
                        mapGraph.addEdge(nodeName, mapArray[x][y - 1]);
                    }
                }

                // South
                if (mapArray[x] !== undefined){
                    if (mapArray[x][y + 1] !== undefined){
                        mapGraph.addEdge(nodeName, mapArray[x][y + 1]);
                    }
                }

                // Northwest
                if (mapArray[x - 1] !== undefined){
                    if (mapArray[x - 1][y - 1] !== undefined){

                        if (mapGraph.getEdge(mapArray[x - 1][y - 1], nodeName)) {
                            mapGraph.addEdge(nodeName, mapArray[x - 1][y - 1]);
                        }
                    }
                }

                // Northeast
                if (mapArray[x + 1] !== undefined){
                    if (mapArray[x + 1][y - 1] !== undefined){
                        if (isConnectNorthEastConnection) {
                            mapGraph.addEdge(nodeName, mapArray[x + 1][y - 1]);
                            isConnectNorthEastConnection = false;
                        }
                    }
                }

                // Southwest
                if (mapArray[x - 1] !== undefined){
                    if (mapArray[x - 1][y + 1] !== undefined){
                        if (mapGraph.getEdge(mapArray[x - 1][y + 1], nodeName)) {
                            mapGraph.addEdge(nodeName, mapArray[x - 1][y + 1]);
                        }
                    }
                }

                // Southeast
                if (mapArray[x + 1] !== undefined) {
                    if (mapArray[x + 1][y + 1] !== undefined){
                        var isConnect = _.sample([true, false]);

                        if (isConnect) {
                            mapGraph.addEdge(nodeName, mapArray[x + 1][y + 1]);
                        } else {
                            isConnectNorthEastConnection = true;
                        }
                    }
                }
            }
        }
    };

    provide(MapGenerator);
});
