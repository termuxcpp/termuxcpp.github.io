var button = document.getElementById("login");
var password = document.getElementById("password");
var times = 0;

function button_enable () {
    button.disabled = false;
}

button.onclick = function(ev){
    if (password.value == "password"){
        window.location.href = "href.html";
    }
    else {
        times++;
        if (times === 1) {
            alert('密码错误，再试一次吧～');
        } else if (times === 2) {
            alert('哎呀，又错了，密码是 password 哦');
        } else if (times === 3) {
            alert('你真笨！密码就是 password 嘛！');
        } else {
            alert('超过三次了，大傻子！');
            button.disabled = true;
            window.setTimeout(button_enable, 60000);
        }
    }
}
