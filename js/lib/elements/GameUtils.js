(function(window) {

    window.game = window.game || {}

    function Bullet() {
        this.initialize();
    }

    var p = Bullet.prototype = new createjs.Sprite();

    p.Sprite_initialize = p.initialize;

    p.speed = 500;
    p.nextY = null;
    p.shouldDie = false;

    p.initialize = function() {
        this.Sprite_initialize(spritesheet, "bullet");
        this.paused = true;
        this.rotation = 90;
    };
    p.reset = function() {
        this.shouldDie = false;
    };

    window.game.Bullet = Bullet;

    function Explosion() {
        this.initialize();
    }

    var p = Explosion.prototype = new createjs.Sprite();

    p.Sprite_initialize = p.initialize;

    p.initialize = function () {
        this.Sprite_initialize(spritesheet,'explosion');
        this.paused = true;
    }
    p.reset = function(){
        this.gotoAndStop('explosion');
    }

    window.game.Explosion = Explosion;

    function HealthMeter() {
        this.initialize();
    }

    var p = HealthMeter.prototype = new createjs.Container();

    p.meter = null;
    p.maxDamage = null;
    p.damage = 0;
    p.empty = false;

    p.Container_initialize = p.initialize;

    p.initialize = function() {
        this.Container_initialize();
        this.x = this.y = 5;
        this.buildMeter();
    };
    p.buildMeter = function() {
        var health = new createjs.Sprite(spritesheet, 'healthHUD');
        this.meter = new createjs.Sprite(spritesheet, 'progessHUD');
        this.maxDamage = this.meter.spriteSheet.getAnimation(this.meter.currentAnimation).frames.length - 1;
        this.meter.paused = true;
        this.addChild(health, this.meter);
    };
    p.getDamagePercent = function() {
        return this.damage / this.maxDamage > 1 ? 1 : this.damage / this.maxDamage;
    };
    p.takeDamage = function(damage) {
        this.damage += damage;
        var perc = this.damage / this.maxDamage > 1 ? 1 : this.damage / this.maxDamage;
        var frame = (this.maxDamage * perc);
        createjs.Tween.get(this.meter).to({ currentAnimationFrame: frame }, 100)
            .call(this.checkHealth, null, this);
    };
    p.regenerateHealth = function(health) {
        if (this.damage > 0) {
            this.damage -= health > this.amage ? this.damage : health;
        }
        var perc = this.damage / this.maxDamage > 1 ? 1 : this.damage / this.maxDamage;
        var frame = (this.maxDamage * perc);
        createjs.Tween.get(this.meter).to({ currentAnimationFrame: frame }, 100)
            .call(this.checkHealth, null, this);
    };
    p.checkHealth = function(e) {
        if (this.meter.currentAnimationFrame === this.maxDamage) {
            this.empty = true;
        }
    };
    p.reset = function(e) {
        this.damage = 0;
        this.empty = false;
        this.meter.currentAnimationFrame = 0;
    };

    window.game.HealthMeter = HealthMeter;

function LifeBox(numLives) {
        this.numLives = numLives;
        this.initialize();
    }

    var p = LifeBox.prototype = new createjs.Container();

    p.numLives = null;

    p.Container_initialize = p.initialize;

    p.initialize = function () {
        this.Container_initialize();
        this.buildSprites();
        this.positionBox();
    }
    p.buildSprites = function () {
        var i, life;
        var xPos = 0;
        for (i = 0; i < this.numLives; i++) {
            life = new createjs.Sprite(spritesheet, 'healthHUD');
            life.paused = true;
            life.x = xPos;
            this.addChild(life);
            xPos += life.getBounds().width + 10;
        }
    }
    p.positionBox = function () {
        this.x = screen_width - this.getBounds().width;
        this.y = screen_height - this.getBounds().height;
    }
    p.removeLife = function () {
        var life = this.getChildAt(0);
        life.on('animationend', function (e) {
            e.target.stop();
            this.removeChild(e.target);
        }, this)
        life.play();
    }

    window.game.LifeBox = LifeBox;

function Scoreboard() {
        this.initialize();
    }

    var p = Scoreboard.prototype = new createjs.Container();

    p.scoreTxt;
    p.score = 0;

    p.Container_initialize = p.initialize;

    p.initialize = function () {
        this.Container_initialize();
        this.x = screen_width - 165;
        this.y = 5;
        this.updateScore(0);
    }
    p.updateScore = function (points) {
        var formattedScore;
        this.removeAllChildren();
        this.score += points;
        formattedScore = this.addLeadingZeros(this.score, 7);
        this.scoreTxt = new createjs.BitmapText(formattedScore, spritesheet);
        this.addChild(this.scoreTxt);
    }
    p.addLeadingZeros = function (score, width) {
        score = score + '';
        return score.length >= width ? score : new Array(width - score.length + 1).join(0) + score;
    }
    p.getScore = function () {
        return this.addLeadingZeros(this.score, 7);
    }

    window.game.Scoreboard = Scoreboard;


}(window));