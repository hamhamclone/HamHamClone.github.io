'use strict'

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

var sound = new Howl({
  src: ['Cloudbreak.mp3'],
  loop: true
});

let started = false;

let newFrame = function(src, inx, iny, inzoom, arrx, arry, outx, outy, outzoom) {
    return {
        src:src,
        inx:600-inx,
        iny:400-iny,
        inzoom:inzoom,
        arrx:arrx,
        arry:arry,
        outx:600-outx,
        outy:400-outy,
        outzoom:outzoom
    };
}

let frames = [
    newFrame('xx',  300,200,'nil',  300,200,  300,200, 'in'),
    newFrame('00',  300,200, 'in',  103,224,  132,221, 'in'),
    newFrame('01',  151, 26,'out',  575, 60,  572, 67, 'in'),
    newFrame('02',  300,200, 'in',  423,144,  300,200, 'in'),
    newFrame('03',  300,200, 'in',  337,340,  337,340, 'in'),
    newFrame('04',  300,200, 'in',  449,137,  431, 83, 'in'),
    newFrame('05',  300,200, 'in',  164,238,  101,208, 'in'),
    newFrame('06',  490,118,'nil',  166,303,  125,376, 'in'),
    newFrame('07',  600,400,'nil',   36,218,    3,190,'nil'),
    newFrame('08',  600,200,'nil',   83,175,    0,200,'nil'),
    newFrame('09',  318,370, 'in',  211,160,  196,148, 'in'),
    newFrame('10',  417,390, 'in',   29,200,    0,200,'nil'),
    newFrame('11',  300,200, 'in',  324, 79,  327, 40, 'in'),
    newFrame('12',  300,400, 'in',  126,147,  156,141, 'in'),
    newFrame('13',  600,200,'nil',  288,345,  300,200,'nil'),
    newFrame('14',  300,200,'nil',  288,345,  300,200,'nil'),
    newFrame('15',  300,200,'nil',  288,345,  300,200,'nil'),
    newFrame('16',  300,200,'nil',  323, 36,  323,  0,'nil'),
    newFrame('17',  300,200,'out',  323, 75,  300,200,'out'),
    newFrame('18',  300,200,'out',  288,345,  300,200,'out')
];

for (let frame of frames) {
    frame.img_line = new Image();
    frame.img_line.src = 'birdseye_'+frame.src+'_line.png';
    frame.img_arr = new Image();
    frame.img_arr.src = 'birdseye_'+frame.src+'_arr.png';
}

let OUT_LENGTH = 60;
let IN_LENGTH = 45;
let ARR_LENGTH = 90;

let frameIndex = 0;
let animMode = 'ok'
let animIndex = 0;

function draw() {
    let frame = frames[frameIndex];
    let pfIndex = frameIndex-1;
    if (pfIndex < 0) { pfIndex+=frames.length; }
    let prevFrame = frames[pfIndex];
    
    ctx.globalAlpha = 1;
    ctx.fillStyle='#323760';
    ctx.fillRect(0,0,600,400);
    
    if (animMode == 'out') {
        let animFrac = 1-(animIndex/OUT_LENGTH);
        animFrac *= 1.5;
        if (animFrac > 1) { animFrac = 1; }

        let tx = (300*(1-animFrac) + prevFrame.outx*animFrac);
        let ty = (200*(1-animFrac) + prevFrame.outy*animFrac);
        let endScale = 1;
        if (prevFrame.outzoom == 'out') {
            endScale = 0.75;
        } else if (prevFrame.outzoom == 'in') {
            endScale = 1.25;        
        }
        let tz = (1*(1-animFrac) + endScale*animFrac);
        
        ctx.globalAlpha = 1-animFrac;
        ctx.save();
        ctx.translate(tx, ty);
        ctx.scale(tz, tz);
        ctx.translate(-300, -200);
        ctx.drawImage(prevFrame.img_line, 0, 0);
        ctx.drawImage(prevFrame.img_arr, 0, 0);
        ctx.restore();
    }
    if (animMode == 'in') {
        let animFrac = 1-(animIndex/IN_LENGTH);
        let tx = (300*animFrac + frame.inx*(1-animFrac));
        let ty = (200*animFrac + frame.iny*(1-animFrac));
        let startScale = 1;
        if (frame.inzoom == 'out') {
            startScale = 1.25;
        } else if (frame.inzoom == 'in') {
            startScale = 0.75;        
        }
        let tz = (1*(animFrac) + startScale*(1-animFrac));
        
        ctx.globalAlpha = animFrac;
        ctx.save();
        ctx.translate(tx, ty);
        ctx.scale(tz, tz);
        ctx.translate(-300, -200);
        ctx.drawImage(frame.img_line, 0, 0);
        ctx.restore();
    }
    if (animMode == 'arr') {
        let animFrac = 1-(animIndex/ARR_LENGTH);
        ctx.globalAlpha = 1;
        ctx.drawImage(frame.img_line, 0, 0);
        let alpha = animFrac*3-2;
        if (alpha > 0) {
            ctx.globalAlpha = alpha;
            ctx.drawImage(frame.img_arr, 0, 0);        
        }

    }
    if (animMode == 'ok') {
        ctx.globalAlpha = 1;
        ctx.drawImage(frame.img_line, 0, 0);
        ctx.drawImage(frame.img_arr, 0, 0);
    }
    
    if (animIndex > 0) {
        animIndex--;
    }
    if (animIndex <= 0 && animMode == 'out') { animMode = 'in'; animIndex = IN_LENGTH; }
    if (animIndex <= 0 && animMode == 'in') { animMode = 'arr'; animIndex = ARR_LENGTH; }
    if (animIndex <= 0 && animMode == 'arr') { animMode = 'ok'; }
    window.requestAnimationFrame(draw);
}

draw();

canvas.addEventListener('mousemove', function(event) {
    if (animMode != 'ok') {
        canvas.style.setProperty('cursor', 'auto');
        return;
    }
    let frame = frames[frameIndex];
    let dx = frame.arrx - event.offsetX;
    let dy = frame.arry - event.offsetY;
    console.log(dx, dy);
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 50) {
        canvas.style.setProperty('cursor', 'pointer');
    } else {
        canvas.style.setProperty('cursor', 'auto');
    }
});

canvas.addEventListener('click', function(event) {
    if (!started) {
        started = true;
        sound.play();
    }

    if (animMode != 'ok') {
        return;
    }
    let frame = frames[frameIndex];
    let dx = frame.arrx - event.offsetX;
    let dy = frame.arry - event.offsetY;
    console.log(dx, dy);
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 50) {
        canvas.style.setProperty('cursor', 'auto');
        frameIndex++;
        if (frameIndex >= frames.length) {
            frameIndex=0;
        } else {
            animMode = 'out'
            animIndex = OUT_LENGTH;
        }
    }
});
