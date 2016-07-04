Application.Preload = function(){};

Application.Preload.prototype = 
{
	preload: function()
	{ 
		this.game.stage.backgroundColor = "#000";
		console.log("Preload preload");
		// on crée un sprite pour la barre de chargement
        var loadingBar = this.add.sprite(Application.Config.width / 2, Application.Config.height / 2, "loading");
	    loadingBar.anchor.setTo(0.5,0.5);

	    // on défini la barre de chargement et phaser va gérer la bare tout seul
	    this.load.setPreloadSprite(loadingBar);

	    // Add the Juicy Plugins to Application.
		Application.Juicy = this.game.plugins.add(new Phaser.Plugin.Juicy(this.game));


	    /***********************
	    	Loading Example
		************************
		this.game.load.tilemap('LevelTest', 'Assets/Graphics/TilesMap/LevelTest.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.tilemap('Tuto', 'Assets/Graphics/TilesMap/Tuto.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.tilemap('Ante1', 'Assets/Graphics/TilesMap/Ante1.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.spritesheet('Hole', 'Assets/Graphics/Interact/Trap/Hole_32_32.png', 32, 32, 4);
    	this.game.load.image('pauseMenu', 'Assets/Graphics/PauseMenu/pauseMenu_150_300.png');
		this.game.load.audio('bossGrunt', 'Assets/Audio/SFX/bossGrunt.wav');
		*/

		/*********************************** 
	    	chargement des assets
	    ************************************/

	},

  	create: function()
  	{
  		console.log("create Preload");

  		// go to another State
		//this.state.start("Title");
	}
}