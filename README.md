# videoWatcher.js

* 建立原生的 HTML5 Video 並可以偵聽影片任意時間點。

* 預設 video 為 `playsInline`、 `muted`

[DEMO](https://cgh20xx.github.io/videoWatcher.js/index.html)

## Example
```javascript
// videoWatcher 回傳的是原生 HTML Video Element
// 第1個參數為 video 路徑
// 第2個參數為想偵聽的時間點，支援3種單位。ex:['1sec', '3000ms', '50%']
var video = videoWatcher(videoSrc, [
    '0sec',
    '1.5sec',
    '3sec',
    '5500ms',
    '75%',
    '100%'
]);

// 偵聽事件 'progress:' + 指定的時間點
video.addEventListener('progress:0sec', function(e) {
    console.log(e.detail.original)
});

video.addEventListener('progress:1.5sec', function(e) {
    console.log(e.detail.original)
});

video.addEventListener('progress:3sec', function(e) {
    console.log(e.detail.original);
});

video.addEventListener('progress:5500ms', function(e) {
    console.log(e.detail.original);
});

video.addEventListener('progress:75%', function(e) {
    console.log(e.detail.original);
});

video.addEventListener('progress:100%', function(e) {
    console.log(e.detail.original);
});

document.body.appendChild(video);

video.play();
```