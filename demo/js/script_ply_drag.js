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
    soundRecord();
}

function soundRecord(){
    if(navigator.mediaDevices) {
        // 获取打开麦克风权限，以及stream对象
        navigator.mediaDevices.getUserMedia({
            audio: {
                sampleRate: 16000,
                channelCount: 2,
                volume: 1.0
            }
        })
        .then((stream) => {
            console.log(stream)
            var chunks = [];
            // 创建MediaRecorder对象，需要传入stream对象
            var mediaRecorder = new MediaRecorder(stream);
            var floatDiv = document.querySelector('.float');
            var startBtn = document.createElement('button');
            var stopBtn = document.createElement('button');
            floatDiv.appendChild(startBtn);
            floatDiv.appendChild(stopBtn);
            startBtn.innerText = '开始';
            stopBtn.innerText = '结束';
            // 开始
            startBtn.onclick = () => {
                // 开始录音 
                mediaRecorder.start();
            }
            // 结束
            stopBtn.onclick = () => {
                // 停止录音
                mediaRecorder.stop();
            }
    
            // 添加事件监听
            mediaRecorder.onstart = () => {
                console.log('start', mediaRecorder.state);

            }
            mediaRecorder.onstop = () => {
                console.log('stop', mediaRecorder.state);
                // 数据块合成blob对象
                var blob = new Blob(chunks, {type: 'audio/wav'});

                var audio = document.createElement('audio');
                var url = (window.URL || webkitURL).createObjectURL(blob);
                audio.src = url;
                audio.controls = true;
                floatDiv.appendChild(audio);              
                }
                
            mediaRecorder.ondataavailable = (e) => {
                console.log('data');
                console.log(e);
                chunks.push(e.data);
            }
        }).catch((e) => {
                console.log(e);
        })
    }
}

function createXHR(){
    //检查是否支持XMLHttpRequest
    if(typeof XMLHttpRequest!="undefined")
    {
        //支持，返回XMLHttpRequest对象
        return new XMLHttpRequest();
    }
    //如果不支持XMLHttpRequest，就检查是否支持ActiveXObject
    else if(typeof ActiveXObject !="undefined")
    {
        //检查activeXString
        if(typeof arguments.callee.activeXString!="string")
        {
            var versions=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],i,len;
            for(i=0,len=versions.length;i<len;i++)
            {
                try{
                    //看是否有可以支持的版本
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString=versions[i];
                    break;
                }
                catch(ex){
                    //跳过
                }
            }
        }
        //返回ActiveXObject
        return new ActiveXObject(arguments.callee.activeXString);
    }
    else
    {
        //都不行
        throw new Error("NO XHR object availablle");
    }
}