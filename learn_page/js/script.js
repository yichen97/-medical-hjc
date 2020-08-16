var container = document.querySelector('.container');
container.onclick = function(ev){
    var ev = ev || window.event;
    var target = ev.target || ev.srcElement;
    switch(target.className){
        case 'preview' :
            showImageOutside(target);
            break;
        case 'ply' :
            showFloatDiv(event);
            break;
        case 'arrow_left':
            var flag = -1;
            //表示前进一页
            playList(flag);
            break;
        case 'arrow_right':
            var flag = 1;
            playList(flag);
            break;
    }
    const float_div = document.querySelector('div.float'); 
    if(float_div.style.display === "block" && target.className !=="ply"){ 
        float_div.style.display = "none";
        console.log(float_div.style.display)  
    }
}

function playList(flag){
        var layers = document.querySelectorAll('.layer');
        var arrow_left = document.querySelector('.arrow_left');
        var arrow_right = document.querySelector('.arrow_right');

        for (let i=0;i<layers.length;i++){    
            if(layers[i].style.display == "block"){
                layers[i].style.display = "none";
                var then_layer = getNearEle(layers[i], flag);
                console.log(i);
                then_layer.style.display = "block";
                arrow_left.style.display = "block";
                arrow_right.style.display = "block";
                if( i+flag === 0 ){
                    arrow_left.style.display = "none";
                }
                if( i+flag === layers.length-1){
                    arrow_right.style.display ="none";
                }
                break;
            }      
        }
    

}

function getNearEle(ele, type) {
    type = type == -1 ? "previousElementSibling" : "nextElementSibling";
    eval("var node = ele." + type+ ";");
    return node;
  }

function showImageOutside(target){
    var layers = document.querySelectorAll('div.layer'); 
    var bgImage = target.style['background-image'];
    var arrow_left = document.querySelector('.arrow_left');
    var arrow_right = document.querySelector('.arrow_right');

    // 将对应的图片设置为显示，其他则不显示
    for (let i=0;i<layers.length;i++){    
        layers[i].style.display = "none";
        if (layers[i].style['background-image'] === bgImage){
            layers[i].style.display = "block";
            arrow_left.style.display = "block";
            arrow_right.style.display = "block";
            if( i === 0 ){
                arrow_left.style.display = "none";
            }
            if( i === layers.length-1){
                arrow_right.style.display ="none";
            }
        }      
    }
}

function showFloatDiv(event) {
    // 漂浮块的定位方式应该为绝对定位  
    const float_div = document.querySelector('div.float');
    const close_float = document.querySelector('div.close_float');
    float_div.style.left = event.pageX + 10 + "px";
    float_div.style.top = event.pageY  + 10 + "px";
    float_div.style.display = "block";

    close_float.onclick = function() {
        float_div.style.display = "none";
    }
}
