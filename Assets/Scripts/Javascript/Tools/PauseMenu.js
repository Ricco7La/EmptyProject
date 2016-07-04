function PauseMenu (_game)
{
	var _self = _game.add.sprite(Application.Config.width * .5, Application.Config.height * .5, 'pauseMenu');
    var menuPositionTopY = ((Application.Config.height - _self.height) * .5);

    _self.anchor.setTo(0.5, 0.5);
    _self.fixedToCamera = true;
    _self.visible = false;

	_self.isPaused = false;

    _self.choiceButton = ['Option', 'Save', 'Load', 'Main Title', 'Quit', 'Back'];

    _self.option = _game.add.text(Application.Config.width * .5, menuPositionTopY + (_self.height * .167) * .5, "Option", { font: "20px Merriweather", fill: "#808DC1", align: "center" });
	_self.option.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
	_self.option.anchor.setTo(0.5, 0.5);
	_self.option.fixedToCamera = true;
	_self.option.visible = false;

    _self.save = _game.add.text(Application.Config.width * .5, menuPositionTopY + (_self.height * .167) * 1.5, "Save", { font: "20px Merriweather", fill: "#808DC1", align: "center" });
	_self.save.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
	_self.save.anchor.setTo(0.5, 0.5);
	_self.save.fixedToCamera = true;
	_self.save.visible = false;

    _self.load = _game.add.text(Application.Config.width * .5, menuPositionTopY + (_self.height * .167) * 2.5, "Load", { font: "20px Merriweather", fill: "#808DC1", align: "center" });
	_self.load.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
	_self.load.anchor.setTo(0.5, 0.5);
	_self.load.fixedToCamera = true;
	_self.load.visible = false;

    _self.mainTitle = _game.add.text(Application.Config.width * .5, menuPositionTopY + (_self.height * .167) * 3.5, "Main Title", { font: "20px Merriweather", fill: "#ff1105", align: "center" });
	_self.mainTitle.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
	_self.mainTitle.anchor.setTo(0.5, 0.5);
	_self.mainTitle.fixedToCamera = true;
	_self.mainTitle.visible = false; 

    _self.quit = _game.add.text(Application.Config.width * .5, menuPositionTopY + (_self.height * .167) * 4.5, "Quit", { font: "20px Merriweather", fill: "#ff1105", align: "center" });
	_self.quit.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
	_self.quit.anchor.setTo(0.5, 0.5);
	_self.quit.fixedToCamera = true;
	_self.quit.visible = false;

    _self.back = _game.add.text(Application.Config.width * .5, menuPositionTopY + (_self.height * .167) * 5.5, "Back", { font: "20px Merriweather", fill: "#ff1105", align: "center" });
	_self.back.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
	_self.back.anchor.setTo(0.5, 0.5);
	_self.back.fixedToCamera = true;
	_self.back.visible = false;

    _self.SetPause = function(e)
	{
        if( (e.code == "KeyP" || e.code == "Escape") && !_self.isPaused)
        {
        	_self.ShowMenu();
        }
        else if( (e.code == "KeyP" || e.code == "Escape") && _self.isPaused)
        {
        	_self.HideMenu();
        }

	};

	_self.OnPauseMenu = function(event)
	{
        if(Application.Game.paused)
        {
            var x1 = (Application.Config.width - 150 ) * .5, x2 = (Application.Config.width + 150) * .5;
                y1 = (Application.Config.height - 300) * .5, y2 = (Application.Config.height + 300) * .5;

            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 )
            {
                var x = event.x - x1,
                    y = event.y - y1;

                var choice = Math.floor(y / 50) ;

                if(_self.choiceButton[choice] == 'Option')
                {

                }
                else if(_self.choiceButton[choice] == 'Save')
                {

                }
                else if(_self.choiceButton[choice] == 'Load')
                {

                }
                else if(_self.choiceButton[choice] == 'Main Title')
				{
	                Application.Game.paused = false;
	                /**
	                	TO DO FOR NEXT PHASER UPDATE
	                	SUBMIT ISSUE ON GITHUB 
	                **/
	                Application.Game.world.width = Application.Config.width;
	                Application.Game.world.height = Application.Config.height;

					Application.Game.state.start("Title");
					Application.Game.input.keyboard.addCallbacks(this, null, null, function(){});
				}
                else if(_self.choiceButton[choice] == 'Quit')
                {
        			_self.HideMenu();
                	var luciferDial = new Dialogue(210,355,'luciferDial',"Gnark, gnark, gnark! \nOù crois-tu aller! Personne ne s'échape de l'Enfer.");
                	Application.Game.time.events.add( Phaser.Timer.SECOND * 2.5, function(){
                		luciferDial.setVisible(false)
                	});
                }
                else if(_self.choiceButton[choice] == 'Back')
                {
                	_self.HideMenu();
                }
            }
        }
    };

    _self.ShowMenu = function()
    {
    	Application.Game.paused = true;
     	_self.visible = true;
		_self.option.visible = true;
		_self.save.visible = true;
		_self.load.visible = true;
		_self.mainTitle.visible = true;
		_self.quit.visible = true;
		_self.back.visible = true;
    	_self.isPaused = true;
    };

    _self.HideMenu = function()
    {
        Application.Game.paused = false;
    	_self.visible = false;
		_self.option.visible = false;
		_self.save.visible = false;
		_self.load.visible = false;
		_self.mainTitle.visible = false;
		_self.quit.visible = false;
		_self.back.visible = false;
    	_self.isPaused = false;
    };

	_game.input.keyboard.addCallbacks(this, null, _self.SetPause, null);
    _game.input.onDown.add(_self.OnPauseMenu, self);

    return _self;
}