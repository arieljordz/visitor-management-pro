import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faShoppingCart, 
  faChartLine, 
  faDollarSign,
  faEye,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import StatBox from '../components/ui/StatBox';
import InfoBox from '../components/ui/InfoBox';
import AdminCard from '../components/ui/AdminCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard: React.FC = () => {
  // Sample data for charts
  const revenueData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
  ];

  const visitorData = [
    { name: 'Mon', desktop: 1200, mobile: 800 },
    { name: 'Tue', desktop: 1100, mobile: 900 },
    { name: 'Wed', desktop: 1300, mobile: 1000 },
    { name: 'Thu', desktop: 1400, mobile: 1100 },
    { name: 'Fri', desktop: 1600, mobile: 1300 },
    { name: 'Sat', desktop: 1000, mobile: 700 },
    { name: 'Sun', desktop: 900, mobile: 600 },
  ];

  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'Created new user account', time: '2 minutes ago', type: 'success' },
    { id: 2, user: 'Jane Smith', action: 'Updated product inventory', time: '15 minutes ago', type: 'info' },
    { id: 3, user: 'Mike Johnson', action: 'Deleted old records', time: '1 hour ago', type: 'warning' },
    { id: 4, user: 'Sarah Wilson', action: 'Generated monthly report', time: '2 hours ago', type: 'success' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stat Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox
          title="Total Users"
          value="2,420"
          icon={faUsers}
          color="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatBox
          title="Orders"
          value="1,245"
          icon={faShoppingCart}
          color="success"
          trend={{ value: 8, isPositive: true }}
        />
        <StatBox
          title="Revenue"
          value="$52,040"
          icon={faDollarSign}
          color="warning"
          trend={{ value: 3, isPositive: false }}
        />
        <StatBox
          title="Growth"
          value="24.8%"
          icon={faChartLine}
          color="info"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoBox
          title="Page Views"
          value="89,420"
          icon={faEye}
          color="info"
          progress={75}
          description="Unique page views this month"
        />
        <InfoBox
          title="New Users"
          value="342"
          icon={faUserPlus}
          color="success"
          progress={60}
          description="New registrations this week"
        />
        <InfoBox
          title="Conversion Rate"
          value="3.2%"
          icon={faChartLine}
          color="warning"
          progress={45}
          description="Sales conversion rate"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <AdminCard title="Revenue Overview" icon={faDollarSign}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        {/* Visitor Chart */}
        <AdminCard title="Visitor Statistics" icon={faUsers}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="desktop" fill="hsl(var(--primary))" />
                <Bar dataKey="mobile" fill="hsl(var(--success))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>

      {/* Recent Activity */}
      <AdminCard title="Recent Activity" icon={faChartLine}>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  activity.type === 'success' ? 'bg-success' :
                  activity.type === 'warning' ? 'bg-warning' : 'bg-info'
                }`} />
                <div>
                  <p className="font-medium text-card-foreground">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
};

export default Dashboard;