"use client";

import { useEffect, useState } from "react";
import { useHabitStore } from "@/store/useHabitStore";
import { Flame, Calendar as CalendarIcon, Dumbbell, Droplets, Utensils, Briefcase, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function SchedulePage() {
  const { tasks, currentStreak } = useHabitStore();
  const [isClient, setIsClient] = useState(false);
  const [todayString, setTodayString] = useState("");

  useEffect(() => {
    setIsClient(true);
    const today = new Date();
    const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000))
      .toISOString()
      .split("T")[0];
    setTodayString(localDate);
  }, []);

  if (!isClient) return null;

  // Extract the 49 unique dates and calculate their status
  const uniqueDates = Array.from(new Set(tasks.map((t) => t.date))).sort();
  
  const gridDays = uniqueDates.map((dateStr) => {
    const dayTasks = tasks.filter((t) => t.date === dateStr);
    const total = dayTasks.length;
    const completed = dayTasks.filter((t) => t.completed).length;
    const isPerfect = total > 0 && completed === total;

    let status = "future";
    if (dateStr < todayString) {
      status = isPerfect ? "completed" : "missed";
    } else if (dateStr === todayString) {
      status = isPerfect ? "completed" : "today";
    }

    return { date: dateStr, status, percent: total > 0 ? (completed / total) * 100 : 0 };
  });

  const totalCompleted = tasks.filter(t => t.completed).length;
  const globalProgress = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0;

  return (
    <div className="flex flex-col h-full px-4 pt-12 pb-8 max-w-md mx-auto overflow-y-auto">
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Schedule</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">
            7-Week Crucible
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-500 px-3 py-1.5 rounded-full font-bold text-sm">
          <Flame className="w-4 h-4 fill-current" />
          {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
        </div>
      </div>

      {/* 49-Day Grid (The Crucible) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Consistency Map</span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{globalProgress}% Total</span>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {gridDays.map((day, i) => (
            <div
              key={day.date}
              className={cn(
                "aspect-square rounded-md sm:rounded-lg transition-all duration-300",
                day.status === "completed" && "bg-green-500 dark:bg-green-600 shadow-sm",
                day.status === "missed" && "bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-900/50",
                day.status === "today" && "bg-blue-50 dark:bg-blue-950 border-2 border-blue-500 dark:border-blue-400 animate-pulse",
                day.status === "future" && "bg-gray-100 dark:bg-gray-800"
              )}
              title={`${day.date}: ${day.status}`}
            />
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-4 px-1 text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-green-500" /> Done</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-red-100 border border-red-200 dark:bg-red-900/30 dark:border-red-900/50" /> Missed</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-gray-100 dark:bg-gray-800" /> Future</div>
        </div>
      </motion.div>

      {/* Weekly Master Plan */}
      <div className="mb-4">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Master Plan</h2>
        
        <div className="space-y-4">
          
          {/* 1. Daily Baseline Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <Sun className="w-4 h-4 text-blue-500" /> The Daily Baseline
            </h3>
            <ul className="space-y-3">
              <ListItem icon={<Dumbbell />} text="6:00 AM - 2km Walk, Morning Face/Hair Routine" />
              <ListItem icon={<Utensils />} text="7:00 AM - Breakfast (Pap + 3 Eggs)" />
              <ListItem icon={<Utensils />} text="1:00 PM - Lunch (Carbs + Chicken/Fish + Spinach)" />
              <ListItem icon={<Utensils />} text="4:00 PM - Pre-Work Snack (Groundnuts + Fruit)" />
              <ListItem icon={<Briefcase />} text="5:00 PM - 9:00 PM - Evening Job" />
              <ListItem icon={<Moon />} text="9:30 PM - Dinner & Nighttime Skin/Hair Routine" />
            </ul>
          </div>

          {/* 2. Fitness Split Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <Dumbbell className="w-4 h-4 text-orange-500" /> The Fitness Split (10:00 AM)
            </h3>
            <ul className="space-y-3">
              <ListItem icon={<CalendarIcon />} text="Sunday: Upper Body Push" />
              <ListItem icon={<CalendarIcon />} text="Monday: Active Rest & Core" />
              <ListItem icon={<CalendarIcon />} text="Tuesday: Lower Body & Cardio" />
              <ListItem icon={<CalendarIcon />} text="Wednesday: Active Rest (Mobility)" />
              <ListItem icon={<CalendarIcon />} text="Thursday: Upper Body Pull" />
              <ListItem icon={<CalendarIcon />} text="Friday: Absolute Rest Day" />
              <ListItem icon={<CalendarIcon />} text="Saturday: Full Body & Sweat" />
            </ul>
          </div>

          {/* 3. Skin & Hair Specifics Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <Droplets className="w-4 h-4 text-teal-500" /> Deep Care Modifiers
            </h3>
            <ul className="space-y-3">
              <ListItem icon={<Droplets />} text="Sunday (8:30 AM) - Deep Moisture Wash Day" />
              <ListItem icon={<Droplets />} text="Wednesday (8:00 AM) - Scalp Refresh & Exfoliation" />
              <ListItem icon={<Droplets />} text="Friday (8:00 AM) - Deep-Cleansing Face Mask" />
            </ul>
          </div>

        </div>
      </div>
      
      {/* Extra padding to ensure scrolling past the bottom nav */}
      <div className="h-20"></div>
    </div>
  );
}

// Helper component for clean list items
function ListItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm font-medium text-gray-600 dark:text-gray-300">
      <div className="mt-0.5 text-gray-400 dark:text-gray-500 [&>svg]:w-4 [&>svg]:h-4">
        {icon}
      </div>
      <span className="leading-snug">{text}</span>
    </li>
  );
}