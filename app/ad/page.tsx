import { DeviceGate } from '@/components/admin/device-gate';
import { AdminLogin } from '@/components/admin/admin-login';

export default function AdminEntryPage() {
  return (
    <main className="container-page py-10">
      <DeviceGate>
        <AdminLogin />
      </DeviceGate>
    </main>
  );
}
