
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SystemStats from '@/components/SystemStats';
import StreamingForm from '@/components/StreamingForm';
import StreamTable from '@/components/StreamTable';
import Navbar from '@/components/Navbar';
import { v4 as uuidv4 } from 'uuid';
import { Stream } from '@/types';
import { mockVideos, mockStreams } from '@/utils/mockData';
import { toast } from 'sonner';

const Index = () => {
  const [streams, setStreams] = useState<Stream[]>(mockStreams);
  const [videos] = useState(mockVideos);

  const handleStartStream = (newStream: Omit<Stream, 'id' | 'status' | 'startTime'>) => {
    const streamExists = streams.some(
      s => s.videoId === newStream.videoId && 
           s.platform === newStream.platform && 
           s.status !== 'ended'
    );

    if (streamExists) {
      toast.error('This video is already being streamed to the selected platform');
      return;
    }

    const stream: Stream = {
      id: uuidv4(),
      ...newStream,
      status: newStream.scheduledTime ? 'scheduled' : 'live',
      startTime: newStream.scheduledTime ? undefined : new Date().toISOString(),
    };

    setStreams(prev => [...prev, stream]);

    // In a real implementation, we would call the backend to start the stream
    console.log('Starting stream:', stream);
  };

  const handleStopStream = (id: string) => {
    setStreams(prev => 
      prev.map(stream => 
        stream.id === id 
          ? { ...stream, status: 'ended' } 
          : stream
      )
    );

    // In a real implementation, we would call the backend to stop the stream
    console.log('Stopping stream:', id);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-6 flex-1">
        <SystemStats />
        
        <Card className="shadow-md border-accent">
          <CardHeader>
            <CardTitle>Live Streaming</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="new">
              <TabsList className="mb-6">
                <TabsTrigger value="new">New Stream</TabsTrigger>
                <TabsTrigger value="active">Active Streams</TabsTrigger>
              </TabsList>
              
              <TabsContent value="new">
                <StreamingForm 
                  videos={videos} 
                  onStartStream={handleStartStream} 
                />
              </TabsContent>
              
              <TabsContent value="active">
                <StreamTable 
                  streams={streams.filter(s => s.status !== 'ended')} 
                  onStopStream={handleStopStream} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
