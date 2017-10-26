## carousel.js
这是一个用原生js写的旋转木马轮播图插件，主要目的是为了练习原生js, 用到了面向对象的方法,通过这个练习对我的技术还是有很大帮助的。
### 重点 ！重点 ！ 重点 ！
* 如果您有更好的更简便的方法来完成这个插件 请分享给我！
* 如果您觉得这个插件对您有一些帮助的话    请右上角给个Star！
* {! _ !}！！！  QQ: 940258489

[展示链接](https://seven-it.github.io/carousel/) 

#### 主要参数
* "width" :1000,                //轮播模块总宽
*  "height":270,                //轮播模块总高
*  "carrouselWidth":600,        //第一张图片的宽度
*  "carrouselHeight":270,       //第一张图片的高度
*  "scale":0.9,                 //缩放比例
*  "setOpacity":0.6,            //透明度
*  "autoPlay":true,             //是否自动轮播
*  "timeSpan":3000,             //轮播间隔时间
*  "imgSpacing":40,             //图片之间的间隔
*  "verticalAlign":'top'        //图片top位置
*  "verticalAlign"  有三个选择 top、middle、bottom 

### 问题总结
#### 1.页面切换，轮播图发生错乱？
问题描述：当我切换到别的页面之后再切换回当前轮播页面，轮播图发生了错乱！

问题分析："浏览器页面切换后，页面的定时任务还是在不停执行，但是页面图片滚动动画效果由于浏览器控制（估计缓存起来了），一直没有得到执行；当你回到页面时，动画效果会累计连续一起把前面的动画效果执行了。" 这是我在知乎上看到描述，具体的没有办法验证，但是细想之后觉得应该差不了多少！

解决方法：利用window.onblur 和 window.onfocus 来监听用户是否处于当前页面。 如果不在 就不执行运动函数！

#### 2.window.onblur 事件中取值问题 
问题描述： 这是由第一个问题引发的问题，因为页面中我放了两个轮播模块，当我在window.onblur中执行clearInterval()时，每次都是第二个轮播生效，第一个无效！

问题分析： 我页面中有两个轮播模块，也就是有两个对象，当我在window.onblur中清除定时器时，由于window对象只有一个，监听事件也就只执行一次，所以后一个轮播对象会覆盖前一个轮播对象，也就只请除了最后的哪一个轮播对象！

解决方法： 在全局环境下初始化一个变量，变量的值为布尔值，利用window.onblur时间监测 并修改布尔值，在自动轮播函数中用if判断是否执行运动函数！

### 新增1.0.1版本 2017-10-26
#### 主要是修改了 js 中 setPic() 方法，1.0版本图片布局是以第一张图片为基准的，感觉这样的布局有点不是很合理，1.0.1版本改为以中心图为基准，例如有5张图片，以第3张为基准，这样在左右轮播时只需要跟随 上一张图片或者下一张图片的值来改变就可以，感觉上会更舒服也更合逻辑，js文件夹中两个版本都有保留，方便对比！！

