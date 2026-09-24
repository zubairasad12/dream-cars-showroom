import React from 'react';
import AdminLayout from '@/components/AdminLayout';

export const metadata = {
  title: 'Dream Cars Admin Portal',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
