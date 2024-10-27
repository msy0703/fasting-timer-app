export function saveToHistory(entry) {
    let history = JSON.parse(localStorage.getItem('fastingHistory')) || [];
    history.push(entry);
    localStorage.setItem('fastingHistory', JSON.stringify(history));
}

export function getHistory() {
    return JSON.parse(localStorage.getItem('fastingHistory')) || [];
}

export function clearHistory() {
    localStorage.removeItem('fastingHistory');
}
