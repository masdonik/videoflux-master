
import { useState } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Video } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface VideoTableProps {
  videos: Video[];
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

const VideoTable = ({ videos, onRename, onDelete }: VideoTableProps) => {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [newName, setNewName] = useState('');

  const handleRenameClick = (video: Video) => {
    setSelectedVideo(video);
    setNewName(video.name);
    setRenameDialogOpen(true);
  };

  const handleDeleteClick = (video: Video) => {
    setSelectedVideo(video);
    setDeleteDialogOpen(true);
  };

  const handleRenameConfirm = () => {
    if (selectedVideo) {
      onRename(selectedVideo.id, newName);
      toast.success(`Video renamed to ${newName}`);
      setRenameDialogOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedVideo) {
      onDelete(selectedVideo.id);
      toast.success(`Video deleted successfully`);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Video Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Download Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.length > 0 ? (
              videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">{video.name}</TableCell>
                  <TableCell>{video.size}</TableCell>
                  <TableCell>{video.downloadDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRenameClick(video)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(video)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No videos found. Download videos from Google Drive to see them here.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Video</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full"
              placeholder="Enter new name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameConfirm} disabled={!newName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the video "{selectedVideo?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VideoTable;
