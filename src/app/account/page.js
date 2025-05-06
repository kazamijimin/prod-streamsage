"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const dummySavedVideos = [
  {
    id: "1",
    title: "Sample Video Title",
    thumbnail: "/assets/ad1.png",
    creator: "Creator Name",
    views: 12345,
    date: "Jan 1, 2025",
  },
];

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const userEmail = user?.email || "-";
  const [myVideos, setMyVideos] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const [loggingOut, setLoggingOut] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login");
    }
  }, [user, authLoading, router]);

  // Fetch user's videos from Supabase
  useEffect(() => {
    if (!user) return;
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("id, title, description, video_url, created_at, user_email")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error) setMyVideos(data || []);
    };
    fetchVideos();

    const fetchSavedVideos = async () => {
      const { data, error } = await supabase
        .from("saved")
        .select("video_id")
        .eq("user_email", user.email);
      if (!error) {
        const savedVideoIds = data.map((item) => item.video_id);
        const { data: videos, error: videoError } = await supabase
          .from("videos")
          .select("*")
          .in("id", savedVideoIds);
        if (!videoError) setSavedVideos(videos || []);
      }
    }
    fetchSavedVideos();
  }, [user]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    setLoggingOut(false);
    router.replace("/auth/login");
  };

  if (authLoading || !user) return null;


  return (
    <div className="bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="w-16 h-16 mb-2">
            <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold text-2xl">
              {userEmail.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-gray-800 text-lg font-semibold">{userEmail}</div>
          <button
            className="mt-2 flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition shadow"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut size={18} /> {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* My Videos Section */}
        <div className="mt-8 w-full">
          <h2 className="text-xl font-bold mb-4">My Videos</h2>
          {myVideos.length === 0 ? (
            <div className="text-gray-500">You haven't uploaded any videos yet.</div>
          ) : (
            <ul className="space-y-4">
              {myVideos.map((video) => (
                <li key={video.id} className="p-4 bg-gray-100 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="font-semibold text-indigo-700 text-lg">{video.title}</div>
                    <div className="text-gray-600 text-sm mb-1">{video.description}</div>
                    <Link href={`/video/${video.id}`} className="text-indigo-500 underline text-xs">View Video</Link>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      onClick={async () => {
                        // Delete from DB
                        await supabase.from('videos').delete().eq('id', video.id);
                        // Delete from storage
                        await supabase.storage.from('videos').remove([video.video_url]);
                        setMyVideos((prev) => prev.filter((v) => v.id !== video.id));
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded text-sm"
                      onClick={() => {
                        setEditingId(video.id);
                        setEditTitle(video.title);
                        setEditDescription(video.description);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Edit Video Modal */}
        {editingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm relative">
              <h3 className="text-lg font-bold mb-4">Edit Video</h3>
              <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
              <input
                className="border w-full px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                placeholder="Title"
              />
              <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="border w-full px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                placeholder="Description"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    await supabase.from('videos').update({ title: editTitle, description: editDescription }).eq('id', editingId);
                    setMyVideos(myVideos.map(v => v.id === editingId ? { ...v, title: editTitle, description: editDescription } : v));
                    setEditingId(null);
                  }}
                >
                  Save
                </button>
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </div>
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
                onClick={() => setEditingId(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Saved Videos</h2>
          {savedVideos.length === 0 ? (
            <p className="text-gray-400 text-center">You haven't saved any videos yet.</p>
          ) : (
            <ul className="space-y-4">
              {savedVideos.map((video) => (
                <li
                  key={video.id}
                  className="flex items-center gap-4 bg-gray-100 rounded-xl p-4 hover:bg-indigo-50 transition group"
                >
                  <img src="/assets/stream-now.png" alt={video.title} className="w-20 h-14 object-cover rounded-lg border border-gray-200" />
                  <div className="flex-1">
                    <Link href={`/video/${video.id}`} className="text-lg font-semibold text-indigo-700 group-hover:underline">
                      {video.title}
                    </Link>
                    <div className="text-sm text-gray-500 mt-1">
                      by <span className="font-medium text-indigo-600">{video.user_email}</span> • {video.created_at ? new Date(video.created_at).toLocaleDateString() : ""}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

