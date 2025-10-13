import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export type ServerStatus = 'unknown' | 'warming' | 'ready' | 'error';

interface ServerStatusPopupProps {
  status: ServerStatus;
  isVisible: boolean;
  estimatedWaitTime?: number;
  onClose?: () => void;
  onRetry?: () => void;
}

const ServerStatusPopup: React.FC<ServerStatusPopupProps> = ({
  status,
  isVisible,
  estimatedWaitTime,
  onClose,
  onRetry
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isVisible) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  const getStatusContent = () => {
    switch (status) {
      case 'warming':
        return {
          icon: <Clock className="h-8 w-8 text-warning animate-spin" />,
          title: 'Server is Starting Up',
          message: 'Our server is waking up in the background. You can still submit requests - they\'ll be processed once the server is ready!',
          waitTime: estimatedWaitTime,
          variant: 'warning'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-8 w-8 text-error" />,
          title: 'Server Unavailable',
          message: 'We\'re having trouble connecting to our servers. You can still try submitting requests, but they may take longer than usual.',
          variant: 'error'
        };
      case 'ready':
        return {
          icon: <CheckCircle className="h-8 w-8 text-success" />,
          title: 'Server Ready!',
          message: 'Everything is working perfectly. You can now use all features at full speed.',
          variant: 'success'
        };
      default:
        return {
          icon: <Server className="h-8 w-8 text-info animate-pulse" />,
          title: 'Checking Server Status',
          message: 'Please wait while we check if our services are available.',
          variant: 'info'
        };
    }
  };

  const content = getStatusContent();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            ref={modalRef}
            className="bg-base-100 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 border border-base-300"
          >
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                {content.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-base-content">
                {content.title}
              </h3>

              {/* Message */}
              <p className="text-lg text-base-content/80 leading-relaxed">
                {content.message}
              </p>

              {/* Wait time countdown */}
              {status === 'warming' && Boolean(content.waitTime) && (
                <div className="bg-base-200 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 text-warning">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">
                      Estimated wait time: ~{content.waitTime} seconds
                    </span>
                  </div>
                  <div className="mt-2">
                    <progress className="progress progress-warning w-full" />
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 justify-center pt-4">
                {status === 'error' && onRetry && (
                  <button
                    onClick={onRetry}
                    className="btn btn-primary"
                  >
                    Try Again
                  </button>
                )}
                
                {(status === 'ready' || status === 'error') && onClose && (
                  <button
                    onClick={onClose}
                    className={`btn ${status === 'ready' ? 'btn-success' : 'btn-outline'}`}
                  >
                    {status === 'ready' ? 'Great!' : 'Close'}
                  </button>
                )}
              </div>

              {/* Help text */}
              {status === 'warming' && (
                <div className="text-sm text-base-content/60 bg-base-200 rounded-lg p-3">
                  <p className="font-medium mb-1">Why is this happening?</p>
                  <p>Our server goes to sleep when not in use to save energy. You can still use the website normally - just submit your requests and they'll be processed when ready!</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServerStatusPopup;
