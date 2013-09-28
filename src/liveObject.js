function LiveObject() {
}
LiveObject.prototype = Object.create( Object2D.prototype );
LiveObject.prototype.constructor = LiveObject;


LiveObject.prototype.onDie = function(){};
LiveObject.prototype.onHpChanged = function(){};


LiveObject.prototype.isLive     = true;
LiveObject.prototype.hp         = 100;


LiveObject.prototype.takeDamage = function(damage){
    this.hp -= damage;

    this.onHpChanged(this.hp);

    if (this.hp <= 0)
        this.die();

    if (this.soundTakeDamage)
        createjs.Sound.play(this.soundTakeDamage, createjs.Sound.INTERRUPT_NONE, 0, 0, false, 1);
};


LiveObject.prototype.die = function(){
    createjs.Sound.play(this.soundDie, createjs.Sound.INTERRUPT_NONE, 0, 0, false, 1);
    this.onDie(this);
};