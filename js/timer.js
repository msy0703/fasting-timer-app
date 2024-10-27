let timer;
let startTime;
let elapsedTimeDisplay = document.getElementById('elapsed-time');
let progressBar = document.getElementById('timer-progress');
let startTimeDisplay = document.getElementById('start-time');
let endTimeDisplay = document.getElementById('end-time');

export function startFasting(fastingHours) {
    startTime = new Date(); // 開始時間を取得
    const totalFastingSeconds = fastingHours * 3600; // 選択された断食時間を秒に変換

    // 開始時間と終了予定時間を表示
    startTimeDisplay.textContent = startTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    const endTime = calculateEndTime(fastingHours);
    endTimeDisplay.textContent = endTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

    // タイマーの開始
    timer = setInterval(() => {
        let currentTime = new Date();
        let elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

        if (elapsedSeconds >= totalFastingSeconds) {
            clearInterval(timer);
            elapsedSeconds = totalFastingSeconds;
        }

        updateElapsedTime(elapsedSeconds);
        updateProgressBar(elapsedSeconds, totalFastingSeconds);
    }, 1000);
}

export function stopFasting() {
    clearInterval(timer); // タイマーを停止
}

export function resetTimer() {
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

function updateElapsedTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = seconds % 60;

    elapsedTimeDisplay.textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function updateProgressBar(elapsedSeconds, totalSeconds) {
    const progressPercentage = (elapsedSeconds / totalSeconds) * 100;
    progressBar.value = progressPercentage;
}
