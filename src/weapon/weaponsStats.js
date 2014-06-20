modules.define(
    'WeaponsStats', [], function(provide) {

    WeaponsStats = {
        assaultRifle:{
            // dps:             283
            damage:             34,
            timeBetweenShots:   120,
            scatter:            0.13,
            bulletSpeed:        0.4,
            bulletsPerShot:     1,
            shotSound:          "shoot_assaut_rifle"
        },
        shotgun:{
            // dps:             200
            damage:             20,
            timeBetweenShots:   400,
            scatter:            0.15,
            bulletSpeed:        0.4,
            bulletsPerShot:     4,
            shotSound:          "shoot"
        },
        sniperRifle:{
            // dps:             250
            damage:             150,
            timeBetweenShots:   600,
            scatter:            0.03,
            bulletSpeed:        0.8,
            bulletsPerShot:     1,
            shotSound:          "shoot_sniper_rifle"
        },
        doubleBarrel:{
            // dps:             137
            damage:             8,
            timeBetweenShots:   700,
            scatter:            0.20,
            bulletSpeed:        0.5,
            bulletsPerShot:     12,
            shotSound:          "shoot"
        }
    };
    provide(WeaponsStats);
});