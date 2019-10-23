
const TILE_WIDTH = 101;
const TILE_HEIGHT = 83;

// Enemies our player must avoid
var Enemy = function () {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
        
    this.reset();

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// randomly initialize the position and speed of the enemy
// speed is between 150 - 450
// position is randomly picked between 1 of the 3 lanes
Enemy.prototype.reset = function() {
    this.x = Math.floor(Math.random() * 100) - 150;

    this.row = Math.floor(Math.random() * 3) + 1;
    this.y = (this.row * TILE_HEIGHT) - 20;

    this.speed = Math.floor(Math.random() * 300) + 150;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += this.speed * dt;    
    
    // if the enemy goes beyond the canvas, reset its parameters
    if(this.x >= ctx.canvas.width){
        this.reset();
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
let Player = function () {

    this.reset();
    this.sprite = 'images/char-boy.png';
};

// starting position of the player is the bottom center of the canvas
Player.prototype.reset = function() {
    this.col = 2;
    this.row = 5;
}

// Update the player's position based on current grid position
// check for collisions and update lives
// check if player has reached the end to win round
Player.prototype.update = function () {
    
    if(this.checkCollision()){
        gameHUD.lives--;
        if(gameHUD.lives === 0){
            gameOverMenu.active = true;
        }
        this.reset();        
    }
    if(this.row === 0){
        gameHUD.score++;
        this.reset();
    }

    this.x = this.col * TILE_WIDTH;
    this.y = (this.row * TILE_HEIGHT) - 20;    
};

// check if the player is colliding with any enemies
// player has to be in the same row as the enemy and check if the
// left and right edge of the bounding box overlaps with the enemy
Player.prototype.checkCollision = function() {
    for(let i = 0; i < numEnemies; i++){
        let enemy = allEnemies[i];
        if(enemy.row == this.row){
            if(!(this.x + TILE_WIDTH - 30 <= enemy.x) && !(this.x + 30 >= enemy.x + TILE_WIDTH)){
                return true;
            }
        }
    }
    return false;
};

// Draw player sprite
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle keyboard input and change the player position accordingly
// Prevent player from going off bounds
Player.prototype.handleInput = function (kbdInput) {
    switch (kbdInput) {
        case 'up':
            if (this.row !== 0) {
                this.row--;
            }
            break;
        case 'down':
            if (this.row !== 5) {
                this.row++;
            }
            break;
        case 'left':
            if (this.col !== 0) {
                this.col--;
            }
            break;
        case 'right':
            if (this.col !== 4) {
                this.col++;
            }
            break;
    }
};

// Object for HUD (heads up display) information
// Displays number of lives left and current score
let GameHUD = function() {
    this.lives = 5;
    this.lifeSprite = 'images/Heart.png';
    this.score = 0;        
};

GameHUD.prototype.reset = function() {
    this.lives = 5;
    this.score = 0;
}

// Render hearts based on number of lives left
// display score on the bottom right
GameHUD.prototype.render = function() {
    for(let i = 0; i < this.lives; i++){
        ctx.drawImage(Resources.get(this.lifeSprite), 3 + i*(101/3), ctx.canvas.height-65, 30, 50);
    }

    ctx.font = '32px impact';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'right';
    ctx.fillText(this.score, ctx.canvas.width-5, ctx.canvas.height-26);    
};

// Object for the game over manu that is displayed when all lives are lost
let GameOverMenu = function() {
    this.active = false;
};

// Render game over menu
GameOverMenu.prototype.render = function() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.font = '42px impact';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText("Game Over", ctx.canvas.width/2, ctx.canvas.height/2-20);
    ctx.font = '20px impact';
    ctx.fillText("Final Score: " + gameHUD.score, ctx.canvas.width/2, ctx.canvas.height/2+20);
    ctx.fillText("Press Enter to play again...", ctx.canvas.width/2, ctx.canvas.height/2+50);    

};

// Handle keyboard input when game over menu is active
// Check if enter is pressed to deactivate the menu and reset the game
GameOverMenu.prototype.handleInput = function (kbdInput) {
    switch (kbdInput) {
        case 'enter':
            this.active = false;
            player.reset();
            gameHUD.reset();
            break;
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

player = new Player();
gameHUD = new GameHUD();
gameOverMenu = new GameOverMenu();

allEnemies = [];
const numEnemies = 4;
for(let i = 0; i < numEnemies; i++){
    allEnemies.push(new Enemy());
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    if(gameOverMenu.active){        
        gameOverMenu.handleInput(allowedKeys[e.keyCode]);
    } else {        
        player.handleInput(allowedKeys[e.keyCode]);
    }
    
});
