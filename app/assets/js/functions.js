var Randomize = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


var uiScore = document.querySelector("#playerScore span.value");
var uiHealth = document.querySelector("#playerHealth span.value");

var uiBackdraft = document.querySelector(".backdraft");

var startAgainButton = document.querySelector("#startAgain");

var Player = {
    score: 0,
    health: 100,
    reset: function () {
        Player.score = 0;
        Player.health = 100;
    },
    hitBy: {
        enemyBullet: function () {
            Player.health -= 2;
        },
        enemyCollision: function () {
            Player.health -= 5;
        },
        meteor: function () {
            Player.health -= 10;
        }
    },
    kills: {
        enemy: function () {
            Player.score += 1;
        },
        meteor: function () {
            Player.score += 5;
        }
    }
}

var PlayerInformation = () => {
    var init = () => {
        uiScore.innerHTML = Player.score;
        uiHealth.innerHTML = Player.health;
    }

    var setScore = () => {
        uiScore.innerHTML = Player.score;
    }

    var damageHealth = (isZero) => {
        if (isZero) {
            uiHealth.innerHTML = 0;
        } else {
            uiHealth.innerHTML = Player.health;
        }
    }

    var gameOver = () => {
        uiBackdraft.classList.remove("hidden");
    }

    return {
        init: init,
        setScore: setScore,
        damageHealth: damageHealth,
        gameOver: gameOver
    }
}

PlayerInformation().init()

startAgainButton.addEventListener("click", (e) => {
    uiBackdraft.classList.add("hidden");
    Player.reset();
    PlayerInformation().init();
    game.state.start('boot');
});