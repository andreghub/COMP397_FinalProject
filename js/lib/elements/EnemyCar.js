(function(window) {
    window.game = window.game || {}

    function EnemyCar(startX) {
        this.initialize(startX);
    }

    var p = EnemyCar.prototype = new createjs.Sprite();
    var gameLevel = window.game.gameLevel;

    p.Sprite_initialize = p.initialize;

    p.type = null;
    p.HP = null;
    p.points = null;

    p.lastFired = 0;
    p.fireDelay = window.game.gameDefinitions[gameLevel || 'MEDIUM'].enemyFireDelay;
    p.speed = window.game.gameDefinitions[gameLevel || 'MEDIUM'].enemySpeed;
    p.nextY = 0;
    p.shouldDie = false;

    p.initialize = function(startX) {
        this.type = Utils.getRandomNumber(0, 2) + 1;
        this.HP = this.type * 3;
        this.points = this.type * 100;
        this.Sprite_initialize(spritesheet, "enemy" + this.type + "Idle");
        this.regX = this.getBounds().width / 2;
        this.regY = this.getBounds().height / 2;
        this.rotation = 90;

    }
    p.takeDamage = function() {
        this.gotoAndPlay("enemy" + this.type + "Hit");
        this.HP--;
        if (this.HP <= 0) {
            this.shouldDie = true;
        }
    }
    p.reset = function() {
        this.type = Utils.getRandomNumber(0, 2) + 1;
        this.shouldDie = false;
        this.HP = this.type * 3;
        this.points = this.type * 100;
        this.gotoAndPlay("enemy" + this.type + "Idle");
    }

    window.game.EnemyCar = EnemyCar;

}(window));