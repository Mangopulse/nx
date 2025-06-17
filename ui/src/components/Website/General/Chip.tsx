"use client"
import { cn } from '@/lib/utils';
import * as React from 'react';

export interface IChipProps {
    children: React.ReactElement | string;
    className?: string;
}

export default function Chip ({children, className}: IChipProps) {
  return (
    <div className={cn('w-fit font-semibold rounded bg-primary-500 text-primary-foreground px-3 py-1.5 border-2 border-primary shadow-[-2px_2px_0px_0px_hsl(var(--primary))]', className)}>
      {children}
    </div>
  );
}
