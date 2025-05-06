import React from 'react'
import { Button } from './ui/button'
import { Play } from 'lucide-react'
import Link from 'next/link';

export default function VideoCard({ title, description, id }) {
  return (
    <Link href={`/video/${id}`} className="block">
      <div className="relative group rounded-xl overflow-hidden shadow-lg bg-white flex flex-col transition-transform hover:scale-[1.025] cursor-pointer">
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src="/assets/stream-now.png"
            alt="Video Thumbnail"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <Button className="bg-white/90 hover:bg-white rounded-full p-4 shadow-lg transition-transform scale-90 group-hover:scale-100" asChild>
              <span><Play className="text-black w-8 h-8 hover:text-indigo-700" /></span>
            </Button>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-1 truncate">{title ?? "Video Title"}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{description ?? "Description."}</p>
        </div>
      </div>
    </Link>
  );
}

