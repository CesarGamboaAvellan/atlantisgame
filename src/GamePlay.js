
var AMOUNT_DIAMONDS = 30;

GamePlayManager = {
    init: function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        
        this.flagFirstMouseDown = false;
    },
    preload: function() {
        game.load.image('background', 'assets/images/background.png');
        game.load.spritesheet('horse', 'assets/images/horse.png', 84, 156, 2);
        game.load.spritesheet('diamonds', 'assets/images/diamonds.png', 81, 84, 4);
        game.load.spritesheet('explosion', 'assets/images/explosion.png');
    },
    create: function() {
        game.add.sprite(0, 0, 'background');
        this.horse = game.add.sprite(0,0,'horse');
        this.horse.frame = 0;
        this.horse.x = game.width/2;
        this.horse.y = game.height/2;
        this.horse.anchor.setTo(0.5);
        
        game.input.onDown.add(this.onTap, this);
        
        this.diamonds = [];
        for(var i=0; i<AMOUNT_DIAMONDS; i++){
            var diamond = game.add.sprite(100,100,'diamonds');
            diamond.frame = game.rnd.integerInRange(0,3);
            diamond.scale.setTo( 0.30 + game.rnd.frac());
            diamond.anchor.setTo(0.5);
            diamond.x = game.rnd.integerInRange(50, 1050);
            diamond.y = game.rnd.integerInRange(50, 600);
            
            this.diamonds[i] = diamond;
            var rectCurrenDiamond = this.getBoundsDiamond(diamond);
            var rectHorse = this.getBoundsDiamond(this.horse);
            
            while(this.isOverlapingOtherDiamond(i, rectCurrenDiamond) || this.isRectanglesOverlapping(rectHorse, rectCurrenDiamond) ){
                diamond.x = game.rnd.integerInRange(50, 1050);
                diamond.y = game.rnd.integerInRange(50, 600);
                rectCurrenDiamond = this.getBoundsDiamond(diamond);
            }
        }
        this.explosion = game.add.sprite(100,100,'explosion');
        //creamos primera animacion
        this.explosion.tweenScale=game.add.tween(this.explosion.scale).to({
            x: [0.4, 0.8, 0.4],
            y: [0.4, 0.8, 0.4]
        }, 600, Phaser.Easing.Exponential.Out,false, 0, 0, false);
        //primer false es el autostart, primer cero es delay, repeticion y por ultimo go and forward
        //creamos segunda animacion
        this.explosion.tweenAlpha = game.add.tween(this.explosion).to({
            alpha: [1, 0.6, 0]
        }, 600, Phaser.Easing.Out, false, 0, 0, false);
        this.explosion.anchor.setTo(0.5);
        this.explosion.visible=false;
        //agregar tweens
        // var tween = game.add.tween(this.explosion);
        //toma 3 parametros, ubicacion, tiempo y easing
        // tween.to({x:500, y:100}, 1500, Phaser.Easing.Exponential.Out);
        // tween.start();
    },
    onTap:function(){
          this.flagFirstMouseDown = true;
    },
    getBoundsDiamond:function(currentDiamond){
        return new Phaser.Rectangle(currentDiamond.left, currentDiamond.top, currentDiamond.width, currentDiamond.height);
    },
    isRectanglesOverlapping: function(rect1, rect2) {
        if(rect1.x> rect2.x+rect2.width || rect2.x> rect1.x+rect1.width){
            return false;
        }
        if(rect1.y> rect2.y+rect2.height || rect2.y> rect1.y+rect1.height){
            return false;
        }
        return true;
    },
    isOverlapingOtherDiamond:function(index, rect2){
        for(var i=0; i<index; i++){
            var rect1 = this.getBoundsDiamond(this.diamonds[i]);
            if(this.isRectanglesOverlapping(rect1, rect2)){
                return true;
            }
        }
        return false;
    },
    getBoundsHorse: function(){
        var x0=this.horse.x -Math.abs(this.horse.width/2);
        //nos aseguramos que el numero sea positivo para widht
        var width = Math.abs(this.horse.width);
        var y0 = this.horse.y -this.horse.height/2;
        var height = this.horse.height;
        return new Phaser.Rectangle(x0, y0, width, height);
    },
    //existe un metodo que nos ayuda a ver los bounds que creamos
    // render: function(){
    //     game.debug.spriteBounds(this.horse);
    //     for(var i=0; i<AMOUNT_DIAMONDS; i++){
    //         game.debug.spriteBounds(this.diamonds[i]);
    //     }
    // },
    //si queremos que la colision sea visualmente un poco mejor, podemos dividir el width entre 4 y no entre 2
    update: function() {
        if(this.flagFirstMouseDown){
            var pointerX = game.input.x;
            var pointerY = game.input.y;

            var distX = pointerX - this.horse.x;
            var distY = pointerY - this.horse.y;

            if(distX>0){
                this.horse.scale.setTo(1,1);
            }else{
                this.horse.scale.setTo(-1,1);
            }

            this.horse.x += distX * 0.02;
            this.horse.y += distY * 0.02;
            for(var i=0; i<AMOUNT_DIAMONDS; i++){
                var rectHorse = this.getBoundsHorse();
                var rectDiamond = this.getBoundsDiamond(this.diamonds[i]);
                //que la colision sea solo con elementos viscibles 
                if(this.isRectanglesOverlapping(rectHorse, rectDiamond)&&(this.diamonds[i].visible)){
                    this.diamonds[i].visible = false;

                    this.explosion.visible =true;
                    this.explosion.x = this.diamonds[i].x;
                    this.explosion.y = this.diamonds[i].y;
                    this.explosion.tweenScale.start();
                    this.explosion.tweenAlpha.start();

                }
            }
        }
        
    }
}

var game = new Phaser.Game(1136, 640, Phaser.CANVAS);
    
game.state.add("gameplay", GamePlayManager);
game.state.start("gameplay");