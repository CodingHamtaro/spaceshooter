var BootState, LoadState, PlayState,
    PLAYER_VELOCITY_RIGHT = 2000,
    PLAYER_VELOCITY_LEFT = -2000,
    MIN_ENEMY_SPACING = 100,
    MAX_ENEMY_SPACING = 150,
    MIN_ENEMY_SPEED = 500,
    MAX_ENEMY_SPEED = 750,
    BULLET_TIME = 0,
    ENEMY_BULLET_CHANCE = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ENEMY_ECOUNTER_CHANCE = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    METEOR_ENCOUTER_CHANCE = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    MIN_METEOR_SPEED = 50,
    MAX_METEOR_SPEED = 75,
    METEOR_TIME = 0,
    PLAYER_SCORE = 0;

PlayState = {
    preload: function () {
        game.time.advancedTiming = true;
    },
    fireBullet: function () {
        if (game.time.now > BULLET_TIME && this.bullets.countDead() > 0) {
            var bullet = this.bullets.getFirstDead();
            bullet.reset(this.player.x, this.player.y - 30);
            bullet.body.velocity.y = -2500;
            BULLET_TIME = game.time.now + 150;
        }
    },
    enemyFireBullet: function (enemy, fire) {
        if (fire == 1 && game.time.now > enemy.bulletTime && this.enemyBullets.countDead() > 0) {
            var bullet = this.enemyBullets.getFirstDead();
            bullet.reset(enemy.x, enemy.y + 50);
            bullet.body.velocity.y = 2500;
            enemy.bulletTime = game.time.now + 100;
        }
    },
    enemyShouldFire: function () {
        this.enemiest1.forEach((enemy) => {
            var shallFire = ENEMY_BULLET_CHANCE[Randomize(0, 19)];
            if (shallFire) {
                enemy.bulletTime = 0;
                this.enemyFireBullet(enemy, shallFire)
            }
        });
    },
    spawnEnemy: function () {
        if (this.enemiest1.countDead() > 0) {
            var enemy = this.enemiest1.getFirstDead();
            enemy.reset(game.rnd.integerInRange(64, (game.width - 64)), -20);
            enemy.body.velocity.y = game.rnd.integerInRange(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED);
        }
        this.enemyShouldFire()
    },
    spawnMeteor: function () {
        if (game.time.now > METEOR_TIME) {
            var choices = [0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4];
            chosen = choices[Randomize(0, 19)];
            switch (chosen) {
                case 1:
                    if (this.meteorBig1.countDead() > 0) {
                        var meteor_1 = this.meteorBig1.getFirstDead();
                        meteor_1.reset(game.rnd.integerInRange(64, (game.width - 64)), -20);
                        meteor_1.body.velocity.y = game.rnd.integerInRange(MIN_METEOR_SPEED, MAX_METEOR_SPEED);
                        meteor_1.rotation = Randomize(0, 359);
                    }
                    break;
                case 2:
                    if (this.meteorBig2.countDead() > 0) {
                        var meteor_2 = this.meteorBig2.getFirstDead();
                        meteor_2.reset(game.rnd.integerInRange(64, (game.width - 64)), -20);
                        meteor_2.body.velocity.y = game.rnd.integerInRange(MIN_METEOR_SPEED, MAX_METEOR_SPEED);
                        meteor_2.rotation = Randomize(0, 359);
                    }
                    break;

                case 3:
                    if (this.meteorBig3.countDead() > 0) {
                        var meteor_3 = this.meteorBig3.getFirstDead();
                        meteor_3.reset(game.rnd.integerInRange(64, (game.width - 64)), -20);
                        meteor_3.body.velocity.y = game.rnd.integerInRange(MIN_METEOR_SPEED, MAX_METEOR_SPEED);
                        meteor_3.rotation = Randomize(0, 359);
                    }
                    break;

                case 4:
                    if (this.meteorBig4.countDead() > 0) {
                        var meteor_4 = this.meteorBig4.getFirstDead();
                        meteor_4.reset(game.rnd.integerInRange(64, (game.width - 64)), -20);
                        meteor_4.body.velocity.y = game.rnd.integerInRange(MIN_METEOR_SPEED, MAX_METEOR_SPEED);
                        meteor_4.rotation = Randomize(0, 359);
                    }
                    break;
            }
            METEOR_TIME = game.time.now + 1500;
        }
    },
    meteorHitByBullet: function (bullet, meteor) {
        var lastPos = {
            x: meteor.position.x,
            y: meteor.position.y
        };
        meteor.kill();
        bullet.kill();
        this.emitterMeteor.x = lastPos.x;
        this.emitterMeteor.y = lastPos.y;
        this.emitterMeteor.start(true, 2000, null, 10);

        Player.kills.meteor();
        PlayerInformation().setScore();
    },
    playerIsHit: function (player, enemy) {
        enemy.kill();
        this.emitter.x = enemy.x;
        this.emitter.y = enemy.y;
        this.emitter.start(true, 1000, null, 10);

        Player.hitBy.enemyCollision();
        if (Player.health <= 0) {
            PlayerInformation().damageHealth(true);
            this.player.kill();
            PlayerInformation().gameOver();
        } else {
            PlayerInformation().damageHealth();
        }
    },
    playerIsHitByBullet: function (player, bullet) {
        var lastPos = {
            x: player.position.x,
            y: player.position.y
        };
        bullet.kill();
        this.emitter.x = lastPos.x;
        this.emitter.y = lastPos.y;
        this.emitter.start(true, 1000, null, 20);

        Player.hitBy.enemyBullet();
        if (Player.health <= 0) {
            PlayerInformation().damageHealth(true);
            this.player.kill();
            PlayerInformation().gameOver();
        } else {
            PlayerInformation().damageHealth();
        }
    },
    playerIsHitByMeteor: function (player, meteor) {
        var lastPos = {
            x: meteor.position.x,
            y: meteor.position.y
        };
        meteor.kill();

        this.emitterMeteor.x = lastPos.x;
        this.emitterMeteor.y = lastPos.y;
        this.emitterMeteor.start(true, 2000, null, 10);

        this.emitter.x = player.x;
        this.emitter.y = player.y;
        this.emitter.start(true, 1000, null, 10);

        Player.hitBy.meteor();
        if (Player.health <= 0) {
            PlayerInformation().damageHealth(true);
            this.player.kill();
            PlayerInformation().gameOver();
        } else {
            PlayerInformation().damageHealth();
        }
    },
    enemyIsHit: function (enemy, bullet) {
        var lastPos = {
            x: enemy.position.x,
            y: enemy.position.y
        };
        enemy.kill();
        bullet.kill();
        this.emitter.x = lastPos.x;
        this.emitter.y = lastPos.y;
        this.emitter.start(true, 1000, null, 20);

        Player.kills.enemy();
        PlayerInformation().setScore();
    },
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.background = game.add.tileSprite(0, 0, 960, 960, 'bg');

        this.player = game.add.sprite(98, 75, 'player');
        this.player.scale.setTo(0.5, 0.5);
        this.player.anchor.setTo(0.5, 0.6);
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.player.position.x = 480;
        this.player.position.y = 700;
        this.player.body.immovable = true;

        this.emitter = game.add.emitter(0, 0, 200);
        this.emitter.makeParticles('explosion');
        this.emitter.setAlpha(1, 0, 500);

        this.emitterMeteor = game.add.emitter(0, 0, 200);
        this.emitterMeteor.makeParticles('meteor_particle');
        this.emitterMeteor.setAlpha(1, 0, 2000);

        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(3000, 'playerBullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);

        this.enemyBullets = game.add.group();
        this.enemyBullets.enableBody = true;
        this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemyBullets.createMultiple(1000, 'enemyBullet');
        this.enemyBullets.setAll('anchor.x', 0.5);
        this.enemyBullets.setAll('anchor.y', 0.5);
        this.enemyBullets.setAll('checkWorldBounds', true);
        this.enemyBullets.setAll('outOfBoundsKill', true);

        this.enemiest1 = game.add.group();
        this.enemiest1.enableBody = true;
        this.enemiest1.createMultiple(5, 'enemyt1');
        this.enemiest1.setAll('anchor.x', 0.5);
        this.enemiest1.setAll('anchor.y', 0.5);
        this.enemiest1.setAll('scale.x', 0.5);
        this.enemiest1.setAll('scale.y', 0.5);
        this.enemiest1.setAll('outOfBoundsKill', true);
        this.enemiest1.setAll('checkWorldBounds', true);

        this.meteorBig1 = game.add.group();
        this.meteorBig1.enableBody = true;
        this.meteorBig1.physicsBodyType = Phaser.Physics.ARCADE;
        this.meteorBig1.createMultiple(1, 'meteorBig1');
        this.meteorBig1.setAll('anchor.x', 0.5);
        this.meteorBig1.setAll('anchor.y', 0.5);
        this.meteorBig1.setAll('checkWorldBounds', true);
        this.meteorBig1.setAll('outOfBoundsKill', true);

        this.meteorBig2 = game.add.group();
        this.meteorBig2.enableBody = true;
        this.meteorBig2.physicsBodyType = Phaser.Physics.ARCADE;
        this.meteorBig2.createMultiple(3, 'meteorBig2');
        this.meteorBig2.setAll('anchor.x', 0.5);
        this.meteorBig2.setAll('anchor.y', 0.5);
        this.meteorBig2.setAll('checkWorldBounds', true);
        this.meteorBig2.setAll('outOfBoundsKill', true);

        this.meteorBig3 = game.add.group();
        this.meteorBig3.enableBody = true;
        this.meteorBig3.physicsBodyType = Phaser.Physics.ARCADE;
        this.meteorBig3.createMultiple(3, 'meteorBig3');
        this.meteorBig3.setAll('anchor.x', 0.5);
        this.meteorBig3.setAll('anchor.y', 0.5);
        this.meteorBig3.setAll('checkWorldBounds', true);
        this.meteorBig3.setAll('outOfBoundsKill', true);

        this.meteorBig4 = game.add.group();
        this.meteorBig4.enableBody = true;
        this.meteorBig4.physicsBodyType = Phaser.Physics.ARCADE;
        this.meteorBig4.createMultiple(3, 'meteorBig4');
        this.meteorBig4.setAll('anchor.x', 0.5);
        this.meteorBig4.setAll('anchor.y', 0.5);
        this.meteorBig4.setAll('checkWorldBounds', true);
        this.meteorBig4.setAll('outOfBoundsKill', true);

        game.camera.follow(this.player);
    },
    update: function () {
        this.background.tilePosition.y += 10;

        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.player.body.velocity.x = PLAYER_VELOCITY_LEFT;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.player.body.velocity.x = PLAYER_VELOCITY_RIGHT;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.fireBullet();
        }

        game.physics.arcade.collide(this.enemiest1, this.player, this.playerIsHit, null, this);
        game.physics.arcade.collide(this.bullets, this.enemiest1, this.enemyIsHit, null, this);
        game.physics.arcade.collide(this.enemyBullets, this.player, this.playerIsHitByBullet, null, this);

        game.physics.arcade.collide(this.bullets, this.meteorBig1, this.meteorHitByBullet, null, this);
        game.physics.arcade.collide(this.bullets, this.meteorBig2, this.meteorHitByBullet, null, this);
        game.physics.arcade.collide(this.bullets, this.meteorBig3, this.meteorHitByBullet, null, this);
        game.physics.arcade.collide(this.bullets, this.meteorBig4, this.meteorHitByBullet, null, this);

        game.physics.arcade.collide(this.meteorBig1, this.player, this.playerIsHitByMeteor, null, this);
        game.physics.arcade.collide(this.meteorBig2, this.player, this.playerIsHitByMeteor, null, this);
        game.physics.arcade.collide(this.meteorBig3, this.player, this.playerIsHitByMeteor, null, this);
        game.physics.arcade.collide(this.meteorBig4, this.player, this.playerIsHitByMeteor, null, this);

        if (ENEMY_ECOUNTER_CHANCE[Randomize(0, 19)]) {
            this.spawnEnemy();
        }

        if (METEOR_ENCOUTER_CHANCE[Randomize(0, 19)]) {
            this.spawnMeteor();
        }
    },
    render: function () {
        // game.debug.spriteInfo(this.player, 32, 32)
        // game.debug.spriteCoords(this.player, 32, 120)
    }
}

LoadState = {
    preload: function () {
        game.load.image('bg', 'assets/images/Background/darkPurple.png');

        game.load.image('player', 'assets/images/Player/playerShip3_blue.png');

        game.load.image('playerBullet', 'assets/images/Effects/fire01.png');
        game.load.image('enemyBullet', 'assets/images/Effects/fire00.png');

        game.load.image('enemyt1', 'assets/images/Enemies/enemyBlack1.png');

        game.load.image('explosion', 'assets/images/Effects/explosion_particle_00.png');

        game.load.image('meteorBig1', 'assets/images/Meteors/meteorBrown_big1.png');
        game.load.image('meteorBig2', 'assets/images/Meteors/meteorBrown_big2.png');
        game.load.image('meteorBig3', 'assets/images/Meteors/meteorBrown_big3.png');
        game.load.image('meteorBig4', 'assets/images/Meteors/meteorBrown_big4.png');
        game.load.image('meteor_particle', 'assets/images/Meteors/meteorBrown_med1.png');
    },
    create: function () {
        game.state.start('level')
    }
}

BootState = {
    create: function () {
        game.state.start('load');
    }
}