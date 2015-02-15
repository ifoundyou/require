//滑动模块
define(['zepto'],function($){
	//滑块类
	var Slide=function(opts){
			//私有属性
			var messages={},
				wrapWidth        ,
				wrapHeight       ,
				rotateNode       ,										//旋转体
				pages            ,										//集合			
				pageNum          ,										//基数
				pageNow          =0,									//当前元素
				pageNext         =null,									//下一个元素
				slideStartY      =0,									//触摸坐标
				slideDeltaY      =0,
				elementStyle     =document.createElement('div').style,	//style对象
				isUC             =RegExp("Android").test(navigator.userAgent)&&RegExp("UC").test(navigator.userAgent)? true : false,
				isWeixin         =RegExp("MicroMessenger").test(navigator.userAgent)? true : false,
				isiPhone         =RegExp("iPhone").test(navigator.userAgent)||RegExp("iPod").test(navigator.userAgent)||RegExp("iPad").test(navigator.userAgent)? true : false,
				isAndroid        =RegExp("Android").test(navigator.userAgent)? true : false;

			//构建结构background-image: url(src/media/0.jpg); background-size: cover; background-position: 50% 50%;	
			function build(opts){
				var target		=$('<section class='+opts.container+' style=width:100%;height:100%;>'),
					mid         =$('<div class='+opts.mid+' style=width:100%;height:100%;>').appendTo(target);
				opts.pages.forEach(function(page,index){
					$('<div class=page-con style=width:100%;height:100%;>')
					.appendTo($('<div class="page '+opts.pages[index].className+'" style=width:100%;height:100%;position:absolute;display:none;>').appendTo(mid))
					.css({
						'background-image'		:'url(static/media/'+index+'.jpg)',
						'background-size' 		:'cover',
						'background-position'	:'50% 50%'
					});
				});
				$(opts.wrap)
				.append(target)
				.find('.'+opts.pages[0].className).css('display','block');
				rotateNode=target;
				pages=mid.children();
				pageNum=opts.pages.length;
			}
			// 声明设备
			function declareDevice(){
				//判断设备的类型并加上class
				if(isPC()) $(document.body).addClass('pc');
				else $(document.body).addClass('mobile');
				if(isAndroid) $(document.body).addClass('android');
				if(isiPhone) $(document.body).addClass('iphone');

				// 判断是否有3d
				if(!hasPerspective()){
					rotateNode.addClass('transformNode-2d');
					$(document.body).addClass('no-3d');
				}else{
					rotateNode.addClass('transformNode-3d');
					$(document.body).addClass('perspective');
					$(document.body).addClass('yes-3d');
				}
			}
			//是否是pc
			function isPC(){ 
				var userAgentInfo = navigator.userAgent; 
				var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"); 
				var flag = true; 
				for (var v = 0; v < Agents.length; v++) { 
					if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; } 
				} 
				return flag; 
			}
			//3d侦测
			function hasPerspective(){
				var ret=prefixStyle('perspective') in elementStyle;
				if (ret&&'webkitPerspective' in elementStyle){
					injectStyle('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}',function(node,rule){
						ret = node.offsetLeft === 9 && node.offsetHeight === 3;
					});
				}
				return !!ret;
			}
			//适配css
			function prefixStyle(style){
				if(vendor()=== false)return false;
				if(vendor()==='')return style;
				return vendor() + style.charAt(0).toUpperCase() + style.substr(1);
			}
			// 判断浏览器内核类型
			function vendor() {
				var vendors=['t','webkitT','MozT','msT','OT'],
					transform,
					i=0,
					l=vendors.length;
				for (;i<l;i++){
					transform = vendors[i] + 'ransform';
					if (transform in elementStyle) return vendors[i].substr(0,vendors[i].length-1);
				}
				return false;
			}
			// 判断属性支持是否
			function injectStyle(rule,callback,nodes,testnames){
				var style,ret,node,docOverflow,
					div = document.createElement('div'),
					body = document.body,
					fakeBody = body || document.createElement('body'),
					mod = 'modernizr';
				if (parseInt(nodes,10)){
					while(nodes--){
						node = document.createElement('div');
						node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
						div.appendChild(node);
					}
				}
				style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
				div.id = mod;
				(body?div:fakeBody).innerHTML += style;
				fakeBody.appendChild(div);
				if ( !body ) {
					fakeBody.style.background = '';
					fakeBody.style.overflow = 'hidden';
					docOverflow = docElement.style.overflow;
					docElement.style.overflow = 'hidden';
					docElement.appendChild(fakeBody);
				}

				ret = callback(div, rule);
				if ( !body ) {
					fakeBody.parentNode.removeChild(fakeBody);
					docElement.style.overflow = docOverflow;
				} else {
					div.parentNode.removeChild(div);
				}

				return !!ret;
			}
			//发布消息
			function trigger(){

			}
			//订阅消息
			function listen(type,handler){
				messages[type]?(messages[type]=[]):messages[type].push(handler);
			}
			//开始事件
			function slideStart_handler(e){
				if(e.type==='touchstart'){
					slideStartY=e.touches[0].pageY;
				}
			}
			//滑动事件
			function slideMove_handler(e){
				e.preventDefault();
				if(e.type==='touchmove'){
					slideDeltaY=e.touches[0].pageY;
				}
				var _now=pageNow,
					delta=slideDeltaY-slideStartY,
					_next=next(e,delta,_now);
				transform(_now,_next,delta);
			}
			//页面转换
			function transform(now,next,delta){
				pages.css('display','none');
				pages.eq(now).css('display','block');
				pages.eq(next).css('display','block');
				pages.eq(now).css({
					'transform':'translate3d(0,'+delta+'px,0)'+' scale('+(1-Math.abs(delta/wrapHeight))+')'
				});
				pages.eq(next).css(prefixStyle('transform'),'translate3d(0,'+(delta+(delta?-wrapHeight:wrapHeight))+'px,0)')

			}
			//结束事件
			function slideEnd_handler(e){
				if(e.type==='touchend'){

				}
			}
			//开启翻页
			function startSlide(){
				pages.on('touchstart',slideStart_handler);
				pages.on('touchmove',slideMove_handler);
				pages.on('touchend',slideEnd_handler);
			}
			//关闭翻页
			function endSlide(){
				pages.off('touchstart',slideStart_handler);
				pages.off('touchmove',slideMove_handler);
				pages.off('touchend',slideEnd_handler);
			}
			//下一个元素
			function next(e,delta,now){
				var target;
				if(delta>0){
					target=pageNow-1;
				}else if(delta<0){
					target=pageNow+1;
				}
				if(target===-1){
					target=pageNum-1;
				}else if(target===pageNow){
					target=0;
				}
				return target;
			}
			//页面渲染
			function render(opts){
				wrapWidth  =$(opts.wrap).width();
				wrapHeight =$(opts.wrap).height();
				//渲染ui
				build(opts);
				//申明设备
				declareDevice();
				//启动翻页
				startSlide();
			}

			return{
				init:function(opts){
					render(opts);
				}
			}
		};
	return Slide;
});
