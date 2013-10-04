function EnemyManager() {
    //Я зомби командую и я синглтон
    if (!EnemyManager.__instance)
        EnemyManager.__instance = this;
    else
        return EnemyManager.__instance;
}

EnemyManager.prototype.constructor = EnemyManager;

EnemyManager.prototype.init = function() {
    this.spawnPoints = [];
}

EnemyManager.prototype.spawn = function(spawnPoint) {
    var rnd = _.random(0, 4);
    var enemyClass;

    if (rnd == 0) enemyClass = ZombieFast;
    else if (rnd == 1) enemyClass = ZombieDamage;
    else enemyClass = Zombie;

    game.createObject2DAt(enemyClass, spawnPoint.x, spawnPoint.y);
}

EnemyManager.prototype.setSpawnPoint = function(x, y, rate) {
    var self = this;
    if (!rate)
        rate = EnemyManager.SPAWN_RATE;
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

EnemyManager.SPAWN_RATE = 1; //in seconds


