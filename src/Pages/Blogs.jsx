import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, post_images(image_url)")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      
      if (!error) setBlogs(data);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6 sm:px-10 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-[0.7rem] font-bold tracking-[0.5em] uppercase text-white/40 block mb-4">Latest Updates</span>
          <h1 className="font-serif text-[clamp(3rem,6vw,6rem)] font-bold leading-none uppercase">Our Blogs</h1>
          <div className="mt-8 h-[1px] w-24 bg-white/20" />
        </div>

        {blogs.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-white/5 p-20 text-center">
            <p className="text-gray-400">No stories published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link to={`/blogs/${blog.id}`} key={blog.id} className="group cursor-pointer">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-white/5 mb-6">
                  {blog.post_images?.[0] && (
                    <img 
                      src={blog.post_images[0].image_url} 
                      alt={blog.title} 
                      className="h-full w-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    <span>{new Date(blog.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="text-white/60">Insight</span>
                  </div>
                  <h2 className="text-2xl font-bold leading-tight group-hover:text-white transition-colors line-clamp-2 uppercase tracking-tight">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                    {blog.description}
                  </p>
                  <div className="pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">Read More →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
