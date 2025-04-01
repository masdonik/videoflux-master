
import { Video, Stream } from '@/types';

export const mockVideos: Video[] = [
  {
    id: '1',
    name: 'Product Presentation.mp4',
    size: '245 MB',
    downloadDate: '2023-05-15',
    path: '/videos/presentation.mp4',
  },
  {
    id: '2',
    name: 'Training Session.mp4',
    size: '1.2 GB',
    downloadDate: '2023-06-20',
    path: '/videos/training.mp4',
  },
  {
    id: '3',
    name: 'Marketing Campaign.mp4',
    size: '780 MB',
    downloadDate: '2023-07-10',
    path: '/videos/marketing.mp4',
  },
];

export const mockStreams: Stream[] = [
  {
    id: '1',
    videoId: '1',
    videoName: 'Product Presentation.mp4',
    platform: 'youtube',
    streamKey: 'yt-123456789',
    scheduledTime: '2023-08-15T15:00:00',
    duration: 60,
    status: 'scheduled',
  },
  {
    id: '2',
    videoId: '3',
    videoName: 'Marketing Campaign.mp4',
    platform: 'facebook',
    streamKey: 'fb-987654321',
    scheduledTime: null,
    duration: null,
    status: 'live',
    startTime: '2023-08-10T10:30:00',
  },
];

export const getSystemStats = (): { cpu: number; memory: number; disk: number } => {
  return {
    cpu: Math.floor(Math.random() * 100),
    memory: Math.floor(Math.random() * 100),
    disk: Math.floor(Math.random() * 100),
  };
};
