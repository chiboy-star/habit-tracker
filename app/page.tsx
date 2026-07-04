"use client";

import { useEffect, useState } from "react";
import { useHabitStore } from "@/store/useHabitStore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TodayPage() {
  const { tasks, toggleTask, initializeProgram, checkDailyReset, hideCompleted } = useHabitStore();
  const [isClient, setIsClient] = useState(false);
  const [todayString, setTodayString] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const today = new Date();
    const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000))
      .toISOString()
      .split("T")[0];
      
    setTodayString(localDate);
    initializeProgram(localDate);
    checkDailyReset(localDate);
  }, [initializeProgram, checkDailyReset]);

  if (!isClient) return null; 

  const todaysTasks = tasks
    .filter((task) => task.date === todayString)
    .filter((task) => (hideCompleted ? !task.completed : true))
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return a.time.localeCompare(b.time);
    });

  const allTodaysTasks = tasks.filter((t) => t.date === todayString);
  const completedCount = allTodaysTasks.filter((t) => t.completed).length;
  const totalCount = allTodaysTasks.length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const handleToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from opening the accordion
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(15);
    }
    toggleTask(id);
  };

  const toggleExpand = (id: string) => {
    setExpandedTaskId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col h-full px-4 pt-12 pb-6 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Today</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="mb-8 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Daily Progress</span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{progressPercentage}%</span>
        </div>
        <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex-1">
        <ul className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <AnimatePresence>
            {todaysTasks.map((task, index) => {
              const isLast = index === todaysTasks.length - 1;
              const isExpanded = expandedTaskId === task.id;

              return (
                <motion.li
                  key={task.id}
                  layout="position"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className={cn(
                    "relative px-4 py-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800 transition-colors",
                    !isLast && "border-b border-gray-100 dark:border-gray-800"
                  )}
                  onClick={() => toggleExpand(task.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* The Checkbox (Isolated Click Area) */}
                    <motion.div
                      layout="position"
                      className={cn(
                        "flex-shrink-0 mt-0.5 transition-colors duration-300",
                        task.completed ? "text-green-500" : "text-gray-300 dark:text-gray-600"
                      )}
                      onClick={(e) => handleToggle(task.id, e)}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 fill-green-50 dark:fill-green-950" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </motion.div>

                    {/* Task Header Information */}
                    <motion.div layout="position" className="flex-1 min-w-0 pr-2">
                      <div className="flex justify-between items-start gap-2">
                        <p
                          className={cn(
                            "text-base font-medium transition-all duration-300 leading-snug",
                            task.completed 
                              ? "text-gray-400 dark:text-gray-600 line-through" 
                              : "text-gray-900 dark:text-gray-100"
                          )}
                        >
                          {task.title}
                        </p>
                        <ChevronDown 
                          className={cn(
                            "w-4 h-4 text-gray-400 shrink-0 transition-transform duration-300 mt-1",
                            isExpanded ? "rotate-180" : ""
                          )} 
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          {task.category}
                        </span>
                        <span className={cn(
                          "text-xs",
                          task.completed ? "text-gray-400 dark:text-gray-600" : "text-blue-600 dark:text-blue-400 font-medium"
                        )}>
                          {task.time}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* The Expandable Details Box */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-10 pr-2 pt-3 pb-1">
                          <div className={cn(
                            "text-sm p-3 rounded-lg border leading-relaxed whitespace-pre-wrap",
                            task.completed 
                              ? "bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-500 border-gray-100 dark:border-gray-800" 
                              : "bg-blue-50/50 dark:bg-blue-900/10 text-gray-700 dark:text-gray-300 border-blue-100 dark:border-blue-900/30"
                          )}>
                            {task.description}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </AnimatePresence>
          
          {todaysTasks.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
              All tasks completed. Rest up!
            </div>
          )}
        </ul>
      </div>
      
      {/* Extra padding to ensure scrolling past the bottom nav */}
      <div className="h-10"></div>
    </div>
  );
}