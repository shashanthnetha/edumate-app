"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatModal from '../components/ChatModal';
import QuizModal from '../components/QuizModal';
import TopicsView from '../components/TopicsView';
import { Flame, Star, Target, Search, Bell, Construction } from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState({ xp: 0, streak: 0, name: "Loading...", mastered: 0, rank: 0 });
  const [showChat, setShowChat] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizTopic, setQuizTopic] = useState("Python Loops");
  
  // NAVIGATION STATE
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    fetch('http://127.0.0.1:8000/dashboard/naga')
      .then(res => res.json())
      .then(data => setStats({ 
        xp: data.xp, 
        streak: data.streak, 
        name: data.full_name,
        mastered: data.topics_mastered, 
        rank: data.global_rank 
      }))
      .catch(err => console.log("API error"));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      
      {/* SIDEBAR NOW CONTROLS 'activePage' */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="flex-1 ml-72 p-8">
        
        {/* --- VIEW 1: DASHBOARD --- */}
        {activePage === 'dashboard' && (
          <div className="animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex justify-between items-center mb-10">
              <div className="relative w-96">
                <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                <input type="text" placeholder="Search topics..." className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-100 outline-none text-gray-600" />
              </div>
              <div className="flex items-center gap-4">
                <button className="p-3 bg-white rounded-xl shadow-sm text-gray-500 hover:text-indigo-600 transition"><Bell size={20} /></button>
                <button onClick={() => setShowChat(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition flex items-center gap-2">
                  <Star size={18} fill="white" /> Ask AI Tutor
                </button>
              </div>
            </header>

            {/* Banner */}
            <div className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-10 text-white shadow-2xl shadow-indigo-200 mb-10 relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm mb-4 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Learning Engine Active
                </div>
                <h1 className="text-4xl font-bold mb-4 leading-tight">Welcome back, {stats.name}! 👋</h1>
                <p className="text-indigo-100 mb-8 text-lg opacity-90">You've mastered <span className="font-bold text-white">Python Basics</span>. Ready to tackle <span className="font-bold text-white">While Loops</span> today?</p>
                <div className="flex gap-4">
<button 
  onClick={() => {
    setQuizTopic("Python Loops & Logic"); // <--- CHANGE THIS (Was "Python Loops")
    setShowQuiz(true);
  }} 
  className="bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
>
  Continue Quiz
</button>                  <button className="bg-indigo-700/50 text-white px-8 py-3.5 rounded-xl font-medium backdrop-blur-md hover:bg-indigo-700/70 transition border border-indigo-500/30">View Progress</button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">Your Vital Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatCard label="Total XP" value={stats.xp} icon={<Target size={24} className="text-blue-600" />} color="bg-blue-50" subtext={`Global Rank: #${stats.rank}`} />
              <StatCard label="Day Streak" value={`${stats.streak} Days`} icon={<Flame size={24} className="text-orange-600" />} color="bg-orange-50" subtext="Don't break it!" />
              <StatCard label="Topics Mastered" value={stats.mastered} icon={<Star size={24} className="text-purple-600" />} color="bg-purple-50" subtext="Keep leveling up!" />
            </div>

            {/* Recommendations */}
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recommended For You</h2>
              <a href="#" className="text-indigo-600 font-medium text-sm hover:underline">See all</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div onClick={() => { setQuizTopic("Python Loops & Logic"); setShowQuiz(true); }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-green-50 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition"><Target size={24} /></div>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">Beginner</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Python Loops & Logic</h3>
                <p className="text-sm text-gray-500 mb-4">Master 'while' and 'for' loops with real-world examples.</p>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-green-500 h-full w-[65%]"></div></div>
                <p className="text-xs text-gray-400 mt-2 text-right">65% Complete</p>
              </div>

              <div onClick={() => alert("🔒 This module unlocks when you reach Level 2!")} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-pink-50 rounded-xl text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition"><Search size={24} /></div>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">Advanced</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Data Structures 101</h3>
                <p className="text-sm text-gray-500 mb-4">Learn Lists, Tuples and Dictionaries effectively.</p>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-pink-500 h-full w-[10%]"></div></div>
                <p className="text-xs text-gray-400 mt-2 text-right">10% Complete</p>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW 2: OTHER PAGES (Placeholder) --- */}
        {/* --- VIEW 2: TOPICS PAGE --- */}
        {activePage === 'topics' && (
          // Pass the quiz opener so clicking a card works!
          <TopicsView onOpenQuiz={(topic) => { setQuizTopic(topic); setShowQuiz(true); }} />
        )}

        {/* --- VIEW 3: OTHER PAGES (Still Construction) --- */}
        {activePage !== 'dashboard' && activePage !== 'topics' && (
          <div className="flex flex-col items-center justify-center h-[80vh] text-center animate-in fade-in zoom-in">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <Construction size={40} className="text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 capitalize">{activePage} Page</h2>
            <p className="text-gray-500 max-w-md">
              We are focused on the Dashboard right now. This module is under construction!
            </p>
            <button 
              onClick={() => setActivePage("dashboard")}
              className="mt-8 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {/* --- MODALS --- */}
        <ChatModal isOpen={showChat} onClose={() => setShowChat(false)} />
        <QuizModal isOpen={showQuiz} topic={quizTopic} onClose={() => setShowQuiz(false)} />

      </main>
    </div>
  );
}

// Stats Component Helper
const StatCard = ({ label, value, icon, color, subtext }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:scale-[1.02] transition">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-xs text-gray-400 mt-1">{subtext}</p>
    </div>
  </div>
);