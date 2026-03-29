'use client';

import { v4 as uuid } from 'uuid';

const DEVICE_ID_KEY = 'ad_device_id';
const DEVICE_APPROVED_KEY = 'ad_device_approved';

export function getOrCreateDeviceId() {
  const stored = localStorage.getItem(DEVICE_ID_KEY);
  if (stored) return stored;
  const newId = uuid();
  localStorage.setItem(DEVICE_ID_KEY, newId);
  return newId;
}

export function markDeviceApproved(value: boolean) {
  localStorage.setItem(DEVICE_APPROVED_KEY, value ? '1' : '0');
}

export function isDeviceMarkedApproved() {
  return localStorage.getItem(DEVICE_APPROVED_KEY) === '1';
}
