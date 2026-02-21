import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onConfirm?: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  confirmText?: string;
  cancelText?: string;
  onCancel?: () => void;
}

export default function Modal({
  isOpen,
  onConfirm,
  title,
  message,
  type,
  confirmText = "OK",
  cancelText = "Cancel",
  onCancel
}: ModalProps) {

  const getIcon = () => {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error_outline';
      case 'warning': return 'warning_amber';
      case 'info': default: return 'info_outline';
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'success': return 'bg-emerald-500/10 text-emerald-500 dark:text-[#6ee7b7]';
      case 'error': return 'bg-red-500/10 text-red-500 dark:text-red-400';
      case 'warning': return 'bg-amber-500/10 text-amber-500 dark:text-amber-400';
      case 'info': default: return 'bg-blue-500/10 text-blue-500 dark:text-blue-400';
    }
  };

  const getTopBorderClass = () => {
    switch (type) {
      case 'success': return 'bg-emerald-500 dark:bg-[#6ee7b7]';
      case 'error': return 'bg-red-500 dark:bg-red-500';
      case 'warning': return 'bg-amber-500 dark:bg-amber-500';
      case 'info': default: return 'bg-blue-500 dark:bg-blue-500';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={undefined}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white/10 dark:bg-[#0a110a] backdrop-blur-xl border border-white/20 dark:border-[var(--neon-green)]/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] dark:shadow-[0_0_30px_rgba(57,255,20,0.1)] relative overflow-hidden"
          >
            {/* Decorative Top Glow */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${getTopBorderClass()} opacity-80`} />

            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-inner ${getColorClass()}`}>
                <span className="material-icons-round text-3xl">{getIcon()}</span>
              </div>

              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 font-medium mb-8">
                {message}
              </p>

              <div className="flex w-full gap-4 justify-center mt-2">
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="flex-1 py-3 px-6 rounded-xl font-bold font-mono tracking-wide bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm uppercase tracking-widest text-xs"
                  >
                    {cancelText}
                  </button>
                )}
                {onConfirm && (
                  <button
                    onClick={onConfirm}
                    className={`flex-1 py-3 px-6 rounded-xl font-bold font-mono tracking-wide text-white transition-colors shadow-lg shadow-emerald-500/20 active:scale-95 uppercase tracking-widest text-xs ${type === 'error' ? 'bg-red-500 hover:bg-red-600' :
                      type === 'warning' ? 'bg-amber-500 hover:bg-amber-600' :
                        type === 'info' ? 'bg-blue-500 hover:bg-blue-600' :
                          'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                  >
                    {confirmText}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
