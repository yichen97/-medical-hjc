const lis = document.querySelectorAll('li.section');

for (let i=0;i<lis.length;i++){
    lis[i].children[0].style['background-image']="url(image/bg" + String(i+1) +".jpg)";
    lis[i].children[0].addEventListener('click', showImageOutside)
    
}

const add_btns = document.querySelectorAll('div.add_section');
for (let i=0;i<add_btns.length;i++){
    add_btns[i].addEventListener("click", addSection);
}

function addSection(){
    // 增加新的节（包括节点和按钮），为节点设置空白北京 
    var li = document.createElement("li");
    li.setAttribute("class", "section")
    li.innerHTML = '<div class="preview"></div><div class="add_section"></div>';
    li.children[0].style['background-image']="url(image/blank_bg.jpg)";
    li.children[1].addEventListener('click', addSection)
    insertAfter(li, this)
}

function showImageOutside(){
    var bgImage = this.style['background-image'];
    const layer = document.querySelector('.layer');
    layer.style['background-image'] = bgImage;
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