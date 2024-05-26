export default class mainScene extends Phaser.Scene {
    constructor(){
        super('mainScene')
        this.ground;
        this.platforms;
        this.cursor;
        this.player;
        this.enemyDirection = 'right';
        this.enemy2Direction = 'left';


        this.playerHealth = 100;
this.inventory = [];
this.inventoryText;
this.sword;
this.poison;
    }
    preload(){
        this.load.image('sky', '../../assets/sky.jpg')
        this.load.image('ground', '../../assets/ground.jpg')
        this.load.image('platform', '../../assets/platform.png')
        this.load.image('sword', '../../assets/sword.png')
        this.load.image('poison', '../../assets/poison.png')

        this.load.spritesheet('player', '../../assets/player/player.png',{frameWidth: 33, frameHeight: 33} ) 
        this.load.spritesheet('enemy','../../assets/enemy/enemy.png',{frameWidth: 33, frameHeight: 33});
this.load.spritesheet('enemy2',       '../../assets/enemy2/enemy2.png', {
    frameWidth:33, 
    frameHeight:33
});
// this.load.audio('backgroundMusic','../../assets/music.mp3');



        
    }
    create(){
        // this.movingPlaform = this.physics.add.group({
        //     allowGravity:false,
        //     immovable: true
        // });
        // this.movingPlatform1=this.movingPlaform.create(200,400,'platform');
        // this.movingPlatform2=this.movingPlaform.create(600,250, 'platform');
        // this.movingPlatform1.body.velocity.x=100;
        // this.movingPlatform1.body.velocity.y=50
        // this.movingPlatform2.body.velocity.x=-150;
        // this.movingPlatform2.body.velocity.y=75;
        // this.physics.add.collider(this.player,this.movingPlatform);
            
        this.ground = this.physics.add.staticGroup() //
        this.ground.create(400,600,'ground')
        this.platforms = this.physics.add.staticGroup() //
        this.add.image(400,300,'sky')
        this.add.image(400,600,'ground')
        this.platforms.create(540,200,'platform')
        this.platforms.create(700,456,'platform')
        this.platforms.create(100,150,'platform')
        this.platforms.create(350,350,'platform')
        this.player = this.physics.add.sprite(100, 450, 'player')
        this.player.setCollideWorldBounds(true)
        this.player.setBounce(0.2)
        this.cursor = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, this.platforms)
        this.physics.add.collider(this.player, this.ground)
         
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player',{ start:0,end:7}),
            frameRate: 10,
            repeat: -1
        });

        this.enemy = this.physics.add.sprite(500, 300, 'enemy');
        this.enemy.setCollideWorldBounds(true);
        this.physics.add.collider(this.enemy, this.platforms);
        this.physics.add.collider(this.enemy, this.ground);

        this.anims.create({
            key: 'runEnemy',
            frames: this.anims.generateFrameNumbers('enemy',{ start:0,end:6}),
            frameRate: 10,
            repeat: -1
        });
        this.createHealthBar();
        
        this.sword = this.add.sprite(0, 0, 'sword');
        this.sword.setVisible(false);

        this.player.sword = this.sword; // Присвоить sword как свойство player
        this.sword.setOrigin(0.5 , 1 );
        this.sword.setRotation(Phaser.Math.DegToRad(0));
            
        this.anims.create({
        key: 'attack',
        frames: this.anims.generateFrameNumbers('player', {
            start: 1,
            end: 3
        }),
        frameRate: 10,
        repeat: 0

});
this.physics.add.overlap(this.player, this.enemy, this.attackEnemy, null, this);
this.physics.add.overlap(this.player, this.enemy2, this.attackEnemy, null, this);
this.poison = this.physics.add.sprite(500, 100, 'poison');
this.physics.add.collider(this.poison, this.ground);
this.physics.add.collider(this.poison, this.platforms);

this.physics.add.overlap(this.player, this.poison, this.collectItem, null, this);
this.inventoryText = this.add.text(10, 50, 'Inventory:', {
font: '16px Arial',
fill: '#ffffff'
});
this.enemy2 = this.physics.add.sprite(800,200, 'enemy2');
this.enemy2.setCollideWorldBounds(true);
this.enemy2.setBounce(0.2);
this.physics.add.collider(this.enemy2, this.platforms);
this.physics.add.collider(this.enemy2, this.ground);


this.anims.create({
    key: 'runEnemy2',
    frames: this.anims.generateFrameNumbers('enemy2',{
start: 0,
end: 6
    }),
    frameRate: 10,
    repeat: -1
});
// this.backgroundMusic = this.sound.add('backgroundMusic');
// this.backgroundMusic.play({ loop: true });
    }
    createHealthBar() {
        this.healthBar = this.add.graphics();
        this.updateHealthBar();
    }

    updateHealthBar() {
        if(this.playerHealth <= 0) {
            this.playerHealth = 0;
        }

        

        const x = 10;
        const y = 10  ;
        const width = 200;
        const height = 20;

        this.healthBar.clear();
        this.healthBar.fillStyle(0x177245);
        this.healthBar.fillRect(x, y, width * (this.playerHealth / 100), height);
        this.healthBar.lineStyle(2, 0x000000);
        this.healthBar.strokeRect(x, y, width, height);
    }

    handleCollision() {
        this.playerHealth -= 0.01;

        if (this.playerHealth <=0) {
            this.restartGame();
        }

        this.updateHealthBar();
    }

    restartGame() {
        this.playerHealth = 100;

        this.scene.restart();
    }
attackEnemy(player, enemy){
    if (this.cursor.space.isDown){
        // Выполняем атаку, только если зажата клавиша пробела
        enemy.disableBody(true, true); // Уничтожаем врага
    }
}

attackEnemy2(player, enemy){
    if (this.cursor.space.isDown){
        // Выполняем атаку, только если зажата клавиша пробела
        enemy2.disableBody(true, true); // Уничтожаем врага
    }
}
collectItem(player, item){
    item.disableBody(true, true); //Убираем предмет
    this.inventory.push(item.texture.key); // Добавляем предмет в инвентарь
    this.updateInvetoryDisplay();

   
}
  updateInvetoryDisplay() {
        // Clear the previous inventory diplay
        this.inventoryText.setText('Inventory:');
        // Display the current inventory items
        this.inventory.forEach((item, index)=> {
            if (item ==='poison') {
                const itemImage = this.add.image(100+ index * 40, 60, item);
                itemImage.setScale(1);
            }
        })
    };   
    update(){
        // this.movingPlatform1.x=Phaser.Math.Sinusoidal.lnOut(time*0.005,
        //     200,200);
        //     this.movingPlatform1.y=Phaser.Math.Sisusoidal.Out(time*0.0025,
        //         400,100);

        //         this.movingPlatform2.x=Phaser.Math.Sinusoidal.Out(time*0.0075,
        //             600,200);
        //             this.movingPlatform2.y=Phaser.Math.Sinusoidal.Out(time*
        //                0.0035,250,100);
            
        this.physics.add.overlap(this.player, this.enemy, this.handleCollision, null, this);
        this.physics.add.overlap(this.player, this.enemy2, this.handleCollision, null, this);
      //  this.physics.add.overlap(this.player, this.enemy2, this.handleCollision, null, this);
// this.physics.add.overlap(this.sword, this.attackEnemy,null, this);
// this.physics.add.overlap(this.player, this.enemy2, this.handleCollision, null, this);
        this.physics.add.overlap(this.sword, this.enemy, this.attackEnemy, null, this);
        this.physics.add.overlap(this.sword, this.enemy2, this.attackEnemy2, null, this);

        if (this.cursor.left.isDown){
            this.player.setVelocityX(-160)
            this.player.anims.play('run',true);
            this.player.flipX = true;
        }
        else if (this.cursor.right.isDown){
            this.player.setVelocityX(160)
            this.player.anims.play('run',true);
            this.player.flipX = false;
        }
        else {
            this.player.setVelocityX(0)
            this.player.anims.stop('run');
            this.player.setTexture('player',0);
        }


        if (this.cursor.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-430)
        }



    if(this.enemyDirection === 'right') {
        this.enemy.setVelocityX(80);
        this.enemy.flipX = false;
        this.enemy.anims.play('runEnemy', true);
    }else if (this.enemyDirection === 'left') {
        this.enemy.setVelocityX(-80);
        this.enemy.flipX = true;
        this.enemy.anims.play('runEnemy', true);
    }

    if(this.enemy.body.blocked.right) {
        this.enemyDirection = 'left';
    }else if (this.enemy.body.blocked.left) {
        this.enemyDirection = 'right';
    }


    if(this.enemy2Direction === 'right') {
        this.enemy2.setVelocityX(80);
        this.enemy2.flipX = false;
        this.enemy2.anims.play('runEnemy2', true);
    }else if (this.enemy2Direction === 'left') {
        this.enemy2.setVelocityX(-80);
        this.enemy2.flipX = true;
        this.enemy2.anims.play('runEnemy2', true);
    }

    if(this.enemy2.body.blocked.right) {
        this.enemy2Direction = 'left';
    }else if (this.enemy2.body.blocked.left) {
        this.enemy2Direction = 'right';
    }


    if (this.player.flipx === false){
        this.sword.setPosition(this.player.x+10, this.player.y+8);
        this.sword.flipx = false
    }
    else{
        this.sword.setPosition(this.player.x-10, this.player.y+8);
        this.sword.flipx = true
    }

    if ( this.sword.flipX == true){
        this.sword.setRotation(this.sword.rotation - 0.5);
        const angle = this.sword.rotation;
        console.log(angle)
        if ( angle > 2){
            //ничего не происходит
        }
    }
    if (this.cursor.space.isDown) {
        // Проверка на нажатие клавиши пробела
        this.player.anims.play('attack', true); // Воспроизведение анимации атаки 
        this.sword.setVisible(true); // Отображение меча 
        if ( this.sword.flipX == true){
            this.sword.setRotation(this.sword.rotation - 0.1);
            const angle = this.sword.rotation;
            console.log(angle)
            if (angle > 2){
                this.sword.setRotation(Phaser.Math.DegToRad(0));
            }
        }
        else{
            this.sword.setRotation(this.sword.rotation + 0.1);
            const angle = this.sword.rotetion;
            if (angle> 2){
                this.sword.setRotation(Phaser.Math.DegToRad(0));

            }
        }
    } else {
        this.sword.setVisible(false); //Скрытие меча
        this.sword.setRotation(Phaser.Math.DegToRad(0));
    }
}    
}
