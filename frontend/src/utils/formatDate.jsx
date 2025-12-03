export default function formatDate(dateStr) {
  if (!dateStr) {
    return 'Date TBD';
  }
  try {
    const d = new Date(dateStr);
    return d.toLocaleString();
  } catch (e) {
    return dateStr;
  }
}