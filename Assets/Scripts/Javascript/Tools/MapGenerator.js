/*
*
* a MapGenerator to use with .json files from Tiled Editor
* 
*
* Parameters :
* --------------
* _Game: reference to the game
* _Map : reference to the level map
* _tilemap: .json file 
* _tilesetName: name of the tileset in Tiled Editor
* _tilesetFile: .png file
* _tilesLayers: array of litterals objects 
*							=> layerName: name of the layer in Tiled Editor
*							
*
* Return :
* ----------
* a litteral object with the layer + an array the Ennemies + an array the Souls + an array of Items(switch)
*
*/
function GenerateMap(_Game, _Map, _tilemap, _tilesetName, _tilesetFile ) 
{
	var Layers = {};
	Application.Layers = Layers;
	//console.log(_Game);
	_Map = _Game.add.tilemap(_tilemap);
	_Map.addTilesetImage(_tilesetName, _tilesetFile);
	
	//console.log("Map");
	//console.log(_Map);


	// Group for Z-index
	Layers["Z-index"] = [];
	Layers["BlockVision"] = [];

	for (var i = 0; i < 10; i++) 
	{
		Layers["Z-index"].push(_Game.add.group());
	}

	//Collision Group
	var tilesCG = _Game.physics.p2.createCollisionGroup();
	var ennemyCG = _Game.physics.p2.createCollisionGroup();
	var playerCG = _Game.physics.p2.createCollisionGroup();
	var soulCG = _Game.physics.p2.createCollisionGroup();
	var switchCG = _Game.physics.p2.createCollisionGroup();
	var exitCG = _Game.physics.p2.createCollisionGroup();
	var fovCG = _Game.physics.p2.createCollisionGroup();
	var doorCG = _Game.physics.p2.createCollisionGroup();
	var spikeCG = _Game.physics.p2.createCollisionGroup();
	var teleportCG = _Game.physics.p2.createCollisionGroup();
	var HoleCG = _Game.physics.p2.createCollisionGroup();
	var bossCG = _Game.physics.p2.createCollisionGroup();
	var blockCG = _Game.physics.p2.createCollisionGroup();

	_Game.physics.p2.updateBoundsCollisionGroup();

	Layers["playerCG"] = playerCG;
	Layers["bossCG"] = bossCG;
	Layers["tilesCG"] = tilesCG;
	Layers["blockCG"] = blockCG;
	/***** Charge Tile Layer from Tiled *****/
	//console.log("Tiles");
	var tilesBodies = [];
	for (prop of _Map.layers) 
	{
		if (prop.visible) 
		{
			Layers[prop.name] = _Map.createLayer(prop.name);
			if (prop.properties.worldSize) 
			{
				Layers[prop.name].resizeWorld();
				_Game.physics.p2.setBoundsToWorld(true, true, true, true, false);
			}
			if (prop.properties.collide) 
			{
				_Map.setCollisionBetween(1, 10000, true, Layers[prop.name]);
				var bodies = _Game.physics.p2.convertTilemap(_Map, Layers[prop.name]);
				tilesBodies = tilesBodies.concat(bodies);
			}
			if (prop.properties.blockView) 
			{
				Layers["BlockVision"].push(prop.name);
			}
			//console.log(prop.properties);
			if (prop.properties && prop.properties.z_index) 
			{
				//console.log("Custom z-index");
				Layers["Z-index"][prop.properties.z_index].add(Layers[prop.name]);
			}
			else
			{
				Layers["Z-index"][5].add(Layers[prop.name]);
			}
			//console.log(prop.name);
			//console.log(Layers[prop.name]);
			Layers[prop.name].debug = Application.debugMode;
		}

	}

	//_Map.setCollisionBetween(1, 500, true, Layers["Wall"]);
	//var bodies = _Game.physics.p2.convertTilemap(_Map, Layers["Wall"]);

	for (prop of tilesBodies) 
	{
		prop.setCollisionGroup(tilesCG);
		prop.collides([playerCG,bossCG]);
		prop.mass = 3;
	}


	/***** Charge Object Layer from Tiled *****/

	/* Ennemies */
	//console.log("Ennemies");
	//console.log(_Map.objects.Ennemies);
	var EnnemiesPaths = [];
	for (el of _Map.objects.Ennemies) 
	{
		if (el.visible) 
		{
			var array = el.name.split('-');
			var ennemiIndex = array[0];
			var pathIndex = array[1];
			if (EnnemiesPaths[ennemiIndex] == undefined) 
			{
				EnnemiesPaths[ennemiIndex] = [];
			}
			EnnemiesPaths[ennemiIndex][pathIndex] = el;
		}
	}
	var Ennemies = [];
	for (p of EnnemiesPaths) 
	{
		var ennemy = new Ennemy(_Game, p, p[0].type, p[0].properties.speed, p[0].properties.timeRotation, p[0].properties.rangeView, p[0].properties.amplitude, p[0].properties.areaDetection);

		if (p[0].properties && p[0].properties.z_index) 
		{
			//console.log("Custom z-index");
			Layers["Z-index"][p[0].properties.z_index].add(ennemy.FOV);
			Layers["Z-index"][p[0].properties.z_index].add(ennemy);
		}
		else
		{
			Layers["Z-index"][5].add(ennemy.FOV);
			Layers["Z-index"][6].add(ennemy);
		}

		ennemy.body.setCollisionGroup(ennemyCG);
		ennemy.fovCG = fovCG;
		ennemy.playerCG = playerCG;
		ennemy.body.collides([HoleCG], ennemy.Kill);

		// What to do on viewed
		ennemy.FunctionOnSeeing = function() {
			console.log("Seen");
			if (ennemy.lastViewed + 5000 < _Game.time.now)
        	{
        		console.log("Do");
        	  	Application.resetLevel();
        	  	ennemy.lastViewed = _Game.time.now;
        	}	
		} 
		ennemy.body.collides([playerCG], ennemy.FunctionOnSeeing);

		Ennemies.push(ennemy);
		
	}
	Layers["Ennemies"] = Ennemies;
	console.dir(EnnemiesPaths);

	/* Souls */
	//console.log("Souls");
	var SoulsPositions = _Map.objects.Souls;
	var Souls = [];
	for (p of SoulsPositions) 
	{
		if (p.visible) 
		{
			var soul = new Soul(_Game, p.x, p.y);
			soul.body.setCollisionGroup(soulCG);
			soul.body.collides([playerCG],soul.Kill);
			if (p.properties && p.properties.z_index) 
			{
				//console.log("Custom z-index");
				Layers["Z-index"][p.properties.z_index].add(soul.emitter);
				Layers["Z-index"][p.properties.z_index].add(soul);
			}
			else
			{
				Layers["Z-index"][5].add(soul.emitter);
				Layers["Z-index"][5].add(soul);
			}
		}
	}
	console.dir(SoulsPositions);

	/* Interractions */
	//console.log("Interractions");
	var Switches = [];
	var Objects = [];
	var EnemyDies = [];
	for (el of _Map.objects.Interractions) 
	{
		if (el.visible) 
		{
			if(el.name == "Switch")
			{
				if (Application.lvl[Application.indexLevel] == "Tuto") {
					var s = new Switch(_Game, el.x, el.y, el.type,true);
				}
				else {
					var s = new Switch(_Game, el.x, el.y, el.type);
				}
				
				s.body.setCollisionGroup(switchCG);
				s.body.collides(playerCG);
				if (el.properties && el.properties.z_index) 
				{
						//console.log("Custom z-index");
					Layers["Z-index"][el.properties.z_index].add(s);
				}
				else
				{
					Layers["Z-index"][5].add(s);
				}
				Switches[el.properties.index] = s;
			}
		}
	}
	for (el of _Map.objects.Interractions) 
	{
		if (el.visible) 
		{
			switch (el.name)
			{
				case "Door":
					//console.log('Door');
					var array = [];
					for (prop of el.properties.switchesIndex.toString().split(",")) 
					{
						array.push(Switches[prop]);
					}
					var s = new Door(_Game, el.x, el.y,el.width,el.height, array, el.type);
					if (el.properties && el.properties.z_index) 
					{
						//console.log("Custom z-index");
						Layers["Z-index"][el.properties.z_index].add(s);
						Layers["Z-index"][el.properties.z_index + 1].add(s.upperPart);
					}
					else
					{
						Layers["Z-index"][5].add(s);
						Layers["Z-index"][6].add(s.upperPart);
						
					}
					var arrayCollision = [playerCG]
					s.body.setCollisionGroup(doorCG);
					s.SavedCollision = arrayCollision;
					s.body.collides(s.SavedCollision);
					
					Objects.push(s);
					break;
				case 'Spike':
					var array = [];
					for (prop of el.properties.switchesIndex.toString().split(",")) 
					{
						array.push(Switches[prop]);
					}
					var s = new Spike(_Game, el.x, el.y,el.width,el.height, array, el.type);
					if (el.properties && el.properties.z_index) 
					{
						//console.log("Custom z-index");
						Layers["Z-index"][el.properties.z_index].add(s);
					}
					else
					{
						Layers["Z-index"][5].add(s);
					}
					var arrayCollision = [playerCG]
					s.body.setCollisionGroup(spikeCG);
					s.SavedCollision = arrayCollision;
					s.body.collides(s.SavedCollision);
					
					Objects.push(s);
					break;
				case 'Hole':
					//console.log('Hole');
					var array = [];
					for (prop of el.properties.switchesIndex.toString().split(",")) 
					{
						array.push(Switches[prop]);
					}
					var s = new Hole(_Game, el.x, el.y,el.width,el.height, array, el.type);
					if (el.properties && el.properties.z_index) 
					{
						//console.log("Custom z-index");
						Layers["Z-index"][el.properties.z_index].add(s);
					}
					else
					{
						Layers["Z-index"][5].add(s);
					}
					s.body.setCollisionGroup(HoleCG);
					s.SavedCollision = [playerCG ,ennemyCG];
					
					Objects.push(s);
					break;
			}
		}
	}
	Layers["InteractObjects"] = Objects;


	/* Teleporting */
	if (_Map.objects.Teleport) 
	{
		//console.log("Teleporting");
		var TeleportArray = [];
		var TeleportZone = [];
		for (el of _Map.objects.Teleport) 
		{
			if (el.visible) 
			{
				if(el.type == "TeleportZone")
				{
					TeleportZone[el.properties.index] = {x: el.x, y: el.y};
				}
			}
		}
		//console.log(TeleportZone);
		for (el of _Map.objects.Teleport) 
		{
			if (el.visible) 
			{
				if(el.type == "Teleport")
				{
					var area = TeleportZone[el.properties.index]
					var t = new Teleport( _Game, el.x, el.y, el.width,el.height, area.x, area.y);
					t.body.setCollisionGroup(teleportCG);
					t.body.collides([playerCG],t.teleportPlayer);
					TeleportArray.push(t);
				}
			}
		}
		//console.log(TeleportArray);
	}

	/* Boss Wall */
	if (_Map.objects.BossWall) 
	{
		var array = [];
		for (el of _Map.objects.BossWall) 
		{
			if (el.visible) 
			{
				var wall = new BossWall( _Game, el.x, el.y, el.width,el.height, el.type);
				wall.body.setCollisionGroup(blockCG);
				wall.body.collides([playerCG, bossCG]);	
				array[el.name-1] = wall;
				if (el.type == "CornerDL" || el.type == "CornerDR" || el.type == "Down") {
					Layers["Z-index"][6].add(wall);
				}
				else 
				{
					Layers["Z-index"][5].add(wall);
				}
						
			}
		}
		Layers["BossWall"] = array;
	}
	if (_Map.objects.InterractionsBoss) {
		Layers["BossInterractions"] = _Map.objects.InterractionsBoss
	}
		
	/* Dial Area */
	if(_Map.objects.DialAreas)
	{
		//console.log("Teleporting");
		var DialAreas = {};
		for (el of _Map.objects.DialAreas) 
		{
			if (el.visible) 
			{
				var dialArea = new DialArea(_Game, el.name, el.x, el.y, el.width, el.height);
				DialAreas[el.name] = dialArea;
			}
		}
		Layers["DialAreas"] = DialAreas;
		//console.log(TeleportArray);
	}

	/*  Exit  */
	//console.log("Exit");
	var Exit = _Map.objects.Exit[0]; //(x,y,width,height);
	var out = new Out(_Game,Exit.x,Exit.y,Exit.width,Exit.height);
		out.body.setCollisionGroup(exitCG);
		out.body.static = true;
		out.body.collides([playerCG], out.Exit);

	//console.dir(Exit);

	/* Player Start */
	//console.log("StartPosition");
	//console.log(_Map.objects.StartPosition[0]);
	var StartPosition = _Map.objects.StartPosition[0];
	//console.dir(StartPosition);
	var myPlayer = new Player(_Game, StartPosition.x, StartPosition.y);
	myPlayer.body.setCollisionGroup(playerCG);
	myPlayer.body.collides([tilesCG, ennemyCG, exitCG, switchCG, doorCG, spikeCG, HoleCG, fovCG, teleportCG, blockCG]);
	myPlayer.body.collides([soulCG],myPlayer.GetSoul);
	myPlayer.body.collides([bossCG],function(){console.log("outch")});
	
	Layers["Z-index"][5].add(myPlayer);
	Application.Player = myPlayer;

	var pauseMenu = new PauseMenu(_Game);

	return Layers;
}