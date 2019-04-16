# VideoWatcher.js

* 建立原生的 HTML5 Video 並可以偵聽影片任意時間點。

* 預設 video 為 `playsInline`、 `muted`

[DEMO](https://cgh20xx.github.io/VideoWatcher.js/index.html)

## Example
```javascript
// VideoWatcher 回傳的是原生 HTML Video Element
// 第1個參數為 video 路徑
// 第2個參數為想偵聽的時間點，支援3種單位。ex:['1sec', '3000ms', '50%']
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