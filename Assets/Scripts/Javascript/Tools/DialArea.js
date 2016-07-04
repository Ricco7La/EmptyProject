function DialArea( _game, _name, _x, _y, _width, _height, _callback)
{
	var type = "";
    var _self = _game.add.sprite(_x, _y, type);
    _self.name = _name;

    _self.callbackFunction = _callback;

    _self.alreadyDid = false;

    _self.width = _width;
    _self.height = _height;
   
    _self.debug = Application.debugMode;

    _self.lastInput = Application.Game.time.now;
    _self.DialArray = [];
    _self.indexDial = 0;

    if(Application.debugMode)
    {
        var graphic = _game.add.graphics(0,0);
        graphic.lineStyle(2, 0x0000ff, .4);
        graphic.drawRect(_x, _y, _width, _height);
    }

    _self.update = function()
    {
        _self.LaunchDialogue();
        _self.NextDialogue();
    };

    _self.CheckOverlap = function()
    {
        var dialBounds = _self.getBounds();
        var playerBound =  Application.Player.getBounds();

        return Phaser.Rectangle.intersects( dialBounds, playerBound);
    };

    _self.LaunchDialogue = function()
    {
        if(!_self.alreadyDid)
        {
            if(_self.CheckOverlap())
            {
                Application.Player.canMove = false;
                Application.Player.body.setZeroVelocity();
                _self.DialArray[_self.indexDial].SetVisible(true);
                _self.DialArray[_self.indexDial].NextLine();
                _self.alreadyDid = true;
            }
        }
    };

    _self.NextDialogue = function()
    {
        if (Application.Game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && ( _self.lastInput + 500) < Application.Game.time.now && _self.indexDial < _self.DialArray.length && _self.alreadyDid)
        {
            _self.lastInput = Application.Game.time.now;
            if(!_self.DialArray[_self.indexDial].endedWindow && _self.DialArray[_self.indexDial].index < _self.DialArray[_self.indexDial].content.length)
            {
                _self.DialArray[_self.indexDial].FinishLine();

            }
            else if (_self.DialArray[_self.indexDial].endedWindow && _self.DialArray[_self.indexDial].index < _self.DialArray[_self.indexDial].content.length-1)
            {
                _self.DialArray[_self.indexDial].NextLine();
            }
            else
            {
                _self.DialArray[_self.indexDial].SetVisible(false);
                _self.indexDial ++;
                if (_self.indexDial < _self.DialArray.length) 
                {
                    _self.DialArray[_self.indexDial].SetVisible(true);
                    _self.DialArray[_self.indexDial].NextLine();
                }
                else
                {
                    Application.Player.canMove = true;
                }
                _self.Callback();
            }
        }   
    };

    _self.Callback = function()
    {
        if (_self.indexDial == _self.DialArray.length && _self.callbackFunction)
        {
            _self.callbackFunction();
        }
    }

    return _self;
}