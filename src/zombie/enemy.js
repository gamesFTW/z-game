function Enemy() {
}
Enemy.prototype = Object.create( LiveObject.prototype );
Enemy.prototype.constructor = Enemy;


Enemy.prototype.meleeCooldown = 1000;
Enemy.prototype.canAttack = true;


Enemy.prototype.attackLiveObjectWithMeleeWeapon = function(attackedObject){
    if (this.canAttack){
        // найти угол между зомби и плеером
        var radian = attackedObject.getRadianBetweenMeAnd(this);

        var speed = 0.3;
        var vel = {
            x: Math.cos(radian) * speed,
            y: Math.sin(radian) * speed
        };

        // создать на плеера импульс в эту сторону
        attackedObject.body.ApplyImpulse(
            new Box2D.Common.Math.b2Vec2(vel.x, vel.y),
            attackedObject.body.GetWorldCenter()
        );

        attackedObject.takeDamage(this.damage);

        var self = this;
        delay(function() {
            self.canAttack = true;
        }, this.meleeCooldown);

        this.canAttack = false;
    }
};