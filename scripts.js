const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const photoSound = document.querySelector('.snap')
const strip = document.querySelector('.strip')
const width = canvas.width;
const height = canvas.height;
let activeEffect = null

navigator.mediaDevices.getUserMedia({ video: true, audio: false})
.then(stream => video.srcObject = stream)
.catch(err => console.error(err + ': Please grant access to media tools'))


function printVideoToScreen() {

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height)

        let pixels = ctx.getImageData(0, 0, width, height)

        if (activeEffect) {
            pixels = activeEffect(pixels)
        }

        ctx.putImageData(pixels, 0, 0)

    }, 16)
}

function takePhoto(){
photoSound.currentTime = 0
photoSound.play();
const url = canvas.toDataURL('image/webp')
const anchorTag = document.createElement('a');
anchorTag.href = url;
anchorTag.setAttribute('download','')
anchorTag.innerHTML = `
<img src=${url} />
`
strip.appendChild(anchorTag)
}


function invertedColors(pixels) {

    for (i = 0; i < pixels.data.length; i +=4){
pixels.data[i] = 255 - pixels.data[i]
pixels.data[i+1] = 255 - pixels.data[i+1]
 pixels.data[i+2] = 255 - pixels.data[i+2]       
    }
return pixels
}

function ghostMode(pixels) {

    ctx.globalAlpha =0.6

    for (i = 0; i < pixels.data.length; i +=4){
pixels.data[i] = pixels.data[i - 50]
pixels.data[i+1] = pixels.data[i+50]
 pixels.data[i+2] = pixels.data[i+30]       
    }
return pixels
}

function snow(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4)
    {
    pixels.data[i] = 255 - Math.floor(Math.random() * pixels.data[i])
    pixels.data[i+1] = 255 - Math.floor(Math.random() *  pixels.data[i+1])
    pixels.data[i+2] = 255 - Math.floor(Math.random() * pixels.data[i+2])
}
return pixels
}


function activateEffect(){
    const fxBtn = document.querySelectorAll('.effect-btn')
    fxBtn.forEach((btn, i) => {
        btn.addEventListener('click', ()=>{
            if(i === 0){
            activeEffect = invertedColors
            } else if (i === 1) {
                activeEffect = ghostMode
            } else if (i === 2) {
                activeEffect = snow
            } else if (i === 3) {
                activeEffect = null

            }
            
        })
    })

    console.log(fxBtn)
}

activateEffect()

video.addEventListener('canplay', printVideoToScreen)