"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, ChevronLeft, ChevronRight, Dumbbell, Flame, Home, Library, LineChart, Play, RotateCcw, Sparkles } from "lucide-react";
import { homeWorkout, workouts, type Workout } from "@/lib/workouts";

type Tab = "home" | "calendar" | "progress" | "library";
type SavedState = { completedDates: string[]; longestStreak: number; personalBests: Record<string, string>; notes: Record<string, string> };
const initialState: SavedState = { completedDates: [], longestStreak: 0, personalBests: {}, notes: {} };
const dateKey = (date = new Date()) => date.toISOString().slice(0, 10);

export function AppShell() {
  const [tab, setTab] = useState<Tab>("home");
  const [data, setData] = useState<SavedState>(initialState);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [checkedSets, setCheckedSets] = useState<boolean[]>([]);
  const [weight, setWeight] = useState("");
  const [feeling, setFeeling] = useState("Good");
  const [note, setNote] = useState("");
  const [showHomeOption, setShowHomeOption] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("muscle-mommy-data");
    if (stored) setData(JSON.parse(stored));
  }, []);
  useEffect(() => localStorage.setItem("muscle-mommy-data", JSON.stringify(data)), [data]);

  const today = new Date();
  const day = today.toLocaleDateString("en-CA", { weekday: "long" });
  const todaysWorkout = workouts.find((w) => w.day === day) ?? workouts[0];
  const streak = useMemo(() => calculateStreak(data.completedDates), [data.completedDates]);
  const weeklyDone = data.completedDates.filter((d) => isThisWeek(d)).length;

  const begin = (workout: Workout) => {
    setActiveWorkout(workout); setExerciseIndex(0); setCheckedSets(Array(workout.exercises[0].sets).fill(false)); setWeight(""); setNote(""); setFeeling("Good");
  };
  const next = () => {
    if (!activeWorkout) return;
    const exercise = activeWorkout.exercises[exerciseIndex];
    if (weight) setData((d) => ({ ...d, personalBests: { ...d.personalBests, [exercise.name]: weight } }));
    if (exerciseIndex < activeWorkout.exercises.length - 1) {
      const i = exerciseIndex + 1; setExerciseIndex(i); setCheckedSets(Array(activeWorkout.exercises[i].sets).fill(false)); setWeight("");
    } else {
      const key = dateKey();
      setData((d) => {
        const completedDates = d.completedDates.includes(key) ? d.completedDates : [...d.completedDates, key];
        const current = calculateStreak(completedDates);
        return { ...d, completedDates, longestStreak: Math.max(d.longestStreak, current), notes: { ...d.notes, [key]: `${feeling}${note ? ` — ${note}` : ""}` } };
      });
      setActiveWorkout(null); setTab("progress");
    }
  };

  if (activeWorkout) {
    const exercise = activeWorkout.exercises[exerciseIndex];
    const progress = ((exerciseIndex + 1) / activeWorkout.exercises.length) * 100;
    return <main className="phone-shell workout-view">
      <header className="workout-header"><button className="icon-button" onClick={() => setActiveWorkout(null)} aria-label="Close workout"><ChevronLeft /></button><div><small>{activeWorkout.title}</small><strong>{exerciseIndex + 1} of {activeWorkout.exercises.length}</strong></div><span className="mini-pill">{Math.round(progress)}%</span></header>
      <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      <section className="exercise-card">
        <div className="exercise-icon"><Dumbbell /></div><p className="eyebrow">TODAY&apos;S MOVE</p><h1>{exercise.name}</h1><p className="prescription">{exercise.sets} sets · {exercise.reps} reps</p>
        <div className="tip"><Sparkles size={18}/><span>{exercise.tip}</span></div>
        <div className="set-list">{checkedSets.map((done, i) => <button key={i} className={`set-row ${done ? "done" : ""}`} onClick={() => setCheckedSets((s) => s.map((v, n) => n === i ? !v : v))}><span>Set {i + 1}</span><span className="set-check">{done && <Check size={18}/>}</span></button>)}</div>
        <label className="weight-field">Weight used (optional)<div><input inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0"/><span>lb</span></div></label>
      </section>
      {exerciseIndex === activeWorkout.exercises.length - 1 && <section className="finish-notes"><h3>How did it feel?</h3><div className="feelings">{["Easy", "Good", "Challenging", "Really Hard"].map(f => <button key={f} className={feeling === f ? "selected" : ""} onClick={() => setFeeling(f)}>{f}</button>)}</div><textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note (optional)" /></section>}
      <button className="primary-button sticky" onClick={next}>{exerciseIndex === activeWorkout.exercises.length - 1 ? "Finish workout" : "Next exercise"}<ChevronRight size={20}/></button>
    </main>;
  }

  return <main className="phone-shell">
    <div className="content">
      {tab === "home" && <>
        <header className="brand"><div><p>Muscle</p><h1>Mommy</h1></div><div className="brand-mark"><Dumbbell /></div></header>
        <section className="hello"><p>Hi ✨</p><h2>Ready to get stronger?</h2></section>
        <section className="today-card"><div className="today-top"><span className="day-pill">{day}</span><span>{todaysWorkout.exercises.length} exercises</span></div><h2>{todaysWorkout.title}</h2><p>{todaysWorkout.subtitle}</p><button className="primary-button" onClick={() => day === "Saturday" ? setShowHomeOption(true) : begin(todaysWorkout)}><Play size={18} fill="currentColor"/>Start workout</button></section>
        {showHomeOption && <section className="choice-card"><h3>Where are you training?</h3><button onClick={() => begin(todaysWorkout)}>At the gym <ChevronRight/></button><button onClick={() => begin(homeWorkout)}>At home <ChevronRight/></button></section>}
        <section className="stat-grid"><article><span className="stat-icon pink"><Flame/></span><small>Current streak</small><strong>{streak} days</strong></article><article><span className="stat-icon blue"><Check/></span><small>This week</small><strong>{weeklyDone} workouts</strong></article></section>
        <section className="weekly"><div><h3>This week</h3><span>{weeklyDone}/4 complete</span></div><div className="week-bar"><span style={{ width: `${Math.min(weeklyDone / 4 * 100, 100)}%` }}/></div><p>Every workout counts. Keep going 💕</p></section>
      </>}
      {tab === "calendar" && <CalendarView completed={data.completedDates}/>} 
      {tab === "progress" && <ProgressView data={data} streak={streak} onReset={() => { if (confirm("Reset all saved progress?")) setData(initialState); }}/>} 
      {tab === "library" && <LibraryView onBegin={begin}/>} 
    </div>
    <nav className="bottom-nav">{([
      ["home", Home, "Home"], ["calendar", CalendarDays, "Calendar"], ["progress", LineChart, "Progress"], ["library", Library, "Library"]
    ] as const).map(([id, Icon, label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}><Icon/><span>{label}</span></button>)}</nav>
  </main>;
}

function CalendarView({ completed }: { completed: string[] }) {
  const now = new Date(); const [offset, setOffset] = useState(0);
  const shown = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const year = shown.getFullYear(), month = shown.getMonth();
  const blanks = new Date(year, month, 1).getDay(); const days = new Date(year, month + 1, 0).getDate();
  return <section className="page"><p className="eyebrow">CONSISTENCY</p><h1>Workout calendar</h1><div className="calendar-card"><header><button className="icon-button" onClick={() => setOffset(o => o - 1)}><ChevronLeft/></button><strong>{shown.toLocaleDateString("en-CA", {month:"long", year:"numeric"})}</strong><button className="icon-button" onClick={() => setOffset(o => o + 1)}><ChevronRight/></button></header><div className="weekday-row">{"SMTWTFS".split("").map((d,i)=><span key={i}>{d}</span>)}</div><div className="calendar-grid">{Array.from({length:blanks}).map((_,i)=><span key={`b${i}`}/>) }{Array.from({length:days},(_,i)=>i+1).map(d=>{const key=`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; const done=completed.includes(key); return <span key={d} className={`${done?"completed":""} ${key===dateKey()?"today":""}`}>{done?<Check size={17}/>:d}</span>})}</div></div><div className="legend"><span><i className="complete-dot"/>Workout complete</span><span><i className="today-dot"/>Today</span></div></section>
}

function ProgressView({ data, streak, onReset }: { data: SavedState; streak: number; onReset: () => void }) {
  const entries = Object.entries(data.personalBests);
  return <section className="page"><p className="eyebrow">YOUR PROGRESS</p><h1>Getting stronger</h1><div className="hero-stat"><Flame/><div><small>Current streak</small><strong>{streak} days</strong><p>Longest streak: {Math.max(data.longestStreak, streak)} days</p></div></div><div className="stat-grid progress"><article><small>Workouts</small><strong>{data.completedDates.length}</strong></article><article><small>Weeks active</small><strong>{new Set(data.completedDates.map(weekKey)).size}</strong></article></div><section className="pb-card"><h3>Personal bests</h3>{entries.length ? entries.map(([name,value])=><div className="pb-row" key={name}><span>{name}</span><strong>{value} lb</strong></div>) : <p className="empty">Add weights during a workout and your latest bests will appear here.</p>}</section><button className="reset" onClick={onReset}><RotateCcw size={16}/>Reset saved progress</button></section>
}

function LibraryView({ onBegin }: { onBegin: (w: Workout) => void }) {
  return <section className="page"><p className="eyebrow">WORKOUTS</p><h1>Exercise library</h1><div className="library-list">{[...workouts, homeWorkout].map((w,i)=><article key={`${w.title}-${i}`}><div className="library-icon"><Dumbbell/></div><div><small>{w.day}</small><h3>{w.title}</h3><p>{w.exercises.length} exercises</p></div><button onClick={()=>onBegin(w)} aria-label={`Start ${w.title}`}><Play size={18} fill="currentColor"/></button></article>)}</div><div className="safety-note"><Sparkles/><p>Choose weights that allow smooth, controlled reps. Stop and ask a trusted adult or qualified coach if anything hurts.</p></div></section>
}

function calculateStreak(dates: string[]) { const set=new Set(dates); let n=0; const d=new Date(); while(set.has(dateKey(d))){n++; d.setDate(d.getDate()-1)} return n; }
function isThisWeek(key:string){const d=new Date(`${key}T12:00:00`), now=new Date(); const start=new Date(now); start.setDate(now.getDate()-now.getDay()); start.setHours(0,0,0,0); const end=new Date(start); end.setDate(start.getDate()+7); return d>=start&&d<end;}
function weekKey(key:string){const d=new Date(`${key}T12:00:00`); d.setDate(d.getDate()-d.getDay()); return dateKey(d);}
