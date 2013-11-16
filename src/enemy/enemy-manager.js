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
    this.maxSpawnsPerPoint = 50;
};

EnemyManager.prototype.spawn = function(spawnPoint) {
    var rnd = _.random(0, 4);
    var enemyClass;

    if (rnd == 0) enemyClass = ZombieFast;
    else if (rnd == 1) enemyClass = ZombieDamage;
    else enemyClass = Zombie;

    game.createObject2DAt(enemyClass, spawnPoint.x, spawnPoint.y);

    spawnPoint.spawned++;
    //if (spawnPoint.spawned > this.maxSpawnsPerPoint) {
    //    spawnPoint.spawnDelayController.remove();
    //}
    return this;
};

EnemyManager.prototype.setSpawnPoint = function(x, y, rate) {
    var self = this;
    if (!rate)
        rate = EnemyManager.SPAWN_RATE;

    var spawnPoint = {
        x: x,
        y: y,
        rate: rate,
        spawned: 0
    };
    this.spawnPoints.push(spawnPoint);

    var delayController = delay(
        function() {
            self.spawn(spawnPoint);
        },
        1000 * rate,
        -1
    );

    spawnPoint.spawnDelayController = delayController;
    return this;
};

EnemyManager.SPAWN_RATE = 10; //in seconds


