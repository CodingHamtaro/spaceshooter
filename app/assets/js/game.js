var game = new Phaser.Game(960, 750, Phaser.WEBGL, 'GameContainer')
game.state.add('boot', BootState)
game.state.add('load', LoadState)
game.state.add('level', PlayState)

game.state.start('load')