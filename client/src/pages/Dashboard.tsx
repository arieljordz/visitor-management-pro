import { Users, UserCheck, UserX, Calendar } from 'lucide-react';
import { useVisitorStore } from '@/store/visitorStore';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { getDashboardStats, visitors, getFilteredVisitors } = useVisitorStore();
  const stats = getDashboardStats();

  // Recent visitors (last 5)
  const recentVisitors = visitors
    .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())
    .slice(0, 5);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your visitor management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Visitors"
          value={stats.totalVisitors}
          icon={Users}
          variant="default"
          trend={{ value: 12, label: 'from last month' }}
        />
        <StatCard
          title="Currently Inside"
          value={stats.currentlyInside}
          icon={UserCheck}
          variant="success"
        />
        <StatCard
          title="Checked Out"
          value={stats.checkedOut}
          icon={UserX}
          variant="warning"
        />
        <StatCard
          title="Today's Visitors"
          value={stats.todayVisitors}
          icon={Calendar}
          variant="default"
          trend={{ value: 8, label: 'from yesterday' }}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVisitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface border border-card-border hover:shadow-sm transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {visitor.name}
                      </p>
                      <span
                        className={
                          visitor.status === 'checked-in'
                            ? 'status-success'
                            : 'status-warning'
                        }
                      >
                        {visitor.status === 'checked-in' ? 'In' : 'Out'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {visitor.company} • {visitor.purpose}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {formatTime(visitor.checkInTime)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(visitor.checkInTime)}
                    </p>
                  </div>
                </div>
              ))}
              {recentVisitors.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No recent visitors
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-card-border hover:bg-surface transition-colors">
                <UserCheck className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium">Check In</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-card-border hover:bg-surface transition-colors">
                <UserX className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">Check Out</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-card-border hover:bg-surface transition-colors">
                <Users className="h-8 w-8 text-success" />
                <span className="text-sm font-medium">Add Visitor</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-card-border hover:bg-surface transition-colors">
                <Calendar className="h-8 w-8 text-warning" />
                <span className="text-sm font-medium">View Reports</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}