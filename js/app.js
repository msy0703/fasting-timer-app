import { startFasting, stopFasting, resetTimer, calculateEndTime } from './timer.js';

let isFasting = false;
let fastingButton = document.getElementById('start-fasting');
let resetButton = document.getElementById('reset-timer');
let fastingTimeSelect = document.getElementById('fasting-time'); // 断食時間の選択
let startTimeDisplay = document.getElementById('start-time');
let endTimeDisplay = document.getElementById('end-time');

fastingButton.addEventListener('click', function () {
    if (!isFasting) {
        // 断食開始
        isFasting = true;
        const fastingHours = parseInt(fastingTimeSelect.value); // 選択された断食時間
        startFasting(fastingHours);
        fastingButton.textContent = "断食を停止"; // ボタンのテキストを「停止」に変更
        fastingButton.classList.add('stop'); // ボタンの色を変更
    } else {
        // 断食停止
        isFasting = false;
        stopFasting();
        fastingButton.textContent = "断食をスタート"; // ボタンのテキストを「スタート」に戻す
        fastingButton.classList.remove('stop'); // ボタンの色を戻す
    }
});

resetButton.addEventListener('click', function () {
    resetTimer(); // リセットボタンが押された際にタイマーをリセット
    startTimeDisplay.textContent = '--:--';
    endTimeDisplay.textContent = '--:--';
});
