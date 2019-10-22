
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

    this.col = 2;
    this.row = 5;

    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function () {
    
    if(this.checkCollision()){
        this.col = 2;
        this.row = 5;
        gameHUD.lives--;
    }

    this.x = this.col * TILE_WIDTH;
    this.y = (this.row * TILE_HEIGHT) - 20;
    
};

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

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

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

let GameHUD = function() {

    this.lives = 5;
    this.lifeSprite = 'images/Heart.png';
};

GameHUD.prototype.render = function() {
    for(let i = 0; i < this.lives; i++){
        ctx.drawImage(Resources.get(this.lifeSprite), 3 + i*(101/3), ctx.canvas.height-65, 30, 50);
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

player = new Player();
gameHUD = new GameHUD();

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
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
