import React from "react";
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
} from "recharts";
import { NotificationTester } from "@/components/notifications/NotificationTester";
import { TokenTester } from "../components/notifications/TokenTester";

// Mock data - replace with actual data from your API
const userSignupsData = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 180 },
  { month: "Mar", users: 240 },
  { month: "Apr", users: 280 },
  { month: "May", users: 320 },
  { month: "Jun", users: 380 },
];

const affirmationCategoriesData = [
  { name: "Mindfulness", value: 35 },
  { name: "Success", value: 25 },
  { name: "Health", value: 20 },
  { name: "Relationships", value: 15 },
  { name: "Career", value: 5 },
];

const postVolumeData = [
  { day: "Mon", posts: 45 },
  { day: "Tue", posts: 52 },
  { day: "Wed", posts: 38 },
  { day: "Thu", posts: 65 },
  { day: "Fri", posts: 48 },
  { day: "Sat", posts: 72 },
  { day: "Sun", posts: 58 },
];

const COLORS = ["#fdcb6e", "#10b981", "#6366f1", "#f59e0b", "#ef4444"];

const Dashboard = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TokenTester />
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to the admin dashboard.</p>
      {/* Add dashboard widgets and stats here */}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          {/* <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Affirmations
            </CardTitle>
            <span className="text-2xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent> */}
          <NotificationTester />
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <span className="text-2xl">👤</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Scheduled Today
            </CardTitle>
            <span className="text-2xl">🗓️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+23% from yesterday</p>
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
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Most Popular Affirmation */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Affirmation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🧠</span>
            <div>
              <p className="font-medium">
                "I am capable of achieving great things"
              </p>
              <p className="text-sm text-muted-foreground">
                Tag: Success • Used 1,234 times
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* User Signups Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Signups Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userSignupsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#fdcb6e"
                    strokeWidth={2}
                  />
                </LineChart>
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
                    data={affirmationCategoriesData}
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
                    {affirmationCategoriesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
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
                <BarChart data={postVolumeData}>
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
    </div>
  );
};

export default Dashboard;
