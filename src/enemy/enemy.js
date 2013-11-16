function Enemy() {
}
Enemy.prototype = Object.create( LiveObject.prototype );
Enemy.prototype.constructor = Enemy;
Enemy.superclass = LiveObject.prototype;


Enemy.prototype.meleeCooldown = 1000;
Enemy.prototype.canAttack = true;
Enemy.prototype.targetPosition = {x:null, y:null};
Enemy.prototype.pathToTarget = [];


Enemy.prototype.init = function(world, x, y, texture, isStatic, isAnimated) {
    Enemy.superclass.init.call(this, world, x, y, texture, isStatic, isAnimated);

    this.targetChangeTilePosition(game.player.tilePosition);
};


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

// TODO вставить куда нибудь и вызывать рекурсивно
//delay(function() {
//    console.log("beep");
//    var targetPosition = game.map.getTileByCoordinates(game.player.getPosition());
//    var enemyPosition = game.map.getTileByCoordinates(self.getPosition());
//    self.findPath(enemyPosition, targetPosition);
//}, 3000);

Enemy.prototype.tick = function() {
    var enemyPosition = this.getPosition('tile', game.map);

    (this.pathToTarget && !this.nearTargetStep) && this.getNearTargetStep();
    // хак для того что бы чувак не имеющий пути не выкидывал эксепшен
    if (!this.pathToTarget && !this.canGoToPlayer) {
        // console.log('warning, no path find');
        this.canGoToPlayer = true;
    }

    if (!this.canGoToPlayer) {
        // console.log(this.nearTargetStep);
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


Enemy.prototype.targetChangeTilePosition = function(targetPosition) {
    var enemyPosition = this.getPosition('tile', game.map);
    if (targetPosition.x !== this.targetPosition.x || targetPosition.y !== this.targetPosition.y) {
        if (targetPosition.x == enemyPosition.x && targetPosition.y == enemyPosition.y) {
            this.canGoToPlayer = true;
        } else {
            this.targetPosition = targetPosition;

            // if (this.pathToTarget.length > 0){
            //     // Оптимизация поиска пути. Пукаем врага по следу цели.
            //     this.pathToTarget.push(new GraphNode(targetPosition.x, targetPosition.y));
            // }
            // else{
                // console.log("findPath");
                // console.log(enemyPosition);
                this.findPath(enemyPosition, targetPosition);
            // }
        }
    }
};


Enemy.prototype.findPath = function(enemyPosition, targetPosition) {
    // TODO: возможно стоит поменять Graph на не граф, говно же
    // var graph = new Graph(game.map.giveCopyOfGreed());
    var graph = game.map.giveGraphNodes();
    try {
        var start = graph.nodes[targetPosition.x][targetPosition.y];
        var end = graph.nodes[enemyPosition.x][enemyPosition.y];
        // var result = AStar.search(graph.nodes, start, end, true);
        var result = astar.search(graph.nodes, start, end, true).reverse();
    } catch(e) {
        result = [];
    }

    this.pathToTarget = result.length > 0 ? result.slice(0, -1) : null;
    this.nearTargetStep = null;
    this.canGoToPlayer = false;
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
    position.x = position.x / Game.box2DMultiplier;
    position.y = position.y / Game.box2DMultiplier;

    var radian = Math.atan2(position.y - myPosition.y, position.x - myPosition.x);
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


