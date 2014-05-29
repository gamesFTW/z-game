modules.define(
    'EnemyManager',
    ['Zombie', 'ZombieDamage', 'ZombieFast'],
    function(provide, Zombie, ZombieDamage, ZombieFast) {

    function EnemyManager() {
    }

    EnemyManager.prototype.constructor = EnemyManager;

    EnemyManager.prototype.scene = null;

    EnemyManager.NUMBER_OF_TYPES_IN_SECTOR = [
        [5, 2],
        [20, 3],
        [50, 4],
        [20, 5],
        [5, 6]
    ];

    EnemyManager.NUMBER_OF_TYPES_IN_WAVE = [
        [5, 1],
        [20, 2],
        [40, 3],
        [25, 4],
        [5, 5],
        [5, 6]
    ];

    EnemyManager.prototype.enemiesTypes = [Zombie, ZombieDamage, ZombieFast,
        ZombieFast, ZombieFast, ZombieFast];

    EnemyManager.prototype.init = function(scene) {
        this.scene = scene;
        this.spawnPoints = [];
        this.maxSpawnsPerPoint = 50;
        this.currentWave = -1;
        this.generateWaves(1);
        console.log(this.waves);
    };

    EnemyManager.prototype.generateWaves = function(difficulty) {
        var types = _.sample(
            this.enemiesTypes,
            this.randomNumPercent(EnemyManager.NUMBER_OF_TYPES_IN_SECTOR)
        );
        console.log(types);
        var waves = [];

        _.forEach([1,2,3], function(i) {
            var wave = {};
            var typesInWave = _.sample(
                types,
                this.randomNumPercent(EnemyManager.NUMBER_OF_TYPES_IN_WAVE)
            );
            wave.types = _.map(typesInWave, function(type) {
                return {
                    type: type,
                    number: (100 / typesInWave.length) * (difficulty / type.difficulty)
                };
            });

            waves.push(wave);
        }.bind(this));
        this.waves = waves;
    };

    EnemyManager.prototype.randomNumPercent = function(ranges) {
        var num = null,
            rnd = _.random(1,100);

        _.reduce(ranges, function(oldPercent, range) {
            var percent = range[0] + oldPercent;
            if (percent >= rnd && num === null) {
                num = range[1];
            }
            return percent;
        }, 0);

        return num;
    };

    EnemyManager.prototype.nextWave = function() {
        var self = this;
        this.currentWave++;
        this.scene.timer.delay(
            function() {
                if (self.currentWave < 3) {
                    self.nextWave();
                }
            },
            90 * 1000
        );
    };

    EnemyManager.prototype.spawn = function(spawnPoint) {
        var rnd = _.random(0, 4);
        var enemyClass;

        if (rnd === 0) enemyClass = ZombieFast;
        else if (rnd == 1) enemyClass = ZombieDamage;
        else enemyClass = Zombie;

        // TODO переписать на эвенты же
        this.scene.createObject2DAt(enemyClass, spawnPoint.x, spawnPoint.y);

        spawnPoint.spawned++;
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


