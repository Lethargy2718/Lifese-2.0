export function pointsToTime(points) {
    const totalMinutes = points * 10;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${pad(hours)}:${pad(minutes)}:00`;
}

function pad(num) {
    return String(num).padStart(2, "0");
}
