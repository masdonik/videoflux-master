
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SystemStats from '@/components/SystemStats';
import VideoTable from '@/components/VideoTable';
import DownloadForm from '@/components/DownloadForm';
import Navbar from '@/components/Navbar';
import { Video } from '@/types';
import { mockVideos } from '@/utils/mockData';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const Download = () => {
  const [videos, setVideos] = useState<Video[]>(mockVideos);

  const handleDownload = async (url: string): Promise<void> => {
    // In a real implementation, we would call the backend to download the video
    console.log('Downloading video from:', url);
    
    // Simulate download delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const newVideo: Video = {
          id: uuidv4(),
          name: `Video-${Math.floor(Math.random() * 1000)}.mp4`,
          size: `${Math.floor(Math.random() * 1000) + 100} MB`,
          downloadDate: new Date().toISOString().split('T')[0],
          path: `/videos/video-${Date.now()}.mp4`,
        };
        
        setVideos(prev => [...prev, newVideo]);
        resolve();
      }, 2000);
    });
  };

  const handleRename = (id: string, newName: string) => {
    setVideos(prev => 
      prev.map(video => 
        video.id === id 
          ? { ...video, name: newName } 
          : video
      )
    );
  };

  const handleDelete = (id: string) => {
    setVideos(prev => prev.filter(video => video.id !== id));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-6 flex-1">
        <SystemStats />
        
        <Card className="shadow-md border-accent mb-6">
          <CardHeader>
            <CardTitle>Download Video from Google Drive</CardTitle>
          </CardHeader>
          <CardContent>
            <DownloadForm onDownload={handleDownload} />
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-accent">
          <CardHeader>
            <CardTitle>Manage Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoTable 
              videos={videos} 
              onRename={handleRename} 
              onDelete={handleDelete} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Download;
