/**
 * Created by 3020mt on 2017/3/29.
 */
function $(id) {
    return typeof id=="string" ?document.getElementById(id):id;
}

window.onload=function () {
    // 标签的索引
    var index=0;
    var timer=null;
    var lis=$('notice-tit').getElementsByTagName('li');
    var divs=$('notice-con').getElementsByTagName('div');
    if(lis.length!=divs.length) return;

    for(var i=0;i<lis.length;i++){
        //给标签的ul赋值
        lis[i].id=i;
        // 如果存在准备执行的定时器，立刻清除，只有当前停留时间大于500ms时才开始执行
        //JavaScript把null、undefined、0、NaN和空字符串''视为false，其他值一概视为true，因此上述代码条件判断的结果是true。
        if(timer){
            clearTimeout(timer);
            timer=null;
        }
        //给每个标签添加滑动事件
        lis[i].onmouseover=function(){
            // 用that这个变量来引用当前滑过的li
            var that=this;

         //滑动切换
            //遍历所有的标签，清楚选中状态
        /*    for(var j=0;j<lis.length;j++){
                lis[j].className="";
                divs[j].style.display='none';
            }
            that.className="select";
            //查看当前标签的值，设置内容是否显示
            divs[that.id].style.display="block";
     */

        //延时切换
            timer=window.setTimeout(function () {
                for(var j=0;j<lis.length;j++){
                    lis[j].className="";
                    divs[j].style.display='none';
                }
                that.className="select";
                //查看当前标签的值，设置内容是否显示
                divs[that.id].style.display="block";
            },1000);
        }
    };

}