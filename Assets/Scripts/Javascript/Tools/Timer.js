/**
 * @class Timer
 * @namespace Tools/Timer
 *
 * @param {Time} _duration - 
 * @param {Time} _isRepeat - 
 * @param {Time} _Action - 
 * @param {Time} _Callback - 
 *
 * @description
 * Create an instance of timer
 *
 * */
function Timer(_duration, _isRepeat, _Callback, _Game) 
{
	this.ID = 0;
	this.currentTime = 0;
	this.duration = _duration;
	this.repeat = _isRepeat || false;
	this.Callback = _Callback || null;
    this.Game = _Game;
    this.deltaTime = this.Game.time.elapsedMS;
    this.totalTime = 0;

	this.Awake = function () 
	{
		Timer.lastID++;
		this.ID = Timer.lastID;
		// Time.Timers.push(this);
		return this.ID;
	}

	this.Update = function() 
	{
		if (this.currentTime + this.deltaTime < this.duration) 
		{
			this.currentTime += this.deltaTime;
            this.totalTime = this.duration - this.currentTime;
		}
		else 
		{
			//End Of Timer
			//console.log('End Timer');
			this.currentTime = this.duration;
			if (this.Callback != null) 
			{
				this.Callback();
			}
			if (this.repeat)
			{	
				this.Reset();
			} 
			else 
			{
				this.Clear();
			}
		}
	}

	this.Reset = function() 
	{
		this.currentTime = 0;
	}

	this.Clear = function() 
	{
		this.duration = 0;
	}

    this.Display = function()
    {
        var min = this.totalTime / 60000 |0;
		var sec = ((this.totalTime % 60000) / 1000) |0;
        if(min <= 9)
        {
            min = '0' + min;
        }
        if(sec <= 9)
        {
            sec = '0' + sec;
        }
		return min + ' : ' + sec;
    }

	this.Awake();
}

Timer.lastID = 0;