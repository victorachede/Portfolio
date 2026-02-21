import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { 
  doc, updateDoc, increment, collection, 
  query, where, getDocs, addDoc, onSnapshot, orderBy 
} from 'firebase/firestore';
import { 
  FiArrowLeft, FiHeart, FiShare2, FiMessageSquare, 
  FiSend, FiCopy, FiCheck, FiClock 
} from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// --- SWEET CODE BLOCK COMPONENT ---
const CodeBlock = ({ lang, code }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied", {
      style: { background: '#121212', color: '#fff', border: '1px solid #27272a', fontSize: '10px', fontFamily: 'monospace' }
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-zinc-800/50 bg-[#0a0a0a] shadow-2xl">
      {/* Terminal Header */}
      <div className="flex justify-between items-center bg-zinc-900/30 px-4 py-3 border-b border-zinc-800/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">{lang}</span>
        </div>
        <button onClick={copyToClipboard} className="group flex items-center gap-2 text-[10px] font-mono text-zinc-500 hover:text-emerald-400 transition-all uppercase tracking-widest">
          {copied ? <FiCheck className="text-emerald-500" /> : <FiCopy className="group-hover:rotate-12 transition-transform" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Code Body with Emerald Accent */}
      <div className="relative group/body">
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-emerald-500/20 group-hover/body:bg-emerald-500/50 transition-colors" />
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <SyntaxHighlighter
            language={lang}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1.5rem 1.5rem 1.5rem 1.75rem',
              fontSize: '0.8rem',
              lineHeight: '1.7',
              background: 'transparent',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [postId, setPostId] = useState(null);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Read Time Logic ---
  const calculateReadTime = (content) => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  useEffect(() => {
    const fetchPost = async () => {
      const q = query(collection(db, "logs"), where("slug", "==", slug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docRef = snap.docs[0];
        setPost(docRef.data());
        setPostId(docRef.id);
        setLikes(docRef.data().likes || 0);
        const likedPosts = JSON.parse(localStorage.getItem('liked_logs') || '[]');
        if (likedPosts.includes(docRef.id)) setHasLiked(true);
      }
      setLoading(false);
    };

    const qComments = query(collection(db, "comments"), where("postSlug", "==", slug), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(qComments, (snap) => {
      setAllComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    fetchPost();
    return () => unsubscribe();
  }, [slug]);

  const handleLike = async () => {
    if (hasLiked || !postId) return;
    const postRef = doc(db, "logs", postId);
    await updateDoc(postRef, { likes: increment(1) });
    const likedPosts = JSON.parse(localStorage.getItem('liked_logs') || '[]');
    localStorage.setItem('liked_logs', JSON.stringify([...likedPosts, postId]));
    setLikes(prev => prev + 1);
    setHasLiked(true);
    toast('Logged to Heart', { icon: '❤️', style: { background: '#000', color: '#fff', border: '1px solid #27272a' } });
  };

  const handleShare = async () => {
    const currentUrl = `https://victorachede.com/blog/${slug}`;
    if (navigator.share) {
      try { await navigator.share({ title: post.title, text: post.description.substring(0, 100), url: currentUrl }); } 
      catch (err) { console.log("Share cancelled"); }
    } else {
      navigator.clipboard.writeText(currentUrl);
      toast.success("Link copied");
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await addDoc(collection(db, "comments"), {
        postSlug: slug,
        text: comment,
        createdAt: new Date(),
        user: "Anonymous"
      });
      setComment('');
      toast.success("Comment transmitted");
    } catch (err) { toast.error("Transmission failed"); }
  };

  const renderContent = (content) => {
    if (!content) return null;
    const blocks = content.split('```');
    return blocks.map((block, index) => {
      if (index % 2 === 1) {
        const lines = block.split('\n');
        const lang = lines[0].trim() || 'javascript';
        const code = lines.slice(1).join('\n').trim();
        return <CodeBlock key={index} lang={lang} code={code} />;
      }
      return (
        <p key={index} className="text-zinc-400 text-base md:text-lg leading-relaxed mb-6 md:mb-8 whitespace-pre-line font-light">
          {block.trim()}
        </p>
      );
    });
  };

  if (loading) return <div className="bg-black min-h-screen" />;
  if (!post) return <div className="bg-black min-h-screen text-zinc-500 p-10 font-mono text-xs">ERR: POST_NOT_FOUND</div>;

  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-20 px-5 md:px-8">
      <Helmet>
        <title>{post.title} | Archive</title>
      </Helmet>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-10 md:mb-12">
            <Link to="/blog" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-mono uppercase tracking-widest">
              <FiArrowLeft /> Back
            </Link>
            
            <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><FiClock size={11}/> {calculateReadTime(post.description)} Min Read</span>
                <span className="hidden md:inline">/</span>
                <span className="hidden md:inline text-emerald-500/80">{post.category || "Log"}</span>
            </div>
        </div>
        
        {/* REFINED TITLE SIZE */}
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-8 md:mb-10 leading-[1.2] md:leading-[1.1]">
          {post.title}
        </h1>
        
        <div className="border-l border-zinc-900 pl-5 md:pl-8 mb-16">
          {renderContent(post.description)}
        </div>

        <div className="flex flex-wrap items-center gap-8 py-6 border-y border-zinc-900/50 mb-16">
          <button onClick={handleLike} disabled={hasLiked} className={`flex items-center gap-2 transition-all ${hasLiked ? 'text-rose-500' : 'text-zinc-600 hover:text-rose-500'}`}>
            <FiHeart className={hasLiked ? 'fill-current' : ''} /> 
            <span className="text-[10px] font-mono">{likes}</span>
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 text-zinc-600 hover:text-emerald-500">
            <FiShare2 /> <span className="text-[10px] font-mono uppercase">Share</span>
          </button>
          <div className="flex items-center gap-2 text-zinc-600">
            <FiMessageSquare /> <span className="text-[10px] font-mono uppercase">{allComments.length}</span>
          </div>
        </div>

        <section>
          <h3 className="text-[10px] font-mono uppercase tracking-widest mb-8 text-zinc-700">Communication Terminal</h3>
          <form onSubmit={postComment} className="relative mb-16">
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-zinc-950/20 border border-zinc-900 p-5 rounded-lg outline-none focus:border-emerald-500/30 text-sm h-32 transition-all resize-none font-sans"
              placeholder="Enter message..."
            />
            <button className="absolute bottom-4 right-4 p-2 bg-white text-black rounded-full hover:bg-emerald-500 transition-colors">
              <FiSend size={14} />
            </button>
          </form>

          <div className="space-y-12">
            <AnimatePresence>
              {allComments.map((c) => (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={c.id} className="group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{c.user}</span>
                    <span className="text-[9px] font-mono text-zinc-800 italic">{c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString() : 'Active'}</span>
                  </div>
                  <p className="text-zinc-400 text-sm border-l border-zinc-900 pl-5 py-1 leading-relaxed">{c.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default PostDetail;