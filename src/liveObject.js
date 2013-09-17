function LiveObject() {
}
LiveObject.prototype = Object.create( Object2D.prototype );
LiveObject.prototype.constructor = LiveObject;


LiveObject.prototype.onDie = function(){};


LiveObject.prototype.isLive     = true;
LiveObject.prototype.hp         = 100;


LiveObject.prototype.takeDamage = function(damage){
    this.hp -= damage;

    if (this.hp <= 0)
        this.die();
};


LiveObject.prototype.die = function(){
    this.onDie(this);
};