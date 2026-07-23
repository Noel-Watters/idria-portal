"use client";
import React from "react";
import Image from "next/image"
import { BadgeInfo } from "lucide-react"

export default function HomePage() {
 
  return (
    <div className="min-h-screen mx-4 md:mx-16">
      {/* Hero Section */}
      <div className="bg-surface-2 rounded-2xl my-8 max-w-7xl mx-auto px-4 md:px-16 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-stretch text-left">
          <div className="flex-1 flex flex-col justify-center p-8">

            <Image
              src="/IdriaLetteringLong.png"
              alt="Idria: D&D Roleplay"
              width={600}
              height={120}
              className="py-6 mx-auto object-contain"
              priority
            />

            <p className="text-left whitespace-normal">Welcome to Idria, a whitelisted Dungeons & Dragons roleplay server set within the Forgotten Realms, where long-term storytelling, 
              meaningful character progression, and a living world take center stage.</p>
            <p> Built from the ground up with roleplay as the primary focus, Idria is designed to reward players who invest in their characters and become part of the world's ongoing story. 
              Whether you dream of becoming a renowned adventurer, an influential merchant, a dangerous assassin, or a humble traveler, every character has the opportunity 
              to leave their mark on the realm.</p>
            <p>Rather than rushing from event to event, Idria embraces a slower, more immersive style of roleplay. Player choices have lasting consequences, 
              settlements grow and change over time, and the stories created by the community become part of the world's history. With regular content updates, evolving storylines, 
              and a focus on collaborative storytelling, Idria is a world built to grow alongside its players.</p>
            <p className="text-primary text-sm flex items-start gap-2">
              <BadgeInfo className="w-4 h-4 mt-0.5 shrink-0" />
              Idria is currently in early development. The website and in-game systems are still in the works! Everything is highly subject to change. Enjoy following along in the development process with us. </p>
            
            <hr className="border-border-medium my-6" />

            <h3>Our Long-term Vision</h3>
            <p>Idria is more than a place to adventure. It's a world designed to support every style of roleplay.</p>
            <p>Our long-term vision includes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>The D&D classes and races we all know and love</li>
              <li>Custom Profession System with unique roles that encourage trade.</li>
              <li>Player-driven economy built around crafting, trade, and cooperation.</li>
              <li>Dice-based combat for both PvP & DM ran events</li>
              <li>Dungeon Master-led events and quests with meaningful, lasting consequences.</li>
              <li>A dynamic world that evolves through player choices and actions.</li>
              <li>Player settlement system allowing communities to establish and grow their own towns.</li>
              <li>Central hub supporting both heroic and villainous roleplay.</li>
              <li>Custom caravan trading system creating opportunities for merchants, guards, and bandits.</li>
              <li>An immersive Conan Exiles roleplay experience inspired by the Forgotten Realms</li>
            </ul>

            <hr className="border-border-medium my-6" />

            <h3>A lost Kingdom</h3>
            <p>For centuries, the lands of Idria have remained isolated from the rest of Faerûn, 
              hidden behind the remnants of an ancient mythal created to imprison a terrible evil beneath the ruined 
              capital of Thoremere. Once a prosperous kingdom of powerful sorcerous houses, fertile farmlands, and grand cities, 
              the realm now struggles to rebuild amidst scarred wastelands, forgotten ruins, and lingering corruption.</p>
            <p>Though the mythal has weakened enough to allow travelers to enter, none have ever found a way to leave.</p>
            <p>Now, in 1495 DR, adventurers, scholars, merchants, and wanderers alike arrive seeking fortune, knowledge, 
              or simply a new beginning, unaware that the choices they make may determine whether Idria is finally restored... 
              or lost forever.</p>

            <div className="pt-2 pb-20 flex items-center gap-4">
              <a
                href="/Lore"
                className="px-4 py-2 rounded-full bg-surface outline outline-accent text-primary hover:text-accent text-sm font-medium"
              >
                More Lore
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}