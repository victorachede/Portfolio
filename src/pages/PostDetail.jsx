import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { 
  doc, updateDoc, increment, collection, 
  query, where, getDocs, addDoc, onSnapshot, orderBy 
} from 'firebase/firestore';
import { FiArrowLeft, FiHeart, FiShare2, FiMessageSquare, FiSend, FiCopy, FiCheck } from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const CodeBlock = ({ lang, code }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied", {
      style: { background: '#000', color: '#fff', border: '1px solid #27272a', fontSize: '10px', fontFamily: 'monospace' }
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 overflow-hidden rounded-lg border border-zinc-900 bg-[#0d0d0d] group/code">
      <div className="flex justify-between items-center bg-zinc-900/40 px-4 py-2 border-b border-zinc-900">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{lang}</span>
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
        >
          {copied ? <FiCheck className="text-emerald-500" /> : <FiCopy />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          fontSize: '0.85rem',
          lineHeight: '1.6',
          background: 'transparent',
        }}
      >
        {code}
      </SyntaxHighlighter>
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

  // Constants for sharing
  const siteUrl = "https://victor-achede.vercel.app"; // UPDATE THIS
  const currentUrl = `${siteUrl}/blog/${slug}`;
  const ogImage = `${siteUrl}/og-fallback.png`; // Fallback image in your public folder

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

    const qComments = query(
      collection(db, "comments"), 
      where("postSlug", "==", slug),
      orderBy("createdAt", "desc")
    );
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
    if (navigator.share) {
      try { 
        await navigator.share({ title: post.title, text: post.description.substring(0, 100), url: currentUrl }); 
      } catch (err) { console.log("Share cancelled"); }
    } else {
      navigator.clipboard.writeText(currentUrl);
      toast.success("Link copied to clipboard");
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
        <p key={index} className="text-zinc-400 text-lg leading-relaxed mb-8 whitespace-pre-line">
          {block}
        </p>
      );
    });
  };

  // Helper to get clean text for meta tags (removes code blocks)
  const getCleanDescription = (content) => {
    if (!content) return "";
    return content.split('```').filter((_, i) => i % 2 === 0).join(' ').substring(0, 160) + "...";
  };

  if (loading) return <div className="bg-black min-h-screen" />;
  if (!post) return <div className="bg-black min-h-screen text-zinc-500 p-20 font-mono text-xs">ERR: POST_NOT_FOUND</div>;

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-8">
      <Helmet>
        <title>{post.title} | Archive</title>
        <meta name="description" content={getCleanDescription(post.description)} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={getCleanDescription(post.description)} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={getCleanDescription(post.description)} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-3xl mx-auto"
      >
        <Link to="/blog" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 text-xs font-mono uppercase tracking-[0.2em]">
          <FiArrowLeft /> Back to Archive
        </Link>
        
        <h1 className="text-6xl font-medium tracking-tighter mb-8 leading-[0.9]">{post.title}</h1>
        
        <div className="border-l border-zinc-800 pl-6 mb-12">
          {renderContent(post.description)}
        </div>

        <div className="flex items-center gap-8 py-6 border-y border-zinc-900 mb-12">
          <button 
            onClick={handleLike} 
            disabled={hasLiked}
            className={`flex items-center gap-2 transition-all ${hasLiked ? 'text-rose-500 cursor-default' : 'text-zinc-500 hover:text-rose-500 group'}`}
          >
            <FiHeart className={`${hasLiked ? 'fill-current' : 'group-active:scale-150 transition-transform'}`} /> 
            <span className="text-xs font-mono">{likes}</span>
          </button>

          <button onClick={handleShare} className="flex items-center gap-2 text-zinc-500 hover:text-emerald-500 transition-colors">
            <FiShare2 /> 
            <span className="text-xs font-mono uppercase tracking-widest text-[10px]">Share</span>
          </button>

          <div className="flex items-center gap-2 text-zinc-500">
            <FiMessageSquare /> 
            <span className="text-xs font-mono uppercase tracking-widest text-[10px]">{allComments.length} Comments</span>
          </div>
        </div>

        <section className="mt-20">
          <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] mb-8 text-zinc-600">Comments</h3>
          
          <form onSubmit={postComment} className="relative mb-16">
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-900 p-4 pr-16 rounded outline-none focus:border-emerald-500/50 text-sm h-28 transition-all resize-none font-sans"
              placeholder="Leave a thought..."
            />
            <button className="absolute bottom-4 right-4 p-2 bg-white text-black rounded-full hover:bg-emerald-500 transition-colors">
              <FiSend size={14} />
            </button>
          </form>

          <div className="space-y-10">
            <AnimatePresence>
              {allComments.length > 0 ? allComments.map((c) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={c.id} 
                  className="group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{c.user}</span>
                    <span className="text-[9px] font-mono text-zinc-800 italic">
                      {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm border-l border-zinc-900 pl-4 group-hover:border-zinc-700 transition-colors font-sans">
                    {c.text}
                  </p>
                </motion.div>
              )) : (
                <p className="text-[10px] font-mono text-zinc-800 uppercase italic">Archive silent. Be the first to speak.</p>
              )}
            </AnimatePresence>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default PostDetail;