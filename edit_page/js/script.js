//new
var container = document.querySelector('.container');
var lis = document.querySelectorAll('li.section');

//加载示例图片
for (let i=0;i<lis.length;i++){
    // 初始化，创建与section中预览图匹配的layer，并设置为不可见 
    var layer = document.createElement('div');  
    lis[i].children[0].style['background-image']="url(image/bg" + String(i+1) +".jpg)";
    layer.style['background-image'] = lis[i].children[0].style['background-image']; 
    layer.setAttribute('class', "layer");
    layer.setAttribute('id','layer' + String(i));  
    layer.style.display = 'none';
    container.appendChild(layer); 
}

// 设置事件委托，container中所有点击事件归纳到这里
container.onclick = function(ev){
    var ev = ev || window.event;
    var target = ev.target || ev.srcElement;
    switch(target.className){
        case 'preview' :
            showImageOutside(target);
            break;
        case 'add_section_btn':
            addSection(target);
            break;
        case 'add_ply_btn' :
            var ply = addPly();
            ply.addEventListener('mousedown', dragOrClick);
            break;
        case 'remove_ply' :
            removePly(target);
            break;
    }
    const float_div = document.querySelector('div.float'); 
    if(float_div.style.display === "block" && target.className !=="ply"){ 
        float_div.style.display = "none";
    }
}

function removePly(target){
    var ply = target.parentNode;
    console.log(ply.parentNode);
    ply.parentNode.removeChild(ply);

}

//全局变量储存坐标，应该有更好的方法。
//使用这种方法是，所有按钮的初始坐标应该一致，必须使用absolute格式。
var target_first_move = true;
var dataList = new Array(4);
function dragOrClick(event){
    var target = event.target;
    var parent_node = target.parentNode;
    // 计时器起点
    var firstTime = new Date().getTime();
    if (target_first_move){
        dataList[0] = event.pageX;
        dataList[1] = event.pageY; 
    }
    
    // 获取外部样式表中值的写法，内部样式用obj.style.attr
    // 获取元素大小信息，以便输出百分比坐标
    var parent_node_height = window.getComputedStyle(parent_node, false)['height'];
    var parent_node_width = window.getComputedStyle(parent_node, false)['width'];
    parent_node_height = parent_node_height.slice(0,parent_node_height.indexOf("px"));
    parent_node_width = parent_node_width.slice(0,parent_node_width.indexOf("px"));
    var target_height = window.getComputedStyle(target, false)['height'];
    var target_width = window.getComputedStyle(target, false)['width'];
    target_height = target_height.slice(0,target_height.indexOf("px"));
    target_width = target_width.slice(0,target_width.indexOf("px"));
    

    window.onmousemove = function(event){

        target_first_move = false;     
        x = event.pageX;
        y = event.pageY;          
        dataList[2] = (x - dataList[0])/parent_node_width  *100 ;
        dataList[3] = (y - dataList[1])/parent_node_height *100 ;
        var limit_x = (parent_node_height-target_height/2)/parent_node_height * 100-1;
        var limit_y = (parent_node_width - target_width/2)/parent_node_width * 100-1;

        // button不能超出layer层,当某一方向出界时，另一方向仍然正常滑动，放置视觉上的卡顿
        if(dataList[2]>=0 && dataList[3]>=0 && dataList[2]<=limit_x && dataList[3]<=limit_y){
            target.style.left = dataList[2] + '%';
            target.style.top = dataList[3] + '%';
        }else if(dataList[2]<0 && dataList[3]>=0 && dataList[2]<=limit_x && dataList[3]<=limit_y){
            target.style.left = 0 + '%';
            target.style.top = dataList[3] + '%';
        }else if(dataList[2]>=0 && dataList[3]<0 && dataList[2]<=limit_x && dataList[3]<=limit_y){
            target.style.left = dataList[2] + '%';
            target.style.top = 0 + '%';
        }else if(dataList[2]>=0 && dataList[3]>=0 && dataList[2]>limit_x && dataList[3]<=limit_y){
            target.style.left = limit_x + '%';
            target.style.top = dataList[3] + '%';
        }else if(dataList[2]>=0 && dataList[3]>=0 && dataList[2]<=limit_x && dataList[3]>limit_y){
            target.style.left = dataList[2] + '%';
            target.style.top = limit_y + '%';
        }
    }
    
    window.onmouseup = function(event){
            window.onmousemove = null;
            window.onmouseup = null;
            // 计时器终点，按下与抬起间隔小于200ms，认为时点击，呼出窗口
            var lastTime = new Date().getTime();
            if( (lastTime - firstTime) < 200){       
                showFloatDiv(event);        
            }
    }
}



function showImageOutside(target){
    var container = document.querySelector('div.container');
    let layers = document.querySelectorAll('div.layer'); 
    var bgImage = target.style['background-image'];
    let exist_flag = false;
    let n = 1;

    // 当前没有layer，直接创建
    if (! layers){
        var layer = document.createElement('div');        
        layer.setAttribute('class', "layer")
        layer.setAttribute('id','layer' + String(n++ +layers.length));
        layer.style.display = 'none';
        // 为layer创建配套的按钮
        container.appendChild(layer); 
        layer.style['background-image'] = bgImage;
        layer.style.display="block";
    }

    // 如果有layer，判断是否存在以该图为背景的layer,生成存在标注exist_flag
    for (let i=0;i<layers.length;i++){    
        layers[i].style.display = "none";
        if (layers[i].style['background-image'] === bgImage){
            exist_flag = true;
            layers[i].style.display = "block";
        }      
    }
    // 不存在，则创建layer
    if(!exist_flag){    
        const layer = document.createElement('div');   
        const container = document.querySelector('div.container');
        layer.setAttribute('class', "layer")
        layer.setAttribute('id','layer'+String(n++ +layers.length));
        container.appendChild(layer);   
        layer.style['background-image'] = bgImage;
        layer.style.display = 'block';
    }
}

function addSection(target){
    // 增加新的节（包括节点和按钮），为节点设置空白
    var li = document.createElement("li");
    li.setAttribute("class", "section")
    li.innerHTML = '<div class="preview"></div><div class="add_section_btn"></div>';
    li.children[0].style['background-image']="url(image/blank_bg.jpg)";
    insertAfter(li, target)
}

function addPly(){
    var ply = document.createElement('div');
    ply.setAttribute('class', "ply");
    ply.innerHTML = '<div class="remove_ply"></div>';
    var layer = getShowingLayer();
    if (layer){
        layer.appendChild(ply);
    }else {
        alert("尚未创建场景")
    }
    return ply
}

function getShowingLayer(){
    var layers = document.querySelectorAll('.layer')
    // 只在窗口中有背景时，向正在显示的背景中添加按钮
    if(layers.length){      
        for (let layer of layers){          
            if (layer.style.getPropertyValue('display') === "block"){
                return layer
            }
        }
    }
}

function showFloatDiv(event) {
    // 漂浮块的定位方式应该为绝对定位  
    const float_div = document.querySelector('div.float');
    const close_float = document.querySelector('div.close_float');
    float_div.style.left = event.pageX + 20 + "px";
    float_div.style.top = event.pageY  + 20 + "px";
    float_div.style.display = "block";

    close_float.onclick = function() {
        float_div.style.display = "none";
    }
}

function insertAfter(newEl, targetEl)
{
    var parentEl = targetEl.parentNode;
            
     if(parentEl.lastChild == targetEl)
     {
           parentEl.appendChild(newEl);
      }else
      {
           parentEl.insertBefore(newEl,targetEl.nextSibling);
       }            
}