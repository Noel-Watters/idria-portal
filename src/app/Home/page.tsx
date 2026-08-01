"use client";
import React from "react";
import Image from "next/image"
import { BadgeInfo } from "lucide-react"
import DevtNotice from "@/components/DevNotice";

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

            <DevtNotice />
            <hr className="border-border-medium my-6" />

            <h1>Welcome to Idria</h1>

            <p className="pt-5">In Idria, the stories belong to the players.</p>

            <p>Set within the Forgotten Realms, Idria is a whitelisted Dungeons & Dragons roleplay server built around one core belief: 
              roleplay should have lasting consequences. The decisions you make, the people you meet, and the ambitions you pursue don't simply 
              disappear when a scene ends. They become part of a living world that continues to grow long after you've logged off.</p>

            <p>We believe game mechanics should exist to serve roleplay. Every system we create is designed to give players the tools to pursue ambitious goals, 
              tell unforgettable stories, and shape the future of the world through collaboration, conflict, and creativity.</p>
            
            <p><strong>With enough roleplay, anything is possible.</strong></p>

            
            <hr className="border-border-medium my-6" />

            <h1>Core Features</h1>
            <p>Idria is built around a collection of interconnected systems, each designed with one goal in mind: creating meaningful roleplay and rewarding player investment. While many of these systems are still in development, this is the vision we're working toward.</p>

            <h3>Forgotten Realms</h3>
            <p>Idria is set within the Forgotten Realms, one of the most beloved and detailed fantasy settings ever created. Its rich history, countless factions, powerful magic, and endless mysteries provide the foundation for stories that feel grounded, immersive, and full of opportunity.</p>

            <h3>D&D Dice System</h3>
            <p>Our dice system forms the backbone of conflict and character progression. Combat follows familiar Dungeons & Dragons mechanics with classes, spells, feats, and abilities, while the same system also supports social encounters, research, rituals, exploration, and other roleplay beyond combat.</p>

            <h3>Profession System</h3>
            <p>Professions are designed to encourage specialization and cooperation rather than allowing every character to do everything. As you progress, you'll unlock new recipes, abilities, and opportunities, creating meaningful reasons to trade, partner with others, or become renowned for mastering your craft.</p>

            <h3>Player-Driven Economy</h3>
            <p>Our economy is built around players, not admin shops. While everyone will have reliable ways to earn gold, the greatest wealth will come through trade, crafting, services, and the relationships you build with other players.</p>

            <h3>Factions</h3>
            <p>The world is home to powerful organizations that shape Idria's politics, conflicts, and future. Whether you pledge your loyalty, oppose their ambitions, or attempt to influence them from within, your choices can change the balance of power across the realm.</p>

            <h3>Settlement System</h3>
            <p>Players will have the opportunity to establish and grow their own settlements. As your community grows, you'll unlock powerful upgrades, unique opportunities, and new ways to shape the world around you. Align your settlement with one of Idria's great factions, or remain independent and forge your own identity.</p>

            <h3>Dynamic DM Events</h3>
            <p>Our Dungeon Masters don't simply run isolated events. They tell collaborative stories that react to the world around them. Major decisions, victories, failures, alliances, and betrayals all have the potential to influence future events, ensuring the world's story is shaped by the players who inhabit it.</p>


            <hr className="border-border-medium my-6" />

            <h1>A lost Kingdom</h1>
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