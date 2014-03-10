modules.define(
    'EnemyManager', ['Zombie', 'ZombieDamage', 'ZombieFast'], function(provide, Zombie, ZombieDamage, ZombieFast) {

    function EnemyManager() {
    }

    EnemyManager.prototype.constructor = EnemyManager;

    EnemyManager.prototype.scene = null;

    EnemyManager.prototype.init = function(scene) {
        this.scene = scene;
        this.spawnPoints = [];
        this.maxSpawnsPerPoint = 50;
    };

    EnemyManager.prototype.spawn = function(spawnPoint) {
        var rnd = _.random(0, 4);
        var enemyClass;

        if (rnd === 0) enemyClass = ZombieFast;
        else if (rnd == 1) enemyClass = ZombieDamage;
        else enemyClass = Zombie;

        // TODO переписать на эвенты
        this.scene.createObject2DAt(enemyClass, spawnPoint.x, spawnPoint.y);

        spawnPoint.spawned++;
        //if (spawnPoint.spawned > this.maxSpawnsPerPoint) {
        //    spawnPoint.spawnDelayController.remove();
        //}
        return this;
    };

    EnemyManager.prototype.setSpawnPoint = function(x, y, rate) {
        var self = this;
        rate = rate ? rate : EnemyManager.SPAWN_RATE;

        var spawnPoint = {
            x: x,
            y: y,
            rate: rate,
            spawned: 0
        };
        this.spawnPoints.push(spawnPoint);

        var delayController = this.scene.timer.delay(
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

    provide(EnemyManager);
});


