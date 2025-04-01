
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, PlayCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Video, Stream } from '@/types';
import { toast } from 'sonner';

interface StreamingFormProps {
  videos: Video[];
  onStartStream: (stream: Omit<Stream, 'id' | 'status' | 'startTime'>) => void;
}

const formSchema = z.object({
  videoId: z.string().min(1, 'Please select a video'),
  platform: z.enum(['facebook', 'youtube'], {
    required_error: 'Please select a platform',
  }),
  streamKey: z.string().min(1, 'Please enter your stream key'),
  scheduledTime: z.date().optional(),
  duration: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const StreamingForm = ({ videos, onStartStream }: StreamingFormProps) => {
  const [isScheduled, setIsScheduled] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoId: '',
      platform: 'youtube',
      streamKey: '',
      duration: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    const selectedVideo = videos.find(v => v.id === data.videoId);
    
    if (!selectedVideo) {
      toast.error('Selected video not found');
      return;
    }

    const stream: Omit<Stream, 'id' | 'status' | 'startTime'> = {
      videoId: data.videoId,
      videoName: selectedVideo.name,
      platform: data.platform,
      streamKey: data.streamKey,
      scheduledTime: data.scheduledTime ? data.scheduledTime.toISOString() : null,
      duration: data.duration ? parseInt(data.duration, 10) : null,
    };

    onStartStream(stream);
    
    // Show success message
    const successMessage = data.scheduledTime 
      ? `Stream scheduled for ${format(data.scheduledTime, 'PPP p')}`
      : 'Stream started successfully';
    
    toast.success(successMessage);
    
    // Reset form
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="videoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a video to stream" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {videos.length > 0 ? (
                      videos.map((video) => (
                        <SelectItem key={video.id} value={video.id}>
                          {video.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No videos available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose a video from your downloaded videos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select streaming platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the platform to stream to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="streamKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stream Key</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your stream key" {...field} />
                </FormControl>
                <FormDescription>
                  The stream key from your platform
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Leave empty for continuous loop" {...field} />
                </FormControl>
                <FormDescription>
                  Set a specific duration or leave empty for continuous looping
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsScheduled(!isScheduled)}
          >
            {isScheduled ? "Stream Now" : "Schedule Stream"}
          </Button>
          
          {isScheduled && (
            <FormField
              control={form.control}
              name="scheduledTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP p")
                          ) : (
                            <span>Pick a date and time</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <Input
                          type="time"
                          onChange={(e) => {
                            const date = field.value || new Date();
                            const [hours, minutes] = e.target.value.split(':');
                            date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                            field.onChange(date);
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Button type="submit" className="w-full md:w-auto">
          <PlayCircle className="mr-2 h-4 w-4" />
          {isScheduled ? "Schedule Stream" : "Start Streaming"}
        </Button>
      </form>
    </Form>
  );
};

export default StreamingForm;
