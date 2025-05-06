"use client";
import { Heart } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";


import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import { useAuth } from "@/context/AuthContext";

export default function VideoDetailPage() {
  const [isSaved, setIsSaved] = useState(false);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [videoRef, setVideoRef] = useState(null);
  const [currentNoteIdx, setCurrentNoteIdx] = useState(null);
  const params = useParams();
  const videoId = params?.id;
  const { user } = useAuth();

  useEffect(() => {
    if (!videoId || !user) return;
  
    // Check if the video is already saved
    const checkIfSaved = async () => {
      const { data, error } = await supabase
        .from("saved")
        .select("id")
        .eq("video_id", videoId)
        .eq("user_email", user.email)
        .single();
  
      if (!error && data) {
        setIsSaved(true);
      } else {
        setIsSaved(false);
      }
    };
  
    checkIfSaved();
  }, [videoId, user]);
  
  const handleSaveVideo = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
  
    if (isSaved) {
      // Unsave the video
      const { error } = await supabase
        .from("saved")
        .delete()
        .eq("video_id", videoId)
        .eq("user_email", user.email);
  
      if (error) {
        console.error("Failed to unsave video:", error.message);
      } else {
        setIsSaved(false);
      }
    } else {
      // Save the video
      const { error } = await supabase.from("saved").insert([
        {
          user_email: user.email,
          video_id: videoId,
          created_at: new Date().toISOString(),
        },
      ]);
  
      if (error) {
        console.error("Failed to save video:", error.message);
      } else {
        setIsSaved(true);
      }
    }
  };

  useEffect(() => {
    if (!videoId) return;
    // Fetch notes for this video
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("id, user_id, video_id, time, text, created_at")
        .eq("video_id", videoId)
        .eq("user_id", user.id)
        .order("time", { ascending: true });
      if (!error && data) {
        setNotes(data);
      } else {
        setNotes([]);
        if (error) console.error("Failed to fetch notes:", error.message);
      }
    };
    fetchNotes();
    const fetchVideo = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("videos")
        .select("id, title, description, video_url, created_at, user_id, user_email")
        .eq("id", videoId)
        .single();
      if (data) {
        // Fetch user email for creator
        const { data: userData } = await supabase
          .from("users")
          .select("email")
          .eq("id", data.user_id)
          .single();
        setVideo({ ...data, creatorEmail: userData?.email || "Unknown" });
      } else {
        setVideo(null);
      }
      setLoading(false);
    };
    fetchVideo();
  }, [videoId]);

  // Track which note matches the current playback time
  useEffect(() => {
    if (!videoRef || notes.length === 0) return;
    const handler = () => {
      const t = videoRef.currentTime;
      const idx = notes.findIndex(note => Math.abs(note.time - t) < 1);
      setCurrentNoteIdx(idx !== -1 ? idx : null);
    };
    videoRef?.addEventListener('timeupdate', handler);
    return () => videoRef?.removeEventListener('timeupdate', handler);
  }, [videoRef, notes]);

  

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (noteInput && selectedTime !== null) {
      // Optimistically update UI
      setNotes([
        ...notes,
        {
          time: selectedTime,
          text: noteInput,
        },
      ]);
      // Save note to Supabase
      try {
        if (!user) throw new Error("Not authenticated");
        const { error } = await supabase.from("notes").insert([
          {
            user_id: user.id,
            video_id: videoId,
            time: selectedTime,
            text: noteInput,
            created_at: new Date().toISOString(),
          },
        ]);
        if (error) {
          // Optionally show error to user
          console.error("Failed to save note:", error.message);
        }
      } catch (err) {
        console.error("Error saving note:", err.message);
      }
      setNoteInput("");
      setSelectedTime(null);
    }
  };


  const handleSelectTimestamp = () => {
    if (videoRef) {
      setSelectedTime(videoRef.currentTime);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-lg text-gray-500">Loading video...</div>;
  }
  if (!video) {
    return <div className="py-16 text-center text-lg text-red-500">Video not found.</div>;
  }

  // Get the public URL for the video from Supabase Storage
  const videoUrl = supabase.storage.from('videos').getPublicUrl(video.video_url).data.publicUrl;

  console.log("video.video_url:", video.video_url);
  console.log("videoUrl:", videoUrl);

  return (
    <div className="bg-gray-50 py-8 px-4" id="videoDetail">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <video
          ref={el => setVideoRef(el)}
          src={videoUrl}
          controls
          className="w-full rounded-xl shadow-md bg-black mb-4 cursor-pointer"
          poster="/assets/stream-now.png"
          onClick={e => {
            if (videoRef) {
              setSelectedTime(videoRef.currentTime);
            }
          }}
          onSeeked={e => {
            if (videoRef) {
              setSelectedTime(videoRef.currentTime);
            }
          }}
        />
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{video.title}</h1>
            <button
              aria-label={isSaved ? 'Unsave video' : 'Save video'}
              title={isSaved ? 'Unsave video' : 'Save video'}
              className="ml-2 p-2 rounded-full hover:bg-gray-200 transition"
              onClick={handleSaveVideo}
            >
              {isSaved ? (
                <Heart className="text-red-500" />
              ) : (
                <Heart />
              )}
            </button>
          </div>
          <div className="flex items-center gap-4 mb-2 text-gray-500 text-sm">
            <span>by <span className="font-semibold text-indigo-600">{video.user_email}</span></span>
            <span>• {video.created_at ? new Date(video.created_at).toLocaleDateString() : ""}</span>
          </div>
          <p className="mb-6 text-gray-700 text-base md:text-lg">{video.description}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="mb-4">
            <span className="text-gray-700 font-medium mr-2">Click the video or seek to add a note at any second.</span>
          </div>
          {selectedTime !== null && (
            <form onSubmit={handleAddNote} className="flex flex-col sm:flex-row gap-3 items-center mb-4">
              <span className="text-sm text-gray-700 font-mono">at {selectedTime.toFixed(1)}s</span>
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-base"
                placeholder="Add a note..."
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                required
              />
              <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded font-medium hover:bg-indigo-700">Add</button>
            </form>
          )}


          <h2 className="text-lg font-semibold mb-2 text-gray-900">Notes</h2>
          {notes.length === 0 ? (
            <p className="text-gray-400">No notes yet. Select a timestamp and add your first note!</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {notes.map((note, idx) => (
                <li
                  key={idx}
                  className={[
                    "flex items-center gap-3 rounded p-2 cursor-pointer transition border",
                    idx === currentNoteIdx
                      ? "bg-indigo-100 border-indigo-400 font-bold shadow"
                      : "bg-gray-50 border-transparent hover:bg-indigo-50"
                  ].join(" ")}
                  onClick={() => {
                    if (videoRef) {
                      videoRef.currentTime = note.time;
                      videoRef.play();
                    }
                  }}
                  title={`Jump to ${note.time.toFixed(1)}s`}
                >
                  <span className="text-xs text-indigo-600 font-mono bg-indigo-50 px-2 py-1 rounded">{note.time.toFixed(1)}s</span>
                  <span className="text-gray-800 break-words">{note.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
