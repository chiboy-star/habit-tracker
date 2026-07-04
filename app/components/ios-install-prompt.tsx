"use client";

import { useEffect, useState } from "react";
import { Share, PlusSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function IosInstallPrompt() {
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if the device is iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Check if the app is already installed and running in standalone mode
    const isRunningStandalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(isRunningStandalone);

    // Show prompt if it's iOS and NOT installed
    if (isIosDevice && !isRunningStandalone) {
      setShowPrompt(true);
    }
  }, []);

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-[4.5rem] left-4 right-4 z-[60] bg-white rounded-2xl shadow-xl border border-gray-100 p-4"
      >
        <button 
          onClick={() => setShowPrompt(false)}
          className="absolute top-2 right-2 text-gray-400 p-1"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-sm font-bold text-gray-900 mb-2">
          Install for Notifications
        </h3>
        <p className="text-xs text-gray-600 mb-4">
          To receive daily habit reminders, you must add this app to your Home Screen.
        </p>
        
        <div className="flex items-center gap-2 text-xs font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">
          <span>Tap</span>
          <Share className="w-4 h-4 text-blue-600" />
          <span>then select</span>
          <PlusSquare className="w-4 h-4 text-blue-600" />
          <span>&quot;Add to Home Screen&quot;</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}