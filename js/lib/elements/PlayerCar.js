(function(window) {

    window.game = window.game || {}

    function PlayerCar() {
        this.initialize();
    }

    var p = PlayerCar.prototype = new createjs.Sprite();

    p.Sprite_initialize = p.initialize;

    p.EXPLOSION_COMPLETE = 'explosion complete';
    p.EXPLOSION_OFFSET = 55;
    p.INVINCIBLE_TIME = 1500;
    p.MAX_FIRE_DELAY = 400;
    p.INITIAL_FIRE_DELAY = 100;
    p.fireDelay = p.INITIAL_FIRE_DELAY;
    p.invincible = false;
    p.shouldDie = false;
    p.speed = 500;
    p.nextX = null;
    p.nextY = null;

    p.initialize = function() {
        this.Sprite_initialize(spritesheet, "PlayerIdle");
        this.regX = this.getBounds().width / 2;
        this.regY = this.getBounds().height / 2;
        this.rotation = 90;
    };
    p.takeDamage = function() {
        this.gotoAndPlay("PlayerHit");
    };
    p.explode = function() {
        this.gotoAndPlay('explosion');
        this.regX = this.regY = this.EXPLOSION_OFFSET;
        this.on('animationend', this.explosionComplete, this, true);
        if (window.game.main.playSound)
            createjs.Sound.play(game.assets.EXPLOSION);
    };
    p.explosionComplete = function(e) {
        this.stop();
        this.dispatchEvent(this.EXPLOSION_COMPLETE);
    };
    p.reset = function() {
        this.fireDelay = this.INITIAL_FIRE_DELAY;
        this.shouldDie = false;
        this.gotoAndStop('PlayerIdle');
        this.regX = this.getBounds().width / 2;
        this.regY = this.getBounds().height / 2;
    };
    p.makeInvincible = function() {
        this.invincible = true;
        this.alpha = 0.4;
        setTimeout(this.removeInvincible.bind(this), this.INVINCIBLE_TIME);
    };
    p.removeInvincible = function() {
        this.invincible = false;
        this.alpha = 1;
    };

    window.game.PlayerCar = PlayerCar;

}(window));