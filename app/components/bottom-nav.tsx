"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Today", href: "/", icon: CheckCircle },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  // Added dark mode styles and increased pb to clear Safari UI
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-2"> 
      <div className="flex justify-around items-center h-14 px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                isActive 
                  ? "text-blue-600 dark:text-blue-500" 
                  : "text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              )}
            >
              <Icon 
                className="w-6 h-6 transition-all" 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span className="text-[10px] font-medium tracking-wide">
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}