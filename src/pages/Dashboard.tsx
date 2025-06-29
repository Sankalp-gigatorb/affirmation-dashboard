import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { NotificationTester } from "@/components/notifications/NotificationTester";
import { TokenTester } from "../components/notifications/TokenTester";
import DashboardService from "@/services/dashboard.service";
import type { DashboardStats } from "@/services/dashboard.service";
import AnalyticsService from "@/services/analytics.service";

const COLORS = ["#fdcb6e", "#10b981", "#6366f1", "#f59e0b", "#ef4444"];

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completionRate, setCompletionRate] = useState<{
    total: number;
    completed: number;
    rate: number;
  } | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [stats, completion] = await Promise.all([
          DashboardService.getDashboardStats(),
          AnalyticsService.getAffirmationCompletionRate(),
        ]);
        setDashboardStats(stats);
        setCompletionRate(completion);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!dashboardStats) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">No data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Welcome to the admin dashboard. Here's an overview of your platform's
        performance.
      </p>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Affirmations
            </CardTitle>
            <span className="text-2xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.affirmations.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <span className="text-2xl">👤</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.users.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.users.active} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <span className="text-2xl">📈</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.subscriptions.active.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              ${dashboardStats.subscriptions.revenue.total.toFixed(2)} monthly
              revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Community Posts
            </CardTitle>
            <span className="text-2xl">💬</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.posts.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total community engagement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Most Popular Affirmation */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Most Popular Affirmation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🧠</span>
            <div>
              <p className="font-medium">
                "{dashboardStats.affirmations.mostPopular.content}"
              </p>
              <p className="text-sm text-muted-foreground">
                Tag: {dashboardStats.affirmations.mostPopular.category} • Used{" "}
                {dashboardStats.affirmations.mostPopular.usageCount.toLocaleString()}{" "}
                times
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* User Signups Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Signups Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardStats.userSignups}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#fdcb6e"
                    fill="#fdcb6e"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Affirmation Categories Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Affirmation Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardStats.affirmations.categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {dashboardStats.affirmations.categories.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Community Post Volume Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Community Post Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardStats.posts.weeklyVolume}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="posts" fill="#fdcb6e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.users.newThisMonth}
            </div>
            <p className="text-xs text-muted-foreground">
              New users this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Subscription Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Monthly:</span>
                <span className="font-medium">
                  {dashboardStats.subscriptions.monthly}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Yearly:</span>
                <span className="font-medium">
                  {dashboardStats.subscriptions.yearly}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Monthly:</span>
                <span className="font-medium">
                  ${dashboardStats.subscriptions.revenue.monthly.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Yearly:</span>
                <span className="font-medium">
                  ${dashboardStats.subscriptions.revenue.yearly.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completionRate ? `${completionRate.rate.toFixed(1)}%` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {completionRate
                ? `${completionRate.completed}/${completionRate.total} completed`
                : "No data"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Users:</span>
                <span className="font-medium">
                  {dashboardStats.users.active}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">With Subscription:</span>
                <span className="font-medium">
                  {dashboardStats.users.withSubscription}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Without Subscription:</span>
                <span className="font-medium">
                  {dashboardStats.users.withoutSubscription}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Content Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Affirmations:</span>
                <span className="font-medium">
                  {dashboardStats.affirmations.total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Categories:</span>
                <span className="font-medium">
                  {dashboardStats.affirmations.categories.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Community Posts:</span>
                <span className="font-medium">
                  {dashboardStats.posts.total}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Revenue:</span>
                <span className="font-medium">
                  ${dashboardStats.subscriptions.revenue.total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Monthly Revenue:</span>
                <span className="font-medium">
                  ${dashboardStats.subscriptions.revenue.monthly.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Yearly Revenue:</span>
                <span className="font-medium">
                  ${dashboardStats.subscriptions.revenue.yearly.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
