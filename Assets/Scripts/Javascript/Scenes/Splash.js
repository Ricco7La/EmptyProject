// on initialise le jeu ceci peut rester vide
Application.Splash = function(){
	console.log("Starting My Game");
}
  
Application.Splash.prototype = 
{
	// logo du splash screen
	preload: function()
	{
		console.log("Preload Splash")        
        this.load.image("logo","Assets/Graphics/Preloader/logo_technobel.png");
        this.load.image("loading","Assets/Graphics/Preloader/preloader-bar.png");  

	},
  	create: function()
  	{
  		console.log("Create Splash")
  		// taille du jeu
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		//console.log(this.scale)
		this.game.stage.backgroundColor = "#FFFFFF";
		var image = this.add.image(Application.Config.width / 2, Application.Config.height / 2, 'logo');
		image.anchor.setTo(0.5,0.5);
		image.alpha = 0;

		// le splash screen a été créé on peu lancer le preload
		var _self = this;

		// affiche le logo
		var logoDuration = 2000;
		var tween = this.game.add.tween(image).to( { alpha: 1}, logoDuration, Phaser.Easing.Cubic.In, true);
		tween.yoyo(true, 0);
        tween.onComplete.add(function() 
        {
            _self.state.start("Preload");
        }, this);
        
        tween.start();
		
	}
}
