"use client"
import ClarityScript from '@/components/tracking/ClarityScript';
import MainLayout from '@/layouts/MainLayout';
import { usePathname } from 'next/navigation';
import * as React from 'react';

export interface ILayoutProps {
    children: React.ReactNode
}

export default function Layout ({children}: ILayoutProps) {

  const pathname = usePathname();
  const pad = ["settings", "collector/basic"].filter(e => pathname.includes(e));

  return (
    <MainLayout pad={!Boolean(pad.length)}>
      {children}
      <ClarityScript/>
    </MainLayout>
  );
}
