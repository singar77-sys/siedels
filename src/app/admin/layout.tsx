import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin | Siedel's Barbershop",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
