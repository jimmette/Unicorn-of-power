// This sectin contains some game constants. It is not super interesting
const GAME_WIDTH = 450;
const GAME_HEIGHT = 700;
const TITLE_BOX = 150;

const ENEMY_WIDTH = 75;
const ENEMY_HEIGHT = 107;
const MAX_ENEMIES = 3;

const AMMO_WIDTH = 75;
const AMMO_HEIGHT = 75;
const AMMO_HITBOX = 50;

const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 15;

const CUPCAKE_WIDTH = 75;
const CUPCAKE_HEIGHT = 75;
const CUPCAKE_HITBOX = 50;

const PLAYER_WIDTH = 75;
const PLAYER_HEIGHT = 54;

// These two constants keep us from using "magic numbers" in our code
const LEFT_ARROW_CODE = 37;
const RIGHT_ARROW_CODE = 39;
const BULLET_CODE = 32;

const NB_POINT_ENEMY_KILL = 25;
NB_CUPCAKE_TO_SUPER_KILL = 3;

// These two constants allow us to DRY
const MOVE_LEFT = "left";
const MOVE_RIGHT = "right";

const BACKGROUND_COLOR = "#F6CFCA";
const BACKGROUND_TITLE_COLOR = "#EABFB9";

// Preload game images
let imageFilenames = [
  "enemy.png",
  "background.png",
  "player.png",
  "ammo.png",
  "poo.png",
  "bullet.png",
  "cupcake.png"
];
let images = {};

imageFilenames.forEach(function(imgName) {
  let img = document.createElement("img");
  img.src = "images/" + imgName;
  images[imgName] = img;
});

/****** Parent class for all elements of the game
 * this.x
 * this.y
 * this.img
 * this.root
 * this.speed
 */
class Entity {
  constructor(root, x, y, img, speed) {
    this.root = root;
    this.x = x;
    this.y = y;

    this.img = document.createElement("img");
    this.img.src = img;
    this.img.style.position = "absolute";
    this.img.style.left = this.x + "px";
    this.img.style.top = this.y + "px";
    this.root.appendChild(this.img);
    this.domElement = this.img;

    this.speed = speed;
  }
  render(ctx) {
    this.domElement.style.left = this.x + "px";
    this.domElement.style.top = this.y + "px";
    //console.log("Enemies: ", this.x, "-", this.y);
  }
  //Assuming all element move downward. This needs to be redefine if child class
  //if a element does not have this behavior;
  update(timeDiff) {
    this.y = this.y + timeDiff * this.speed;
  }
  destroy() {
    // When an enemy reaches the end of the screen, the corresponding DOM element should be destroyed
    this.root.removeChild(this.domElement);
  }
}

/******
 *
 */
class Enemy extends Entity {
  constructor(root, xPos) {
    super(
      root,
      xPos,
      -ENEMY_HEIGHT,
      "images/" + imageFilenames[0],
      Math.random() / 2 + 0.25
    );

    this.img.style.zIndex = 5;
  }
}

/******
 *
 */
class Bullet extends Entity {
  constructor(root, xPos, yPos) {
    super(
      root,
      xPos + PLAYER_WIDTH / 2 - 5,
      yPos - PLAYER_HEIGHT / 2,
      "images/" + imageFilenames[5],
      1
    );

    this.img.style.zIndex = 5;
  }

  update(timeDiff) {
    this.y = this.y - timeDiff * this.speed;
  }
}

/******
 * this.nbAmmo
 * this.nbCupcake
 */
class Player extends Entity {
  constructor(root) {
    super(
      root,
      2 * PLAYER_WIDTH,
      GAME_HEIGHT - PLAYER_HEIGHT - 10,
      "images/" + imageFilenames[2],
      0
    );
    this.nbAmmo = 0;
    this.nbCupcake = 0;

    this.img.style.zIndex = "10";
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

  updateCupcake(nb) {
    this.nbCupcake = this.nbCupcake + nb;
    //console.log(this.nbAmmo);
  }
}

/******
 *
 */
class Ammo extends Entity {
  constructor(root, xPos) {
    super(
      root,
      xPos,
      -AMMO_HEIGHT,
      "images/" + imageFilenames[3],
      Math.random() / 2 + 0.25
    );

    this.img.style.zIndex = 5;
  }
}

/******
 *
 */
class Cupcake extends Entity {
  constructor(root, xPos, yPos) {
    super(
      root,
      xPos,
      -CUPCAKE_HEIGHT,
      "images/" + imageFilenames[6],
      Math.random() / 2 + 0.25
    );

    this.img.style.zIndex = 5;
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
    span.style.zIndex = 102;
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

    //Setup span
    this.infoTitle = new Text(this.root, 5, 0);
    this.infoTitle.update("UNICORN OF POWER");
    this.infoScore = new Text(this.root, 5, 50);
    this.infoScore.update("SCORE");
    this.infoAmmo = new Text(this.root, 5, 100);
    this.infoAmmo.update("AMMO");
    this.infoCupcake = new Text(this.root, 5, 150);
    this.infoAmmo.update("CUPCAKE");

    // Setup enemies, making sure there are always three
    this.setupEntities();

    //Setup body
    let body = document.querySelector("body");
    body.style.backgroundColor = BACKGROUND_COLOR;
    body.style.backgroundImage = "url(images/" + imageFilenames[1] + ")";

    //Setup main Div #app
    let divApp = document.getElementById("app");
    divApp.style.position = "absolute";
    divApp.style.top = 0 + "px";
    divApp.style.left = "50%";
    divApp.style.zIndex = 2;
    divApp.style.width = GAME_WIDTH + "px";
    divApp.style.marginLeft = -(GAME_WIDTH / 2) + "px";

    //Setup title div
    let titleBox = document.createElement("div");
    titleBox.style.zIndex = 101;
    titleBox.style.position = "absolute";
    titleBox.style.top = 0 + "px";
    titleBox.style.height = TITLE_BOX + "px";
    titleBox.style.width = GAME_WIDTH + "px";
    titleBox.style.backgroundColor = BACKGROUND_TITLE_COLOR;
    this.root.append(titleBox);

    // Put a white div at the bottom so that enemies seem like they dissappear
    let whiteBox = document.createElement("div");
    whiteBox.style.zIndex = 100;
    whiteBox.style.position = "absolute";
    whiteBox.style.top = GAME_HEIGHT + "px";
    whiteBox.style.height = ENEMY_HEIGHT + "px";
    whiteBox.style.width = GAME_WIDTH + "px";
    whiteBox.style.background = BACKGROUND_TITLE_COLOR;
    this.root.append(whiteBox);

    let bg = document.createElement("img");
    //bg.src = "images/stars.png";
    bg.style.position = "absolute";
    bg.style.height = GAME_HEIGHT + "px";
    bg.style.width = GAME_WIDTH + "px";
    bg.style.backgroundColor = BACKGROUND_COLOR;
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
      case 4:
      case 5:
        this.entities[entitySpot] = new Ammo(
          this.root,
          entitySpot * AMMO_WIDTH
        );
        break;
      //New cupcake
      case 10:
        this.entities[entitySpot] = new Cupcake(
          this.root,
          entitySpot * CUPCAKE_WIDTH
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
      } else if (e.keyCode === BULLET_CODE) {
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
    //this.score += timeDiff;

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
    this.infoAmmo.update("AMMO " + this.player.nbAmmo);

    if (this.isPlayerCollidedWithCupcake()) {
      if (this.player.nbCupcake < NB_CUPCAKE_TO_SUPER_KILL - 1) {
        this.player.updateCupcake(1);
      } else {
        this.activateSuperKillMode();
      }
    }
    this.infoCupcake.update("Cupcake " + this.player.nbCupcake);

    if (this.isBulletCollidedWithEnemy()) {
    }

    // Check if player is dead
    if (this.isPlayerDead()) {
      // If they are dead, then it's game over!
      this.infoScore.update("SCORE " + this.score + " GAME OVER");
    } else {
      // If player is not dead, then draw the score
      this.infoScore.update("SCORE " + this.score);

      // Set the time marker and redraw
      this.lastFrame = Date.now();
      setTimeout(this.gameLoop, 20);
    }
  }

  activateSuperKillMode() {
    console.log("Super kill mode activated");
    this.player.nbCupcake = 0;
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
        this.score = this.score + NB_POINT_ENEMY_KILL;
        return true;
      }
    }
    return false;
  }

  isPlayerCollidedWithAmmo() {
    let diff = (AMMO_WIDTH - AMMO_HITBOX) / 2;
    for (let i = 0; i < this.entities.length; i++) {
      if (
        this.entities[i] !== undefined &&
        this.entities[i] instanceof Ammo &&
        this.player.x < this.entities[i].x + AMMO_HITBOX + diff &&
        this.player.x + PLAYER_WIDTH > this.entities[i].x + diff &&
        this.player.y < this.entities[i].y + AMMO_HITBOX + diff &&
        PLAYER_HEIGHT + this.player.y > this.entities[i].y + diff
      ) {
        this.entities[i].destroy();
        delete this.entities[i];
        return true;
      }
    }
    return false;
  }

  isPlayerCollidedWithCupcake() {
    let diff = (CUPCAKE_WIDTH - CUPCAKE_HITBOX) / 2;
    for (let i = 0; i < this.entities.length; i++) {
      if (
        this.entities[i] !== undefined &&
        this.entities[i] instanceof Cupcake &&
        this.player.x < this.entities[i].x + CUPCAKE_HITBOX + diff &&
        this.player.x + PLAYER_WIDTH > this.entities[i].x + diff &&
        this.player.y < this.entities[i].y + CUPCAKE_HITBOX + diff &&
        PLAYER_HEIGHT + this.player.y > this.entities[i].y + diff
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
