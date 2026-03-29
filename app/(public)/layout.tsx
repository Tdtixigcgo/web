import { PublicHeader } from '@/components/public/header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PublicHeader />
      <main className="container-page py-8">{children}</main>
    </div>
  );
}
