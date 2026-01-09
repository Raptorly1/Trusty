import { useState, useEffect, useCallback } from 'react';
import { checkServerHealth, warmUpServer } from '../services/geminiService';

export type ServerStatus = 'unknown' | 'warming' | 'ready' | 'error';

interface UseServerStatusResult {
  status: ServerStatus;
  isWarming: boolean;
  isReady: boolean;
  isError: boolean;
  estimatedWaitTime?: number;
  checkStatus: () => Promise<void>;
  startWarmUp: () => Promise<void>;
}

export const useServerStatus = (autoCheck: boolean = true): UseServerStatusResult => {
  const [status, setStatus] = useState<ServerStatus>('unknown');
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | undefined>();

  const checkStatus = useCallback(async () => {
    try {
      const result = await checkServerHealth();
      setStatus(result.status);
      setEstimatedWaitTime(result.estimatedWaitTime);
    } catch (error) {
      console.warn('Server status check failed:', error);
      setStatus('error');
      setEstimatedWaitTime(undefined);
    }
  }, []);

  const startWarmUp = useCallback(async () => {
    setStatus('warming');
    try {
      await warmUpServer();
      // Check status after warm-up attempt
      await checkStatus();
    } catch (error) {
      console.warn('Server warm-up failed:', error);
      setStatus('error');
    }
  }, [checkStatus]);

  useEffect(() => {
    if (autoCheck) {
      // Initial check
      checkStatus();
      
      // Set up periodic checking when warming
      const interval = setInterval(() => {
        if (status === 'warming' || status === 'unknown') {
          checkStatus();
        }
      }, 10000); // Check every 10 seconds when warming

      return () => clearInterval(interval);
    }
  }, [autoCheck, checkStatus, status]);

  return {
    status,
    isWarming: status === 'warming',
    isReady: status === 'ready',
    isError: status === 'error',
    estimatedWaitTime,
    checkStatus,
    startWarmUp
  };
};
