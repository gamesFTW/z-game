modules.define(
    'EnemyManager',
    ['Zombie', 'ZombieDamage', 'ZombieFast', 'WaveManager'],
    function(provide, Zombie, ZombieDamage, ZombieFast, WaveManager) {

    function EnemyManager() {
    }

    EnemyManager.prototype.constructor          = EnemyManager;

    EnemyManager.prototype.scene                = null;
    EnemyManager.prototype.waveManager          = null;
    EnemyManager.prototype.currentWaveID        = -1;
    EnemyManager.prototype.enemiesRespawned     = 0;
    EnemyManager.prototype.is_waves_finished    = false;
    EnemyManager.prototype.nextWaveTimer        = null;

    EnemyManager.WAVE_DURATION                  = 60;

    EnemyManager.prototype.init = function(scene) {
        this.scene = scene;
        this.spawnPoints = [];

        this.waveManager = new WaveManager();
        this.waveManager.generateWaves(1);
    };

    EnemyManager.prototype.nextWaveRightNow = function() {
        if (this.nextWaveTimer) {
            this.nextWaveTimer.remove();
            this.nextWaveTimer = null;
        }

        this.nextWave();
    };

    EnemyManager.prototype.nextWave = function() {
        var self = this;
        
        this.currentWaveID++;
        this.spanwWave();

        if (this.currentWaveID < this.waveManager.waves.length - 1) {
            this.nextWaveTimer = this.scene.timer.delay(
                self.nextWave.bind(this),
                EnemyManager.WAVE_DURATION * 1000
            );    
        } else {
            this.is_waves_finished = true;
        }
    };

    EnemyManager.prototype.spanwWave = function() {
        var types = this.waveManager.waves[this.currentWaveID].types;
        for (var i = 0; i < types.length; i++) {
            for (var j = 0; j < types[i].number; j++) {
                this.spawnAtRandomPoint(types[i].type);
            }
        }
    };

    EnemyManager.prototype.spawnAtRandomPoint = function(enemyClass) {
        var spawnPoint = _.sample(this.spawnPoints);

        this.enemiesRespawned ++;
        this.scene.createObject2DAt(enemyClass, spawnPoint.x, spawnPoint.y);
    };

    EnemyManager.prototype.setSpawnPoint = function(x, y) {
        var self = this;

        var spawnPoint = {
            x: x,
            y: y
        };
        this.spawnPoints.push(spawnPoint);
        return this;
    };

    provide(EnemyManager);
});