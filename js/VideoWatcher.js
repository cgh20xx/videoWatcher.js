/**
 *  VideoWatcher.js
 *
 *  Author : Hank Hsiao
 */

 /**
  * custom event polyfill for IE 11 (>= 9 really) 
  * ref: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
  */
;(function () {
    if ( typeof window.CustomEvent === 'function' ) return false;
    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: null };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();

var unitConvertStrategy = {
    'sec': function(num, duration) {
        return num;
    },
    'ms': function(num, duration) {
        var sec = num / 1000;
        return sec;
    },
    '%': function(num, duration) {
        var percent = num / 100;
        var sec = duration * percent;
        return sec;
    }
};

/**
 * VideoWatcher
 * @param {String} src - video src
 * @param {Array} watchPoints - support 3 types unit. ex:['1sec', '3000ms', '50%']
 * @returns {Object} video
 */

function VideoWatcher(src, watchPoints) {
    if (!src) {
        throw Error('[VideoWatcher] src must be URL String.');
    }
    if (!Array.isArray(watchPoints)) {
        throw Error('[VideoWatcher] watchPoints must be an Array.');
    }
    var video = document.createElement('video');

    video.preload = 'auto';
    video.WebKitPlaysInline = true;
    video.playsInline = true;
    video.muted = true;
    
    var duration = 0;
    var watchPointsSort = [];

    /**
     * 將不同單位轉換為對應影片秒數
     * 1s -> 1
     * 500ms -> 5
     * 50% -> 10
     * @param {Number} duration
     * @param {Array} watchPoints
     */
    function convertToSecByDuration(duration, watchPoints) {
        // 將不同單位轉換為對應影片秒數
        var convertToSec = function(str) {
            var watchObj = {}
            if (typeof str !== 'string') throw Error('unit must be String');
            for (var unit in unitConvertStrategy) {
                var unitIndex = str.indexOf(unit); // 找出單位在字串的位置
                if (unitIndex !== -1) {
                    // 有找到正確的單位
                    var num = parseFloat(str.substring(0, unitIndex));
                    watchObj.sec = unitConvertStrategy[unit](num, duration);
                    break;
                }
            }
            if (watchObj.sec === undefined) throw Error('unit should be "sec" or "ms" or "%"')
            watchObj.original = str;
            watchObj.isDispatch = false; // 記錄是否發佈過事件
            return watchObj;
        };
        // 由小到大排序
        var sortByAsc = function(a, b) {
            return a.sec - b.sec;
        }

        return watchPoints.map(convertToSec).sort(sortByAsc);
    }

    function seekingHandler(e) {
        var currentTime = e.target.currentTime;
        var resetDispatch = function(watchObj) {
            watchObj.isDispatch = currentTime > watchObj.sec ? true : false;
        }
        watchPointsSort.forEach(resetDispatch);
    }

    video.addEventListener('loadedmetadata', function(e) {
        duration = e.target.duration;
        if (watchPoints) {
            watchPointsSort = convertToSecByDuration(duration, watchPoints);
            console.log(watchPointsSort);
        }
    });

    video.addEventListener('seeking', seekingHandler);

    video.addEventListener('timeupdate', function(e) {
        var currentTime = e.target.currentTime;
        for (var i = 0; i < watchPointsSort.length; i++) {
            if (currentTime >= watchPointsSort[i].sec && !watchPointsSort[i].isDispatch) {
                video.dispatchEvent(new CustomEvent('pass:' + watchPointsSort[i].original, {
                    'detail': watchPointsSort[i]
                }));
                watchPointsSort[i].isDispatch = true;
            }
        }
    });

    video.src = src;
    return video;
}
