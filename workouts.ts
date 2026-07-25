export type Exercise = { name: string; sets: number; reps: string; tip: string };
export type Workout = { day: string; title: string; subtitle: string; exercises: Exercise[] };

export const workouts: Workout[] = [
  { day: "Monday", title: "Full Body", subtitle: "Strong start to the week", exercises: [
    { name: "Goblet Squat", sets: 3, reps: "8–10", tip: "Keep your chest tall and knees tracking over toes." },
    { name: "Lat Pulldown", sets: 3, reps: "8–10", tip: "Pull toward your upper chest without swinging." },
    { name: "Dumbbell Bench Press", sets: 3, reps: "8–10", tip: "Keep feet planted and lower with control." },
    { name: "Romanian Deadlift", sets: 3, reps: "8–10", tip: "Push hips back and keep the weights close." },
    { name: "Plank", sets: 3, reps: "20–30 sec", tip: "Make one straight line from shoulders to heels." }
  ]},
  { day: "Wednesday", title: "Upper Body", subtitle: "Posture, power and confidence", exercises: [
    { name: "Chest Press", sets: 3, reps: "8–10", tip: "Press smoothly and avoid locking your elbows." },
    { name: "Seated Row", sets: 3, reps: "8–10", tip: "Lead with elbows and gently squeeze shoulder blades." },
    { name: "Shoulder Press", sets: 3, reps: "8–10", tip: "Keep ribs down and press overhead with control." },
    { name: "Bicep Curl", sets: 2, reps: "10–12", tip: "Keep elbows beside your body." },
    { name: "Side Plank", sets: 2, reps: "15–25 sec/side", tip: "Keep hips lifted and body long." }
  ]},
  { day: "Friday", title: "Lower Body", subtitle: "Legs, glutes and steady strength", exercises: [
    { name: "Leg Press", sets: 3, reps: "8–10", tip: "Use a comfortable depth and keep your back supported." },
    { name: "Walking Lunges", sets: 3, reps: "8/leg", tip: "Take controlled steps and stay tall." },
    { name: "Hip Thrust", sets: 3, reps: "10–12", tip: "Finish with hips tall, not with an arched back." },
    { name: "Hamstring Curl", sets: 3, reps: "10–12", tip: "Move slowly through the full comfortable range." },
    { name: "Calf Raises", sets: 3, reps: "12–15", tip: "Pause at the top and lower fully." }
  ]},
  { day: "Saturday", title: "Gym Mix", subtitle: "A simple full-body bonus", exercises: [
    { name: "Goblet Squat", sets: 3, reps: "10", tip: "Choose a weight that keeps every rep smooth." },
    { name: "Cable Row", sets: 3, reps: "10", tip: "Sit tall and pull without leaning back." },
    { name: "Shoulder Press", sets: 3, reps: "8–10", tip: "Stop if the movement feels pinchy." },
    { name: "Farmer Carry", sets: 3, reps: "30 sec", tip: "Walk tall with relaxed shoulders." },
    { name: "Plank", sets: 3, reps: "20–30 sec", tip: "Breathe normally while bracing your core." }
  ]}
];

export const homeWorkout: Workout = { day: "Saturday", title: "Home Circuit", subtitle: "Three easy-to-follow rounds", exercises: [
  { name: "Squats", sets: 3, reps: "15", tip: "Sit back gently and stand tall." },
  { name: "Push-ups", sets: 3, reps: "10", tip: "Use a wall, bench or knees as needed." },
  { name: "Glute Bridges", sets: 3, reps: "15", tip: "Press through heels and squeeze at the top." },
  { name: "Reverse Lunges", sets: 3, reps: "10/leg", tip: "Step back softly and keep your front foot planted." },
  { name: "Superman", sets: 3, reps: "15", tip: "Lift only as high as feels comfortable." },
  { name: "Plank", sets: 3, reps: "30 sec", tip: "Use knees down anytime you need." }
]};
