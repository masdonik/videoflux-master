
export interface Video {
  id: string;
  name: string;
  size: string;
  downloadDate: string;
  path: string;
}

export interface Stream {
  id: string;
  videoId: string;
  videoName: string;
  platform: 'facebook' | 'youtube';
  streamKey: string;
  scheduledTime: string | null;
  duration: number | null; // in minutes, null means looping indefinitely
  status: 'scheduled' | 'live' | 'ended';
  startTime?: string;
}

export interface SystemResource {
  cpu: number;
  memory: number;
  disk: number;
}
