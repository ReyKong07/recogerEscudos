
class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.image('fondo', './js/img/fondo.png');
        this.load.image('plataforma', './js/img/platform1.png');
        this.load.image('platBase', './js/img/platform4.png');
        this.load.image('flecha-left', './js/img/izquierda.png')
        this.load.image('flecha-right', './js/img/derecha.png')
        this.load.spritesheet('dino', './js/img/dino.png', { frameWidth: 50, frameHeight: 50 });
    }

    create() {
        this.add.image(250, 400, 'fondo');
        var platBase = this.physics.add.staticGroup();
        platBase.create(69, 790, 'platBase');
        platBase.create(450, 790, 'platBase');
        platBase.create(69, 760, 'platBase');
        platBase.create(450, 760, 'platBase');

        // Player
        this.player = this.physics.add.sprite(400, 400, 'dino').setScale(1.4);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        this.physics.add.collider(this.player, platBase);
        this.cursors = this.input.keyboard.createCursorKeys();

        // Botones de pantalla táctil como sprites
        this.leftButton = this.add.sprite(50, 770, 'flecha-left').setInteractive();
        this.rightButton = this.add.sprite(150, 770, 'flecha-right').setInteractive();

        // Asignar eventos a los sprites
        this.leftButton.on('pointerdown', () => this.moveLeft = true);
        this.leftButton.on('pointerup', () => this.moveLeft = false);
        this.rightButton.on('pointerdown', () => this.moveRight = true);
        this.rightButton.on('pointerup', () => this.moveRight = false);

        this.moveLeft = false;
        this.moveRight = false;
        this.turn = false;

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
}

const config = {
    type: Phaser.AUTO,
    width: 500,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.FIT,
        
    }
};
const game = new Phaser.Game(config);


