/**
 * Created by 3020mt on 2017/3/29.
 */
function $(id) {
    return typeof id=="string" ?document.getElementById(id):id;
}
window.onload=tab;

function tab() {
    // 标签的索引
    var index=0;
    var timer=null;

    var lis=$('notice-tit').getElementsByTagName('li');
    var divs=$('notice-con').getElementsByTagName('div');
    if(lis.length!=divs.length) return;

    for(var i=0;i<lis.length;i++){
        //给标签的ul赋值
        lis[i].id=i;
        //给每个标签添加滑动事件
        lis[i].onmouseover=function(){
            clearInterval(timer);
            // 用that这个变量来引用当前滑过的li
            changeOption(this.id);
        }
        lis[i].onmouseout=function(){
            if(timer){
                clearInterval(timer);
            }
            timer=window.setInterval(autoPlay,1000);
        }
    };
    if(timer){
        clearInterval(timer);
    }
    timer=window.setInterval(autoPlay,1000);

    function autoPlay() {
        changeOption(index);
        index++;
        console.log(index);
        if(index>=lis.length){
            index=0;
        }
    }

    function changeOption(curIndex) {
        for(var j=0;j<lis.length;j++){
            lis[j].className="";
            divs[j].style.display='none';
        }
        lis[curIndex].className="select";
        //查看当前标签的值，设置内容是否显示
        divs[curIndex].style.display="block";
    }

}


