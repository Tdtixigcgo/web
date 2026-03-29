'use client';

import { FormEvent, useState } from 'react';
import { createSupabaseClient } from '@/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return toast.error(error.message);
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
