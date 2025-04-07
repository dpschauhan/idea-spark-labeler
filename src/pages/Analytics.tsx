
import React from 'react';
import { useIdeas } from '@/context/IdeaContext';
import Navbar from '@/components/Navbar';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

const Analytics = () => {
  const { getAnalytics } = useIdeas();
  const analytics = getAnalytics();
  
  // Prepare data for category chart
  const categoryData = Object.entries(analytics.categoryCounts).map(([name, value]) => ({
    name,
    value
  }));
  
  // Prepare data for label chart
  const labelData = [
    { name: 'Best', value: analytics.bestIdeasCount },
    { name: 'Worst', value: analytics.worstIdeasCount },
    { name: 'Unlabeled', value: analytics.totalIdeas - analytics.bestIdeasCount - analytics.worstIdeasCount }
  ];
  
  // Prepare data for monthly trend
  const sortedMonths = Object.entries(analytics.ideasPerMonth)
    .sort(([monthA], [monthB]) => {
      return monthA.localeCompare(monthB);
    })
    .map(([month, count]) => {
      // Format YYYY-MM to a nicer display format (e.g., Jan 2023)
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      return {
        month: `${monthName} ${year}`,
        count
      };
    });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Get insights about your ideas</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{analytics.totalIdeas}</CardTitle>
              <CardDescription>Total Ideas</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{analytics.bestIdeasCount}</CardTitle>
              <CardDescription>Best Ideas</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{analytics.worstIdeasCount}</CardTitle>
              <CardDescription>Worst Ideas</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{analytics.sharedIdeasCount}</CardTitle>
              <CardDescription>Shared Ideas</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Ideas by Category</CardTitle>
              <CardDescription>Distribution across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label={(entry) => entry.name}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Ideas by Label</CardTitle>
              <CardDescription>Best vs. Worst ideas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={labelData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label={(entry) => entry.name}
                    >
                      <Cell fill="#10b981" /> {/* Best - green */}
                      <Cell fill="#ef4444" /> {/* Worst - red */}
                      <Cell fill="#94a3b8" /> {/* Unlabeled - gray */}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
            <CardDescription>Ideas created over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedMonths}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Ideas Created" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <footer className="border-t py-4">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          © 2025 IdeaSpark. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Analytics;
