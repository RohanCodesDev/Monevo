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

// Distinct category color mapping for visual contrast
const CATEGORY_COLORS = {
  Food: '#E65100',          // Vibrant Terracotta / Deep Orange
  Shopping: '#6A1B9A',      // Deep Purple / Violet
  Transport: '#0277BD',     // Electric / Ocean Blue
  Bills: '#C62828',         // Crimson Red
  Entertainment: '#AD1457', // Magenta / Pink
  Health: '#00695C',        // Deep Teal / Emerald
  Education: '#283593',     // Indigo / Royal Navy
  Travel: '#00838F',        // Cyan / Lagoon
  Subscriptions: '#4E342E', // Warm Sienna / Bronze
  Salary: '#2E7D32',        // Forest Green
  Freelance: '#1565C0',     // Cobalt Blue
  Business: '#37474F',      // Slate / Steel
  Gift: '#D81B60',          // Cerise
  Investment: '#00897B',    // Jade Green
  Other: '#455A64',         // Neutral Graphite
};

// Fallback high-contrast qualitative palette
const DISTINCT_PALETTE = [
  '#E65100', // Terracotta
  '#6A1B9A', // Royal Violet
  '#0277BD', // Ocean Blue
  '#2E7D32', // Forest Green
  '#C62828', // Crimson Red
  '#00838F', // Cyan Lagoon
  '#AD1457', // Vivid Magenta
  '#F57F17', // Golden Amber
  '#283593', // Deep Indigo
  '#4E342E', // Warm Bronze
  '#00695C', // Deep Emerald
  '#5D4037', // Roasted Umber
];

export const SpendingBreakdown = () => {
  const { metrics, theme } = useTransactions();
  const { expenses, categoryTotals } = metrics;
  const [chartType, setChartType] = useState('doughnut');

  const categories = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  const isDark = theme === 'dark';

  // Build high-contrast, category-mapped colors
  const chartColors = categories.map((cat, idx) => {
    return CATEGORY_COLORS[cat] || DISTINCT_PALETTE[idx % DISTINCT_PALETTE.length];
  });

  const doughnutData = {
    labels: categories,
    datasets: [
      {
        data: values,
        backgroundColor: chartColors,
        borderColor: isDark ? '#191918' : '#FAFAFA',
        borderWidth: 2,
        hoverOffset: 6,
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
          color: isDark ? '#DCDAD5' : '#181816',
          font: { family: 'Outfit', size: 11, weight: '500' },
          boxWidth: 10,
          boxHeight: 10,
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#282826' : '#181816',
        titleFont: { family: 'Outfit', size: 12, weight: '600' },
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
    cutout: '68%',
  };

  const barData = {
    labels: categories,
    datasets: [
      {
        label: 'Expenses',
        data: values,
        backgroundColor: chartColors,
        borderRadius: 4,
        maxBarThickness: 36,
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
        titleFont: { family: 'Outfit', size: 12, weight: '600' },
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
