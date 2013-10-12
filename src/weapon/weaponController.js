function WeaponController() {
}


WeaponController.prototype.init = function(weaponStats){
    this.weaponStats = weaponStats;
};


// Означает что сейчас идет кулдаун между выстрелами
WeaponController.prototype.isBetweenShot = false;
WeaponController.prototype.betweenShotDelay = null;