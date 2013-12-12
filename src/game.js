function Game() {

}

Game.prototype.constructor = Game;

Game.WIDTH = 1024;
Game.HEIGHT = 768;
Game.box2DMultiplier = 100;

Game.prototype.init = function(renderer) {

    this.renderer = renderer;

    this.timer = new GlobalTimer();
    this.timer.init();

    //TODO: убрать в другое место!! FPS
    this.stats = new Stats();
    $(".viewport").append(this.stats.domElement);
    this.stats.domElement.style.position = "absolute";

    this.activeScene = new Sector();
    this.activeScene.init();
};



Game.prototype.mainLoop = function() {
    var self = this;

    function loop(){
        // TODO Cчитываем кнопки пользователя

        // Считаем таймер для делеев и симуляци
        self.timer.tick();
        // TODO Пройтись по всем активным стейджам и запустить их лупы
        self.activeScene.loop();

        self.stats.update();
        requestAnimFrame(loop);
    }

    loop();
};



