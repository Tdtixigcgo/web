'use client';

import { useEffect, useState } from 'react';
import { getOrCreateDeviceId, isDeviceMarkedApproved, markDeviceApproved } from '@/lib/device';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type GateState = 'checking' | 'request' | 'pending' | 'approved';

export function DeviceGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GateState>('checking');

  const check = async () => {
    const deviceId = getOrCreateDeviceId();
    const res = await fetch(`/api/admin/device-status?device_id=${deviceId}`);
    const payload = await res.json();

    if (payload.approved) {
      markDeviceApproved(true);
      setState('approved');
      return;
    }

    if (isDeviceMarkedApproved()) {
      markDeviceApproved(false);
    }

    setState(payload.pending ? 'pending' : 'request');
  };

  useEffect(() => {
    check();
  }, []);

  const requestAccess = async () => {
    const deviceId = getOrCreateDeviceId();
    const body = {
      device_id: deviceId,
      device_name: navigator.platform || 'Unknown device',
      browser_info: navigator.userAgent
    };

    const res = await fetch('/api/admin/access-request', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      toast.error('Không thể gửi yêu cầu duyệt.');
      return;
    }

    toast.success('Đã gửi yêu cầu duyệt thiết bị.');
    setState('pending');
  };

  if (state === 'checking') return <div className="card">Đang kiểm tra thiết bị...</div>;

  if (state === 'request') {
    return (
      <div className="card space-y-3">
        <h1 className="text-xl font-semibold">Xác minh truy cập quản trị</h1>
        <p className="text-sm text-gray-500">Thiết bị này chưa được duyệt. Bấm nút dưới để gửi yêu cầu đến email quản trị.</p>
        <Button onClick={requestAccess}>Gửi yêu cầu duyệt</Button>
      </div>
    );
  }

  if (state === 'pending') {
    return (
      <div className="card space-y-2">
        <h1 className="text-xl font-semibold">Đang chờ duyệt thiết bị</h1>
        <p className="text-sm text-gray-500">Yêu cầu đã gửi đến admin. Vui lòng chờ phê duyệt, sau đó tải lại trang này.</p>
        <Button variant="secondary" onClick={check}>
          Kiểm tra lại
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
