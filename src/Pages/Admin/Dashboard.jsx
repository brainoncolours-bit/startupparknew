import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("posts"); // "posts" or "bookings"
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/admin");
        return;
      }
      setUser(user);

      // Fetch Posts
      const { data: postsData } = await supabase
        .from('posts')
        .select(`*, post_images(id, image_url, display_order)`)
        .order('created_at', { ascending: false });

      if (postsData) setPosts(postsData);

      // Fetch Bookings
      const { data: bookingsData } = await supabase
        .from('pre_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookingsData) setBookings(bookingsData);

      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      // Delete associated images first (or rely on CASCADE if set in Supabase)
      await supabase.from("post_images").delete().eq("post_id", id);
      const { error } = await supabase.from("posts").delete().eq("id", id);

      if (error) throw error;
      setPosts(posts.filter((post) => post.id !== id));
    } catch (err) {
      alert("Error deleting post: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 bg-white/5 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="font-serif text-xl font-bold uppercase tracking-widest">Startup Park Admin</h1>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-400">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex gap-4 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("posts")}
            className={`text-sm font-bold uppercase tracking-widest transition-colors ${
              activeTab === "posts" ? "text-white" : "text-white/40 hover:text-white"
            }`}
          >
            Blog Posts
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`text-sm font-bold uppercase tracking-widest transition-colors ${
              activeTab === "bookings" ? "text-white" : "text-white/40 hover:text-white"
            }`}
          >
            Card Pre-bookings
          </button>
        </div>

        {activeTab === "posts" ? (
          <>
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-serif text-3xl font-bold">Manage Posts</h2>
              <Link 
                to="/admin/create-post"
                className="rounded-lg bg-white px-6 py-2 text-sm font-bold uppercase tracking-widest text-black hover:bg-gray-200 transition-all"
              >
                New Post
              </Link>
            </div>

            <div className="grid gap-6">
              {posts.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-white/5 p-12 text-center">
                  <p className="text-gray-400">No posts found. Start by creating your first post.</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-6">
                        {post.post_images?.[0] && (
                          <div className="h-24 w-24 overflow-hidden rounded-lg bg-black/40">
                            <img src={post.post_images[0].image_url} alt="" className="h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                        <div>
                          <div className="mb-2 flex items-center gap-3">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              post.status === 'published' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                            }`}>
                              {post.status}
                            </span>
                            <span className="text-[10px] text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                          <h3 className="text-xl font-bold">{post.title}</h3>
                          <p className="mt-1 line-clamp-1 text-sm text-gray-400">{post.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link 
                          to={`/admin/edit-post/${post.id}`}
                          className="rounded-lg border border-white/10 bg-black/50 p-2 text-xs hover:border-white/30 transition-colors"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="rounded-lg border border-white/10 bg-black/50 p-2 text-xs text-red-400 hover:border-red-400/30 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold">Pre-bookings</h2>
              <p className="mt-2 text-sm text-gray-400">Manage expressions of interest for the new card.</p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-sm text-gray-500">No pre-bookings yet.</td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{booking.full_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{booking.phone_number}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{new Date(booking.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
