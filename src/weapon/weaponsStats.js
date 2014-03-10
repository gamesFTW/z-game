modules.define(
    'WeaponsStats', [], function(provide) {

    WeaponsStats = {
        assaultRifle:{
            damage:             34,
            timeBetweenShots:   120,
            scatter:            0.1,
            bulletSpeed:        0.4,
            bulletsPerShot:     1,
            shotSound:          "shoot"
        },
        shotgun:{
            damage:             20,
            timeBetweenShots:   400,
            scatter:            0.15,
            bulletSpeed:        0.4,
            bulletsPerShot:     4,
            shotSound:          "shoot"
        },
        sniperRifle:{
            damage:             100,
            timeBetweenShots:   400,
            scatter:            0.05,
            bulletSpeed:        0.8,
            bulletsPerShot:     1,
            shotSound:          "shoot"
        }
    };
    provide(WeaponsStats);
});
