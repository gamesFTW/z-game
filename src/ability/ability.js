modules.define(
    'Ability', ['EventDispatcher'], function (provide, EventDispatcher) {

    function Ability() {

    }

    Ability.prototype = Object.create( EventDispatcher.prototype );
    Ability.prototype.constructor = Ability;

    Ability.prototype.name 			= "";
    Ability.prototype.cooldown 		= 0;
    Ability.prototype.user 			= null;
    Ability.prototype.isOnCooldown 	= false;

    Ability.prototype.use = function() {
    	var self = this;

    	if (!this.isOnCooldown) {
    		this.isOnCooldown = true;

    		game.activeScene.timer.delay(function() {
    			self.isOnCooldown = false;
    		}, this.cooldown);
    	}
    };

    provide(Ability);
});

modules.define(
    'AbilityJump', ['Ability'], function (provide, Ability) {

    function AbilityJump() {

    }

    AbilityJump.prototype = Object.create( Ability.prototype );
    AbilityJump.prototype.constructor = AbilityJump;
    AbilityJump.superclass = Ability.prototype;

    AbilityJump.prototype.name 			= "jump";
    AbilityJump.prototype.cooldown 		= 10 * 1000;
    AbilityJump.prototype.jumpTime 		= 1 * 1000;
    AbilityJump.prototype.jumpForce 	= 2;

    AbilityJump.prototype.init = function(cooldown, jumpForce) {
    	this.id = new Date();
    	// console.log(this.id.getMilliseconds());

    	this.cooldown = cooldown || this.cooldown;
    	this.jumpForce = jumpForce || this.jumpForce;

    	return this;
    };

    AbilityJump.prototype.use = function(position) {
    	// console.log("use");
    	// console.log(this.id.getMilliseconds());

    	if (!this.isOnCooldown) {
    		// console.log("use2");
	        this.user.body.SetLinearDamping(1.3);
	        this.user.isJumping = true;        

	        var myPosition = this.user.getPosition('box2D');

	        var radian = Math.atan2(position.y - myPosition.y, position.x - myPosition.x);

	        var newVelocity = new Box2D.Common.Math.b2Vec2(
	            Math.cos(radian) * this.jumpForce,
	            Math.sin(radian) * this.jumpForce
	        );

	        this.user.body.ApplyImpulse(
	            newVelocity,
	            this.user.body.GetWorldCenter()
	        );

	        game.activeScene.timer.delay(function() {
	            this.user.body.SetLinearDamping(6);
	            this.user.isJumping = false;
	        }.bind(this), this.jumpTime);
	    }

    	AbilityJump.superclass.use.apply(this);
    };

    provide(AbilityJump);
});