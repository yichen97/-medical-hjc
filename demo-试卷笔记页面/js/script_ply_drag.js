const container = document.querySelector('.container');
const layer = document.querySelector('.layer');
const button = document.querySelector('.btn');
const coordinatList = new Array();
// 按钮按下新建播放图标，并为图标绑定拖拽事件
button.addEventListener('click', addPly);

var n=1;
function addPly(){
    var ply = document.createElement('div');
    ply.setAttribute('class', "ply");
    ply.setAttribute('id', "ply"+ String(n++));
    layer.appendChild(ply);
    ply.addEventListener('mousedown', dragAround);
    ply.addEventListener('click', showFloatDiv);
        
    var first =true;
    var dataList = new Array(4);
    function dragAround(event){

    if (first){
        dataList[0] = event.pageX;
        dataList[1] = event.pageY;
    };

    container.onmousemove = function(event){
        x = event.pageX;
        y = event.pageY;
        first = false;
        dataList[2] = x - dataList[0] + 'px';
        dataList[3] = y - dataList[1] + 'px';
        // button不能超出layer层
        if((x - dataList[0])>=0 && (y - dataList[1])>=0){
            ply.style.left = dataList[2];
            ply.style.top = dataList[3];
        }
        
        
    };
    
    container.onmouseup = function(){
        container.onmousemove = null;
        container.onmouseup = null;
    };
    };
};

function showFloatDiv(event) {
    const float_div = document.querySelector('div.float');
    const close_float = document.querySelector('div.close_float');
    float_div.style.left = event.pageX + 20 + "px";
    float_div.style.top = event.pageY + 20 + "px";
    float_div.style.top = event.pageY;
    float_div.style.display = "block";

    close_float.onclick = function() {
        float_div.style.display = "none";
    }

}