import React from 'react';
import { Loader2, Sparkles, Cpu } from 'lucide-react';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  message = 'Please wait... AI Working on your course',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="flex flex-col items-center justify-center px-10 py-8 bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full text-center">
        {/* Animated AI Gear Icon matching the video illustration */}
        <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full opacity-20 animate-ping"
            style={{ backgroundColor: '#8150E8' }}
          />
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform rotate-6 transition-transform"
            style={{ backgroundColor: '#F3E8FF', border: '2px solid #8150E8' }}
          >
            <Cpu className="w-8 h-8 text-[#8150E8] animate-pulse" />
          </div>
          <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-bounce" />
        </div>

        <h4 className="text-base font-semibold text-slate-800 mb-1">
          {message}
        </h4>
        <p className="text-xs text-slate-500">
          Generating structured curriculum & chapters
        </p>

        <div className="flex items-center gap-1.5 mt-4">
          <span className="w-2 h-2 rounded-full bg-[#8150E8] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#8150E8] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#8150E8] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
