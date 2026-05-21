import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [imageUrl, setImageUrl] = useState("");
  const [imageId, setImageId] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data: post, error: postError } = await supabase
          .from("posts")
          .select(`
            *,
            post_images (
              id,
              image_url
            )
          `)
          .eq("id", id)
          .single();

        if (postError) throw postError;

        setTitle(post.title);
        setDescription(post.description);
        setStatus(post.status);
        if (post.post_images?.[0]) {
          setImageUrl(post.post_images[0].image_url);
          setPreviewUrl(post.post_images[0].image_url);
          setImageId(post.post_images[0].id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // 1. Update the Post title, description, and status
      const { error: postError } = await supabase
        .from("posts")
        .update({ title, description, status })
        .eq("id", id);

      if (postError) throw postError;

      // 2. Handle Image update only if a new file is selected
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        
        // Upload new file to storage
        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from("blog-images")
          .getPublicUrl(fileName);

        if (imageId) {
          // If we had an existing image record, update it
          const { error: imageError } = await supabase
            .from("post_images")
            .update({ image_url: publicUrl })
            .eq("id", imageId);
          if (imageError) throw imageError;
        } else {
          // If no previous image record existed, create one
          const { error: imageError } = await supabase
            .from("post_images")
            .insert([{ post_id: id, image_url: publicUrl, display_order: 0 }]);
          if (imageError) throw imageError;
        }
      }

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.message || "An unexpected error occurred while updating the post.");
      setSaving(false);
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
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-8 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
        >
          ← Back to Dashboard
        </button>

        <h1 className="font-serif text-3xl font-bold mb-8">Edit Post</h1>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-8">
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
                    {file ? file.name : (imageUrl ? "Change image" : "Select an image to upload")}
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
            disabled={saving}
            className="w-full rounded-lg bg-white py-4 text-sm font-bold uppercase tracking-widest text-black hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Update Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
