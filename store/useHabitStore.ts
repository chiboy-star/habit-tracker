import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Category = 'Diet' | 'Fitness' | 'Skin/Hair' | 'Work';

export interface Task {
  id: string;
  title: string;
  category: Category;
  time: string;
  completed: boolean;
  date: string;
  description: string; // Added description field
}

interface HabitStore {
  tasks: Task[];
  lastAccessedDate: string | null;
  currentStreak: number;
  hideCompleted: boolean;
  
  toggleTask: (id: string) => void;
  toggleHideCompleted: () => void;
  initializeProgram: (startDate: string) => void;
  clearProgram: () => void;
  checkDailyReset: (todayDateString: string) => void;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      lastAccessedDate: null,
      currentStreak: 0,
      hideCompleted: false,

      toggleTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        }));
      },

      toggleHideCompleted: () => {
        set((state) => ({ hideCompleted: !state.hideCompleted }));
      },

      clearProgram: () => set({ tasks: [], currentStreak: 0, lastAccessedDate: null }),

      checkDailyReset: (todayDateString: string) => {
        const { lastAccessedDate, tasks, currentStreak } = get();

        if (!lastAccessedDate) {
          set({ lastAccessedDate: todayDateString });
          return;
        }

        if (lastAccessedDate === todayDateString) return;

        const yesterdaysTasks = tasks.filter((t) => t.date === lastAccessedDate);
        
        if (yesterdaysTasks.length > 0) {
          const completedCount = yesterdaysTasks.filter((t) => t.completed).length;
          const isPerfectDay = completedCount === yesterdaysTasks.length;

          if (isPerfectDay) {
            set({ currentStreak: currentStreak + 1 });
          } else {
            set({ currentStreak: 0 });
          }
        }

        set({ lastAccessedDate: todayDateString });
      },

      initializeProgram: (startDateString: string) => {
        if (get().tasks.length > 0) return; 

        const tasks: Task[] = [];
        const startDate = new Date(startDateString);

        for (let i = 0; i < 49; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          
          const dateStr = currentDate.toISOString().split('T')[0];
          const dayOfWeek = currentDate.getDay(); 

          const addTask = (time: string, title: string, category: Category, description: string) => {
            tasks.push({
              id: `${dateStr}-${time}-${category}-${tasks.length}`,
              title,
              category,
              time,
              completed: false,
              date: dateStr,
              description,
            });
          };

          // --- 1. THE DAILY BASELINE ---
          addTask(
            '06:00', '2km Walk', 'Fitness', 
            'Wake up, drink a glass of water, put on your shoes. Go outside and walk 2 kilometers. This is a brisk walk, not a casual stroll. You should be lightly sweating by the end.'
          );
          
          addTask(
            '06:30', 'Face Wash + Aloe/SPF + Hair Spritz & Scalp Oil', 'Skin/Hair', 
            'FACE: Splash face with water. Pat dry. Apply thin layer of fresh aloe gel. Let dry for 60s, apply SPF moisturizer.\nHAIR: Spritz with 50/50 water and aloe juice until lightly damp.\nSCALP: 2-3 drops Scalp Growth Oil, massage directly into scalp with firm circular motions for 5 mins.'
          );
          
          addTask(
            '07:00', 'Breakfast: Pap (Stevia/honey, milk) + 3 Boiled Eggs', 'Diet', 
            'Prepare your Pap. Sweeten it with Stevia or a tiny bit of honey, and a splash of milk. You must boil and eat 3 eggs alongside this to get the protein required to prevent muscle loss.'
          );
          
          addTask(
            '13:00', 'Lunch: Sweet potatoes/rice + Chicken/Fish + Spinach', 'Diet', 
            'CARBS: One fist-sized portion of boiled sweet potatoes or rice.\nPROTEIN: One large palm-sized piece of chicken breast or Titus/Mackerel fish.\nVEGGIES: Fill half the plate with spinach (Efo) or cabbage.'
          );
          
          addTask(
            '16:00', 'Pre-Work Snack: Groundnuts + Apple/Banana', 'Diet', 
            'Eat a handful of groundnuts and an apple or banana. This gives you steady blood sugar for your shift.'
          );
          
          addTask(
            '17:00', 'Evening Job (Drink water throughout)', 'Work', 
            'Do your job. Keep a large bottle of water next to you. You need to drink at least 1.5 liters during this window.'
          );
          
          addTask(
            '21:30', 'Dinner: Pap + Beans/Moi-Moi', 'Diet', 
            'Make a small bowl of Pap. Pair it with a massive portion of boiled beans or steamed Moi-Moi.'
          );
          
          addTask(
            '22:00', 'Night Routine: Wash face, Heavy Moisturizer, Bonnet', 'Skin/Hair', 
            'FACE: Wash thoroughly with a cleanser to get rid of sweat/oil. Apply a heavy nighttime moisturizer.\nHAIR: Put your silk or satin bonnet on. Do not sleep on bare cotton pillows; it will rip out your hair and cause acne. Go to sleep.'
          );

          // --- 2. THE WEEKLY MODIFIERS ---
          switch (dayOfWeek) {
            case 0: // Sunday
              addTask(
                '08:30', 'Deep Moisture Wash Day', 'Skin/Hair', 
                'Pre-Poo Wash Day: Blend fresh aloe gel. Coat your hair and scalp in it. Put a plastic shopping bag or shower cap over your head for 30 minutes. Wash it out with shampoo, then apply conditioner.'
              );
              addTask(
                '10:00', 'Upper Body Push', 'Fitness', 
                'Multi-Gym Chest Press: 4 sets of 12 reps (Keep back flat, squeeze chest).\nDumbbell Overhead Press: 4 sets of 15 reps using 6kg weights.\nPushups: 3 sets to absolute failure.'
              );
              break;
            case 1: // Monday
              addTask(
                '10:00', 'Active Rest & Core', 'Fitness', 
                'Marcy Ab Bar: 4 sets of 20 reps. Rest your neck on the pad. Use stomach muscles, do not use arms.\nPlanks: 3 sets of 45 seconds. Keep body straight, no sagging hips.'
              );
              break;
            case 2: // Tuesday
              addTask(
                '10:00', 'Lower Body & Cardio', 'Fitness', 
                'Multi-Gym Leg Extensions: 4 sets of 15 reps (Pause for 1s at top).\nBodyweight Squats: 4 sets of 20 reps (Thighs parallel to floor).\nDumbbell Lunges: 3 sets of 12 reps per leg holding 6kg dumbbells.\nBike: 20 minutes at a moderate, sweaty pace.'
              );
              break;
            case 3: // Wednesday
              addTask(
                '08:00', 'Scalp Refresh & Face Exfoliation', 'Skin/Hair', 
                'FACE: Use a gentle facial scrub in the shower to exfoliate dead skin.\nHAIR: Mix aloe with shea butter and massage into your scalp and the ends of your twists. Do not wash it out.'
              );
              addTask(
                '10:00', 'Active Rest (Mobility)', 'Fitness', 
                'No heavy lifting. Spend 15 minutes stretching your chest, legs, and back.'
              );
              break;
            case 4: // Thursday
              addTask(
                '10:00', 'Upper Body Pull', 'Fitness', 
                'Multi-Gym Lat Pulldowns: 4 sets of 12 reps (Pull to collarbone, squeeze shoulder blades).\nDumbbell Bicep Curls: 4 sets of 15 reps with 6kg weights. Do not swing back.\nDumbbell Bent-Over Rows: 4 sets of 15 reps with 6kg weights. Hinge at hips, pull to ribcage.'
              );
              break;
            case 5: // Friday
              addTask(
                '08:00', 'Deep-Cleansing Face Mask', 'Skin/Hair', 
                'Wash face with Aloe-Boost Clarifying Cleanser for a full 60 seconds. Rinse. Apply a thick layer of pure, fresh aloe gel to face like a mask. Leave for 15 minutes, rinse, and apply moisturizer.'
              );
              break;
            case 6: // Saturday
              addTask(
                '10:00', 'Full Body & Sweat', 'Fitness', 
                'Stationary Bike: 30 minutes HIIT (pedal fast for 1 min, slow for 1 min).\nSuperset: Pushups to failure, immediately do squats to failure. Rest 2 mins. Repeat 3 times.'
              );
              break;
          }
        }

        set({ tasks, lastAccessedDate: startDateString, currentStreak: 0 });
      },
    }),
    {
      name: 'habit-tracker-storage',
    }
  )
);