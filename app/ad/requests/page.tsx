'use client';

import { useEffect, useState } from 'react';
import { AdminAccessRequest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<AdminAccessRequest[]>([]);

  const load = async () => {
    const res = await fetch('/api/admin/access-request');
    setRequests((await res.json()).data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, action: 'approve' | 'reject') => {
    const endpoint = action === 'approve' ? '/api/admin/approve-device' : '/api/admin/reject-device';
    const res = await fetch(endpoint, { method: 'POST', body: JSON.stringify({ request_id: id }) });
    if (!res.ok) return toast.error('Cập nhật thất bại');
    toast.success('Đã cập nhật yêu cầu');
    load();
  };

  return (
    <div className="card space-y-3">
      <h2 className="text-lg font-semibold">Quản lý yêu cầu truy cập admin</h2>
      {requests.map((r) => (
        <div key={r.id} className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
          <p className="font-medium">{r.device_name}</p>
          <p className="text-xs text-gray-500">{r.browser_info}</p>
          <p className="text-sm">Trạng thái: {r.status}</p>
          {r.status === 'pending' && (
            <div className="mt-2 flex gap-2">
              <Button onClick={() => updateStatus(r.id, 'approve')}>Duyệt</Button>
              <Button variant="danger" onClick={() => updateStatus(r.id, 'reject')}>Từ chối</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
