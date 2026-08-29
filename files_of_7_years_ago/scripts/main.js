let myImage = document.querySelector('img');

myImage.onclick = function() {
    let mySrc = myImage.getAttribute('src');
    if(mySrc === 'images/mbu-cat.jpg') {
        myImage.setAttribute('src', 'images/nvu-cat.jpg');
    } else {
        myImage.setAttribute('src', 'images/mbu-cat.jpg');
    }
}

function setHeading(name) {
    let myHeading = document.querySelector('h3');
    myHeading.textContent = '猫酷毙了，' + name + '!';
}

function setUserName() {
    let myName = prompt('请输入你的名字');
    localStorage.setItem('name', myName);
    setHeading(myName);
}

let storedName = localStorage.getItem('name');
if(!storedName) {
    setUserName();
} else {
    setHeading(storedName);
}

let myButton = document.querySelector('button');
myButton.onclick = setUserName;