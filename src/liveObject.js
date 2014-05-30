modules.define(
    'LiveObject', ['Object2D'], function(provide, Object2D) {

    function LiveObject() {
    }
    LiveObject.prototype = Object.create( Object2D.prototype );
    LiveObject.prototype.constructor = LiveObject;
    LiveObject.superclass = Object2D.prototype;


    LiveObject.HP_CHANGED = "hpChanged";
    LiveObject.DIE = "die";

    LiveObject.prototype.isLive     = true;
    LiveObject.prototype.hp         = 100;
    LiveObject.prototype.is_died    = false;
    LiveObject.prototype.canMove    = true;


    LiveObject.prototype.init = function(scene, x, y, texture, isStatic, isAnimated) {
        LiveObject.superclass.init.call(this, scene, x, y, texture, isStatic, isAnimated);
        this.body.SetLinearDamping(6);
    };


    LiveObject.prototype.takeDamage = function(damage){
        if (!this.is_died) {
            this.hp -= damage;

            this.dispatchEvent(LiveObject.HP_CHANGED);

            if (this.hp <= 0)
                this.die();

            if (this.soundTakeDamage)
                createjs.Sound.play(this.soundTakeDamage, createjs.Sound.INTERRUPT_NONE, 0, 0, false, 1);
        }
    };


    LiveObject.prototype.die = function(){
        this.is_died = true;
        createjs.Sound.play(this.soundDie, createjs.Sound.INTERRUPT_NONE, 0, 0, false, 1);
        this.dispatchEvent(LiveObject.DIE);
    };

    provide(LiveObject);
});
