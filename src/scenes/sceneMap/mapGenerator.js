function MapGenerator() {

}


MapGenerator.generateMap = function(width, height, numberOfNodesToRemove) {
	var Graph = require('data-structures').Graph;
	var mapGraph = new Graph();

	MapGenerator._generateGrid(mapGraph, width, height);

	MapGenerator._removeRandomNodes(mapGraph, numberOfNodesToRemove);	
	
	return mapGraph;
};


MapGenerator._removeRandomNodes = function(mapGraph, numberOfremoves) {
	var allNodes = _.keys(mapGraph._nodes),
    	i = 0;

	while(i != numberOfremoves){
		var nodeNameForRemove = _.sample(allNodes);
		if (MapGenerator._removeNodeByName(mapGraph, nodeNameForRemove)) {
			i++;
		    _.without(allNodes, nodeNameForRemove);
		}
	}
};


MapGenerator._removeNodeByName = function(mapGraph, nodeNameToRemove) {
	var verificationNodeName = null;

	for (var nodeName in mapGraph._nodes) {
		if (nodeName != nodeNameToRemove){
			verificationNodeName = nodeName;
			break;
		}
	}

	var isHasConnection = this._hasConnectionToAll(mapGraph, verificationNodeName, nodeNameToRemove);

	if(isHasConnection){
		mapGraph.removeNode(nodeNameToRemove);
		return true;
	}
	return false;
};


MapGenerator._hasConnectionToAll = function(mapGraph, startNodeName, nodeNameToIgnore){
	var visitedNodes = {},
	    notVisitedNodes = {};

	visitedNodes[nodeNameToIgnore] = true;
	notVisitedNodes[startNodeName] = true;


	mapGraph.getAllBros = function(nodeName) {
        return _.keys(this.getNode(nodeName)._outEdges);
	}

	while (_.keys(notVisitedNodes).length) {
		var currentNodeName = _.keys(notVisitedNodes)[0];

		var nodes = mapGraph.getAllBros(currentNodeName);
		for (var i = 0; i < nodes.length; i++) {
			if (!visitedNodes[nodes[i]]) {
				notVisitedNodes[nodes[i]] = true;
			}
		}
    
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
			node.x = x * 100;
			node.y = y * 100;

			id ++;
		}		
	}

	for (x = 0; x < mapArray.length; x++) {
		for (y = 0; y < mapArray[x].length; y++) {
			var nodeName = mapArray[x][y];

			if (mapArray[x - 1] !== undefined){
				if (mapArray[x - 1][y - 1] !== undefined){
					mapGraph.addEdge(nodeName, mapArray[x - 1][y - 1]);
				}
			}

			if (mapArray[x] !== undefined){
				if (mapArray[x][y - 1] !== undefined){
					mapGraph.addEdge(nodeName, mapArray[x][y - 1]);
				}
			}

			if (mapArray[x + 1] !== undefined){
				if (mapArray[x + 1][y - 1] !== undefined){
					mapGraph.addEdge(nodeName, mapArray[x + 1][y - 1]);
				}
			}


			if (mapArray[x - 1] !== undefined){
				if (mapArray[x - 1][y] !== undefined){
					mapGraph.addEdge(nodeName, mapArray[x - 1][y]);
				}
			}

			if (mapArray[x] !== undefined){
				if (mapArray[x][y] !== undefined){
					mapGraph.addEdge(nodeName, mapArray[x][y]);
				}
			}

			if (mapArray[x + 1] !== undefined){
				if (mapArray[x + 1][y] !== undefined){
					mapGraph.addEdge(nodeName, mapArray[x + 1][y]);
				}
			}


			if (mapArray[x - 1] !== undefined){
				if (mapArray[x - 1][y + 1] !== undefined){
					mapGraph.addEdge(nodeName, mapArray[x - 1][y + 1]);
				}
			}

			if (mapArray[x] !== undefined){
				if (mapArray[x][y + 1] !== undefined){
					mapGraph.addEdge(nodeName, mapArray[x][y + 1]);
				}
			}

			if (mapArray[x + 1] !== undefined){
				if (mapArray[x + 1][y + 1] !== undefined){
					mapGraph.addEdge(nodeName, mapArray[x + 1][y + 1]);
				}
			}
		}		
	}
};

function getListFromGraphs(graphs) {
	var i

	for (i in graphs) {

	}
}