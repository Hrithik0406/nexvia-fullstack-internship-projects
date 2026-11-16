import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { DollarSign, Users, Award, BookOpen, TrendingUp, Sparkles } from 'lucide-react';
import { User } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface InstructorAnalyticsProps {
  currentUser: User;
  token: string;
}

export const InstructorAnalytics: React.FC<InstructorAnalyticsProps> = ({ currentUser, token }) => {
  const [data, setData] = useState<any>({
    summary: {
      totalCourses: 2,
      totalStudents: 156,
      totalCertificatesIssued: 48,
      grossRevenue: 9840.0,
      instructorEarnings: 7872.0,
    },
    chartData: {
      monthlyRevenue: [
        { month: 'Jun', earnings: 1850, enrollments: 38 },
        { month: 'Jul', earnings: 2420, enrollments: 52 },
        { month: 'Aug', earnings: 3100, enrollments: 65 },
        { month: 'Sep', earnings: 4200, enrollments: 88 },
        { month: 'Oct', earnings: 5600, enrollments: 114 },
        { month: 'Nov', earnings: 7872, enrollments: 156 },
      ],
      courseDistribution: [
        { title: 'Microservices & Event-Driven', students: 94, revenue: 4700 },
        { title: 'Modern React 19 & TypeScript', students: 62, revenue: 3172 },
      ],
    },
  });

  useEffect(() => {
    fetchAnalytics();
  }, [token]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/instructor/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load instructor analytics', err);
    }
  };

  const { summary, chartData } = data;

  // Chart 1: Monthly Earnings Line Chart
  const lineChartData = {
    labels: chartData.monthlyRevenue.map((m: any) => m.month),
    datasets: [
      {
        label: 'Net Earnings ($)',
        data: chartData.monthlyRevenue.map((m: any) => m.earnings),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#4f46e5',
        pointRadius: 5,
      },
    ],
  };

  // Chart 2: Course Enrollments Bar Chart
  const barChartData = {
    labels: chartData.courseDistribution.map((c: any) => c.title),
    datasets: [
      {
        label: 'Enrolled Students',
        data: chartData.courseDistribution.map((c: any) => c.students),
        backgroundColor: '#6366f1',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-black tracking-tight">Instructor Revenue & Performance Hub</h1>
          </div>
          <p className="text-indigo-200 text-sm mt-1 max-w-xl">
            Live analytics powered by Chart.js. Track student enrollment velocity, monthly royalty distributions, and course completions.
          </p>
        </div>
        <span className="hidden sm:inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full">
          80% Net Royalty Share
        </span>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Instructor Royalties</p>
            <h3 className="text-2xl font-black text-indigo-600 mt-1">${summary.instructorEarnings.toFixed(2)}</h3>
            <span className="text-[11px] text-emerald-600 font-bold">Paid Out via Stripe Connect</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{summary.totalStudents} Students</h3>
            <span className="text-[11px] text-blue-600 font-bold">+28% Month-over-Month</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Certificates Awarded</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{summary.totalCertificatesIssued} Verified</h3>
            <span className="text-[11px] text-amber-600 font-bold">Exam Pass Rate: 84%</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Curriculum</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{summary.totalCourses} Masterclasses</h3>
            <span className="text-[11px] text-purple-600 font-bold">With Live Sessions</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Earnings Growth Trajectory (Chart.js)</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Last 6 Months</span>
          </div>
          <div className="h-64">
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { grid: { color: '#f1f5f9' }, ticks: { callback: (val) => `$${val}` } },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Enrollments by Course (Chart.js)</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Student Distribution</span>
          </div>
          <div className="h-64">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { grid: { color: '#f1f5f9' } },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
