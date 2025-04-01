
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Card, CardContent } from '@/components/ui/card';
import { DownloadCloud, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DownloadFormProps {
  onDownload: (url: string) => Promise<void>;
}

const formSchema = z.object({
  url: z.string().url('Please enter a valid Google Drive URL'),
});

type FormValues = z.infer<typeof formSchema>;

const DownloadForm = ({ onDownload }: DownloadFormProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsDownloading(true);
    try {
      await onDownload(data.url);
      form.reset();
      toast.success('Video downloaded successfully');
    } catch (error) {
      toast.error('Failed to download video');
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Drive URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://drive.google.com/file/d/..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the shareable link from Google Drive
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isDownloading || !form.formState.isValid}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Download Video
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DownloadForm;
