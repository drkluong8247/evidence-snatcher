window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render } );
    
    function preload() {
        // Loads images
        game.load.image( 'world', 'assets/FloorBackground.png' );
        game.load.image( 'goodguy', 'assets/Police.png');
        game.load.image( 'badguy', 'assets/BadGuy.png');
        game.load.image( 'clue', 'assets/Clue.png');
        
        // loads sound
        game.load.audio( 'castSound', 'assets/magicshot.mp3');
        game.load.audio( 'backgroundMusic', 'assets/AnimalCrossing-TownHall.ogg');
    }
    
    //background image
    var world;
    
    //player and monster sprites
    var player;
    var enemies;
    
    //player's current chance of winning
    var percentSuccess;
    
    //timer of the game
    var timer;
    
    //game over message (and player death)
    var lost;
    var style;
    var isAlive;
    
    //player input
    var cursors;
    
    //sounds
    var fx;
    var music;
    
    //holds clues/evidence
    var clues;
    
    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // creates background, player, and monsters
        world = game.add.tileSprite(0, 0, 800, 600, 'world');
        player = game.add.sprite( game.world.centerX + 200, game.world.centerY + 200, 'goodguy' );
        
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        createEnemies();
        
        
        // Create a sprite at the center of the screen using the 'logo' image.
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        player.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for sprites.
        game.physics.enable( player, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        player.body.collideWorldBounds = true;
        
        
        // adds evidence sprites
        clues = game.add.group();
        clues.enableBody = true;
        clues.createMultiple(30, 'clue', 0, false);
        clues.setAll('anchor.x', 0.5);
        clues.setAll('anchor.y', 0.5);
        clues.setAll('outOfBoundsKill', true);
        clues.setAll('checkWorldBounds', true);
        
        // Player controls
        cursors = game.input.keyboard.createCursorKeys();
        
        // Adds sound
        fx = game.add.audio('castSound');
        music = game.add.audio('backgroundMusic', 1, true);
        music.play('', 0, 1, true);
        
        //initializes percentage and player's 1 life
        percentSuccess = 0;
        isAlive = true;
        
        //initializes timer
        timer = 90000;
        
        //creates game over
        style = { font: "65px Arial", fill: "#ff0044", align: "center" };
    }
    
    function createEnemies()
    {
        //modified from Invaders
        for(var y = 0; y < 10; y++)
        {
            var enemy = enemies.create(10, 10, 'badguy');
            enemy.anchor.setTo(0.5, 0.5);
            enemy.body.bounce.set(1);
            enemy.body.velocity.x = game.rnd.integer() % 200;
            enemy.body.velocity.y = game.rnd.integer() % 200;
            enemy.body.collideWorldBounds = true;
        }
        
        enemies.x = 50;
        enemies.y = 50;
    }
    
    function update() {
        // Controls movement of the player
        player.body.velocity.setTo(0, 0);
        if (cursors.left.isDown)
        {
            player.body.velocity.x = -150;
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 150;
        }
        if (cursors.up.isDown)
        {
            player.body.velocity.y = -150;
        }
        else if (cursors.down.isDown)
        {
            player.body.velocity.y = 150;
        }
        
        //now to check enemies
        game.physics.arcade.overlap(clues, player, clueHandler, null, this);
        game.physics.arcade.overlap(enemies, player, monsterHandler, null, this);
        
    }
    
    function castMagic() {
        /*if (game.time.now > nextFire && bolts.countDead() > 0)
        {
            nextFire = game.time.now + fireRate;

            var bolt = bolts.getFirstExists(false);

            bolt.reset(player.x, player.y);

            bolt.rotation = game.physics.arcade.moveToPointer(bolt, 1000, game.input.activePointer, 500);
            
            fx.play();
        }*/
    }
    
    function clueHandler (player, clue) {
        clue.kill();
        percentSuccess += 5;
        if(percentSuccess > 100) percentSuccess = 100;
    }
    
    function monsterHandler(player, enemy)
    {
        player.kill();
        isAlive = false;
        lost = game.add.text(game.world.centerX, game.world.centerY, "GAME OVER!", style);
        lost.anchor.setTo( 0.5, 0.5);
    }
    
    
    function render()
    {
        game.debug.text("Chance to arrest: " + percentSuccess + "%", 20, 580);
    }
};
