export const formatCurrency = (amount) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();

  // Reset time portions for comparison
  const dYear = date.getFullYear();
  const dMonth = date.getMonth();
  const dDate = date.getDate();

  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();
  const nowDate = now.getDate();

  if (dYear === nowYear && dMonth === nowMonth && dDate === nowDate) {
    return 'Today';
  }

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (
    dYear === yesterday.getFullYear() &&
    dMonth === yesterday.getMonth() &&
    dDate === yesterday.getDate()
  ) {
    return 'Yesterday';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: dYear === nowYear ? undefined : 'numeric',
  }).format(date);
};

export const formatMonthYear = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
};
