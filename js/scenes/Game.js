(function(window) {

    window.game = window.game || {};

    function Game() {
        this.initialize();
    }

    var p = Game.prototype = new createjs.Container();

    p.Container_initialize = p.initialize;

    // Player
    p.PlayerCar = null;
    p.PlayerBulletPool = null;
    p.PlayerBullets = null;

    // Enemies
    p.enemyPool = null;
    p.enemies = null;
    p.enemyBulletPool = null;
    p.enemyBullets = null;
    p.enemyLastSpawnTime = null;
    p.enemySpawnWaiter = 2000;

    // SPRITES
    p.stars = null;
    p.explosionPool = null;
    p.healthMeter = null;
    p.lifeBox = null;
    p.scoreboard = null;

    //
    p.leftWall = null;
    p.rightWall = null;
    p.ceiling = null;
    p.floor = null;
    p.betweenLevels = true;
    p.numLives = 3;
    p.delta = null;

    // Controls
    p.leftKeyDown = false;
    p.rightKeyDown = false;
    p.upKeyDown = false;
    p.downKeyDown = false;

    p.initialize = function() {
        this.Container_initialize();
        this.setProperties();
        this.buildStarField();
        this.buildSprites();
        this.setWalls();
        this.setControls();
        if(window.game.main.playSound)
            createjs.Sound.play(game.assets.SOUNDTRACK);
    };
    p.setProperties = function() {
        this.PlayerBulletPool = [];
        this.PlayerBullets = [];
        this.enemyPool = [];
        this.enemies = [];
        this.enemyBulletPool = [];
        this.enemyBullets = [];
        this.stars = [];
        this.explosionPool = [];
        this.betweenLevels = false;
        this.enemyLastSpawnTime = 0;
    };
    p.buildStarField = function() {
        var star;
        var numStars = 20;
        for (i = 0; i < numStars; i++) {
            star = new createjs.Sprite(spritesheet, 'star3');
            star.speed = Utils.getRandomNumber(100, 200);
            star.x = Math.random() * screen_width;
            star.y = Math.random() * screen_height;
            this.addChild(star);
            this.stars.push(star);
        }
    };
    p.buildSprites = function() {
        this.PlayerCar = new game.PlayerCar();
        this.PlayerCar.on(this.PlayerCar.EXPLOSION_COMPLETE, this.checkGame, this);
        this.PlayerCar.x = this.PlayerCar.getBounds().height / 2;
        this.PlayerCar.y = screen_height / 2;
        this.PlayerBulletPool = new game.SpritePool(game.Bullet, 20);
        this.enemyBulletPool = new game.SpritePool(game.Bullet, 20);
        this.enemyPool = new game.SpritePool(game.EnemyCar, 10);
        this.explosionPool = new game.SpritePool(game.Explosion, 10);
        this.healthMeter = new game.HealthMeter();
        this.scoreboard = new game.Scoreboard();
        this.lifeBox = new game.LifeBox(this.numLives);
        this.addChild(this.PlayerCar, this.healthMeter, this.scoreboard, this.lifeBox);
    };
    p.setWalls = function() {
        this.leftWall = this.PlayerCar.getBounds().height / 2;
        this.rightWall = (this.PlayerCar.getBounds().height * 3);
        this.floor = screen_height - this.PlayerCar.getBounds().width / 2;
        this.ceiling = this.PlayerCar.getBounds().width / 2;
    };
    p.setControls = function() {
        document.onkeydown = this.handleKeyDown.bind(this);
        document.onkeyup = this.handleKeyUp.bind(this);

    };
    p.handleKeyDown = function(e) {
        e = !e ? window.event : e;
        switch (e.keyCode) {
            case ARROW_KEY_LEFT:
                this.leftKeyDown = true;
                break;
            case ARROW_KEY_RIGHT:
                this.rightKeyDown = true;
                break;
            case ARROW_KEY_UP:
                this.upKeyDown = true;
                break;
            case ARROW_KEY_DOWN:
                this.downKeyDown = true;
                break;
            case SPACE_KEY:
                this.spawnPlayerBullet();
                break;
            case F_KEY:
                this.spawnPlayerBullet();
                break;
            default:
                console.log('key down', e.keyCode);
        }
    };
    p.handleKeyUp = function(e) {
        e = !e ? window.event : e;
        switch (e.keyCode) {
            case ARROW_KEY_LEFT:
                this.leftKeyDown = false;
                break;
            case ARROW_KEY_RIGHT:
                this.rightKeyDown = false;
                break;
            case ARROW_KEY_UP:
                this.upKeyDown = false;
                break;
            case ARROW_KEY_DOWN:
                this.downKeyDown = false;
                break;
            default:
                console.log('key up', e.keyCode);
        }
    };
    /*
     *
     * UPDATE FUNCTIONS
     *
     */
    p.updateStars = function() {
        var i, star, velX, speed, nextX;
        var len = this.stars.length;
        for (i = 0; i < len; i++) {
            star = this.stars[i];
            velX = star.speed * this.delta / 1000;
            nextX = star.x - velX;
            if (nextX < 0) {
                nextX = screen_width + 10;
            }
            star.nextX = nextX;
        }
    };
    p.updatePlayerCar = function() {
        var velocity = this.PlayerCar.speed * this.delta / 1000;
        var nextX = this.PlayerCar.x;
        var nextY = this.PlayerCar.y;
        if (this.leftKeyDown) {
            nextX -= velocity;
            if (nextX < this.leftWall) {
                nextX = this.leftWall;
            }
        } else if (this.rightKeyDown) {
            nextX += velocity;
            if (nextX > this.rightWall) {
                nextX = this.rightWall;
            }
        } else if (this.downKeyDown) {
            nextY += velocity;
            if (nextY > this.floor) {
                nextY = this.floor;
            }
        } else if (this.upKeyDown) {
            nextY -= velocity;
            if (nextY < this.ceiling) {
                nextY = this.ceiling;
            }
        }
        this.PlayerCar.nextX = nextX;
        this.PlayerCar.nextY = nextY;
    };
    p.updateEnemies = function() {
        var enemy, i, velX;
        var len = this.enemies.length - 1;
        for (i = len; i >= 0; i--) {
            enemy = this.enemies[i];
            velX = enemy.speed * this.delta / 1000;
            enemy.nextX = enemy.x - velX;
            if (enemy.nextX < 0) {
                enemy.reset();
                this.enemyPool.returnSprite(enemy);
                this.removeChild(enemy);
                this.enemies.splice(i, 1);
            }
        }
    };
    p.updatePlayerBullets = function() {
        var bullet, i, velX;
        var len = this.PlayerBullets.length - 1;
        for (i = len; i >= 0; i--) {
            bullet = this.PlayerBullets[i];
            velX = bullet.speed * this.delta / 1000;
            bullet.nextX = bullet.x + velX;
            if (bullet.nextX > screen_width) {
                this.PlayerBulletPool.returnSprite(bullet);
                this.removeChild(bullet);
                this.PlayerBullets.splice(i, 1);
            }
        }
    };
    p.updateEnemyBullets = function() {
        var bullet, i, velX;
        var len = this.enemyBullets.length - 1;
        for (i = len; i >= 0; i--) {
            bullet = this.enemyBullets[i];
            velX = bullet.speed * this.delta / 1000;
            bullet.nextX = bullet.x - velX;
            if (bullet.nextX < 0) {
                this.enemyBulletPool.returnSprite(bullet);
                this.removeChild(bullet);
                this.enemyBullets.splice(i, 1);
            }
        }
    };
    /*
     *
     * RENDER FUNCTIONS
     *
     */
    p.renderStars = function() {
        var i, star;
        for (i = 0; i < this.stars.length; i++) {
            star = this.stars[i];
            star.y = star.nextY;
        }
    };
    p.renderPlayerCar = function() {
        this.PlayerCar.x = this.PlayerCar.nextX;
        this.PlayerCar.y = this.PlayerCar.nextY;
    };
    p.renderPlayerBullets = function() {
        var bullet, i;
        var len = this.PlayerBullets.length - 1;
        for (i = len; i >= 0; i--) {
            bullet = this.PlayerBullets[i];
            if (bullet.shouldDie) {
                this.removeChild(bullet);
                bullet.reset();
                this.PlayerBulletPool.returnSprite(bullet);
                this.PlayerBullets.splice(i, 1);
            } else {
                bullet.x = bullet.nextX;
            }
        }
    };
    p.renderEnemyBullets = function() {
        var bullet, i;
        var len = this.enemyBullets.length - 1;
        for (i = len; i >= 0; i--) {
            bullet = this.enemyBullets[i];
            if (bullet.shouldDie) {
                this.removeChild(bullet);
                bullet.reset();
                this.enemyBulletPool.returnSprite(bullet);
                this.enemyBullets.splice(i, 1);
            } else {
                bullet.x = bullet.nextX;
            }
        }
    };
    p.renderEnemies = function() {
        var enemy, i;
        var len = this.enemies.length - 1;
        for (i = len; i >= 0; i--) {
            enemy = this.enemies[i];
            if (enemy.shouldDie) {
                this.scoreboard.updateScore(enemy.points);
                this.enemies.splice(i, 1);
                this.removeChild(enemy);
                this.spawnEnemyExplosion(enemy.x, enemy.y);
                enemy.reset();
                this.enemyPool.returnSprite(enemy);
            } else {
                enemy.x = enemy.nextX;
            }
        }
    };
    /*
     *
     * CHECK FUNCTIONS
     *
     */
    p.checkForEnemySpawn = function(time) {
        if (time - this.enemyLastSpawnTime > this.enemySpawnWaiter) {
            this.spawnEnemyCar();
            this.enemyLastSpawnTime = time;
        }
    };
    p.checkForEnemyFire = function(time) {
        var enemy, i;
        var len = this.enemies.length - 1;
        for (i = len; i >= 0; i--) {
            enemy = this.enemies[i];
            if (time - enemy.lastFired > enemy.fireDelay) {
                this.spawnEnemyBullet(enemy);
                enemy.lastFired = time;
            }
        }
    };
    p.checkPlayerBullets = function() {
        var i, b, bullet, enemy, collision;
        for (i in this.enemies) {
            enemy = this.enemies[i];
            for (b in this.PlayerBullets) {
                bullet = this.PlayerBullets[b];
                collision = ndgmr.checkPixelCollision(enemy, bullet);
                if (collision) {
                    enemy.takeDamage();
                    bullet.shouldDie = true;
                }
            }
        }
    };
    p.checkEnemyBullets = function() {
        var b, bullet, collision;
        for (b in this.enemyBullets) {
            bullet = this.enemyBullets[b];
            collision = ndgmr.checkPixelCollision(this.PlayerCar, bullet);
            if (collision) {
                bullet.shouldDie = true;
                this.PlayerCar.takeDamage();
                this.healthMeter.takeDamage(10);
            }
        }
    };
    p.checkCars = function() {
        var enemy, i;
        var len = this.enemies.length - 1;
        for (i = len; i >= 0; i--) {
            enemy = this.enemies[i];
            if (enemy.x < screen_width / 2) {
                collision = ndgmr.checkPixelCollision(this.PlayerCar, enemy);
                if (collision) {
                    this.removeChild(enemy);
                    this.enemies.splice(i, 1);
                    this.spawnEnemyExplosion(enemy.x, enemy.y);
                    this.PlayerCar.shouldDie = true;
                    break;
                }
            }
        }
    };
    p.checkHealth = function(e) {
        if (this.healthMeter.empty) {
            this.PlayerCar.shouldDie = true;
        } else {
            this.healthMeter.regenerateHealth(this.delta / 500);
        }
    };
    p.checkPlayer = function() {

        var perc = this.healthMeter.getDamagePercent();
        this.PlayerCar.fireDelay = this.PlayerCar.INITIAL_FIRE_DELAY + (perc * this.PlayerCar.MAX_FIRE_DELAY);
        // console.log('getDamagePercent(), firedelay', perc, this.PlayerCar.fireDelay);

        if (this.PlayerCar.shouldDie) {
            this.numLives--;
            this.PlayerCar.explode();
            this.lifeBox.removeLife();
            this.betweenLevels = true;
        }
    };
    p.checkGame = function(e) {
        if (this.numLives > 0) {
            this.PlayerCar.reset();
            this.PlayerCar.makeInvincible(true);
            this.healthMeter.reset();
            this.betweenLevels = false;
        } else {
            game.score = this.scoreboard.getScore();
            this.dispose();
            this.dispatchEvent(game.GameStateEvents.GAME_OVER);
        }
    };
    /*
     *
     * SPAWN FUNCTION
     *
     */
    p.spawnEnemyCar = function() {
        var enemy = this.enemyPool.getSprite();
        enemy.y = Utils.getRandomNumber(enemy.getBounds().height, screen_height - enemy.getBounds().height);
        enemy.x = screen_width + enemy.getBounds().height;
        this.addChild(enemy);
        this.enemies.push(enemy);
    };
    p.spawnEnemyBullet = function(enemy) {
        var bullet = this.enemyBulletPool.getSprite();
        bullet.currentAnimationFrame = 1;
        bullet.y = enemy.y;
        bullet.x = enemy.x;
        this.addChildAt(bullet, 0);
        this.enemyBullets.push(bullet);
    };
    p.spawnPlayerBullet = function() {

        var player = this.PlayerCar,
            time = createjs.Ticker.getTime(),
            bullet;

        if (time - player.lastFired < player.fireDelay) {
            return;
        }

        player.lastFired = time;
        bullet = this.PlayerBulletPool.getSprite();
        bullet.x = this.PlayerCar.x + this.PlayerCar.getBounds().height / 2;
        bullet.y = this.PlayerCar.y;
        this.addChildAt(bullet, 0);
        this.PlayerBullets.push(bullet);
    };
    p.spawnEnemyExplosion = function(x, y) {
        var explosion = this.explosionPool.getSprite();
        explosion.x = x - 45;
        explosion.y = y - 30;
        this.addChild(explosion);
        explosion.on('animationend', this.explosionComplete, this, true);
        explosion.play();
        if(window.game.main.playSound)
            createjs.Sound.play(game.assets.EXPLOSION);
    };
    p.explosionComplete = function(e) {
        var explosion = e.target;
        this.removeChild(explosion);
        this.explosionPool.returnSprite(explosion);
    };
    /*
     *
     * GAME LOOP
     *
     */
    p.update = function() {
        this.updateStars();
        this.updatePlayerCar();
        this.updateEnemies();
        this.updatePlayerBullets();
        this.updateEnemyBullets();
    };
    p.render = function() {
        this.renderStars();
        this.renderPlayerCar();
        this.renderEnemies();
        this.renderPlayerBullets();
        this.renderEnemyBullets();
    };
    p.run = function(tickEvent) {
        this.delta = tickEvent.delta;
        if (!this.betweenLevels) {
            this.update();
            this.render();
            this.checkForEnemySpawn(tickEvent.time);
            this.checkForEnemyFire(tickEvent.time);
            // this.checkForPlayerFire(tickEvent.time);
            this.checkPlayerBullets();
            if (!this.PlayerCar.invincible) {
                this.checkEnemyBullets();
                this.checkCars();
            }
            this.checkHealth();
            this.checkPlayer();
        }
    };
    p.dispose = function() {
        document.onkeydown = null;
        document.onkeyup = null;
    };
    window.game.Game = Game;

}(window));