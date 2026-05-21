import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Upload Image to Supabase Storage
      let imageUrl = "";
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("blog-images")
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // 2. Insert the Post
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .insert([{ title, description, status }])
        .select()
        .single();

      if (postError) throw postError;

      // 3. Insert the Image Record
      if (imageUrl) {
        const { error: imageError } = await supabase
          .from("post_images")
          .insert([{ post_id: postData.id, image_url: imageUrl, display_order: 0 }]);

        if (imageError) throw imageError;
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-8 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
        >
          ← Back to Dashboard
        </button>

        <h1 className="font-serif text-3xl font-bold mb-8">Create New Post</h1>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-8">
          <div className="grid gap-6">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">Post Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-white/30 focus:outline-none"
                placeholder="Enter post title..."
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-white/30 focus:outline-none resize-none"
                placeholder="Write your post content..."
                required
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-white/30 focus:outline-none appearance-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">Main Image</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-400 transition-colors hover:border-white/30">
                    {file ? file.name : "Select an image to upload"}
                  </div>
                </div>
                {previewUrl && (
                  <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
                    <img src={previewUrl} alt="Preview" className="h-40 w-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white py-4 text-sm font-bold uppercase tracking-widest text-black hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            {loading ? "Creating Post..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
