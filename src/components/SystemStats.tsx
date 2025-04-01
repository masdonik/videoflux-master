
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Cpu, HardDrive, Memory } from 'lucide-react';

// Simulating system stats for the frontend
// In a real implementation, these would come from server APIs
const SystemStats = () => {
  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
  });

  useEffect(() => {
    // This simulates fetching system stats from an API
    const fetchStats = async () => {
      try {
        // In a real implementation, replace with actual API call
        // const response = await fetch('/api/system-stats');
        // const data = await response.json();
        
        // For demo purposes, we'll use random values
        const mockData = {
          cpu: Math.floor(Math.random() * 100),
          memory: Math.floor(Math.random() * 100),
          disk: Math.floor(Math.random() * 100),
        };
        
        setStats(mockData);
      } catch (error) {
        console.error('Failed to fetch system stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-accent border-0">
        <CardContent className="p-4 flex items-center space-x-4">
          <Cpu className="h-10 w-10 text-blue-400" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <p className="text-sm font-medium">CPU Usage</p>
              <p className="text-sm font-medium">{stats.cpu}%</p>
            </div>
            <Progress value={stats.cpu} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-accent border-0">
        <CardContent className="p-4 flex items-center space-x-4">
          <Memory className="h-10 w-10 text-purple-400" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <p className="text-sm font-medium">Memory Usage</p>
              <p className="text-sm font-medium">{stats.memory}%</p>
            </div>
            <Progress value={stats.memory} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-accent border-0">
        <CardContent className="p-4 flex items-center space-x-4">
          <HardDrive className="h-10 w-10 text-green-400" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <p className="text-sm font-medium">Disk Usage</p>
              <p className="text-sm font-medium">{stats.disk}%</p>
            </div>
            <Progress value={stats.disk} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStats;
