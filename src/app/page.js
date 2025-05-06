'use client'
import HeroCarousel from "@/components/HeroCarousel";
import VideoCard from "@/components/VideoCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const [videos, setVideo] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }

    const fetchVideos = async () => {
      const { data: videos, error } = await supabase
        .from('videos')
        .select('*')
      if (!error) setVideo(videos || []);
     
    };

    fetchVideos();

  }, [user, loading, router]);

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="bg-white flex flex-col">
      <div className="mx-6">
        <HeroCarousel />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {videos?.map(({ title, description, id }) => <VideoCard key={id} id={id} title={title} description={description} />)}
        </div>
      </div>
    </div>
  );
}
