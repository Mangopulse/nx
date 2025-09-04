import { Skeleton } from '@/components/ui/skeleton';
import * as React from 'react';

export default function NewslettersListSkeleton () {
  return (
    <div className='flex gap-3 items-center'>
        {new Array(3).fill(0).map((_, i) => <Skeleton key={i} className='w-64 aspect-[0.8]' />)}
    </div>
  );
}
