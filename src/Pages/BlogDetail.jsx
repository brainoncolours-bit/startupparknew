import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, post_images(*)")
        .eq("id", id)
        .single();

      if (error || !data) {
        navigate("/blogs");
      } else {
        setBlog(data);
      }
      setLoading(false);
    };

    fetchBlog();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6 sm:px-10 lg:px-24">
      <article className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/blogs")}
          className="mb-12 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
        >
          ← All Blogs
        </button>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6">
            <span>{new Date(blog.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="text-white/60 font-serif italic normal-case">By Startup Park Editorial</span>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[1.1] uppercase mb-8">
            {blog.title}
          </h1>
        </header>

        {blog.post_images?.map((img) => (
          <div key={img.id} className="relative aspect-video overflow-hidden rounded-3xl bg-white/5 mb-12 border border-white/5">
            <img 
              src={img.image_url} 
              alt={blog.title} 
              className="h-full w-full object-cover" 
            />
          </div>
        ))}

        <div className="prose prose-invert max-w-none">
          <p className="text-[1.15rem] leading-[1.8] text-gray-300 whitespace-pre-wrap font-medium">
            {blog.description}
          </p>
        </div>

        <footer className="mt-20 pt-12 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Share this story</h4>
              <div className="flex gap-4">
                <button className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">𝕏</button>
                <button className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">in</button>
                <button className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">f</button>
              </div>
            </div>
            <button 
              onClick={() => navigate("/blogs")}
              className="px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all rounded-full"
            >
              Back to Insights
            </button>
          </div>
        </footer>
      </article>
    </main>
  );
}
