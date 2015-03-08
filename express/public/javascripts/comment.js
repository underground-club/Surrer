// 初期情報取得フラグ
var is_got_past = false;

var socket = io.connect('http://210.140.162.52:7010/');
socket.on('connect', function(msg) {
  console.log("connet");
  socket.emit('login', { id: socket.id });
});

// Member Login
socket.on('come_member', function(data) {
  var members = data.members;
  var comments = data.comments;
  if (is_got_past) {
      var new_user = members.pop();
      $(".View__memberLists").append('<li class="View__memberList">'+new_user.id+'</li>');
      return;
  }
  for (var i = 0; i < members.length; i++) {
      $(".View__memberLists").append('<li class="View__memberList">'+members[i].id+'</li>');
  };
  for (var i = 0; i < comments.length; i++) {
      $(".View__commentLists").append('<li class="View__commentList">'+comments[i].value+'</li>');
  };
  is_got_past = true;
});

// メッセージを受けたとき
socket.on('message', function(msg) {
  // メッセージを画面に表示する
  $(".View__commentLists").append('<li class="View__commentList">'+msg.value+'</li>');
});

// メッセージ欄のキー入力
function keyPressMes(code) {
  if (code === 13) {
    sendMsg();
  }
}
// メッセージを送る
function SendMsg() {
  var msg = document.getElementById("message");
  // 空白文字のみの場合は送信しない
  if (!msg.value.match(/\S/g)) {
    return;
  }
  // メッセージを発射する
  socket.emit('message', { id: socket.id, value: msg.value });
  msg.value = "";
}
// 切断する
function DisConnect() {
  var msg = socket.id + "は切断しました。";
  // メッセージを発射する
  socket.emit('message', { value: msg });
  // socketを切断する
  socket.disconnect();
}

