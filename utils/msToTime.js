// utils/msToTime.js
// This code converts milliseconds to a human-readable format of days, hours, minutes, and seconds. The function takes in a duration in milliseconds and iterates through each time portion, subtracting the corresponding milliseconds from the duration. It then pushes the formatted time portion (e.g., '1d', '2h', '30m') into an array called portions. Finally, it returns the first element of the portions array.
export default function msToTime(duration) {
  const portions = [];
    const msInDay = 1000 * 60 * 60 * 24;
  const days = Math.trunc(duration / msInDay);
  if (days > 0) {
    portions.push(days + 'd');
    duration = duration - (days * msInDay);
  }

  const msInHour = 1000 * 60 * 60;
  const hours = Math.trunc(duration / msInHour);
  if (hours > 0) {
    portions.push(hours + 'h');
    duration = duration - (hours * msInHour);
  }

  const msInMinute = 1000 * 60;
  const minutes = Math.trunc(duration / msInMinute);
  if (minutes > 0) {
    portions.push(minutes + 'm');
    duration = duration - (minutes * msInMinute);
  }

  const seconds = Math.trunc(duration / 1000);
  if (seconds > 0) {
    portions.push(seconds + 's');
  }

  return portions[0]
}