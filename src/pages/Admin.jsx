import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Removed storage
import { 
  collection, addDoc, getDocs, deleteDoc, 
  doc, updateDoc, query, orderBy 
} from 'firebase/firestore';
import toast from 'react-hot-toast';

const Admin = () => {
  const [passkey, setPasskey] = useState('');
  const [status, setStatus] = useState('READY');
  const [logs, setLogs] = useState([]);
  const [comments, setComments] = useState([]); 
  const [isEditing, setIsEditing] = useState(null);
  const [post, setPost] = useState({
    title: '',
    category: '',
    description: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    slug: ''
  });

  // 1. Fetch Posts and Comments
  const fetchData = async () => {
    try {
      const qLogs = query(collection(db, "logs"), orderBy("date", "desc"));
      const logSnap = await getDocs(qLogs);
      setLogs(logSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const qComms = query(collection(db, "comments"), orderBy("createdAt", "desc"));
      const commSnap = await getDocs(qComms);
      setComments(commSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 2. Security Check
  const checkAuth = () => {
    if (passkey !== import.meta.env.VITE_ADMIN_KEY) {
      setStatus('ERROR: INVALID_MASTER_KEY');
      toast.error("Master Key Refused");
      return false;
    }
    return true;
  };

  // 3. Post Deployment Logic
  const handleDeploy = async (e) => {
    e.preventDefault();
    if (!checkAuth()) return;
    setStatus('PROCESSING...');

    try {
      if (isEditing) {
        await updateDoc(doc(db, "logs", isEditing), post);
        toast.success("Log Updated");
      } else {
        await addDoc(collection(db, "logs"), post);
        toast.success("Log Deployed");
      }
      resetForm();
      fetchData();
      setStatus('SUCCESS');
    } catch (err) {
      setStatus('ERROR: ACTION_FAILED');
    }
  };

  // 4. Delete Log
  const handleDeleteLog = async (id) => {
    if (!checkAuth()) return;
    if (!window.confirm("Archive permanent deletion?")) return;
    try {
      await deleteDoc(doc(db, "logs", id));
      fetchData();
      toast.success("Log Purged");
    } catch (err) { setStatus('ERROR: DELETE_FAILED'); }
  };

  // 5. Delete Comment
  const handleDeleteComment = async (id) => {
    if (!checkAuth()) return;
    try {
      await deleteDoc(doc(db, "comments", id));
      fetchData();
      toast.success("Transmission Deleted");
    } catch (err) { toast.error("Delete failed"); }
  };

  const resetForm = () => {
    setPost({ title: '', category: '', description: '', date: post.date, slug: '' });
    setIsEditing(null);
  };

  const startEdit = (log) => {
    setPost(log);
    setIsEditing(log.id);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 pt-32 pb-20 px-8 font-mono text-sm">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* SECTION: WRITE PROTOCOL */}
        <div className="border border-zinc-900 bg-zinc-950/50 p-8 rounded-lg">
          <header className="mb-10">
            <h2 className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-2">Protocol Dashboard</h2>
            <h1 className="text-2xl font-medium tracking-tighter text-white">
              {isEditing ? 'Edit Log //' : 'Archive Write //'}
            </h1>
          </header>

          <form onSubmit={handleDeploy} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required className="bg-black border border-zinc-800 p-3 rounded outline-none focus:border-white transition-colors" 
                placeholder="Title" value={post.title} onChange={(e) => setPost({...post, title: e.target.value})} />
              <input required className="bg-black border border-zinc-800 p-3 rounded outline-none focus:border-white transition-colors" 
                placeholder="Slug" value={post.slug} onChange={(e) => setPost({...post, slug: e.target.value})} />
              <input className="bg-black border border-zinc-800 p-3 rounded outline-none focus:border-white transition-colors" 
                placeholder="Category" value={post.category} onChange={(e) => setPost({...post, category: e.target.value})} />
              <input className="bg-black border border-zinc-800 p-3 rounded outline-none focus:border-white transition-colors" 
                placeholder="Date" value={post.date} onChange={(e) => setPost({...post, date: e.target.value})} />
            </div>
            <textarea required className="w-full bg-black border border-zinc-800 p-3 h-32 rounded outline-none focus:border-white transition-colors" 
              placeholder="Description content..." value={post.description} onChange={(e) => setPost({...post, description: e.target.value})} />

            <div className="pt-6 border-t border-zinc-900">
              <input type="password" required className="w-full bg-zinc-900/40 border border-zinc-800 p-3 rounded text-emerald-500 outline-none focus:border-emerald-500 mb-4" 
                placeholder="Master Key Required" onChange={(e) => setPasskey(e.target.value)} />
              <div className="flex gap-4">
                <button type="submit" className="flex-1 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-95">
                  {isEditing ? 'Update Entry' : 'Execute Deployment'}
                </button>
                {isEditing && <button type="button" onClick={resetForm} className="px-6 border border-zinc-800 hover:bg-zinc-900 transition-colors">Cancel</button>}
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 uppercase">STATUS: <span className="text-emerald-500">{status}</span></p>
          </form>
        </div>

        {/* SECTION: ARCHIVE MANAGEMENT */}
        <div className="space-y-4">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-2">Active Archive Entries</div>
          <div className="border border-zinc-900 rounded-lg overflow-hidden divide-y divide-zinc-900 bg-zinc-950/30">
            {logs.map(log => (
              <div key={log.id} className="p-4 flex justify-between items-center group hover:bg-zinc-900/40 transition-colors">
                <div>
                  <h4 className="text-white font-medium">{log.title}</h4>
                  <p className="text-[10px] text-zinc-600">{log.date} — /{log.slug}</p>
                </div>
                <div className="flex gap-4 text-[10px] font-bold">
                  <button onClick={() => startEdit(log)} className="text-zinc-500 hover:text-white transition-colors">EDIT</button>
                  <button onClick={() => handleDeleteLog(log.id)} className="text-zinc-500 hover:text-red-500 transition-colors">DELETE</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: COMMENT MODERATION */}
        <div className="space-y-4 pb-20">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-2">Transmission Moderation // Comments</div>
          <div className="border border-zinc-900 rounded-lg overflow-hidden divide-y divide-zinc-900 bg-zinc-950/30">
            {comments.length > 0 ? comments.map(c => (
              <div key={c.id} className="p-4 flex justify-between items-start group hover:bg-zinc-900/40 transition-colors">
                <div className="space-y-1 pr-8">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] px-1.5 py-0.5 bg-zinc-900 text-zinc-500 rounded uppercase tracking-tighter">On: {c.postSlug}</span>
                    <span className="text-[9px] text-zinc-700 italic">{c.createdAt?.toDate?.().toLocaleDateString()}</span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">{c.text}</p>
                </div>
                <button 
                  onClick={() => handleDeleteComment(c.id)}
                  className="text-[10px] text-zinc-700 hover:text-red-500 font-bold transition-colors pt-1"
                >
                  PURGE
                </button>
              </div>
            )) : (
              <div className="p-8 text-center text-zinc-800 text-[10px] uppercase tracking-widest italic">No transmissions found in buffer.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;