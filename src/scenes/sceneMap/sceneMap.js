function SceneMap() {

}

SceneMap.prototype = Object.create(Scene.prototype);
SceneMap.prototype.constructor = SceneMap;
SceneMap.superclass = Scene.prototype;


SceneMap.prototype.init = function() {
    SceneMap.superclass.init.call(this, arguments);


    this.pixiStage = new PIXI.Stage(0xEEFFFF, true);

    this.displayContainer = new PIXI.DisplayObjectContainer();
    this.pixiStage.addChild(this.displayContainer);
    this.displayContainer.position.x = 50;
    this.displayContainer.position.y = 50;

    this.nodesContainer = new PIXI.DisplayObjectContainer();
    this.edgesContainer = new PIXI.Graphics();

    this.displayContainer.addChild(this.edgesContainer);
    this.displayContainer.addChild(this.nodesContainer);

    this.buildMap();

    return this;
};

SceneMap.prototype.createGraph = function() {
    return MapGenerator.generateMap(9, 7, 29);
};


SceneMap.prototype.buildMap = function() {
    var graph =  this.createGraph(),
       nodes = _.keys(graph._nodes),
       self = this;

    this.map = {};

    _.forEach(nodes, function(node) {
        self.map[node] = (new SimpleSector()).init(node, graph);
        self.drawNode(self.map[node]);
    });

    _.forEach(nodes, function(node) {
        _.keys(self.map[node].graph._outEdges).forEach(function(node2) {
            node2 = self.map[node2];
            self.drawEdge(self.map[node], node2);
        });
    });
};

SceneMap.prototype.render = function() {
    game.renderer.render(this.pixiStage);
};


SceneMap.prototype.loop = function() {
    this.render();
};


//SceneMap.prototype.drawGraph = function() {
    //var self = this;
    //_.keys(this.map).forEach(function(node){
        //self.drawNode(node);
    //});
//};


SceneMap.prototype.drawNode = function(node) {
    this.nodesContainer.addChild(node.view);
};


SceneMap.prototype.drawEdge = function(node, node2) {
    this.edgesContainer.lineStyle(3, 0x00ff00, 0.5);
    this.edgesContainer.moveTo(node.view.position.x, node.view.position.y);
    this.edgesContainer.lineTo(node2.view.position.x, node2.view.position.y);
};




function SimpleSector() {

}


SimpleSector.prototype.constructor = SimpleSector();


SimpleSector.prototype.texturePath = "img/brick.png";


SimpleSector.prototype.init = function(nodeName, mapGraph) {
    mapGraph.getNode(nodeName).model = this;
    this.nodeName = nodeName;
    this.graph = mapGraph.getNode(nodeName);
    this.createView();
    return this;
};


SimpleSector.prototype.createView = function() {
    var brickTexture = PIXI.Texture.fromFrame(this.texturePath);
    this.view = new PIXI.Sprite(brickTexture);
    this.view.anchor.x = 0.5;
    this.view.anchor.y = 0.5;
    this.view.position.x = this.graph.positionX * 100;
    this.view.position.y = this.graph.positionY * 100;
};

