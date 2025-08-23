import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { useState } from 'react';
import { useVisitorStore } from '@/stores/visitorStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Reports() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { visitors, getDashboardStats } = useVisitorStore();
  const stats = getDashboardStats();

  const handleExport = () => {
    // Mock export functionality
    alert('Export functionality would be implemented here');
  };

  const filteredVisitors = visitors.filter(visitor => {
    if (!startDate && !endDate) return true;
    
    const visitDate = new Date(visitor.checkInTime);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && visitDate < start) return false;
    if (end && visitDate > end) return false;
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Generate and export visitor reports
          </p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filter Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {filteredVisitors.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Total Visitors
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                {filteredVisitors.filter(v => v.status === 'checked-in').length}
              </p>
              <p className="text-sm text-muted-foreground">
                Currently Inside
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">
                {filteredVisitors.filter(v => v.status === 'checked-out').length}
              </p>
              <p className="text-sm text-muted-foreground">
                Checked Out
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {new Set(filteredVisitors.map(v => v.company)).size}
              </p>
              <p className="text-sm text-muted-foreground">
                Companies
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Detailed Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredVisitors.map((visitor) => (
              <div key={visitor.id} className="flex items-center justify-between p-4 rounded-lg border border-card-border bg-surface">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-700">
                      {visitor.name}
                    </h3>
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
                  <p className="text-xs text-muted-foreground">
                    Host: {visitor.hostName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    }).format(new Date(visitor.checkInTime))}
                  </p>
                  {visitor.checkOutTime && (
                    <p className="text-xs text-muted-foreground">
                      Out: {new Intl.DateTimeFormat('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      }).format(new Date(visitor.checkOutTime))}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {filteredVisitors.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No visitors found for the selected date range
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}