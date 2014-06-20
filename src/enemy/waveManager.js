modules.define(
    'WaveManager',
    ['Zombie', 'ZombieDamage', 'ZombieFast', 'ZombieJump', 'ZombieLongJump', 'ZombieVeryFast'],
    function(provide, Zombie, ZombieDamage, ZombieFast, ZombieJump, ZombieLongJump, ZombieVeryFast) {


    function WaveManager() {
    }

    WaveManager.prototype.constructor   = WaveManager;
    WaveManager.prototype.waves         = null;

    WaveManager.prototype.enemiesTypes = [Zombie, ZombieDamage, ZombieFast,
        ZombieJump, ZombieLongJump, ZombieVeryFast];

    WaveManager.NUMBER_OF_TYPES_IN_SECTOR = [
        [5, 2],
        [20, 3],
        [50, 4],
        [20, 5],
        [5, 6]
    ];

    WaveManager.NUMBER_OF_TYPES_IN_WAVE = [
        [5, 1],
        [20, 2],
        [40, 3],
        [25, 4],
        [5, 5],
        [5, 6]
    ];

    WaveManager.DEFAULT_ENEMIES_NUMBER = 70;

    WaveManager.prototype.generateWaves = function(difficulty) {
        var types = _.sample(
            this.enemiesTypes,
            this.randomNumPercent(WaveManager.NUMBER_OF_TYPES_IN_SECTOR)
        );
        var waves = [];

        _.forEach([1,2,3], function(i) {
            var wave = {};
            var typesInWave = _.sample(
                types,
                this.randomNumPercent(WaveManager.NUMBER_OF_TYPES_IN_WAVE)
            );
            wave.types = _.map(typesInWave, function(type) {
                return {
                    type: type,
                    number: (WaveManager.DEFAULT_ENEMIES_NUMBER / typesInWave.length) 
                        * (difficulty / type.difficulty)
                };
            });

            waves.push(wave);
        }.bind(this));

        this.waves = waves;
    };

    WaveManager.prototype.randomNumPercent = function(ranges) {
        var num = null,
            rnd = _.random(1, 100);

        _.reduce(ranges, function(oldPercent, range) {
            var percent = range[0] + oldPercent;
            if (percent >= rnd && num === null) {
                num = range[1];
            }
            return percent;
        }, 0);

        return num;
    };

    provide(WaveManager);
});
