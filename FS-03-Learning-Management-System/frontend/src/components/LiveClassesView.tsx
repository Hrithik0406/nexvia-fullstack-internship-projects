import React, { useState } from 'react';
import { Video, Calendar, Clock, Users, Mic, MicOff, MessageSquare, Hand, Send, CheckCircle2 } from 'lucide-react';
import { LiveSession } from '../types';

interface LiveClassesViewProps {
  sessions: LiveSession[];
}

export const LiveClassesView: React.FC<LiveClassesViewProps> = ({ sessions }) => {
  const [activeRoom, setActiveRoom] = useState<LiveSession | null>(null);
  const [micMuted, setMicMuted] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Dr. Aryan Sengupta (Host)', text: 'Welcome everyone! Today we will break down Saga choreography vs orchestration.', time: '7:00 PM' },
    { sender: 'Elena R.', text: 'Excited for the live demo on Kafka rollback events!', time: '7:02 PM' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'You (Student)', text: inputMsg, time: 'Now' },
    ]);
    setInputMsg('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Active Live Room Modal/Fullscreen */}
      {activeRoom ? (
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
              <div>
                <h2 className="text-lg font-black">{activeRoom.title}</h2>
                <p className="text-xs text-slate-400">Live Session • Room: {activeRoom.meetingRoomId}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveRoom(null)}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-xs font-bold rounded-xl transition"
            >
              Leave Room
            </button>
          </div>

          {/* Video Stream + Interactive Chat Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Video Box */}
            <div className="lg:col-span-2 bg-slate-950 rounded-2xl aspect-video relative overflow-hidden flex flex-col justify-between p-6">
              <div className="flex items-center justify-between">
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Live Stream
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg">
                  <Users className="w-3.5 h-3.5" />
                  38 Enrolled Students
                </span>
              </div>

              {/* Instructor stream representation */}
              <div className="text-center my-auto">
                <div className="w-24 h-24 rounded-full bg-indigo-600/30 mx-auto flex items-center justify-center ring-4 ring-indigo-500/20 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                    alt="Instructor"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <h3 className="font-extrabold text-base">Dr. Aryan Sengupta</h3>
                <p className="text-xs text-indigo-300">Speaking & Sharing Screen...</p>
              </div>

              {/* Room Controls Bar */}
              <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl flex items-center justify-center gap-3 mx-auto">
                <button
                  onClick={() => setMicMuted(!micMuted)}
                  className={`p-2.5 rounded-xl transition ${
                    micMuted ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-white'
                  }`}
                  title={micMuted ? 'Unmute Mic' : 'Mute Mic'}
                >
                  {micMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setHandRaised(!handRaised)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                    handRaised ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  <Hand className="w-4 h-4" />
                  <span>{handRaised ? 'Hand Raised' : 'Raise Hand'}</span>
                </button>
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-slate-950 rounded-2xl p-4 flex flex-col justify-between h-[380px] border border-slate-800">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold text-slate-300">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Class Discussion</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-indigo-300">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-slate-200 bg-slate-900 p-2 rounded-xl">{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {/* Live Classes Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Interactive Live Masterclasses</h1>
        <p className="text-xs text-slate-500 mt-1">
          Join scheduled live workshops, ask questions in real-time, and practice alongside industry leads.
        </p>
      </div>

      {/* Scheduled Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition space-y-4"
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  session.status === 'LIVE'
                    ? 'bg-rose-100 text-rose-700 animate-pulse'
                    : 'bg-indigo-50 text-indigo-700'
                }`}
              >
                <Video className="w-3 h-3" />
                {session.status === 'LIVE' ? 'ACTIVE NOW' : 'SCHEDULED'}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {session.durationMinutes} Minutes
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900">{session.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {session.description || 'Live architectural breakdown with interactive whiteboard code walkthrough.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>{new Date(session.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>

              <button
                onClick={() => setActiveRoom(session)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                  session.status === 'LIVE'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                }`}
              >
                {session.status === 'LIVE' ? 'Join Live Room' : 'Enter Session'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
