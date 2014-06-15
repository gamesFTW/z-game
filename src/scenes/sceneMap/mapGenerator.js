modules.define(
    'MapGenerator', [], function(provide) {

    function MapGenerator() {

    }

    MapGenerator.DISTANCE_BETWEEN_MAIN_NODES = 200;


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

        var lastID = MapGenerator._generateGrid(mapGraph, width, height);
        MapGenerator._removeRandomNodes(mapGraph, numberOfNodesToRemove);
        MapGenerator._removeRandomConnections(mapGraph, numberOfConnectionsToRemove);
        MapGenerator._createIntermediateNodes(mapGraph, lastID);

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


    MapGenerator._createIntermediateNodes = function(mapGraph, id) {
        var infelicity = 10;

        var allNodes = _.keys(mapGraph._nodes);
        var connections = [];

        _.each(allNodes, function(node) {
            var broNodes = mapGraph.getAllBros(node);

            _.each(broNodes, function(broNode) {
                connections.push([node, broNode]);
                mapGraph.removeEdge(node, broNode);
                mapGraph.removeEdge(broNode, node);
            });
        });

        _.each(connections, function(connection){
            var nodeNameA = connection[0];
            var nodeNameB = connection[1];

            var nodeA = mapGraph.getNode(nodeNameA);
            var nodeB = mapGraph.getNode(nodeNameB);

            // Создаем 2-3 промежуточных нода
            var randomNodeNumber =_.random(2, 3);
            var randomNodeNumberList = _.range(1, randomNodeNumber + 1);

            var radian = Math.atan2(nodeB.positionY - nodeA.positionY, nodeB.positionX - nodeA.positionX);
            var distance = Math.sqrt(Math.pow(nodeB.positionX - nodeA.positionX, 2) 
                + Math.pow(nodeB.positionY - nodeA.positionY, 2)) / (randomNodeNumber + 1);

            var prevNodeName = nodeNameA;
            _.each(randomNodeNumberList, function(element) {
                var nodeName = id.toString();
                var node = mapGraph.addNode(nodeName);

                node.positionX = (nodeA.positionX + Math.cos(radian) * (distance * element)) + _.random(-infelicity, infelicity);
                node.positionY = (nodeA.positionY + Math.sin(radian) * (distance * element)) + _.random(-infelicity, infelicity);

                mapGraph.addEdge(prevNodeName, nodeName);
                mapGraph.addEdge(nodeName, prevNodeName);

                if (element == randomNodeNumber) {
                    mapGraph.addEdge(nodeNameB, nodeName);
                    mapGraph.addEdge(nodeName, nodeNameB);
                }

                prevNodeName = nodeName;
                id ++;
            })
        });
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
        var id = 0;
        var infelicity = 40;

        for (var x = 0; x < width; x++) {
            mapArray[x] = [];

            for (var y = 0; y < height; y++) {
                var nodeName = id.toString();
                mapArray[x][y] = nodeName;

                var node = mapGraph.addNode(nodeName);
                // node.positionX = x * MapGenerator.DISTANCE_BETWEEN_MAIN_NODES;
                // node.positionY = y * MapGenerator.DISTANCE_BETWEEN_MAIN_NODES;

                node.positionX = x * MapGenerator.DISTANCE_BETWEEN_MAIN_NODES + _.random(-infelicity, infelicity);
                node.positionY = y * MapGenerator.DISTANCE_BETWEEN_MAIN_NODES + _.random(-infelicity, infelicity);
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

        return id;
    };

    provide(MapGenerator);
});
