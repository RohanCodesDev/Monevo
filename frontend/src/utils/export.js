export const exportToCSV = (transactions, filename = 'monevo-transactions.csv') => {
  if (!transactions || transactions.length === 0) {
    alert('No transactions available to export.');
    return;
  }

  const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount (INR)'];
  
  const rows = transactions.map((tx) => [
    `"${tx.id || ''}"`,
    `"${tx.date ? new Date(tx.date).toISOString().split('T')[0] : ''}"`,
    `"${tx.type || ''}"`,
    `"${(tx.category || '').replace(/"/g, '""')}"`,
    `"${(tx.description || '').replace(/"/g, '""')}"`,
    `"${tx.amount || 0}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
