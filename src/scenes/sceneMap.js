function SceneMap() {

}

SceneMap.prototype = Object.create(Scene.prototype);
SceneMap.prototype.constructor = SceneMap;
SceneMap.superclass = Scene.prototype;


SceneMap.prototype.init = function() {
    SceneMap.superclass.init.call(this, arguments);


    this.pixiStage = new PIXI.Stage(0xEEFFFF, true);

    this.nodesConteiner = new PIXI.DisplayObjectContainer();
    this.edgesContainer = new PIXI.Graphics();

    this.pixiStage.addChild(this.nodesConteiner);
    this.pixiStage.addChild(this.edgesContainer);

    this.createGraph();
    this.drawGraph();

    return this;
};

SceneMap.prototype.createGraph = function() {
	var Graph = require('data-structures').Graph;
	this.mapGraph = new Graph();

	// var nodesNames = ["A", "B", "C", "D", ""];

	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var node = this.mapGraph.addNode(i.toString()+j);
			node.x = i * 100;
			node.y = j * 100;

			this.mapGraph.addEdge(i.toString()+j, i + (j - 1).toString());
			this.mapGraph.addEdge(i.toString()+j, "00");
		}
	}
};


SceneMap.prototype.render = function() {
    // Рендерим
    game.renderer.render(this.pixiStage);
};


SceneMap.prototype.loop = function() {
    this.render();
};


SceneMap.prototype.drawGraph = function() {
	var self = this;
	this.mapGraph.forEachNode(function(node){
		self.drawNode(node);
	});
};


SceneMap.prototype.drawNode = function(node) {
	var brickTexture = PIXI.Texture.fromFrame("img/brick.png");

	var nodeView = new PIXI.Sprite(brickTexture);
	nodeView.anchor.x = 0.5;
	nodeView.anchor.y = 0.5;
	nodeView.position.x = node.x;
	nodeView.position.y = node.y;

	this.nodesConteiner.addChild(nodeView);

	for (var j in node._outEdges){
		this.drawEdge(node, this.mapGraph.getNode(j));
	}
};


SceneMap.prototype.drawEdge = function(node, node2) {
	this.edgesContainer.lineStyle(5, 0x00ff00, 1);
   	this.edgesContainer.moveTo(node.x, node.y);
   	this.edgesContainer.lineTo(node2.x, node2.y);
};