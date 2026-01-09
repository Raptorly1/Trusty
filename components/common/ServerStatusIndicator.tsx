import React from 'react';
import { motion } from 'framer-motion';
import { Server, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export type ServerStatus = 'unknown' | 'warming' | 'ready' | 'error';

interface ServerStatusIndicatorProps {
  status: ServerStatus;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ServerStatusIndicator: React.FC<ServerStatusIndicatorProps> = ({
  status,
  showText = false,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'ready':
        return {
          icon: <CheckCircle className={`${sizeClasses[size]} text-success`} />,
          text: 'Server Ready',
          badgeColor: 'badge-success'
        };
      case 'warming':
        return {
          icon: <Clock className={`${sizeClasses[size]} text-warning animate-spin`} />,
          text: 'Server Starting',
          badgeColor: 'badge-warning'
        };
      case 'error':
        return {
          icon: <AlertCircle className={`${sizeClasses[size]} text-error`} />,
          text: 'Server Error',
          badgeColor: 'badge-error'
        };
      default:
        return {
          icon: <Server className={`${sizeClasses[size]} text-info animate-pulse`} />,
          text: 'Checking Server',
          badgeColor: 'badge-info'
        };
    }
  };

  const config = getStatusConfig();

  if (showText) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`badge ${config.badgeColor} gap-2 ${className}`}
      >
        {config.icon}
        <span className="text-xs font-medium">{config.text}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`tooltip tooltip-bottom ${className}`}
      data-tip={config.text}
    >
      {config.icon}
    </motion.div>
  );
};

export default ServerStatusIndicator;
