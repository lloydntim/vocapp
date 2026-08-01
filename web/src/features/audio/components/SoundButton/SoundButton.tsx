'use client';

import { MouseEvent } from 'react';
import IconButton from '@/components/ui/IconButton/IconButton';
import { useItemAudio } from '../../hooks';
import { ItemAudioField } from '../../schemas';

interface SoundButtonProps {
  listId: string;
  itemId: string;
  field: ItemAudioField;
  title?: string;
  className?: string;
  size?: 'small' | 'base' | 'large';
}

function SoundButton({
  listId,
  itemId,
  field,
  title = 'Listen',
  className,
  size,
}: SoundButtonProps) {
  const { play, isLoading } = useItemAudio(listId, itemId, field);

  const handleClick = (event: MouseEvent) => {
    // Cells that render this inside a <Link> (e.g. the source-text column)
    // would otherwise also navigate on click.
    event.stopPropagation();
    event.preventDefault();
    play();
  };

  return (
    <IconButton
      className={className}
      size={size}
      variant="ghost"
      icon="volume-1"
      title={title}
      loading={isLoading}
      onClick={handleClick}
    />
  );
}

export default SoundButton;
