'use client';

import { FormEvent, useState } from 'react';
import { createSupabaseClient } from '@/supabase/client';
import { getOrCreateDeviceId } from '@/lib/device';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return toast.error(error.message);

    const accessToken = data.session?.access_token;
    if (!accessToken) return toast.error('Không lấy được access token');

    const deviceId = getOrCreateDeviceId();
    const sessionRes = await fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: accessToken, device_id: deviceId })
    });

    if (!sessionRes.ok) {
      const payload = await sessionRes.json();
      return toast.error(payload.error || 'Không thể tạo phiên admin');
    }

    toast.success('Đăng nhập thành công');
    window.location.href = '/ad/dashboard';
  };

  return (
    <form onSubmit={onSubmit} className="card mx-auto max-w-md space-y-3">
      <h2 className="text-xl font-semibold">Admin Login</h2>
      <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button className="w-full">Đăng nhập</Button>
    </form>
  );
}
