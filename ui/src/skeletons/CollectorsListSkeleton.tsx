import { Skeleton } from '@/components/ui/skeleton';
import * as React from 'react';

export default function CollectorsListSkeleton () {
  return (
    <div className='flex gap-3 items-stretch h-full'>
        {new Array(3).fill(0).map((_, i) => <Skeleton key={i} className='w-72 h-36' />)}
    </div>
  );
}
