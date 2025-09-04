import MainLayout from '@/layouts/MainLayout';
import * as React from 'react';

export interface ILayoutProps {
    children: React.ReactNode
}

export default function Layout ({children}: ILayoutProps) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}
