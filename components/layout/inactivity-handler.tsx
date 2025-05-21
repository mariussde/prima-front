'use client';

import { useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export function InactivityHandler() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(async () => {
      await signOut({ redirect: false });
      router.push('/login');
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    // Set up event listeners for user activity
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart'
    ];

    // Reset timer on any activity
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Initial timer setup
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [router]);

  return null;
} 