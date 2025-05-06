"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

export default function UploadVideoPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if not authenticated
  if (!loading && !user) {
    router.replace("/auth/login");
    return null;
  }

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!videoFile) {
      setError("Please select a video file.");
      return;
    }
    setUploading(true);
    // Upload video to Supabase Storage
    const fileExt = videoFile.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const { data, error: uploadError } = await supabase.storage
      .from("videos")
      .upload(fileName, videoFile);
    if (uploadError) {
      setError("Video upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }
    // Save video metadata to Supabase (optional: videos table)
    const { error: dbError } = await supabase.from("videos").insert([
      {
        user_id: user.id,
        user_email: user.email,
        title,
        description,
        video_url: data.path,
      },
    ]);
    if (dbError) {
      setError("Failed to save video info: " + dbError.message);
      setUploading(false);
      return;
    }
    setSuccess("Video uploaded successfully!");
    setUploading(false);
    setTitle("");
    setDescription("");
    setVideoFile(null);
    // Optionally redirect to home or video page after upload
    // router.replace("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Video</h1>
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2 text-base"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border border-gray-300 rounded px-3 py-2 text-base"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          required
        />
        <input
          type="file"
          accept="video/*"
          className="border border-gray-300 rounded px-3 py-2 text-base"
          onChange={handleFileChange}
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-2 rounded font-medium hover:bg-indigo-700 disabled:opacity-60"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}
