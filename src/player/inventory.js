function Inventory() {
}


Inventory.prototype.init = function(){
    this.currentmainWeaponsSlot = 0;
    this.mainWeaponsSlots = [null, null, null];

    this.setKeyboardEvents();
};


Inventory.prototype.setKeyboardEvents = function(){
    var self = this;
    KeyboardJS.on("1", function(){
        self.currentmainWeaponsSlot = 0;
    });

    KeyboardJS.on("2", function(){
        self.currentmainWeaponsSlot = 1;
    });

    KeyboardJS.on("3", function(){
        self.currentmainWeaponsSlot = 2;
    });
};