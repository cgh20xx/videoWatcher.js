# VideoWatcher.js

讓你可以偵聽影片播放時任意位置。

VideoWatcher 第1個參數為影片路徑

VideoWatcher 第2個參數為陣列 支援3種單位 ('sec', 'ms', '%')

[DEMO](https://cgh20xx.github.io/VideoWatcher.js/index.html)

```javascript
var videoSrc = 'yourVideoUrl';
var video = new VideoWatcher(videoSrc, [
    '0sec',
    '1sec',
    '3sec',
    '5500ms',
    '25%',
    '50%',
    '75%',
    '100%'
]);

video.width = 320;
video.controls = true;
wrapper.appendChild(video);

function log(msg) {
    var li = document.createElement('li');
    li.textContent = msg;
    console.log(msg);
    watchList.appendChild(li);
}

// 偵聽事件 'pass:' + 指定的時間點
video.addEventListener('pass:0sec', function(e) {
    log(e.detail.original);
});

video.addEventListener('pass:1sec', function(e) {
    log(e.detail.original);
});

video.addEventListener('pass:3sec', function(e) {
    log(e.detail.original);
});

video.addEventListener('pass:5500ms', function(e) {
    log(e.detail.original);
});

video.addEventListener('pass:25%', function(e) {
    log(e.detail.original);
});

video.addEventListener('pass:50%', function(e) {
    log(e.detail.original);
});

video.addEventListener('pass:75%', function(e) {
    log(e.detail.original);
});

video.addEventListener('pass:100%', function(e) {
    log(e.detail.original);
});

video.play();
```