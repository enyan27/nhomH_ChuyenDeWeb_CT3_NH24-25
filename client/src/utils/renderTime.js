export default function renderTime(time) {
  const now = new Date();
  if (time) {
    const livingTime = (now - new Date(time)) / 60000;
    switch (true) {
      case livingTime < 3:
        return "Just now";
      case livingTime < 60:
        return `${Math.floor(livingTime)} minutes ago`;
      case livingTime < 1440:
        return `${Math.floor(livingTime / 60)} hours ago`;
      case livingTime < 44640:
        return `${Math.floor(livingTime / 1440)} days ago`;
      case livingTime < 525600:
        return `${Math.floor(livingTime / 43200)} months ago`;
      default:
        return `${Math.floor(livingTime / 525600)} years ago`;
    }
  }
  return time;
}
