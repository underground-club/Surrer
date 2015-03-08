var socket = io.connect('http://210.140.162.52:7010/');
var v = document.getElementById('video');
function playVideo() {	//再生ボタン押下時の処理
  socket.emit('play');
  //動画を再生
  v.play();
}
function pauseVideo() {	//一時停止ボタン押下時の処理
  socket.emit('pause');
  //動画を一時停止
  v.pause();
}
function upVolume() {	//音量アップボタン押下時の処理
  //音量を上げる
  if(1 > (v.volume + 0.25)){
      v.volume = v.volume + 0.25;
  }
}
function downVolume() {	//音量ダウンボタン押下時の処理
  //音量を下げる
  if(0 <= (v.volume - 0.25)){
      v.volume = v.volume - 0.25;
  }
}

socket.on('play', function(sig) {
    v.play();
} );

socket.on('pause', function(sig) {
    v.pause();
} );

socket.on('set_video_stat', function(stat) {
    v.currentTime = stat.time;
    seekbar.value = stat.time;
    if (stat.paused) {
        v.pause();
        return;
    }
    v.play()
} );

socket.on('get_video_stat', function() {
    var stat = {
        "paused": v.paused || v.ended,
        "time": v.currentTime
    };
    socket.emit('set_new_members', stat);
} );

window.onload = function() {
    video = document.getElementById('video');
    seekbar = document.getElementById('seekbar');
    if(video.readyState > 0){
        seekbar.max = video.duration;
    }else{
        video.addEventListener('loadedmetadata', function(){
            seekbar.max = video.duration;
        });
    }
    seekbar.addEventListener('change', function(){
        video.currentTime = seekbar.value;
    },false);
    video.addEventListener('timeupdate', function(){
        seekbar.value = video.currentTime;
        console.log(seekbar.value);
    },false);
};

