function ZombieManager() {
    //Я зомби командую и я синглтон
    if (!ZombieManager.__instance)
        ZombieManager.__instance = this;
    else
        return ZombieManager.__instance;
}

ZombieManager.prototype.constructor = ZombieManager;

ZombieManager.prototype.init = function() {
    this.spawnPoints = [];
}

ZombieManager.prototype.spawn = function(spawnPoint) {
    game.createObject2DAt(Zombie, spawnPoint.x, spawnPoint.y);
}

ZombieManager.prototype.setSpawnPoint = function(x, y, rate) {
    var self = this;
    if (!rate)
        rate = ZombieManager.SPAWN_RATE;
    this.spawnPoints.push({
        x: x,
        y: y,
        rate: rate
    });
    delay(function() {
        self.spawn({
            x: x,
            y: y,
            rate: rate
        })
    }, 1000 * rate, -1);
}

ZombieManager.SPAWN_RATE = 1; //in seconds


