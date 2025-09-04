import { Skeleton } from '@/components/ui/skeleton';
import * as React from 'react';

export default function EmailCanvasSkeleton () {
  return (
    <div className='flex flex-col w-[600px] h-[calc(100vh-53px)]'>
        <Skeleton className='w-full h-16 my-2 '/>
        <Skeleton className='w-full h-64 my-2 '/>
        <Skeleton className='w-full h-28 my-2 '/>
        <div className="w-full h-64 grid grid-cols-3 gap-3 my-2 ">
            <Skeleton className='w-full h-full'/>
            <Skeleton className='w-full h-full'/>
            <Skeleton className='w-full h-full'/>
        </div>
        <Skeleton className='w-full h-9 my-2 '/>
        <Skeleton className='w-full h-20 my-2 '/>
    </div>
  );
}
