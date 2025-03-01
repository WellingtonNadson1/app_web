'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  className?: string;
}

export default function BackButton({
  label = 'Back',
  className = '',
}: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      className={`flex items-center gap-2 ${className}`}
      aria-label="Go back to previous page"
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
