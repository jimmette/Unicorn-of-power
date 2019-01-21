// This sectin contains some game constants. It is not super interesting
const GAME_WIDTH = 375;
const GAME_HEIGHT = 500;

const ENEMY_WIDTH = 75;
const ENEMY_HEIGHT = 156;
const MAX_ENEMIES = 3;

const AMMO_WIDTH = 75;
const AMMO_HEIGHT = 75;
const AMMO_HIT_BOX = 50;

const BULLET_WIDTH = 10;
const BULLET_HEIGHT = 30;

const PLAYER_WIDTH = 75;
const PLAYER_HEIGHT = 54;

// These two constants keep us from using "magic numbers" in our code
const LEFT_ARROW_CODE = 37;
const RIGHT_ARROW_CODE = 39;
const P_CODE = 80;

// These two constants allow us to DRY
const MOVE_LEFT = "left";
const MOVE_RIGHT = "right";

// Preload game images
let imageFilenames = [
  "enemy.png",
  "stars.png",
  "player.png",
  "ammo.png",
  "poo.png",
  "bullet.png"
];
let images = {};

imageFilenames.forEach(function(imgName) {
  let img = document.createElement("img");
  img.src = "images/" + imgName;
  images[imgName] = img;
});

class Entity {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;

    this.img = document.createElement("img");
    this.img.src = img;
    this.img.style.position = "absolute";
    this.img.style.left = this.x + "px";
    this.img.style.top = this.y + "px";
  }
  render(ctx) {
    this.domElement.style.left = this.x + "px";
    this.domElement.style.top = this.y + "px";
    //console.log("Enemies: ", this.x, "-", this.y);
  }
  update(timeDiff) {
    this.y = this.y + timeDiff * this.speed;
  }
  destroy() {
    // When an enemy reaches the end of the screen, the corresponding DOM element should be destroyed
    this.root.removeChild(this.domElement);
  }
}

// This section is where you will be doing most of your coding
class Enemy extends Entity {
  constructor(root, xPos) {
    super(xPos, -ENEMY_HEIGHT, "images/enemy.png");
    this.root = root;

    this.img.style.zIndex = 5;
    root.appendChild(this.img);
    this.domElement = this.img;
    // Each enemy should have a different speed
    this.speed = Math.random() / 2 + 0.25;
  }
}

// This section is where you will be doing most of your coding
class Bullet extends Entity {
  constructor(root, xPos, yPos) {
    super(
      xPos + PLAYER_WIDTH / 2 - 5,
      yPos - PLAYER_HEIGHT / 2,
      "images/bullet.png"
    );
    this.root = root;

    this.img.style.zIndex = 5;
    root.appendChild(this.img);
    this.domElement = this.img;
    // Each enemy should have a different speed
    this.speed = 0.5; //Math.random() / 2 + 0.25;
  }

  update(timeDiff) {
    this.y = this.y - timeDiff * this.speed;
  }
}

class Player extends Entity {
  constructor(root) {
    super(
      2 * PLAYER_WIDTH,
      GAME_HEIGHT - PLAYER_HEIGHT - 10,
      "images/player.png"
    );
    this.nbAmmo = 0;
    this.root = root;

    this.img.style.zIndex = "10";
    root.appendChild(this.img);
    this.domElement = this.img;
  }

  // This method is called by the game engine when left/right arrows are pressed
  move(direction) {
    if (direction === MOVE_LEFT && this.x > 0) {
      this.x = this.x - PLAYER_WIDTH;
    } else if (direction === MOVE_RIGHT && this.x < GAME_WIDTH - PLAYER_WIDTH) {
      this.x = this.x + PLAYER_WIDTH;
    }
  }

  updateAmmo(nb) {
    this.nbAmmo = this.nbAmmo + nb;
    //console.log(this.nbAmmo);
  }
}

//
class Ammo extends Entity {
  constructor(root, xPos) {
    super(xPos, -AMMO_HEIGHT, "images/ammo.png");
    this.root = root;

    this.img.style.zIndex = 5;
    root.appendChild(this.img);
    this.domElement = this.img;
    // Each enemy should have a different speed
    this.speed = Math.random() / 2 + 0.25;
  }
}

class Text {
  constructor(root, xPos, yPos) {
    this.root = root;

    let span = document.createElement("span");
    span.style.position = "absolute";
    span.style.left = xPos + "px";
    span.style.top = yPos + "px";
    span.style.font = "bold 30px Impact";
    span.style.zIndex = 101;
    span.style.color = "#ffffff";
    span.style.padding = "10px";

    root.appendChild(span);
    this.domElement = span;
  }

  // This method is called by the game engine when left/right arrows are pressed
  update(txt) {
    this.domElement.innerText = txt;
  }
}

/*
This section is a tiny game engine.
This engine will use your Enemy and Player classes to create the behavior of the game.
*/
class Engine {
  constructor(element) {
    this.root = element;
    // Setup the player
    this.player = new Player(this.root);
    this.info = new Text(this.root, 5, 5);
    this.infoAmmo = new Text(this.root, 5, 50);

    // Setup enemies, making sure there are always three
    this.setupEntities();

    // Put a white div at the bottom so that enemies seem like they dissappear
    let whiteBox = document.createElement("div");
    whiteBox.style.zIndex = 100;
    whiteBox.style.position = "absolute";
    whiteBox.style.top = GAME_HEIGHT + "px";
    whiteBox.style.height = ENEMY_HEIGHT + "px";
    whiteBox.style.width = GAME_WIDTH + "px";
    whiteBox.style.background = "#fff";
    this.root.append(whiteBox);

    let bg = document.createElement("img");
    bg.src = "images/stars.png";
    bg.style.position = "absolute";
    bg.style.height = GAME_HEIGHT + "px";
    bg.style.width = GAME_WIDTH + "px";
    this.root.append(bg);

    // Since gameLoop will be called out of context, bind it once here.
    this.gameLoop = this.gameLoop.bind(this);
  }

  /*
     The game allows for 5 horizontal slots where an enemy can be present.
     At any point in time there can be at most MAX_ENEMIES enemies otherwise the game would be impossible
     */
  setupEntities() {
    if (!this.entities) {
      this.entities = [];
    }

    while (
      this.entities.filter(function() {
        return true;
      }).length < MAX_ENEMIES
    ) {
      this.addEntity();
    }
  }

  // This method finds a random spot where there is no enemy, and puts one in there
  addEntity() {
    let entitySpots = GAME_WIDTH / ENEMY_WIDTH;

    let entitySpot = undefined;
    // Keep looping until we find a free enemy spot at random
    while (entitySpot === undefined || this.entities[entitySpot]) {
      entitySpot = Math.floor(Math.random() * entitySpots);
    }

    //We roll a dice
    let chance = Math.floor(Math.random() * 20);

    switch (chance) {
      //New ammo box
      case 3:
        this.entities[entitySpot] = new Ammo(
          this.root,
          entitySpot * AMMO_WIDTH
        );
        break;
      //New enemy
      default:
        this.entities[entitySpot] = new Enemy(
          this.root,
          entitySpot * ENEMY_WIDTH
        );
        break;
    }
  }

  fireABullet() {
    //console.log(this.player.nbAmmo);
    if (this.player.nbAmmo > 0) {
      this.bullet = new Bullet(this.root, this.player.x, this.player.y);
      this.player.nbAmmo--;
    }
  }

  // This method kicks off the game
  start() {
    this.score = 0;
    this.lastFrame = Date.now();
    let keydownHandler = function(e) {
      if (e.keyCode === LEFT_ARROW_CODE) {
        this.player.move(MOVE_LEFT);
      } else if (e.keyCode === RIGHT_ARROW_CODE) {
        this.player.move(MOVE_RIGHT);
      } else if (e.keyCode === P_CODE) {
        this.fireABullet();
      }
    };
    keydownHandler = keydownHandler.bind(this);
    // Listen for keyboard left/right and update the player
    document.addEventListener("keydown", keydownHandler);

    this.gameLoop();
  }

  /*
    This is the core of the game engine. The `gameLoop` function gets called ~60 times per second
    During each execution of the function, we will update the positions of all game entities
    It's also at this point that we will check for any collisions between the game entities
    Collisions will often indicate either a player death or an enemy kill

    In order to allow the game objects to self-determine their behaviors, gameLoop will call the `update` method of each entity
    To account for the fact that we don't always have 60 frames per second, gameLoop will send a time delta argument to `update`
    You should use this parameter to scale your update appropriately
     */
  gameLoop() {
    // Check how long it's been since last frame
    let currentFrame = Date.now();
    let timeDiff = currentFrame - this.lastFrame;

    // Increase the score!
    this.score += timeDiff;

    // Call update on all enemies
    this.entities.forEach(function(enemy) {
      enemy.update(timeDiff);
    });

    // Call update for bullet
    if (this.bullet !== undefined) {
      //console.log("update bullet");
      this.bullet.update(timeDiff);
    }

    // Draw everything!
    //this.ctx.drawImage(images["stars.png"], 0, 0); // draw the star bg
    let renderEnemy = function(enemy) {
      enemy.render(this.ctx);
    };
    renderEnemy = renderEnemy.bind(this);
    this.entities.forEach(renderEnemy); // draw the enemies
    this.player.render(this.ctx); // draw the player
    if (this.bullet !== undefined) {
      //console.log("render bullet");
      this.bullet.render();
    }

    // Check if any enemies should die
    this.entities.forEach((enemy, enemyIdx) => {
      if (enemy.y > GAME_HEIGHT) {
        this.entities[enemyIdx].destroy();
        delete this.entities[enemyIdx];
      }
    });
    this.setupEntities();
    // Check if bullet should die
    if (this.bullet !== undefined && this.bullet.y < 0) {
      this.bullet.destroy();
      delete this.bullet;
    }

    if (this.isPlayerCollidedWithAmmo()) {
      this.player.updateAmmo(5);
    }
    this.infoAmmo.update("AMMO: " + this.player.nbAmmo);

    if (this.isBulletCollidedWithEnemy()) {
    }

    // Check if player is dead
    if (this.isPlayerDead()) {
      // If they are dead, then it's game over!
      this.info.update("SCORE: " + this.score + " GAME OVER");
    } else {
      // If player is not dead, then draw the score
      this.info.update("SCORE: " + this.score);

      // Set the time marker and redraw
      this.lastFrame = Date.now();
      setTimeout(this.gameLoop, 20);
    }
  }

  isBulletCollidedWithEnemy() {
    for (let i = 0; i < this.entities.length; i++) {
      if (
        this.entities[i] !== undefined &&
        this.bullet !== undefined &&
        this.entities[i] instanceof Enemy &&
        this.bullet.x < this.entities[i].x + ENEMY_WIDTH &&
        this.bullet.x + BULLET_WIDTH > this.entities[i].x &&
        this.bullet.y < this.entities[i].y + ENEMY_HEIGHT &&
        BULLET_HEIGHT + this.bullet.y > this.entities[i].y
      ) {
        this.entities[i].destroy();
        delete this.entities[i];
        this.bullet.destroy();
        delete this.bullet;
        return true;
      }
    }
    return false;
  }

  isPlayerCollidedWithAmmo() {
    for (let i = 0; i < this.entities.length; i++) {
      if (
        this.entities[i] !== undefined &&
        this.entities[i] instanceof Ammo &&
        this.player.x < this.entities[i].x + AMMO_HIT_BOX &&
        this.player.x + PLAYER_WIDTH > this.entities[i].x &&
        this.player.y < this.entities[i].y + AMMO_HIT_BOX &&
        PLAYER_HEIGHT + this.player.y > this.entities[i].y
      ) {
        this.entities[i].destroy();
        delete this.entities[i];
        return true;
      }
    }
    return false;
  }

  isPlayerDead() {
    for (let i = 0; i < this.entities.length; i++) {
      if (
        this.entities[i] !== undefined &&
        this.entities[i] instanceof Enemy &&
        this.player.x < this.entities[i].x + ENEMY_WIDTH &&
        this.player.x + PLAYER_WIDTH > this.entities[i].x &&
        this.player.y < this.entities[i].y + ENEMY_HEIGHT &&
        PLAYER_HEIGHT + this.player.y > this.entities[i].y
      ) {
        return true;
      }
    }
    return false;
  }
}

// This section will start the game
let gameEngine = new Engine(document.getElementById("app"));
gameEngine.start();
