let timer;
let startTime; // 断食開始時間を保持
let elapsedTimeDisplay = document.getElementById('elapsed-time');
let progressBar = document.getElementById('timer-progress');
let startTimeDisplay = document.getElementById('start-time');
let endTimeDisplay = document.getElementById('end-time');
let fastingButton = document.getElementById('start-fasting');
let resetButton = document.getElementById('reset-timer');
let fastingTimeSelect = document.getElementById('fasting-time');
let modal = document.getElementById('start-modal');
let startNowButton = document.getElementById('start-now');
let startWithTimeButton = document.getElementById('start-with-time');
let startTimePicker = document.getElementById('start-time-picker');
let remainingTimeDisplay = document.getElementById('remaining-time'); // 残り時間を表示する要素を取得


let isFasting = false; // 断食の状態を保持

// モーダル表示と断食開始/停止の処理
fastingButton.addEventListener('click', function() {
    if (!isFasting) {
        // 断食が開始されていない場合、モーダルを表示して選択を促す
        modal.style.display = "block";
    } else {
        // 断食が開始されている場合、停止処理を実行
        stopFasting();
    }
});

// キャンセルボタンを押した時にモーダルを閉じる
let cancelModalButton = document.getElementById('cancel-modal');

cancelModalButton.addEventListener('click', function() {
    modal.style.display = "none"; // モーダルを閉じる
});

// 現在時刻で開始する場合
startNowButton.addEventListener('click', function() {
    modal.style.display = "none"; // モーダルを閉じる
    let currentTime = new Date(); // 現在時刻を取得
    startFasting(currentTime); // 断食を開始
});

// 指定した時間で開始する場合
startWithTimeButton.addEventListener('click', function() {
    modal.style.display = "none"; // モーダルを閉じる
    let selectedTime = startTimePicker.value; // ユーザーが指定した日時を取得

    // 選択した時間が正しいかを確認
    if (selectedTime) {
        let startTime = new Date(selectedTime); // 日付をDateオブジェクトに変換
        if (!isNaN(startTime.getTime())) { // 有効な日時かどうか確認
            startFasting(startTime); // 指定した時間で断食を開始
        } else {
            alert("有効な時間を選択してください。");
        }
    } else {
        alert("有効な時間を選択してください。");
    }
});

// 断食開始
function startFasting(selectedStartTime) {
    startTime = selectedStartTime;
    startTimeDisplay.textContent = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const fastingHours = parseInt(fastingTimeSelect.value);
    const totalFastingSeconds = fastingHours * 3600;

    // 終了予定時間を計算
    const endTime = new Date(startTime.getTime() + totalFastingSeconds * 1000); 
    endTimeDisplay.textContent = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 開始時間と断食時間をローカルストレージに保存
    localStorage.setItem('fastingStartTime', startTime.getTime()); // ミリ秒で保存
    localStorage.setItem('fastingDuration', fastingHours); // 断食時間（時間単位）

    timer = setInterval(() => {
        let currentTime = new Date();
        let elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        let remainingSeconds = totalFastingSeconds - elapsedSeconds;

        // 経過時間を表示
        updateElapsedTime(elapsedSeconds);

        // 12時間（43200秒）を経過したらプログレスバーの色とテキストを変更
        if (elapsedSeconds >= 43200) { // 12時間以上経過した場合
            document.getElementById('timer-progress').classList.add('autophagy-mode');
            document.getElementById('autophagy-text').style.display = 'block'; // テキストを表示
        }

        // 残り時間を表示
        if (remainingSeconds > 0) {
            updateRemainingTime(remainingSeconds);
        } else {
            let overtimeSeconds = Math.abs(remainingSeconds);
            updateRemainingTime(-overtimeSeconds);
        }

        updateProgressBar(elapsedSeconds, totalFastingSeconds);
    }, 1000);

    isFasting = true;
    fastingButton.textContent = "断食を停止";
    fastingButton.classList.add('stop');
}

// 断食停止
function stopFasting() {
    clearInterval(timer); // タイマーを停止
    let endTime = new Date();
    saveFastingHistory(startTime, endTime); // 履歴を保存
    loadFastingHistory(); // 履歴を表示
    resetTimer(); // タイマーと表示をリセット

    // ローカルストレージからタイマー情報を削除
    localStorage.removeItem('fastingStartTime');
    localStorage.removeItem('fastingDuration');

    isFasting = false; // 断食が停止されたことを示すフラグを設定
    fastingButton.textContent = "断食をスタート";
    fastingButton.classList.remove('stop');

    // ページをリロード
    location.reload(); // ページをリロードする
}

// タイマーリセット
function resetTimer() {
    clearInterval(timer); // タイマーをリセット
    elapsedTimeDisplay.textContent = "00:00:00";
    progressBar.value = 0; // プログレスバーをリセット
}

// 終了予定時間を計算
export function calculateEndTime(fastingHours) {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + fastingHours);
    return endTime;
}

// 残り時間をプログレスバーの上に表示する関数
function updateRemainingTime(remainingSeconds) {
    let displayText;
    if (remainingSeconds >= 0) {
        let hours = Math.floor(remainingSeconds / 3600);
        let minutes = Math.floor((remainingSeconds % 3600) / 60);
        let seconds = remainingSeconds % 60;
        displayText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        // 超過時間を表示
        let overtimeSeconds = Math.abs(remainingSeconds);
        let hours = Math.floor(overtimeSeconds / 3600);
        let minutes = Math.floor((overtimeSeconds % 3600) / 60);
        let seconds = overtimeSeconds % 60;
        displayText = `+${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    remainingTimeDisplay.textContent = displayText; // 残り時間を表示
}

// 経過時間の表示を更新
function updateElapsedTime(elapsedSeconds) {
    let hours = Math.floor(elapsedSeconds / 3600);
    let minutes = Math.floor((elapsedSeconds % 3600) / 60);
    let remainingSeconds = elapsedSeconds % 60;

    elapsedTimeDisplay.textContent = 
        `経過時間: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// プログレスバーを更新
function updateProgressBar(elapsedSeconds, totalSeconds) {
    const progressPercentage = (elapsedSeconds / totalSeconds) * 100;
    progressBar.value = progressPercentage;
}

// 履歴を保存
function saveFastingHistory(startTime, endTime) {
    let history = JSON.parse(localStorage.getItem('fastingHistory')) || [];

    // 断食の経過時間を計算
    let elapsedMilliseconds = endTime - startTime;
    let elapsedHours = Math.floor(elapsedMilliseconds / (1000 * 60 * 60)); // 時間を計算
    let elapsedMinutes = Math.floor((elapsedMilliseconds % (1000 * 60 * 60)) / (1000 * 60)); // 残りの分を計算

    // 開始日付を yyyy-mm-dd 形式で取得
    let startDate = startTime.toISOString().split('T')[0];

    // 既に同じ日付の履歴が存在するか確認して削除
    history = history.filter(entry => entry.startDate !== startDate);

    // 新しい履歴を追加
    history.push({
        startDate: startDate, // 正しい形式の開始日付
        duration: `${elapsedHours}h${elapsedMinutes}m` // 短縮形式の時間表示
    });

    // ローカルストレージに履歴を保存
    localStorage.setItem('fastingHistory', JSON.stringify(history));
}

// 履歴を表示
function loadFastingHistory() {
    let history = JSON.parse(localStorage.getItem('fastingHistory')) || [];
    let historyList = document.getElementById('fasting-history-list');

    // 履歴リストをクリア
    historyList.innerHTML = '';

    if (history.length > 0) {
        history.forEach((entry, index) => {
            let listItem = document.createElement('li');
            listItem.textContent = `日付: ${entry.startDate}, 断食時間: ${entry.duration}`;
            historyList.appendChild(listItem);
        });
    } else {
        // 履歴がない場合のメッセージを表示
        let noHistoryItem = document.createElement('li');
        noHistoryItem.textContent = "履歴がありません";
        historyList.appendChild(noHistoryItem);
    }
}

// ページ読み込み時に履歴を表示
window.onload = function() {
    // ローカルストレージにデータがあるか確認
    const savedStartTime = localStorage.getItem('fastingStartTime');
    const savedDuration = localStorage.getItem('fastingDuration');

    if (savedStartTime && savedDuration) {
        const startTime = new Date(parseInt(savedStartTime));
        const fastingHours = parseInt(savedDuration);
        const totalFastingSeconds = fastingHours * 3600;
        const currentTime = new Date();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

        // 経過時間が断食時間を超えていないか確認
        if (elapsedSeconds < totalFastingSeconds) {
            startFasting(startTime); // タイマーを再開
            updateElapsedTime(elapsedSeconds);
            updateProgressBar(elapsedSeconds, totalFastingSeconds);
        } else {
            // 既に断食時間を過ぎている場合、タイマーを停止
            saveFastingHistory(startTime, new Date(startTime.getTime() + totalFastingSeconds * 1000));
            loadFastingHistory();
            localStorage.removeItem('fastingStartTime'); // ローカルストレージから削除
            localStorage.removeItem('fastingDuration');
        }
    } else {
        loadFastingHistory(); // ローカルストレージに何もなければ履歴のみ読み込む
    }
};


// 履歴削除ボタンの処理を追加
document.getElementById('clear-history').addEventListener('click', function() {
    // ローカルストレージから履歴を削除
    localStorage.removeItem('fastingHistory');
    
    // 履歴リストをクリア
    loadFastingHistory();

    // ページをリロード
    location.reload(); // ページをリロードする
});

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 'auto', // カレンダーの高さを自動調整
        events: loadCalendarEvents() // イベントを読み込み
    });

    calendar.render();
});

// 履歴をカレンダーのイベントとして読み込む関数
function loadCalendarEvents() {
    let history = JSON.parse(localStorage.getItem('fastingHistory')) || [];
    let events = [];

    // ログを追加して履歴データを確認
    console.log("履歴データ:", history);

    history.forEach((entry) => {
        events.push({
            title: entry.duration, // 「何時間何分」のみ表示
            start: entry.startDate, // 開始日付をカレンダーに表示
            allDay: true // 終日イベントとして表示
        });
    });

    // カレンダーに渡すイベントリストを表示
    console.log("カレンダーイベント:", events);

    return events;
}

