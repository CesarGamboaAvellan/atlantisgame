
GamePlayManager = {
    init: function() {
        //agregar responsividad al juego
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        //el caballo no se movera hasta que el flag pase a true
        this.flagFirstMouseDown = false;
    },
    preload: function() {
        game.load.image('background', 'assets/images/background.png');
        //ademas de esto, se agregan parametros, ancho, alto, cantidad de imagenes
        game.load.spritesheet('horse', 'assets/images/horse.png', 84, 156, 2);
    },
    create: function() {
        game.add.sprite(0,0, 'background');
        this.horse = game.add.sprite(0,0, 'horse');
        this.horse.frame = 1;
        this.horse.x = game.width/2;
        this.horse.y = game.height/2;
        this.horse.anchor.setTo(0.5, 0.5);
        game.input.onDown.add(this.onTap, this);
    },
    onTap: function(){
        this.flagFirstMouseDown=true;
    },
    update: function() {
        if(this.flagFirstMouseDown){
            //ahora vamos a agregar movimiento
        var pointerX = game.input.x;
        var pointerY = game.input.y;

        //vamos a verificar que la distancia entre el caballo
        //es mayor en x o y, para que se mueva en direccion del mouse

        var distX = pointerX-this.horse.x;
        var distY = pointerY-this.horse.y;
         if(distX>0){
             //esto quiere decir que el puntero esta a la derecha
             this.horse.scale.setTo(1,1);
         }else{
            this.horse.scale.setTo(-1,1);
             //esto quiere decir que esta a la izq
         }
         //ahora vamos a hacer que se mueva, modificando la coordenada x y y un %
         this.horse.x += distX *0.02;
         this.horse.y += distY *0.02;
        }
    }
}

var game = new Phaser.Game(1136, 640, Phaser.CANVAS);
    
game.state.add("gameplay", GamePlayManager);
game.state.start("gameplay");