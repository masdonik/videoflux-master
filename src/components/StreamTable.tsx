
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stream } from '@/types';
import { Circle, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

interface StreamTableProps {
  streams: Stream[];
  onStopStream: (id: string) => void;
}

const StreamTable = ({ streams, onStopStream }: StreamTableProps) => {
  const handleStopClick = (id: string, videoName: string) => {
    onStopStream(id);
    toast.success(`Stream for "${videoName}" has been stopped`);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Immediate (no schedule)';
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (duration: number | null) => {
    if (duration === null) return 'Continuous (looping)';
    return `${duration} minutes`;
  };

  const getPlatformDisplay = (platform: 'facebook' | 'youtube') => {
    return platform === 'facebook' ? 'Facebook' : 'YouTube';
  };

  const formatStatus = (status: Stream['status']) => {
    if (status === 'live') {
      return <Badge className="bg-green-500">Live</Badge>;
    } else if (status === 'scheduled') {
      return <Badge variant="outline">Scheduled</Badge>;
    } else {
      return <Badge variant="secondary">Ended</Badge>;
    }
  };

  const activeStreams = streams.filter(s => s.status === 'live' || s.status === 'scheduled');

  return (
    <div className="rounded-md border mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Video Name</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Scheduled Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeStreams.length > 0 ? (
            activeStreams.map((stream) => (
              <TableRow key={stream.id}>
                <TableCell>
                  {formatStatus(stream.status)}
                </TableCell>
                <TableCell className="font-medium">{stream.videoName}</TableCell>
                <TableCell>{getPlatformDisplay(stream.platform)}</TableCell>
                <TableCell>{formatDate(stream.scheduledTime)}</TableCell>
                <TableCell>{formatDuration(stream.duration)}</TableCell>
                <TableCell className="text-right">
                  {stream.status === 'live' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleStopClick(stream.id, stream.videoName)}
                    >
                      <StopCircle className="h-4 w-4 mr-2" />
                      Stop Stream
                    </Button>
                  )}
                  {stream.status === 'scheduled' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStopClick(stream.id, stream.videoName)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No active streams. Set up a new stream to see it here.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StreamTable;
