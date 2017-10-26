/**
 * 插件名: carousel.js
 * 版本：1.01
 */
;(function (){
    //初始化判断当前页的布尔值
    var ib = false;
    //构造函数
   var Carousel = function (carrousel){
        var calSelf = this;
        
        this.carrousel = carrousel;
        //获取 UL
        this.carrouselItemMain = this.carrousel.querySelector('.rotate-ul')
        //获取左右按钮
        this.prevBtn = this.carrousel.querySelector('.prev');
        this.nextBtn = this.carrousel.querySelector('.next');
        //获取图片数量
        this.carrouselItems = this.carrouselItemMain.querySelectorAll('.carrousel-item');
        // 获取第一张图片
        this.carrouselFir = this.carrouselItemMain.firstElementChild;
        // 最后一张图片
        this.carrouselLat = this.carrouselItemMain.lastElementChild;
        this.rotoFlag = true;
        //设置默认值
        this.Settings = {
            "width" :1000,//轮播模块总宽
            "height":270, //轮播模块总高
            "carrouselWidth":600,//第一张图片的宽度
            "carrouselHeight":270,//第一张图片的高度
            "scale":0.9,//缩放比例
            "setOpacity":0.6,//透明度
            "autoPlay":true,//是否自动轮播
            "timeSpan":3000,//轮播间隔时间
            "imgSpacing":40,//图片之间的间隔
            "verticalAlign":'top'//图片top位置
        }
        //自定义默认值
        this.Settings = this.extendObj(this.Settings,this.getSetting())
        //设置图片相对位置
        this.setPic();
        //点击切换下一张
        this.nextBtn.onclick = function (){
            //防止多次点击
            if(calSelf.rotoFlag){
                calSelf.carrouselRote('left')
            }
            calSelf.rotoFlag=false;   
        }
        
        this.prevBtn.onclick = function (){
            if(calSelf.rotoFlag){
                calSelf.carrouselRote('right')
            }
            calSelf.rotoFlag=false;
        }
        //判断是否自动轮播
        if(this.Settings.autoPlay){
            this.autoPlay();
            this.carrousel.onmouseover=function(){
                clearInterval(calSelf.timer);
            }
            this.carrousel.onmouseout = function(){
                calSelf.autoPlay();
            }
        };
    };

    
    //初始化对象方法
    Carousel.init=function (carrousels){
        var _this = this;
        //获取节点对象转化为数组
        var cals = toArray(carrousels);
        cals.forEach(function(item,index,array){
            new _this(item);
        })
    };
    //设置原型
    Carousel.prototype = {
        autoPlay:function(){
            var _this = this;
            clearInterval(_this.timer)
            _this.timer = setInterval(function(){
                //判断用户浏览是否为当前页面
                //yes   执行
                //no   不用理会
                if(!window.ib){
                    _this.carrouselRote('left')
                }
            },_this.Settings.timeSpan);
        },
        carrouselRote:function(dir){
            var _this = this;
            //初始化 每个图片的样式属性
            var tempWidth,
                tempHeight,
                tempZIndex,
                tempOpacity,
                tempTop,
                tempLeft;
            
            if(dir == 'left'){
                //向左轮播时 第一张图片的样式属性等于最后一张
                tempWidth = _this.carrouselLat.offsetWidth;
                tempHeight = _this.carrouselLat.offsetHeight;
                tempZIndex = _this.carrouselLat.style.zIndex;
                tempOpacity = _this.carrouselLat.style.opacity;
                tempTop = _this.carrouselLat.offsetTop;
                tempLeft = _this.carrouselLat.offsetLeft;
                //循环 每张图片
                toArray(this.carrouselItems).forEach(function(item,index,array){
                    //判断是否为第一张图片，如果是，那么第一张的样式属性 就 等于最后一张图片的样式属性
                    if(index == 0){
                        var width=tempWidth;
                        var height=tempHeight;
                        var zIndex=tempZIndex;
                        var opa=tempOpacity;
                        var top=tempTop;
                        var left=tempLeft; 
                    }else{
                        //其它图片的样式属性 等于 它前一个节点的样式属性
                        //假如有五张图片 那么就是下面这样循环
                        //  1-> 5 -> 4 -> 3 -> 2 ->1  
                        var width  = item.previousElementSibling.offsetWidth;
                        var height = item.previousElementSibling.offsetHeight;
                        var zIndex = tempZIndex;
                        var opa  = item.previousElementSibling.style.opacity;
                        var top  = item.previousElementSibling.offsetTop;
                        var left = item.previousElementSibling.offsetLeft;
                    }
                    //由于第一个图片的变化 导致第二张图片获取不到第一张的opacity,所以这里判断一下
                    if(!opa){
                        opa=1;
                    }

                    //小bug  由于图片的排列顺序  左侧图片z-index是反着的，但是不影响效果。
                    tempZIndex = item.style.zIndex;
                    item.style.zIndex=zIndex;

                    //运动函数调用，最后的回调保证每次点击时图片都已经运动完成
                    move(item,{'left':left,'width':width,'top':top,'height':height,'opacity':opa},{'complete':function(){
                        _this.rotoFlag=true;
                    }});  
                })
            }

            if(dir == 'right'){
                //向右侧轮播，将左侧轮播反向设置
                //最后一张图片的 样式属性 等于 第一张的样式属性
                tempWidth = _this.carrouselFir.offsetWidth;
                tempHeight = _this.carrouselFir.offsetHeight;
                tempZIndex = _this.carrouselFir.style.zIndex;
                tempOpacity = _this.carrouselFir.style.opacity;
                tempTop = _this.carrouselFir.offsetTop;
                tempLeft = _this.carrouselFir.offsetLeft;

                toArray(this.carrouselItems).forEach(function(item,index,array){
                    //最后一张图片的样式属性等于第一张的样式属性
                    if(index == (array.length-1)){
                        var width=tempWidth;
                        var height=tempHeight;
                        var zIndex=tempZIndex;
                        var opa=tempOpacity;
                        var top=tempTop;
                        var left=tempLeft; 
                    }else{
                        //其它图片的样式属性 等于 它 后 一个节点的样式属性
                        //假如有五张图片 那么就是下面这样循环
                        //  5 -> 1 -> 2 -> 3 -> 4 -> 5
                        var width  = item.nextElementSibling.offsetWidth;
                        var height = item.nextElementSibling.offsetHeight;
                        var zIndex = item.nextElementSibling.style.zIndex;
                        var opa  = item.nextElementSibling.style.opacity;
                        var top  = item.nextElementSibling.offsetTop;
                        var left = item.nextElementSibling.offsetLeft; 
                    }
                    //与上面一样
                    if(!opa){
                        opa=1;
                    }

                    item.style.zIndex=zIndex;

                    move(item,{'left':left,'width':width,'top':top,'height':height,'opacity':opa},{'complete':function(){
                        _this.rotoFlag=true;
                    }});  
                })
            }    
            
        },
        getSetting:function (){
            //获取自定义属性
            var setting = this.carrousel.getAttribute('data-setting');
            if(setting&&setting!=null){
                //字符串转化为json格式
                setting = JSON.parse(setting);
                return setting;
            }else{
                return {};
            }
        },
        setCarrouselAlign:function (height){
            //判断 top 效果
            var type = this.Settings.verticalAlign;
            var top = 0;
            switch(type){
                case 'middle':
                    top = (this.Settings.height-height)/2;
                    break;
                case 'top':
                    top = 0;
                    break;
                case 'bottom':
                    top =this.Settings.height-height;
                    break;
                default:
                    top = (this.Settings.height-height)/2;
            }
            return top;
        },
        setPic:function (){
            var btnW = (this.Settings.width-this.Settings.carrouselWidth)/2;
             //初始化 整体布局
            this.carrousel.style.width = this.Settings.width+'px';
            this.carrousel.style.height = this.Settings.height+'px';

            //按钮设置
            this.prevBtn.style.width = btnW+'px';
            this.prevBtn.style.height = this.Settings.height+'px';
            this.prevBtn.style.zIndex = toArray(this.carrouselItems).length;

            this.nextBtn.style.width = btnW+'px';
            this.nextBtn.style.height = this.Settings.height+'px';
            this.nextBtn.style.zIndex = toArray(this.carrouselItems).length;

            //获取所有图片 转化为数组
            var sliceItems = toArray(this.carrouselItems);
            // 获取最在中间那张图片的index值
            var cItemIndex = Math.floor(sliceItems.length/2);
            //截取中心图片
            var itemCenter = sliceItems.slice(cItemIndex,cItemIndex+1);
            //设置样式属性，由于截取的数组 所以后面要加索引
                itemCenter[0].style.left = btnW+'px';
                itemCenter[0].style.top = this.setCarrouselAlign(this.Settings.carrouselHeight)+'px';
                itemCenter[0].style.width = this.Settings.carrouselWidth+'px';
                itemCenter[0].style.height = this.Settings.carrouselHeight+'px';
                itemCenter[0].style.zIndex = cItemIndex;
            //截取 中心图片之后的图片元素
            var rightSlice = sliceItems.slice(cItemIndex+1); 
            //截取 中心图片之前的图片元素
            var leftSlice = sliceItems.slice(0,cItemIndex).reverse();
               
            var level = Math.floor(this.carrouselItems.length/2);
            // 获取中心 的left值
            var firLeft = btnW;
            // 获取opacity的值
            var setOpt = this.Settings.setOpacity;

            var carrouselSelf = this;
            //获取图片大小
            var rw=lw= this.Settings.carrouselWidth;
            var rh=lh= this.Settings.carrouselHeight;
            //获取图片间隔
            var spacing = this.Settings.imgSpacing;
            var contOffset = firLeft+rw;

            var rightIndex = level;
            rightSlice.forEach(function(item,index,array){
                rightIndex--;
                //透明度渐变
                var ropt = index;
                //计算宽高
                rw = Math.floor(rw*carrouselSelf.Settings.scale);
                rh = Math.floor(rh*carrouselSelf.Settings.scale);

                item.style.zIndex = rightIndex;
                item.style.width = rw+'px';
                item.style.height = rh+'px';
                item.style.opacity = Math.pow(setOpt,++ropt);
                item.style.left = (contOffset+(ropt)*spacing-rw)+'px';
                item.style.top = carrouselSelf.setCarrouselAlign(rh)+'px';
            });

            //左侧图片位置 ，与右侧设置基本相同

            leftSlice.forEach(function(item,index,array){
                var lopt = index;
                var i = index;

                lw = Math.floor(lw*carrouselSelf.Settings.scale);
                lh = Math.floor(lh*carrouselSelf.Settings.scale);
                
                item.style.zIndex = i;
                item.style.width = lw+'px';
                item.style.height = lh+'px';
                item.style.opacity = Math.pow(setOpt,++lopt);
                //由于左侧图片left未知 所以先求出右侧位置后再设置左侧left；
                item.style.right = (contOffset+(lopt)*spacing-lw)+'px';
                item.style.top = carrouselSelf.setCarrouselAlign(lh)+'px';   
                //设置左侧left
                item.style.left = item.offsetLeft+'px';
            })
        },
        extendObj:function (){
          // 仿jq $.extend方法
            var args = arguments;
            if(args.length < 2){
                return;
            }else{
                var temp = {};
                for(var i=0;i<args.length;i++){
                    for(var item in args[i]){
                        temp[item]=args[i][item];
                    }
                }
                return temp;
            }
        }
    }
    
    window.onload = function(){
        Carousel.init(document.querySelectorAll('.rotate-box'));
    }
    //用户离开当前页面时关闭定时器
    window.onblur=function(){
        this.ib = true;
    }
    //用户回到当前页面时开启定时器
    window.onfocus=function(){
        this.ib = false;
    }
    
    //伪数组转化为真正数组方法
    function toArray (list){
        return Array.prototype.slice.call(list);
    }  
})()