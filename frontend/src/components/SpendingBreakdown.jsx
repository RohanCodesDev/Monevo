import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext.jsx';
import { formatCurrency } from '../utils/formatters.js';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { PieChart, BarChart2 } from 'lucide-react';
import './SpendingBreakdown.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export const SpendingBreakdown = () => {
  const { metrics, theme } = useTransactions();
  const { expenses, categoryTotals } = metrics;
  const [chartType, setChartType] = useState('doughnut');

  const categories = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  const isDark = theme === 'dark';

  // Strict charcoal and white architectural shades
  const palette = isDark
    ? ['#F5F4F0', '#D6D5CF', '#B2B1AA', '#8E8D88', '#6E6D68', '#4F4E4A', '#333330']
    : ['#181816', '#3A3A36', '#585753', '#7A7973', '#9E9D97', '#C4C3BD', '#E0DFDA'];

  const doughnutData = {
    labels: categories,
    datasets: [
      {
        data: values,
        backgroundColor: palette.slice(0, categories.length),
        borderColor: isDark ? '#191918' : '#FAFAFA',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#9E9D97' : '#585753',
          font: { family: 'Outfit', size: 11 },
          boxWidth: 10,
          padding: 10,
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#282826' : '#181816',
        titleFont: { family: 'Outfit', size: 12 },
        bodyFont: { family: 'Outfit', size: 12 },
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            const pct = expenses > 0 ? Math.round((val / expenses) * 100) : 0;
            return ` ${context.label}: ${formatCurrency(val)} (${pct}%)`;
          },
        },
      },
    },
    cutout: '72%',
  };

  const barData = {
    labels: categories,
    datasets: [
      {
        label: 'Expenses',
        data: values,
        backgroundColor: isDark ? '#F5F4F0' : '#181816',
        borderRadius: 4,
        maxBarThickness: 32,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#282826' : '#181816',
        titleFont: { family: 'Outfit', size: 12 },
        bodyFont: { family: 'Outfit', size: 12 },
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (context) => ` ${formatCurrency(context.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? '#9E9D97' : '#585753', font: { family: 'Outfit', size: 11 } },
      },
      y: {
        grid: { color: isDark ? '#1E1E1D' : '#F2F1ED' },
        ticks: { color: isDark ? '#9E9D97' : '#585753', font: { family: 'Outfit', size: 11 } },
      },
    },
  };

  return (
    <div className="insight-card spending-breakdown-card">
      <div className="insight-card-header">
        <div>
          <h3 className="insight-card-title">Spending Breakdown</h3>
          <span className="insight-card-subtitle">{formatCurrency(expenses)} total</span>
        </div>

        <div className="chart-type-toggles">
          <button
            type="button"
            className={`btn-chart-toggle ${chartType === 'doughnut' ? 'active' : ''}`}
            onClick={() => setChartType('doughnut')}
            aria-label="Donut Chart"
            title="Donut Chart"
          >
            <PieChart size={14} />
          </button>
          <button
            type="button"
            className={`btn-chart-toggle ${chartType === 'bar' ? 'active' : ''}`}
            onClick={() => setChartType('bar')}
            aria-label="Bar Chart"
            title="Bar Chart"
          >
            <BarChart2 size={14} />
          </button>
        </div>
      </div>

      {expenses === 0 || categories.length === 0 ? (
        <div className="insight-empty">
          <p>No expenses recorded this month.</p>
        </div>
      ) : (
        <div className="chart-canvas-container">
          {chartType === 'doughnut' ? (
            <Doughnut data={doughnutData} options={doughnutOptions} />
          ) : (
            <Bar data={barData} options={barOptions} />
          )}
        </div>
      )}
    </div>
  );
};
