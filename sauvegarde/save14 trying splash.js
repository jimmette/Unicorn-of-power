// This sectin contains some game constants. It is not super interesting
const GAME_WIDTH = 450;
const GAME_HEIGHT = 750;
const TITLE_BOX = 150;

const ENEMY_WIDTH = 75;
const ENEMY_HEIGHT = 75;
const MAX_ENTITIES = 3;

const AMMO_WIDTH = 75;
const AMMO_HEIGHT = 75;
const AMMO_MARGIN = (ENEMY_WIDTH - AMMO_WIDTH) / 2;

const BULLET_WIDTH = 25;
const BULLET_HEIGHT = 26;

const CUPCAKE_WIDTH = 75;
const CUPCAKE_HEIGHT = 75;
const CUPCAKE_MARGIN = (ENEMY_WIDTH - CUPCAKE_WIDTH) / 2;

const RAINBOW_WIDTH = 75;
const RAINBOW_HEIGHT = 75;

const SPLASH_WIDTH = 75;
const SPLASH_HEIGHT = 75;
const SPLASH_MARGIN = (ENEMY_WIDTH - SPLASH_WIDTH) / 2;
const SPLASH_LEFT = "left";
const SPLASH_RIGHT = "right";

const PLAYER_WIDTH = 75;
const PLAYER_HEIGHT = 114;
const START_PLAYER_WIDTH = 200;
const START_PLAYER_HEIGHT = 200;
const PLAYER_MOVE = 75;
const PLAYER_OFFSET = 24;

// These two constants keep us from using "magic numbers" in our code
const LEFT_ARROW_CODE = 37;
const RIGHT_ARROW_CODE = 39;
const UP_ARROW_CODE = 38;
const DOWN_ARROW_CODE = 40;
const BULLET_CODE = 32;
const GAME_START = 83;

const NB_POINT_ENEMY_KILL = 25;
const NB_CUPCAKE_TO_SUPER_KILL = 3;
const NB_ENNEMIES_IN_SUPER_KILL = 5;
const TIMER_SUPER_KILL = 5000;
const TIME_GAME_START = 1000;

// These two constants allow us to DRY
const MOVE_LEFT = "left";
const MOVE_RIGHT = "right";
const MOVE_UP = "up";
const MOVE_DOWN = "down";

const BACKGROUND_COLOR = "#F6CFCA";
const BACKGROUND_TITLE_COLOR = "#EABFB9";

const MSG_TO_START = "S to start";

// Preload game images
let imageFilenames = [
  "enemy.png",
  "background.png",
  "player.png",
  "ammo.png",
  "splash.png",
  "bullet.png",
  "cupcake.png",
  "cupcake_40.png",
  "rainbow.png",
  "start.gif"
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
  constructor(root, x, y, img, speed, width, height, margin) {
    this.root = root;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.margin = margin;

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
  //Assuming all element move downward. This needs to be redefine in child class
  //if an element does not have this behavior;
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
      Math.random() / 2 + 0.2,
      ENEMY_WIDTH,
      ENEMY_HEIGHT
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
      yPos - (PLAYER_HEIGHT - PLAYER_OFFSET) / 2,
      "images/" + imageFilenames[5],
      1,
      BULLET_WIDTH,
      BULLET_HEIGHT
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
      (GAME_WIDTH - START_PLAYER_WIDTH) / 2,
      GAME_HEIGHT - START_PLAYER_HEIGHT,
      "images/" + imageFilenames[9], //Start img
      0,
      START_PLAYER_WIDTH,
      START_PLAYER_HEIGHT
    );
    this.nbAmmo = 0;
    this.nbCupcake = 0;

    this.img.style.zIndex = "10";
  }

  // This method is called by the game engine when left/right arrows are pressed
  move(direction) {
    if (direction === MOVE_LEFT && this.x > 0) {
      this.x = this.x - PLAYER_MOVE;
    } else if (direction === MOVE_RIGHT && this.x < GAME_WIDTH - PLAYER_WIDTH) {
      this.x = this.x + PLAYER_MOVE;
    } else if (direction === MOVE_UP && this.y > TITLE_BOX + PLAYER_OFFSET) {
      this.y = this.y - PLAYER_MOVE;
    } else if (
      direction === MOVE_DOWN &&
      this.y < GAME_HEIGHT - PLAYER_HEIGHT + PLAYER_OFFSET
    ) {
      this.y = this.y + PLAYER_MOVE;
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
      Math.random() / 2 + 0.25,
      AMMO_WIDTH,
      AMMO_HEIGHT,
      AMMO_MARGIN
    );

    this.img.style.zIndex = 5;
  }
}

/******
 *
 */
class Rainbow extends Entity {
  constructor(root, xPos) {
    super(
      root,
      xPos,
      -RAINBOW_HEIGHT,
      "images/" + imageFilenames[8],
      Math.random() / 2 + 0.25,
      RAINBOW_WIDTH,
      RAINBOW_HEIGHT
    );

    this.img.style.zIndex = 5;
  }
}

/******
 *
 */
class Cupcake extends Entity {
  constructor(root, xPos) {
    super(
      root,
      xPos,
      -CUPCAKE_HEIGHT,
      "images/" + imageFilenames[6],
      Math.random() / 2 + 0.5,
      CUPCAKE_WIDTH,
      CUPCAKE_HEIGHT,
      CUPCAKE_MARGIN
    );

    this.img.style.zIndex = 5;
  }
}

class Splash extends Entity {
  constructor(root, xPos, yPos, direction) {
    super(
      root,
      xPos,
      yPos,
      "images/" + imageFilenames[4],
      Math.random() / 2 + 0.25,
      SPLASH_WIDTH,
      SPLASH_HEIGHT,
      SPLASH_MARGIN
    );

    this.direction = direction;

    this.img.style.zIndex = 5;
  }

  update(timeDiff) {
    if (this.direction === SPLASH_LEFT) {
      this.x = this.x - timeDiff * this.speed;
    } else if (this.direction === SPLASH_RIGHT) {
      this.x = this.x + timeDiff * this.speed;
    }
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

/******
 *
 */
class SuperKillMode {
  constructor(start) {
    this.startTime = start;
    this.endTime = start + TIMER_SUPER_KILL;
    this.nbAmmoStart;
  }
}

/*
This section is a tiny game engine.
This engine will use your Enemy and Player classes to create the behavior of the game.
*/
class Engine {
  constructor(element) {
    this.root = element;

    this.isGameStarted = false;
    this.nbMaxEntities = MAX_ENTITIES;
    this.startTime = 0;

    // Setup entities array
    this.entities = [];

    // Setup bullets array
    this.bullets = [];

    // Setup super kill
    this.isSuperKillMode = false;
    this.superKill = undefined;

    // Setup splash
    this.splash = undefined;

    //Background music
    this.musicMain = new Audio("sounds/bg_music.mp3");

    // Setup the player
    this.player = new Player(this.root);
    // Setup enemies, making sure there are always three
    //this.setupEntities();

    //Setup body
    let body = document.querySelector("body");
    body.style.backgroundColor = BACKGROUND_COLOR;
    body.style.backgroundImage = "url(images/" + imageFilenames[1] + ")";
    //Setup Title span
    this.infoTitle = new Text(this.root, 5, 0);
    this.infoTitle.update("UNICORN OF POWER");
    //Setup Score span
    this.infoScore = new Text(this.root, 5, 50);
    this.infoScore.update("SCORE");
    //Setup Ammo span
    this.infoAmmo = new Text(this.root, 5, 100);
    this.infoAmmo.update("AMMO");
    //Setup Start menu span
    this.infoStart = new Text(this.root, 0, 300);
    this.infoStart.domElement.style.width = "100%";
    this.infoStart.domElement.style.textAlign = "center";
    this.infoStart.domElement.style.fontSize = "50px";
    this.infoStart.update(MSG_TO_START);

    //Setup Cupcake div
    this.divCupcake = document.createElement("div");
    this.divCupcake.style.position = "absolute";
    this.divCupcake.style.top = TITLE_BOX - 45 + "px";
    this.divCupcake.style.left = GAME_WIDTH - 120 + "px";
    this.divCupcake.style.height = "40px";
    this.divCupcake.style.width = "0px";
    this.divCupcake.style.backgroundImage =
      "URL('images/" + imageFilenames[7] + "')";
    this.divCupcake.style.zIndex = 110;
    this.root.append(this.divCupcake);

    //Setup main div #app
    this.divApp = document.getElementById("app");
    this.divApp.style.position = "absolute";
    this.divApp.style.top = "0px";
    this.divApp.style.left = "50%";
    this.divApp.style.zIndex = 2;
    this.divApp.style.width = GAME_WIDTH + "px";
    this.divApp.style.height = GAME_HEIGHT + "px";
    this.divApp.style.marginLeft = -(GAME_WIDTH / 2) + "px";
    this.divApp.style.backgroundColor = BACKGROUND_COLOR;

    //Setup top div for title/score/ammo/cupcake
    let titleBox = document.createElement("div");
    titleBox.style.zIndex = 101;
    titleBox.style.position = "absolute";
    titleBox.style.top = 0 + "px";
    titleBox.style.height = TITLE_BOX + "px";
    titleBox.style.width = GAME_WIDTH + "px";
    titleBox.style.backgroundColor = BACKGROUND_TITLE_COLOR;
    this.root.append(titleBox);

    //Put a white div at the bottom so that enemies seem like they dissappear
    let whiteBox = document.createElement("div");
    whiteBox.style.zIndex = 100;
    whiteBox.style.position = "absolute";
    whiteBox.style.top = GAME_HEIGHT + "px";
    whiteBox.style.height = ENEMY_HEIGHT + "px";
    whiteBox.style.width = GAME_WIDTH + "px";
    whiteBox.style.background = BACKGROUND_TITLE_COLOR;
    this.root.append(whiteBox);

    // Since gameLoop will be called out of context, bind it once here.
    this.gameLoop = this.gameLoop.bind(this);
  }

  /*
  The game allows for (GAME_WIDTH/ENEMY_WIDTH) horizontal slots where an entity can be present.
  At any point in time there can be at most this.nbMaxEntities entety otherwise the game would be impossible
  */
  setupEntities() {
    while (
      this.entities.filter(function() {
        return true;
      }).length < this.nbMaxEntities
    ) {
      this.addEntity();
    }
  }

  // This method finds a random spot where there is no entity, and puts one in there
  addEntity() {
    //Nb of slots
    let entitySpots = GAME_WIDTH / ENEMY_WIDTH;

    let entitySpot = undefined;
    // Keep looping until we find a free entity spot at random
    while (entitySpot === undefined || this.entities[entitySpot]) {
      entitySpot = Math.floor(Math.random() * entitySpots);
    }

    //We roll a dice
    let chance = Math.floor(Math.random() * 30);

    //What will span depending on chance
    switch (chance) {
      //New ammo box
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        if (!this.isSuperKillMode) {
          console.log("ammo create");
          this.entities[entitySpot] = new Ammo(
            this.root,
            entitySpot * AMMO_WIDTH
          );
        }
        break;
      //New cupcake
      case 8:
      case 9:
        if (!this.isSuperKillMode) {
          console.log("cupcake create");
          this.entities[entitySpot] = new Cupcake(
            this.root,
            entitySpot * CUPCAKE_WIDTH
          );
        }
        break;
      //New splash left
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
        console.log("splash create");
        this.splash = new Splash(
          this.root,
          GAME_WIDTH - SPLASH_WIDTH,
          Math.floor(Math.random() * 3 + 7) * ENEMY_HEIGHT,
          SPLASH_LEFT
        );
        break;
      //New rainbow
      case 15:
        console.log("rainbow create");
        this.entities[entitySpot] = new Rainbow(
          this.root,
          entitySpot * RAINBOW_WIDTH
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
    if (this.player.nbAmmo > 0) {
      this.bullets.push(new Bullet(this.root, this.player.x, this.player.y));
      this.player.nbAmmo--;
    }
  }

  initialiseGame() {
    this.musicMain.play();
    this.musicMain.loop = "true";
    this.isGameStarted = true;
    this.score = 0;
    this.player.nbAmmo = 0;
    this.player.nbCupcake = 0;
    this.divCupcake.style.width = "0px";
    this.player.x = 2 * PLAYER_WIDTH;
    this.player.y = GAME_HEIGHT - PLAYER_HEIGHT + PLAYER_OFFSET;
    this.player.img.src = "images/" + imageFilenames[2];
    this.player.width = PLAYER_WIDTH;
    this.player.height = PLAYER_HEIGHT;
    this.infoStart.update("");
    this.startTime = new Date() / 1;
  }

  // This method kicks off the game
  start() {
    this.lastFrame = Date.now();
    //this.musicIntro.play();
    let keydownHandler = function(e) {
      if (e.keyCode === LEFT_ARROW_CODE) {
        this.player.move(MOVE_LEFT);
      } else if (e.keyCode === RIGHT_ARROW_CODE) {
        this.player.move(MOVE_RIGHT);
      } else if (e.keyCode === UP_ARROW_CODE) {
        this.player.move(MOVE_UP);
      } else if (e.keyCode === DOWN_ARROW_CODE) {
        this.player.move(MOVE_DOWN);
      } else if (e.keyCode === BULLET_CODE) {
        this.fireABullet();
      } else if (e.keyCode === GAME_START) {
        if (!this.isGameStarted) {
          //this.musicIntro.pause();
          this.initialiseGame();
          this.gameLoop();
        }
      }
    };
    keydownHandler = keydownHandler.bind(this);
    // Listen for keyboard left/right and update the player
    document.addEventListener("keydown", keydownHandler);
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
    this.score += timeDiff / 1000;

    if (this.isSuperKillMode) {
      if (new Date() / 1 > this.superKill.endTime) {
        this.terminateSuperKillMode();
      }
    }

    // Call update on all entities
    this.entities.forEach(function(entity) {
      entity.update(timeDiff);
    });
    // Call update for bullet
    if (this.bullets !== undefined) {
      //console.log("update bullet");
      this.bullets.forEach(function(bullet) {
        bullet.update(timeDiff);
      });
    }
    // Call update on splash
    if (this.splash !== undefined) {
      this.splash.update(timeDiff);
    }

    /**** Draw everything! ****/
    // draw the entities
    let renderEntity = function(entity) {
      entity.render(this.ctx);
    };
    renderEntity = renderEntity.bind(this);
    this.entities.forEach(renderEntity);
    // draw the player
    this.player.render(this.ctx);
    // draw the entities
    let renderBullet = function(bullet) {
      bullet.render(this.ctx);
    };
    renderBullet = renderBullet.bind(this);
    this.bullets.forEach(renderBullet);
    if (this.splash !== undefined) {
      this.splash.render(this.ctx);
    }

    // Check if any entity should die
    this.entities.forEach((entity, entityIdx) => {
      if (entity.y > GAME_HEIGHT) {
        this.entities[entityIdx].destroy();
        delete this.entities[entityIdx];
      }
    });
    this.setupEntities();

    // Check if bullet should die
    this.bullets.forEach((bullet, bulletIdx) => {
      if (bullet.y > GAME_HEIGHT) {
        this.entities[bulletIdx].destroy();
        delete this.entities[bulletIdx];
      }
    });

    // Check if splash should die
    if (this.splash !== undefined) {
      if (this.splash.direction === SPLASH_LEFT && this.splash.x > GAME_WIDTH) {
        this.splash.destroy();
        delete this.splash;
      } else if (this.splash.direction === SPLASH_RIGHT && this.splash.x < 0) {
        this.splash.destroy();
        delete this.splash;
      }
    }

    //Check if player collided with ammo
    this.isPlayerCollidedWithAmmo();
    //Check if a bullet collided with an enemy
    this.isBulletCollidedWithEnemy();
    //Check if player collided with cupcake
    this.isPlayerCollidedWithCupcake();
    //Check if player collided with rainbow
    this.isPlayerCollidedWithRainbow();

    if (this.isPlayerDead()) {
      // Check if player is dead
      // If they are dead, then it's game over!
      this.isGameStarted = false;
      this.infoStart.update(MSG_TO_START);
      this.infoScore.update("SCORE " + Math.floor(this.score) + " GAME OVER");
      this.musicMain.pause();
      this.musicMain.currentTime = 0;
    } else {
      // If player is not dead, then draw the score
      this.infoScore.update("SCORE " + Math.floor(this.score));

      // Set the time marker and redraw
      this.lastFrame = Date.now();

      setTimeout(this.gameLoop, 20);
    }
  }

  activateSuperKillMode() {
    this.isSuperKillMode = true;
    this.superKill = new SuperKillMode(new Date() / 1);
    this.superKill.nbAmmoStart = this.player.nbAmmo;
    this.player.nbAmmo = 1000;
    this.nbMaxEntities = NB_ENNEMIES_IN_SUPER_KILL;
    this.divApp.style.backgroundImage = "URL('images/bg_skm.gif')";
    console.log("Super kill mode start");
  }

  terminateSuperKillMode() {
    console.log("Super kill mode finish");
    this.isSuperKillMode = false;
    this.player.nbAmmo = this.superKill.nbAmmoStart;
    this.nbMaxEntities = MAX_ENTITIES;
    delete this.superKill;
    this.player.nbCupcake = 0;
    this.divCupcake.style.width = "0px";
    this.divApp.style.backgroundImage = "";
  }

  isBulletCollidedWithEnemy() {
    for (let i = 0; i < this.bullets.length; i++) {
      for (let j = 0; j < this.entities.length; j++) {
        if (
          this.entities[j] instanceof Enemy &&
          this.isCollision(this.bullets[i], this.entities[j])
        ) {
          this.entities[j].destroy();
          delete this.entities[j];
          this.bullets[i].destroy();
          delete this.bullets[i];
          this.bullets.splice(i, 1);
          this.score = this.score + NB_POINT_ENEMY_KILL;
        }
      }
    }
    return false;
  }

  isPlayerCollidedWithAmmo() {
    for (let i = 0; i < this.entities.length; i++) {
      if (
        this.entities[i] instanceof Ammo &&
        this.isCollision(this.player, this.entities[i])
      ) {
        this.entities[i].destroy();
        delete this.entities[i];
        this.player.updateAmmo(5);
        this.infoAmmo.update("AMMO " + this.player.nbAmmo);
        return true;
      }
    }
    return false;
  }

  isPlayerCollidedWithRainbow() {
    for (let i = 0; i < this.entities.length; i++) {
      if (
        this.entities[i] instanceof Rainbow &&
        this.isCollision(this.player, this.entities[i])
      ) {
        this.entities[i].destroy();
        delete this.entities[i];
        //Every ennemies should die
        for (let j = 0; j < this.entities.length; j++) {
          if (
            this.entities[j] !== undefined &&
            this.entities[j] instanceof Enemy
          ) {
            this.entities[j].destroy();
            delete this.entities[j];
          }
        }
        return true;
      }
    }
    return false;
  }

  isPlayerCollidedWithCupcake() {
    for (let i = 0; i < this.entities.length; i++) {
      if (
        this.entities[i] instanceof Cupcake &&
        this.isCollision(this.player, this.entities[i])
      ) {
        this.entities[i].destroy();
        delete this.entities[i];
        this.player.updateCupcake(1);
        this.divCupcake.style.width = this.player.nbCupcake * 40 + "px";
        if (this.player.nbCupcake === NB_CUPCAKE_TO_SUPER_KILL - 1) {
          this.activateSuperKillMode();
        }
        return true;
      }
    }
    return false;
  }

  //As the player collided with an enemy?
  isPlayerDead() {
    for (let i = 0; i < this.entities.length; i++) {
      if (
        !this.isSuperKillMode &&
        this.entities[i] instanceof Enemy &&
        this.isCollision(this.player, this.entities[i])
      ) {
        return true;
      }
    }
    return false;
  }

  //Collision test
  isCollision(box1, box2) {
    if (
      box1 !== undefined &&
      box2 !== undefined &&
      box1.x + (box1.margin || 0) < box2.x + box2.width - (box2.margin || 0) &&
      box1.x + box1.width - (box1.margin || 0) > box2.x + (box2.margin || 0) &&
      box1.y + (box1.margin || 0) < box2.y + box2.height - (box2.margin || 0) &&
      box1.height + box1.y - (box1.margin || 0) > box2.y + (box2.margin || 0)
    ) {
      return true;
    }

    return false;
  }
}

// This section will start the game
let gameEngine = new Engine(document.getElementById("app"));
gameEngine.start();
