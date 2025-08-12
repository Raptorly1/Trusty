import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { ServerStatus } from '../../hooks/useServerStatus';

interface ServerStatusIndicatorProps {
  status: ServerStatus;
  showText?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const ServerStatusIndicator: React.FC<ServerStatusIndicatorProps> = ({
  status,
  showText = true,
  size = 'md',
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return {
          icon: 'h-3 w-3',
          text: 'text-xs',
          container: 'gap-1 px-2 py-1'
        };
      case 'sm':
        return {
          icon: 'h-4 w-4',
          text: 'text-sm',
          container: 'gap-2 px-3 py-1'
        };
      case 'lg':
        return {
          icon: 'h-6 w-6',
          text: 'text-lg',
          container: 'gap-3 px-4 py-2'
        };
      case 'md':
      default:
        return {
          icon: 'h-5 w-5',
          text: 'text-base',
          container: 'gap-2 px-3 py-2'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const getStatusConfig = () => {
    switch (status) {
      case 'ready':
        return {
          icon: Wifi,
          text: 'Server Ready',
          color: 'text-success',
          bgColor: 'bg-success/10'
        };
      case 'warming':
        return {
          icon: Loader2,
          text: 'Server Starting',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          animate: 'animate-spin'
        };
      case 'error':
        return {
          icon: WifiOff,
          text: 'Server Error',
          color: 'text-error',
          bgColor: 'bg-error/10'
        };
      default:
        return {
          icon: WifiOff,
          text: 'Server Offline',
          color: 'text-base-content/50',
          bgColor: 'bg-base-content/5'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const Icon = statusConfig.icon;

  return (
    <div className={`inline-flex items-center rounded-full ${sizeClasses.container} ${statusConfig.bgColor} ${className}`}>
      <Icon 
        className={`${sizeClasses.icon} ${statusConfig.color} ${statusConfig.animate || ''} flex-shrink-0`}
      />
      {showText && (
        <span className={`${sizeClasses.text} ${statusConfig.color} font-medium`}>
          {statusConfig.text}
        </span>
      )}
    </div>
  );
};

export default ServerStatusIndicator;
