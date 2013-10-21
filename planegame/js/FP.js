/*
author: centre
refer to：hongkid
*/
Ext.ns("FP");

FP.Config={
	gameWidth:500,
	gameHeight:500,
	bgHeight:4200,
	containId:'contain',
	score:0
};
FP.Mrg = function(){
	var seed=0,
		config = FP.Config,
		isRunning = false,
		keylock=false,
		player1={},
		bg = {},
		emyPlanePool = {lv:{},die:{}},
		bulletPool = {lv:{},die:{}},
		process = 0,
		keyState = {up:false,down:false,left:false,right:false,fire:false};
		
	function rnd(s,e){
		return parseInt(Math.random()*(e)+s);
	}
	
	function initBg(){
		var gh = config.gameHeight,
			bh = config.bgHeight,
			gw = config.gameWidth,
			topval = gh-bh;
			bg.top = topval;
		var el = bg.el=Ext.DomHelper.append(config.containId, {tag: 'div', cls: 'bg',style:'height:'+bh+'px;width:'+gw+'px;top:'+topval+"px"}); 
		bg.scroll = function(){
			var l = el.offsetTop+1;
			if(l>=0)
			{
				l=0;
				showTips(3);
				isRunning=false;
			}
			el.style.top=l+"px";
			bg.top=l;
		}
		bg.reSet =function(){
			el.style.top=topval+"px";
		}
	}
	
	function createEnemyPlanes(num)
	{
		var cfg = FP.Config,
			w = cfg.gameWidth,
			dieEmyplanes = emyPlanePool.die,
			i=0;
		for(var it in dieEmyplanes)
		{
			if(i<num)
			{
				dieEmyplanes[it].run(rnd(0,10)*50,0);
				delete emyPlanePool.die[it];
				i++;
			}
		}
		for(i;i<num;i++)
		{
			var	h = new FP.EnemyPlane(player1);
			h.run(i*50,0);
		}
	}
	
	function showTips(type){
		var w = config.gameWidth,
			h=config.gameHeight,
			title = Ext.getDom("tipTitle"),
			tipbody = Ext.getDom("tipbody");
		switch(type)
		{
			case 0:
				title.innerHTML = 'Plane Game';
				tipbody.innerHTML="author：centre <br/>说明：按空格键开始，暂停，W-S-A-D控制上下左右，J发射子弹";
				break;
			case 1:
				title.innerHTML = '暂停中';
				tipbody.innerHTML="提示：按空格键继续";
				break;
			case 2:
				title.innerHTML = '游戏结束';
				tipbody.innerHTML="提示：按空格键重新开始";
				break;
			case 3:
				title.innerHTML = '恭喜你过关了';
				tipbody.innerHTML="提示：按空格键再玩一遍";
				break;
		}
		tipbody.curType = type;
		Ext.getDom("tips").style.display="";
	}
	
	function addEmyPlane(){
		var t = bg.top%100;
		if(t===0)
		{
			createEnemyPlanes(rnd(5,10));
		}
	}
	
	function initEvent(){
		Ext.get(document).on("keydown",function(e){
			switch(e.keyCode)
			{
				case 65:
					keyState.left = true;
					break;					
				case 68:
					keyState.right = true;
					break;
				case 87:
					keyState.up = true;
					break;
				case 83:
					keyState.down = true;
					break;
				case 74:
					keyState.fire = true;
					break;
				case 32:
					if(keylock)return;
					keylock=true;
					setTimeout(doAction,50);
					break;
				
			};
		}).on("keyup",function(e){
			switch(e.keyCode)
			{
				case 65:
					keyState.left = false;
					break;
					
				case 68:
					keyState.right = false;
					break;
				case 87:
					keyState.up = false;
					break;
				case 83:
					keyState.down = false;
					break;
				case 74:
					keyState.fire = false;
					break;
				case 32:
					keylock=false;
					break;
				
			};
		});
	}
	
	function runBullets(){
		var pool = bulletPool.lv;
		for(var i in pool)
		{
			pool[i].run();
		}
	}
	
	function runEmyPlanes(){
		var pool = emyPlanePool.lv;
		for(var i in pool)
		{
			pool[i].run();
		}
	}
	
	function run(){
		if(!isRunning)return;
		bg.scroll();
		runBullets();
		addEmyPlane();
		runEmyPlanes();
		if(player1.islive)
		{
			player1.comState();
			if(keyState.up)
			{
				player1.upRun();
			}
			else if(keyState.down)
			{
				player1.downRun();
			}
			
			if(keyState.left)
			{
				player1.leftRun();
			}
			else if(keyState.right)
			{
				player1.rightRun();
			}
			
			if(keyState.fire)
			{
				player1.fire();
			}
			
			if(keyState.pause)
			{
				isRunning=false;
				showTips(1);
			}
		}
		setTimeout(run,50);
	}
	
	function start(){
		isRunning=true;run();
	}
	
	function stop(){isRunning=false;}
	
	function reStart(){
		var planes_lv = emyPlanePool.lv
			planes_die = emyPlanePool.die,
			bullets_lv = bulletPool.lv,
			bullets_die = bulletPool.die;
			
		for(var i in planes_lv)
		{
			planes_lv[i].die();
		}
		for(var i in bullets_lv)
		{
			bullets_lv[i].die();
		}
		bg.reSet();
		player1.reSet();
		config.score=0;
		Ext.getDom("score").innerHTML=0;
		start();
	}
	
	function doAction(){
		var obj = Ext.getDom("tipbody");
		if(!obj.curType)obj.curType=0;
		switch(obj.curType)
		{
			case 0:
				start();
				obj.curType=1;
				obj.show = false;
				break;
			case 1:
				//process=1;
				if(!obj.show){
					isRunning=false;
					showTips(1);
					obj.show=true;
				}
				else
				{
					player1.lastFireTime=new Date().getTime();
					start();
					obj.show = false;
				}
				break;
			case 2:
			case 3:
				reStart();
				obj.curType=1;
				obj.show = false;
				break;
		}
		Ext.getDom("tips").style.display = obj.show?"":"none";
	}
	
	return {
		getId:function(){return seed++;},
		bulletPoolOpt:{
			getBullet:function(){
				var bulletpool_d = bulletPool.die;
				for(var i in bulletpool_d)
				{
					delete bulletpool_d[i];
					return b = bulletpool_d[i];
				}
			},
			add:function(bullet){bulletPool.lv[bullet.id]=bullet},
			del:function(bullet){
				delete bulletPool.lv[bullet.id];
				bulletPool.die[bullet.id]=bullet;
			}
		},
		emyPlanePoolOpt:{
			add:function(plane){
				emyPlanePool.lv[plane.id]=plane;
			},
			del:function(plane){
				delete emyPlanePool.lv[plane.id];
				emyPlanePool.die[plane.id]=plane;
			},
			get:function(){return emyPlanePool.lv}
		},
		init:function(){
				initBg();
				initEvent();
				player1 = new FP.PlayerPlane();
				//isRunning=true;
				//run();
		},
		gameOver:function(){
			setTimeout(function(){
				isRunning=false;
				showTips(2);
			},1000);
		}
	}
}();

FP.PlaneBase = function(){
	//this.el=Ext.DomHelper.append(contain, {tag: 'div', cls: 'heli',style:"display:none"}); 
	//this.id=FP.Mrg.getId();
	FP.PlaneBase.superclass.constructor.call(this);	
	this.x=0;
	this.y=0;
	//this.w=0;
	//this.h=0;
	this.islive = true;
	this.bulletType = 0;
	this.step = 3;
	this.fireSpan = 350;//发射子弹时间间隔
	this.lastFireTime = 0;//最后发射时间
	this.pid = FP.Config.containId;
}
Ext.extend(FP.PlaneBase, Ext.util.Observable, {
	setY:function(_y){
		this.y=_y;
		this.el.style.top=_y+"px";
	},
	setX:function(_x){
		this.x=_x;
		this.el.style.left=_x+"px";
	},
	setXY:function(_x,_y)
	{
		this.setX(_x);
		this.setY(_y);
	},
	die:function()
	{
		this.islive = false;
		this.el.style.display="none";
	},
	beHit:function(){
		this.islive = false;
		var This = this,el=this.el;
		var i = 0;
		var h = setInterval(function(){
			if(i==4){
				clearInterval(h);
				This.die();
			}
			el.className="explosion exp"+i;
			i++;
		},100)
	},
	fire:function(){}
});

FP.PlayerPlane = function(config){
	FP.PlayerPlane.superclass.constructor.call(this);
	Ext.apply(this, config);
	//this.pid="contain";
	this.el=Ext.DomHelper.append(this.pid, {tag: 'div', cls: 'plane m'});
	this.w=60;
	this.h=53;
	this.reSet();
}
Ext.extend(FP.PlayerPlane, FP.PlaneBase, {
	leftRun:function(){
		var el = this.el,l = el.offsetLeft-this.step;
		// el.className="plane l";
		if(l<=0)l=0;
		this.setX(l);
	},
	rightRun:function(){
		var el = this.el,
			l = el.offsetLeft+this.step,
			maxl=FP.Config.gameWidth-this.w;
			
		if(l>=maxl)l=maxl;
		// el.className="plane r";
		this.setX(l);
	},
	upRun:function(){
		var el = this.el,l = el.offsetTop-this.step;
		if(l<=0)l=0;
		this.setY(l);
	},
	downRun:function(){
		var el = this.el,
			l = el.offsetTop+this.step,
			maxl=FP.Config.gameHeight-this.h;
			
		if(l>=maxl)l=maxl;
		this.setY(l);
	},
	comState:function(){
		this.el.className="plane m";
	},
	bulletType0:function(){
		var x=this.x+22, //+10 remove change to +22
			y=this.y-10,
			opt = FP.Mrg.bulletPoolOpt,
			b=opt.getBullet();
		if(!b){b = new FP.Bullet()};
		b.run(x,y);
		opt.add(b);
	},
	fire:function(){
		var t =new Date().getTime(),lastfiretime = this.lastFireTime;
		if(lastfiretime==0||t-lastfiretime>this.fireSpan){
			this["bulletType"+this.bulletType]();
			this.lastFireTime = t;
		}
	},
	reSet:function(){
		var cfg = FP.Config;
		this.setXY((cfg.gameWidth-this.w)/2,cfg.gameHeight-this.h);//起始位置
		this.islive = true;
		this.el.style.display="";
	}
});

FP.EnemyPlane = function(target){
	FP.EnemyPlane.superclass.constructor.call(this);
	//Ext.apply(this, config);
	//this.pid="contain";
	this.id=FP.Mrg.getId();	
	this.target= target;
	this.el=Ext.DomHelper.append(this.pid, {tag: 'div', cls: 'heli'});
	this.w=65;
	this.h=56;
	this.islive=false;
	this.flyType=0;//0垂直向下飞行
	
}
Ext.extend(FP.EnemyPlane, FP.PlaneBase, {
	run:function(_x,_y){
		var el = this.el,plane=this.target;
		if(_x!=undefined)
		{
			el.className="heli";
			el.style.display="";
			this.islive = true;
			this.setXY(_x,_y);
			FP.Mrg.emyPlanePoolOpt.add(this);
			this.step = parseInt(Math.random()*(5)+3);
		}
		else
		{
			if(!this.islive)return;
			var hy = this.y,
				hx=this.x,
				px=plane.x,
				py=plane.y,
				cfg = FP.Config,
				maxX = cfg.gameWidth,
				maxY = cfg.gameHeight,
				xy = this.getNextPoint(hx,hy,px,py);
			this.setXY(xy.x,xy.y);
			if(hx>maxX||hy>maxY)
			{
				this.die();
				//this.beHit();
			}
			
			if(hx>px-this.w
				&&hy>py-this.h
				&&hx<px+this.w+plane.w
				&&hy<py+plane.h
				&&plane.islive
			)
			{
				plane.beHit();
				this.beHit();
				FP.Mrg.gameOver();
			}
		}
	},
	getNextPoint:function(hx,hy,px,py){
		var p=null;
		switch(this.flyType)
		{
			case 0:
				p= {x:hx,y:hy+this.step};
			break;
		}
		return p;
	},
	die:function()
	{
		this.islive = false;
		this.el.style.display="none";
		FP.Mrg.emyPlanePoolOpt.del(this);
	},
	bulletType0:function(){
	/*
		var x=this.x+10,
			y=this.y-10,
			opt = FP.Mrg.bulletPoolOpt,
			b=opt.getBullet();
		if(!b){b = new FP.Bullet()};
		b.run(x,y);
		opt.add(b);
		*/
	},
	fire:function(){
	/*
		var t =new Date().getTime(),lastfiretime = this.lastFireTime;
		if(lastfiretime==0||t-lastfiretime>this.fireSpan){
			this["bulletType"+this.bulletType]();
			this.lastFireTime = t;
		}
		*/
	}
});


FP.Bullet = function(config){
	Ext.apply(this, config);
	FP.Bullet.superclass.constructor.call(this);
	this.id=FP.Mrg.getId();	
	//this.pid="contain";
	this.el=Ext.DomHelper.append(this.pid, {tag: 'div', cls: 'bullet',style:"display:none"});
	this.w=11;
	this.h=10;
	this.islive=false;
	this.step = 6;
}
Ext.extend(FP.Bullet, FP.PlaneBase, {
	run:function(_x,_y){
		if(_x!=undefined)
		{
			this.el.style.display="";
			this.islive = true;
			this.setXY(_x,_y);
		}
		else
		{
			
			_y = this.el.offsetTop-this.step;
			if(_y>0)
			{
				this.setY(_y);
			}
			else
			{
				this.die();
			}
		}
		var pool=FP.Mrg.emyPlanePoolOpt.get();
		for(var it in pool)
		{
			var item = pool[it];
			if(
				this.x>item.x-this.w
				&&this.y>item.y-this.h
				&&this.x<item.x+this.w+item.w
				&&this.y<item.y+item.h
			)
			{
				item.beHit();
				this.die();
				var cfg = FP.Config;
				cfg.score+=10;
				Ext.getDom("score").innerHTML = cfg.score;
			}
		}
	},
	die:function(){
		var opt = FP.Mrg.bulletPoolOpt;
		this.el.style.display="none";
		this.islive = false;
		opt.del(this);
	}
});

