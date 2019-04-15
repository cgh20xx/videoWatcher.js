document.addEventListener('DOMContentLoaded', function(e) {
    // 判斷 setting 給的寬 <640 的話，寬高x2倍，確保產生出的 canvas 不會小於 640，但素材長寬要有兩倍大
    if (setting.mod.width < 640) {
        var resolution = setting.mod.resolution || 2; //找不到 resultion 預設為 2 倍大
        setting.mod.width *= resolution;
        setting.mod.height *= resolution;
    }

    Inapp.afterViewable(function() {
        if (setting.vastXml) {
            loadVastXml(setting.vastXml, function (vast) {
                main(vast)
            });
        } else {
            main();
        }
        
    });

    function main(vast) {
        // vast && test('test');
        // Tracking: acceptInvitation、close、fullscreen 未使用
        vast && vastTracking(vast['impression'], 'impression');

        setting.el = '.module-video-vertical';
        setting.width = setting.mod.width;
        setting.height = setting.mod.height;

        var expVideoVertical = new Explosion.VideoVertical(setting);
        expVideoVertical.init();

        expVideoVertical.on('volume.click', function (muteState) {
            if (muteState.MUTED) {
                gs('開啟聲音', 'engagement');
                vast && vastTracking(vast['unmute'], 'unmute');
            } else {
                gs('關閉聲音', 'engagement');
                vast && vastTracking(vast['mute'], 'mute');
            }
        });

        expVideoVertical.on('poster.click', function (e, url) {
            gsClickThrough(url, false, '點擊外連 ' + url);
        });

        expVideoVertical.on('video.play', function (e) {
            gs('影片播放', 'system');
            vast && vastTracking(vast['start'], 'start');
        });

        var checkPlaying1Sec = 1; // 秒
        var checkPlaying3Sec = 3; // 秒
        var checkPlayingFirstQuartile = 0; // Q1
        var checkPlayingMidpoint = 0; // Q2
        var checkPlayingThirdQuartile = 0; // Q3
        var checkPlayingFlagAlmost = 0; // 97%
        var checkPlayingFlag1Sec = false;
        var checkPlayingFlag3Sec = false;
        var checkPlayingFlagFirstQuartile = false;
        var checkPlayingFlagMidpoint = false;
        var checkPlayingFlagThirdQuartile = false;
        var isUserControl = false;
        var isCounted = false;

        expVideoVertical.on('video.loadeddata', function (e) {
            // console.log('video.loadeddata');
            // checkPlayingFirstQuartile = e.target.duration * 0.25;
            // checkPlayingMidpoint = e.target.duration * 0.5;
            // checkPlayingThirdQuartile = e.target.duration * 0.75;
            // checkPlayingFlagAlmost = e.target.duration * 0.97;
            // // 下方這個註冊事件，要註冊在計算完所有影片節點之後，否則所有節點都 = 0
            // // 下方這個註冊事件 'AD2Event' 以及 intersectionHandler function 目前必須搭配一起使用(待優化)
            // OtherWindow.on('AD2Event', function (e) {
            //     intersectionHandler(e, expVideoVertical.el.querySelector('video'), function () {
            //         if (!isUserControl) expVideoVertical.play();
            //     }, function () {
            //         if (!isUserControl) expVideoVertical.pause();
            //     });
            // });
        });

        OtherWindow.on('AD2Event', function (e) {
            intersectionHandler(e, expVideoVertical.el.querySelector('video'), function () {
                if (!isUserControl) expVideoVertical.play();
            }, function () {
                if (!isUserControl) expVideoVertical.pause();
            });
        });

        expVideoVertical.on('video.timeupdate', function (e) {
            if(!isCounted) {
                checkPlayingFirstQuartile = e.target.duration * 0.25;
                checkPlayingMidpoint = e.target.duration * 0.5;
                checkPlayingThirdQuartile = e.target.duration * 0.75;
                checkPlayingFlagAlmost = e.target.duration * 0.97;
                isCounted = true;
            };
            
            if (e.target.currentTime >= checkPlaying1Sec && !checkPlayingFlag1Sec) {
                gs('影片播放中,1秒', 'system');
                checkPlayingFlag1Sec = true;
            }
            if (e.target.currentTime >= checkPlaying3Sec && !checkPlayingFlag3Sec) {
                gs('影片播放中,3秒', 'system');
                checkPlayingFlag3Sec = true;
            }
            if (e.target.currentTime >= checkPlayingFirstQuartile && !checkPlayingFlagFirstQuartile) {
                gs('影片播放中,1/4', 'system');
                vast && vastTracking(vast['firstQuartile'], 'firstQuartile');
                checkPlayingFlagFirstQuartile = true;
            }
            if (e.target.currentTime >= checkPlayingMidpoint && !checkPlayingFlagMidpoint) {
                gs('影片播放中,1/2', 'system');
                vast && vastTracking(vast['midpoint'], 'midpoint');
                checkPlayingFlagMidpoint = true;
            }
            if (e.target.currentTime >= checkPlayingThirdQuartile && !checkPlayingFlagThirdQuartile) {
                gs('影片播放中,3/4', 'system');
                vast && vastTracking(vast['thirdQuartile'], 'thirdQuartile');
                checkPlayingFlagThirdQuartile = true;
            }
            if (e.target.currentTime >= checkPlayingFlagAlmost && !isUserControl) {
                // gs('影片播放中,97%', 'system' + checkPlayingFlagAlmost);
                // 影片快結束時，先將 isUserControl 改成 true，因為 requestanimationframe 觸發的 postmessage 頻率很高，不提早處理，將導致影片無限循環
                isUserControl = true;
            }
        });

        expVideoVertical.on('video.pause', function (e) {
            gs('影片暫停', 'system');
            vast && vastTracking(vast['pause'], 'pause');
        });

        expVideoVertical.on('video.ended', function (e) {
            gs('影片結束', 'system');
            vast && vastTracking(vast['complete'], 'complete');
        });

        expVideoVertical.on('replay.click', function (e) {
            gs('按下重播', 'engagement');
            checkPlayingFlag1Sec = false;
            checkPlayingFlag3Sec = false;
            checkPlayingFlagFirstQuartile = false;
            checkPlayingFlagMidpoint = false;
            checkPlayingFlagThirdQuartile = false;
            isUserControl = false;
        });

        if (window === window.top) {
            // 沒有 iframe 下
            expVideoVertical.play();
        };

    };

    function vastTracking(trackingUrl, trackingEvt) {
        // console.log('trackingEvt: ', trackingEvt);
        // console.log('trackingUrl: ', trackingUrl);
        var tracking = document.createElement('img');
        tracking.style.display = 'none';
        tracking.src = trackingUrl;
    };

    function loadVastXml(src, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var vast = parseXml(this.responseXML);
                callback(vast);
            }
        };
        xhr.onerror = function () {
            gs('VAST 4.0 xml載入失敗', 'system');
        };
        xhr.open('GET', src);
        xhr.responseType = 'document';
        xhr.send();
    };

    function parseXml(xml) {
        var i;
        // 建立 vast 物件
        var vast = {};
        var impression = xml.getElementsByTagName('Impression');
        var trackings = xml.getElementsByTagName('Tracking');
        var clickThrough = xml.getElementsByTagName('ClickThrough');
        var MediaFiles = xml.getElementsByTagName('MediaFile');
        // event name: ts[i].attributes.event.nodeValue
        // event url: ts[i].textContent

        // 取得 Impression 標籤 => 這個url讀進來就可以直接載入
        vast['impression'] = impression[0].textContent;

        // 取得所有 Tracking 標籤
        for (i = 0; i < trackings.length; i++) {
            vast[trackings[i].attributes.event.nodeValue] = trackings[i].textContent;
        }

        // 取得 ClickThrough 標籤，並覆寫 setting.url
        if (clickThrough[0].textContent) {
            setting.url = clickThrough[0].textContent;
        }

        // 取得 MediaFile 標籤(目前直接指定idx = 11)，並覆寫 setting.video
        for (i = 0; i < MediaFiles.length; i++) {
            if (MediaFiles[i].attributes.width.nodeValue === '1024') {
                setting.video = MediaFiles[i].textContent;
            }
        }
        
        return vast;

    };

});