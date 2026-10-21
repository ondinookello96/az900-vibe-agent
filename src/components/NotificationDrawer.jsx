import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Trash2, 
  Clock 
} from 'lucide-react';

export const NotificationDrawer = ({ 
  isOpen, 
  onClose, 
  notifications, 
  onClearAll, 
  onSelectNotification 
}) => {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-white shadow-2xl flex flex-col justify-between">
          
          {/* Top Bar */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Study Nudges & Alerts</h3>
                <p className="text-xs text-slate-400">Agent spaced repetition notifications</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No active notifications right now. Keep vibing!
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => onSelectNotification && onSelectNotification(n)}
                  className={`p-4 rounded-xl border transition text-left cursor-pointer space-y-1.5 ${
                    n.read 
                      ? 'bg-slate-950/40 border-slate-850 opacity-75' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getIcon(n.type)}
                      <span className="font-semibold text-xs sm:text-sm text-white">{n.title}</span>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-6">
                    {n.message}
                  </p>
                  <div className="flex items-center space-x-1 pl-6 pt-1 text-[10px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>{notifications.length} alerts saved</span>
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-rose-400 hover:text-rose-300 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
