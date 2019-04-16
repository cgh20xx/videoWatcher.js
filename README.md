# VideoWatcher.js

讓你可以偵聽影片播放時任意位置。

VideoWatcher 第1個參數為影片路徑

VideoWatcher 第2個參數為陣列 支援3種單位 ('sec', 'ms', '%')

[DEMO](https://cgh20xx.github.io/VideoWatcher.js/index.html)

```javascript
// VideoWatcher 回傳的是原生 HTML Video Element
var video = VideoWatcher(videoSrc, [
    '0sec',
    '3sec',
    '5500ms',
    '75%',
    '100%'
]);

// 偵聽事件 'pass:' + 指定的時間點
video.addEventListener('pass:0sec', function(e) {
    console.log(e.detail.original)
});

video.addEventListener('pass:3sec', function(e) {
    console.log(e.detail.original);
});

video.addEventListener('pass:5500ms', function(e) {
    console.log(e.detail.original);
});

video.addEventListener('pass:75%', function(e) {
    console.log(e.detail.original);
});

video.addEventListener('pass:100%', function(e) {
    console.log(e.detail.original);
});

document.body.appendChild(video);

video.play();
```