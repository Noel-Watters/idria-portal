"use client";
import React from "react";
import Image from "next/image"
import { BadgeInfo } from "lucide-react"
import Editor from "@/components/editor/Editor";

export default function RulesPage() {
 
  return (
    <div className="min-h-screen mx-4 md:mx-16">
      {/* Hero Section */}
      <div className="bg-surface-2 rounded-2xl my-8 max-w-7xl mx-auto px-4 md:px-16 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-stretch text-left">
          <div className="flex-1 flex flex-col justify-center p-8">

            <Image
              src="/RulesLettering.png"
              alt="Idria: D&D Roleplay"
              width={400}
              height={120}
              className="py-6 mx-auto object-contain"
              priority
            />
            <p className="text-primary text-sm flex items-start gap-2">
                          <BadgeInfo className="w-4 h-4 mt-0.5 shrink-0" />
                          Idria is currently in early development. The website and in-game systems are still in the works! Everything is highly subject to change. Enjoy following along in the development process with us. </p>
                        
            <p>Will be updated soon!</p>
            <Editor />

          </div>
        </div>
      </div>
    </div>
  );
}