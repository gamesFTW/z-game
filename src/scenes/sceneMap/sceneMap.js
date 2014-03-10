modules.define(
    'SceneMap', ['Scene', 'SimpleSector', 'MapGenerator'], function(provide, Scene, SimpleSector, MapGenerator) {
    function SceneMap() {

    }

    SceneMap.prototype = Object.create(Scene.prototype);
    SceneMap.prototype.constructor = SceneMap;
    SceneMap.superclass = Scene.prototype;


    SceneMap.prototype.graphManager = null;


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

        this.createPlayer();

        return this;
    };


    SceneMap.prototype.disactive = function() {
        this.pixiStage.visible = false;
    };

    SceneMap.prototype.active = function() {
        this.pixiStage.visible = true;
    };

    SceneMap.prototype.buildMap = function() {
        this.graphManager =  this.createGraph();
        var nodes = _.keys(this.graphManager._nodes),
            self = this;

        this.map = {};

        _.forEach(nodes, function(node) {
            var simpleSector = (new SimpleSector()).init(node, self.graphManager);
            self.map[node] = simpleSector;

            simpleSector.view.interactive = true;
            simpleSector.view.click = function(event){
                self.sectorClickhandler(event, simpleSector);
            };

            self.drawNode(simpleSector);
        });

        _.forEach(nodes, function(node) {
            _.keys(self.map[node].graph._outEdges).forEach(function(node2) {
                node2 = self.map[node2];
                self.drawEdge(self.map[node], node2);
            });
        });
    };


    SceneMap.prototype.createGraph = function() {
        return MapGenerator.generateMap(9, 7, 29);
    };


    SceneMap.prototype.getRandomSector = function() {
        return this.map[_.sample(_.keys(this.map))];
    };


    SceneMap.prototype.createPlayer = function() {
        this.player = new MapUnitPlayer();
        this.player.init();

        var randomSector = this.getRandomSector();
        randomSector.addUnit(this.player);
    };


    SceneMap.prototype.render = function() {
        game.renderer.render(this.pixiStage);
    };


    SceneMap.prototype.loop = function() {
        this.render();
    };


    SceneMap.prototype.drawNode = function(node) {
        this.nodesContainer.addChild(node.view);
    };


    SceneMap.prototype.drawEdge = function(node, node2) {
        this.edgesContainer.lineStyle(3, 0x00ff00, 0.5);
        this.edgesContainer.moveTo(node.view.position.x, node.view.position.y);
        this.edgesContainer.lineTo(node2.view.position.x, node2.view.position.y);
    };


    SceneMap.prototype.moveUnitToSector = function(unit, sector) {
        unit.currentSector.removeUnit(unit);

        sector.addUnit(unit);
    };


    SceneMap.prototype.movePlayerToSector = function(unit, sector) {
        this.moveUnitToSector(unit, sector);

        if (_.random(0, 1) == 1) {
            this.dispatchEvent(SceneMap.PLAYER_ENCOUNTERED_ENEMIES);
        }
    };


    SceneMap.prototype.sectorClickhandler = function(event, sector) {
        var playerSector = this.player.currentSector;

        if (this.graphManager.getEdge(playerSector.nodeName, sector.nodeName) !== undefined) {
            this.movePlayerToSector(this.player, sector);
        }
    };


    SceneMap.PLAYER_ENCOUNTERED_ENEMIES = "playerEncounteredEnemies";

    provide(SceneMap);
});
