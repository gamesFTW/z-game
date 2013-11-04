function Enemy() {
}
Enemy.prototype = Object.create( LiveObject.prototype );
Enemy.prototype.constructor = Enemy;


Enemy.prototype.meleeCooldown = 1000;
Enemy.prototype.canAttack = true;
Enemy.prototype.targetPosition = {x:null, y:null};


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


Enemy.prototype.tick = function() {
    var targetPosition = game.map.getTileByCoordinates(game.player.getPosition());
    var enemyPosition = game.map.getTileByCoordinates(this.getPosition());
    if (targetPosition.x !== this.targetPosition.x || targetPosition.y !== this.targetPosition.y) {
        if (targetPosition.x == enemyPosition.x && targetPosition.y == enemyPosition.y) {
            this.canGoToPlayer = true;
        } else {
            this.targetPosition = targetPosition;

            // TODO: возможно стоит поменять Graph на не граф, говно же
            var graph = new Graph(game.map.giveCopyOfGreed());
            try {
                var start = graph.nodes[enemyPosition.x][enemyPosition.y];
                var end = graph.nodes[targetPosition.x][targetPosition.y];
                var result = astar.search(graph.nodes, start, end, true);
            } catch(e) {
                var result = [];
            }

            this.pathToTarget = result.length > 0 ? result.slice(0, -1) : null;
            this.nearTargetStep = null;
            this.canGoToPlayer = false;
        }
    }

    (this.pathToTarget && !this.nearTargetStep) && this.getNearTargetStep();
    if (!this.canGoToPlayer) {
        if (enemyPosition.x == this.nearTargetStep.x && enemyPosition.y == this.nearTargetStep.y) {
            this.getNearTargetStep();
        }
    }

    if (this.canGoToPlayer) {
        this.goToPosition(game.player.getPosition('pixi'));
    } else {
        this.goToPosition();
    }
};


Enemy.prototype.getNearTargetStep = function() {
    this.nearTargetStep = this.pathToTarget.shift();
    if (!this.nearTargetStep) {
        this.canGoToPlayer = true;
    }
    return this.nearTargetStep;
};


Enemy.prototype.goToPosition = function(position) {
    var myPosition = this.getPosition('box2D');
    position = position || game.map.getCoordinatesByTileInCenter(this.nearTargetStep);
    position.x = position.x / 100;
    position.y = position.y / 100;

    var self = this;
    //function randomateInfelicity() {
    //    // Рандомим погрешность, что бы зомби не шли по прямой на плеера.
    //    var infelicity = Math.random() * (self.dullness - 0) + self.dullness;
    //    self._radianInfelicity = _.random(- infelicity, infelicity);
    //}

    //if (this._changeDirectionCounter >= this._changeDirection) {
    //    randomateInfelicity();

    //    this._changeDirectionCounter = 0;
    //} else {
    //    this._changeDirectionCounter ++;

    //}

    //var playerX = playerPosition.x + this._infelicityX,
    //    playerY = playerPosition.y + this._infelicityY;
    var radian = Math.atan2(position.y - myPosition.y, position.x - myPosition.x);
    //this._radianWithInfelicity = radian + this._radianInfelicity;

    var velocity = this.body.GetLinearVelocity();

    var newVelocity = new Box2D.Common.Math.b2Vec2(
        Math.cos(radian) * this.acceleration,
        Math.sin(radian) * this.acceleration
    );


    if ((Math.abs(newVelocity.x + velocity.x) > this.maxSpeed) && signum(newVelocity.x) == signum(velocity.x))
        newVelocity.x = 0;

    if ((Math.abs(newVelocity.y + velocity.y) > this.maxSpeed) && signum(newVelocity.y) == signum(velocity.y))
        newVelocity.y = 0;

    this.body.ApplyImpulse(
        newVelocity,
        this.body.GetWorldCenter()
    );

    // Rotate in right angle
    radian = Math.atan2(velocity.y, velocity.x);
    var newRotation = radian - (90 * (Math.PI / 180));
    this.body.SetAngle(newRotation);
};


