import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';


interface ToastProps {
    message: string;
    type?: 'info' | 'error' | 'success';
    onClose: () => void;
    duration?: number;
    backgroundColor?: string;
    textColor?: string;
}

const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    onClose,
    duration = 4000,
    backgroundColor = '#ffffff',
    textColor = '#000000'
}) => {

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const isLight = backgroundColor === '#ffffff';

    const getIcon = () => {
        switch (type) {
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            default:
                return <Info className="w-4 h-4 text-sky-500" />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'error':
                return {
                    bg: isLight ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.2)',
                    border: 'rgba(239, 68, 68, 0.3)',
                    text: '#ef4444'
                };
            case 'success':
                return {
                    bg: isLight ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.2)',
                    border: 'rgba(34, 197, 94, 0.3)',
                    text: '#22c55e'
                };
            default:
                return {
                    bg: isLight ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.2)',
                    border: 'rgba(14, 165, 233, 0.3)',
                    text: '#0ea5e9'
                };
        }
    };

    const colors = getColors();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm"
            style={{
                backgroundColor: colors.bg,
                borderColor: colors.border
            }}
        >
            {getIcon()}
            <p className="text-xs font-semibold flex-1" style={{ color: textColor }}>
                {message}
            </p>
            <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Close notification"
            >
                <X className="w-3.5 h-3.5 opacity-40" style={{ color: textColor }} />
            </button>
        </motion.div>
    );
};

export default Toast;
