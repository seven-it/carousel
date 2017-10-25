/*
 * Move.js
 * obj:要运动的元素
 * json: 要改变的属性与运动终点的集合
 * options: 运动时长,运动状态和回调函数的集合
 * 用法示例：move(obj,{'width':200,'height':200},{'duration':1000,'easing':'ease-out','complete':fn})
 * obj，json为必选参数，options为可选参数；
*/

;function move(obj,json,options){
	var options = options || {};
	var duration=options.duration || 800;//运动持续时间
	var easing=options.easing || 'linear';//运动状态
	var start = {};//初始值
	var dis={};//终点值
	var cont = Math.ceil(duration/30);//计算规定时间内运动次数
	var n=0;//计数器

	//循环json对象
	for(name in json){
		//获取json对象中各个属性的初始值（样式）
		start[name] = parseFloat(getComputedStyle(obj,false)[name]);
		//json中传入的终点值 - 获取后的初始值 = 总路程
		dis[name] = json[name]-start[name];
	}

	//定时器
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		//开始计数
		n++;
		for(name in json){
			switch(easing){
				case 'linear':
					var a = n/cont;//已经走过的路程比例 
					var cur = start[name]+dis[name]*a;//要走的路程
					break;
				case 'ease-out':
					var a = 1-n/cont;
					var cur = start[name]+dis[name]*(1-a*a*a);
					break;
				case 'ease-in':
					var a = n/cont;
					var cur = start[name]+dis[name]*a*a*a;
					break;
			}
			// 判断属性是否是 'opacity'
			if(name == 'opacity'){
				obj.style.opacity=cur;
			}else{
				obj.style[name]=cur+'px';
			}
			//已走的次数是否等于总次数
			if(n == cont){
				clearInterval(obj.timer)
				// 回调函数
				options.complete && options.complete();
			}
		}
	},30)
}