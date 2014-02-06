function SceneMap() {

}

SceneMap.prototype = Object.create(Scene.prototype);
SceneMap.prototype.constructor = SceneMap;
SceneMap.superclass = Scene.prototype;


SceneMap.prototype.init = function() {
    SceneMap.superclass.init.call(this, arguments);


    this.pixiStage = new PIXI.Stage(0xEEFFFF, true);

    this.map = new PIXI.DisplayObjectContainer();
    this.pixiStage.addChild(this.map);
    this.map.position.x = 50;
    this.map.position.y = 50;

    this.nodesConteiner = new PIXI.DisplayObjectContainer();
    this.edgesContainer = new PIXI.Graphics();

    this.map.addChild(this.edgesContainer);
    this.map.addChild(this.nodesConteiner);

    this.createGraph();
    this.drawGraph();

    return this;
};

SceneMap.prototype.createGraph = function() {
	this.mapGraph = MapGenerator.generateMap(7, 7, 20);
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
	this.edgesContainer.lineStyle(3, 0x00ff00, 0.5);
   	this.edgesContainer.moveTo(node.x, node.y);
   	this.edgesContainer.lineTo(node2.x, node2.y);
};