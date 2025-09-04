"use client"
import { cn } from '@/lib/utils';
import * as React from 'react';

export interface ISectionTitleProps {
    className?: string;
    children: React.ReactNode | string
}

export function SectionTitle ({className, children}: ISectionTitleProps) {
  return (
    <h2 className={cn("text-center font-bold text-2xl md:text-4xl text-primary mb-8 md:mb-16 rtl:space-y-3", className)}>
      {children}
    </h2>
  );
}
