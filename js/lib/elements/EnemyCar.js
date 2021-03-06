(function(window) {
    window.game = window.game || {}

    function EnemyCar(startX) {
        this.initialize(startX);
    }

    var p = EnemyCar.prototype = new createjs.Sprite();

    p.Sprite_initialize = p.initialize;

    p.type = null;
    p.HP = null;
    p.points = null;

    p.lastFired = 0;
    p.nextY = 0;
    p.shouldDie = false;
    p.gotHit = false;

    p.initialize = function(startX) {

        var gameLevel = window.game.main.gameLevel;

        this.type = Utils.getRandomNumber(0, 2) + 1;
        this.HP = this.type * 3;
        this.points = this.type * 100;
        this.Sprite_initialize(spritesheet, "enemy" + this.type + "Idle");
        this.regX = this.getBounds().width / 2;
        this.regY = this.getBounds().height / 2;
        this.rotation = 90;
        this.fireDelay = window.game.gameDefinitions[gameLevel || 'MEDIUM'].enemyFireDelay;
        this.speed = window.game.gameDefinitions[gameLevel || 'MEDIUM'].enemySpeed;
    }
    p.takeDamage = function() {
        this.gotoAndPlay("enemy" + this.type + "Hit");
        this.HP--;
        if (this.HP <= 0) {
            this.shouldDie = true;
        } else {
            this.gotHit = true;
        }
    }
    p.reset = function() {
        this.type = Utils.getRandomNumber(0, 2) + 1;
        this.shouldDie = false;
        this.gotHit = false;
        this.HP = this.type * 3;
        this.points = this.type * 100;
        this.gotoAndPlay("enemy" + this.type + "Idle");
    }

    window.game.EnemyCar = EnemyCar;

}(window));