import React, { useEffect, useState } from 'react';
import { Play, Lock, Code, Database, Box, Server, Brain, Layout, Search } from 'lucide-react';

interface TopicsViewProps {
  onOpenQuiz: (topic: string) => void;
}

const TopicsView = ({ onOpenQuiz }: TopicsViewProps) => {
  const [topics, setTopics] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/topics/naga')
      .then(res => res.json())
      .then(data => setTopics(data))
      .catch(err => console.error("Error fetching topics"));
  }, []);

  // Helper to get the right icon
  const getIcon = (name: string) => {
    const icons: any = { code: <Code />, database: <Database />, box: <Box />, server: <Server />, brain: <Brain />, layout: <Layout /> };
    return icons[name] || <Code />;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Course Library</h1>
        <p className="text-gray-500">Explore all available modules and track your mastery.</p>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Search modules..." className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border-none shadow-sm focus:ring-2 focus:ring-indigo-100 outline-none" />
        </div>
        <select className="bg-white px-4 py-2.5 rounded-xl shadow-sm border-none outline-none text-gray-600 cursor-pointer">
          <option>All Categories</option>
          <option>Beginner</option>
          <option>Advanced</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <div 
            key={topic.id}
            onClick={() => topic.status !== 'locked' ? onOpenQuiz(topic.title) : alert("Complete previous levels to unlock!")}
            className={`p-6 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden
              ${topic.status === 'locked' 
                ? 'bg-gray-50 border-gray-100 opacity-70 grayscale' 
                : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100'
              }`}
          >
            {/* Topic Icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors
              ${topic.status === 'locked' ? 'bg-gray-200 text-gray-400' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}
            `}>
              {getIcon(topic.icon)}
            </div>

            {/* Content */}
            <div className="mb-4">
              <span className={`text-xs font-bold px-2 py-1 rounded mb-2 inline-block
                ${topic.category === 'Beginner' ? 'bg-green-100 text-green-700' : 
                  topic.category === 'Advanced' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}
              `}>
                {topic.category}
              </span>
              <h3 className="text-lg font-bold text-gray-800 leading-tight">{topic.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{topic.desc}</p>
            </div>

            {/* Footer / Status */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
              {topic.status === 'locked' ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                  <Lock size={16} /> Locked
                </div>
              ) : (
                <div className="w-full">
                  <div className="flex justify-between text-xs mb-1 font-bold text-gray-500">
                    <span>Progress</span>
                    <span>{topic.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full transition-all" style={{ width: `${topic.progress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Hover Action */}
            {topic.status !== 'locked' && (
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-indigo-600 text-white p-2 rounded-full shadow-lg">
                  <Play size={16} fill="white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicsView;