var puntos = 0;
var speed = 50;

class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.image('fondo', './js/img/fondo.png');
        this.load.image('plataforma', './js/img/platform1.png');
        this.load.image('platBase', './js/img/platform4.png');
        this.load.image('flecha-left', './js/img/izquierda.png');
        this.load.image('flecha-right', './js/img/derecha.png');
        this.load.spritesheet('dino', './js/img/dino.png', { frameWidth: 50, frameHeight: 50 });

        // Cargar los sprites que el jugador debe recoger
        this.load.image('item1', './js/img/carp.png');
        this.load.image('item2', './js/img/boca.png');
        this.load.image('item3', './js/img/est.png');
        this.load.image('item4', './js/img/cat.png');
        this.load.image('item5', './js/img/arg.png');
        this.load.image('roja1', './js/img/roja.png');
        this.load.image('roja2', './js/img/roja.png');
        this.load.image('roja3', './js/img/roja.png');
    }

    create() {
        this.add.image(250, 400, 'fondo');
        this.puntosText = this.add.text(250, 50, '0', { fontSize: '42px', fill: '#000' });
        
        var platBase = this.physics.add.staticGroup();
        platBase.create(69, 790, 'platBase');
        platBase.create(450, 790, 'platBase');
        platBase.create(69, 760, 'platBase');
        platBase.create(450, 760, 'platBase');

        // Player
        this.player = this.physics.add.sprite(400, 600, 'dino').setScale(1.4);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        this.physics.add.collider(this.player, platBase);
        this.cursors = this.input.keyboard.createCursorKeys();

        // Botones de pantalla táctil como sprites
        this.leftButton = this.add.sprite(50, 770, 'flecha-left').setInteractive();
        this.rightButton = this.add.sprite(150, 770, 'flecha-right').setInteractive();

        // Asignar eventos a los sprites
        this.leftButton.on('pointerover', () => this.leftButton.setTint(0x00ff00));
        this.leftButton.on('pointerout', () => this.leftButton.clearTint());
        this.leftButton.on('pointerdown', () => this.moveLeft = true);
        this.leftButton.on('pointerup', () => this.moveLeft = false);
        
        this.rightButton.on('pointerover', () => this.rightButton.setTint(0x00ff00));
        this.rightButton.on('pointerout', () => this.rightButton.clearTint());
        this.rightButton.on('pointerdown', () => this.moveRight = true);
        this.rightButton.on('pointerup', () => this.moveRight = false);

        this.moveLeft = false;
        this.moveRight = false;
        this.turn = false;

        // Crear un grupo para los ítems normales y los ítems rojos
        this.itemsGroup = this.physics.add.group();
        this.itemsRojaGroup = this.physics.add.group();

        // Generar ítems aleatoriamente
        this.time.addEvent({
            delay: 1000, // Intervalo de tiempo en milisegundos
            callback: this.spawnItem,
            callbackScope: this,
            loop: true
        });

        // Añadir colisión entre el jugador y los ítems
        this.physics.add.overlap(this.player, this.itemsGroup, this.collectItem, null, this);
        this.physics.add.overlap(this.player, this.itemsRojaGroup, this.collectItemRoja, null, this);

        // Animaciones
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dino', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dino', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: this.anims.generateFrameNumbers('dino', { start: 6, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update() {
        if (this.cursors.left.isDown || this.moveLeft) {
            this.player.setVelocityX(-160);
            if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== 'left') {
                this.player.anims.play('left');
            }
        } else if (this.cursors.right.isDown || this.moveRight) {
            this.player.setVelocityX(160);
            if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== 'right') {
                this.player.anims.play('right');
            }
        } else {
            this.player.setVelocityX(0);
            if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== 'turn') {
                this.player.anims.play('turn');
            }
        }
    }

    spawnItem() {
        // Seleccionar un sprite aleatorio
        const items = ['item1', 'item2', 'item3', 'item4', 'item5'];
        const tRoja = ['roja1', 'roja2', 'roja3'];
        const randomItem = Phaser.Utils.Array.GetRandom(items);
        const randomRoja = Phaser.Utils.Array.GetRandom(tRoja);

        // Crear el ítem en una posición aleatoria en la parte superior de la pantalla
        const x = Phaser.Math.Between(20, 480);
        const item = this.itemsGroup.create(x, 0, randomItem);
        const xR = Phaser.Math.Between(20, 480);
        const itemRoja = this.itemsRojaGroup.create(xR, 0, randomRoja);

        // Ajustar la velocidad de caída
        if (puntos <= 10) {
            speed = 10;
            
        }
        if (puntos > 10 && puntos <= 20) {
            speed = 50;
            
        }
        if (puntos > 20 && puntos <= 30){
            speed = 200;
            
        }
        if (puntos > 30 && puntos <= 40){
            speed = 300;
            
        }
         if (puntos > 40 && puntos <= 50){
            speed = 550;
            
        }
        if(puntos >50){
            speed=800;
        }
        item.setVelocityY(speed);
        item.setGravity(0,0); // Desactivar la gravedad para este ítem
        itemRoja.setVelocityY(speed);
        itemRoja.setGravityY(0); // Desactivar la gravedad para este ítem

        // Ajustar la escala del ítem
        itemRoja.setScale(0.15);
        item.setScale(0.7);
    }

    collectItem(player, item) {
        item.disableBody(true, true); // Eliminar el ítem de la pantalla
        puntos++;
        this.puntosText.setText('puntos: ' + puntos);
    }

    collectItemRoja(player, itemRoja) {
        if (itemRoja.texture.key === 'roja1' || itemRoja.texture.key === 'roja2' || itemRoja.texture.key === 'roja3') {
            this.scene.start('GameOver', { puntos: puntos });
        }
    }
}

class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    preload() {
    }

    create(data) {
        this.overText = this.add.text(250, 300, 'GAME OVER', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
        this.puntosText = this.add.text(250, 400, `Puntos: ${data.puntos}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Reiniciar el juego al hacer clic
        this.input.on('pointerdown', () => {
            puntos = 0;
            this.scene.start('MainScene');
        });
    }

    update() {
    }
}

const config = {
    type: Phaser.AUTO,
    width: 500,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: false
        }
    },
    scene: [MainScene, GameOver],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);
