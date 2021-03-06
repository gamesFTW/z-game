modules.define(
    'Inventory', ['WeaponController', 'WeaponsStats'], function(provide, WeaponController, WeaponsStats) {

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

        var doubleBarrel = new WeaponController();
        doubleBarrel.init(WeaponsStats.doubleBarrel);

        this.mainWeaponsSlots = [
            assaultRifle,
            shotgun,
            sniperRifle,
            doubleBarrel
        ];

        this.setKeyboardEvents();
    };


    Inventory.prototype.destroy = function(){
        KeyboardJS.clear('1');
        KeyboardJS.clear('2');
        KeyboardJS.clear('3');
        KeyboardJS.clear('4');
    };


    Inventory.prototype.changeMainWeapon = function(weaponID){
        var weapon = this.getCurrentMainWeapon();
        if (weapon.betweenShotDelay) {
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

        KeyboardJS.on("4", function(){
            self.changeMainWeapon(3);
        });
    };

    provide(Inventory);
});
