import { Image, Video } from 'lucide-react';

interface MediaPlaceholderProps {
  type: 'image' | 'video';
  label: string;
}

export default function MediaPlaceholder({ type, label }: MediaPlaceholderProps) {
  const Icon = type === 'image' ? Image : Video;

  return (
    <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-muted">
      <div className="text-center">
        <Icon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
