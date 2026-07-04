"use client";

import { useEffect, useState } from "react";
import { useHabitStore } from "@/store/useHabitStore";
import { registerServiceWorkerAndRequestPush } from "@/lib/push"; // Your push utility
import { Moon, Bell, EyeOff, AlertTriangle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { hideCompleted, toggleHideCompleted, clearProgram } = useHabitStore();
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pushStatus, setPushStatus] = useState<"idle" | "granted" | "denied">("idle");

  useEffect(() => {
    setIsClient(true);
    // Check initial dark mode status from HTML tag
    setIsDarkMode(document.documentElement.classList.contains("dark"));
    
    // Check initial notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushStatus(Notification.permission as any);
    }
  }, []);

  if (!isClient) return null;

  // Manual Dark Mode Toggle Logic
  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  const handlePushRequest = async () => {
    const registration = await registerServiceWorkerAndRequestPush();
    if (registration) {
      setPushStatus("granted");
      if ("vibrate" in navigator) navigator.vibrate(50);
    } else {
      setPushStatus("denied");
    }
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you absolutely sure? This will wipe your entire 7-week history and streak."
    );
    if (confirmReset) {
      clearProgram();
      window.location.href = "/"; // Force a reload to the Today page to re-initialize
    }
  };

  return (
    <div className="flex flex-col h-full px-4 pt-12 pb-24 max-w-md mx-auto overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Preferences Section */}
        <div>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
            Preferences
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300">
                  <Moon className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">Dark Mode</span>
              </div>
              <ToggleSwitch isChecked={isDarkMode} onChange={toggleTheme} />
            </div>

            {/* Focus Mode Toggle */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white block">Focus Mode</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Hide completed tasks today</span>
                </div>
              </div>
              <ToggleSwitch isChecked={hideCompleted} onChange={toggleHideCompleted} />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
            System
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <button 
              onClick={handlePushRequest}
              disabled={pushStatus === "granted"}
              className="w-full flex items-center justify-between p-4 active:bg-gray-50 dark:active:bg-gray-800 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <Bell className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Push Notifications
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {pushStatus === "granted" ? "Enabled" : pushStatus === "denied" ? "Denied" : "Setup"}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-4">
          <h2 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 px-1">
            Danger Zone
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 overflow-hidden">
            <button 
              onClick={handleReset}
              className="w-full flex items-center justify-between p-4 active:bg-red-50 dark:active:bg-red-900/20 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="font-medium text-red-600 dark:text-red-500">
                  Reset 7-Week Journey
                </span>
              </div>
            </button>
          </div>
          <p className="text-xs text-center text-gray-500 mt-4">
            Version 1.0.0 • Local Storage Synced
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Helper Component: iOS Style Toggle Switch ---
function ToggleSwitch({ isChecked, onChange }: { isChecked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={isChecked}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
        isChecked ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
      )}
    >
      <span
        className={cn(
          "inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out",
          isChecked ? "translate-x-5" : "translate-x-1"
        )}
      />
    </button>
  );
}