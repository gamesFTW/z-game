function Inventory() {
}


Inventory.prototype.init = function(){
    this.currentmainWeaponsSlot = 0;

    var assaultRifle = new WeaponController();
    assaultRifle.init(WeaponsStats.assaultRifle);

    var shotgun = new WeaponController();
    shotgun.init(WeaponsStats.shotgun);

    var sniperRifle = new WeaponController();
    sniperRifle.init(WeaponsStats.sniperRifle);

    this.mainWeaponsSlots = [
        assaultRifle,
        shotgun,
        sniperRifle
    ];

    this.setKeyboardEvents();
};


Inventory.prototype.changeMainWeapon = function(weaponID){
    var weapon = this.getCurrentMainWeapon();
    if (weapon.betweenShotDelay){
        weapon.betweenShotDelay.remove();
        weapon.betweenShotDelay = null;
    }

    this.currentmainWeaponsSlot = weaponID;
};


Inventory.prototype.getCurrentMainWeapon = function(){
    return this.mainWeaponsSlots[this.currentmainWeaponsSlot];
};


Inventory.prototype.setKeyboardEvents = function(){
    var self = this;
    KeyboardJS.on("1", function(){
        self.changeMainWeapon(0);
    });

    KeyboardJS.on("2", function(){
        self.changeMainWeapon(1);
    });

    KeyboardJS.on("3", function(){
        self.changeMainWeapon(2);
    });
};