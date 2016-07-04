function Dialogue(_x, _y, _charaDial, _text)
{
	
	var _self = Application.Game.add.image(0,0,_charaDial);
 	_self.dialogue = Application.Game.add.text(_x,_y, "", { font: "13px Lithos Pro", fill: "#000", align: "left" });
 	_self.dialogue.setShadow(3, 3, 'rgba(0,0,0,0.2)', 5);
	_self.fixedToCamera = true;
	_self.dialogue.fixedToCamera = true;

	_self.visible = false;
	_self.dialogue.visible = false;

	_self.index = 0;
	_self.window = "";
	_self.content = _text;
	_self.endedWindow = false;
	
	_self.SetVisible = function(_bool)
	{
		_self.visible = _bool;
		_self.dialogue.visible = _bool;
	};

	_self.UpdateLine = function()
	{
	    if (_self.window.length < _self.content[_self.index].length)
	    {
	        _self.window = _self.content[_self.index].substr(0, _self.window.length + 1);
	        _self.dialogue.setText(_self.window);
	    }
	    else
	    {
	        _self.endedWindow = true;
	    }
	};

	_self.NextLine = function()
	{
	    _self.index++;
	    _self.endedWindow = false;

	    if (_self.index < _self.content.length)
	    {
	        _self.window = '';
	        _self.repeat = Application.Game.time.events.repeat(40, _self.content[_self.index].length + 1, _self.UpdateLine, this);
	    }
	};

	_self.FinishLine = function()
	{
		_self.repeat.timer.remove(_self.repeat);
		console.log(_self.repeat)
		_self.window = _self.content[_self.index];
	    _self.dialogue.setText(_self.window);
		_self.endedWindow = true;
	}

	return _self;
}