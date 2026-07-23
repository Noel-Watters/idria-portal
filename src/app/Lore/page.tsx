"use client";
import React from "react";
import Image from "next/image"
import { BadgeInfo } from "lucide-react"
import Link from "next/link";

export default function LorePage() {
 
  return (
    <div className="min-h-screen mx-4 md:mx-16">
      {/* Hero Section */}
      <div className="bg-surface-2 rounded-2xl my-8 max-w-7xl mx-auto px-4 md:px-16 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-stretch text-left">
          <div className="flex-1 flex flex-col justify-center p-8">

            <Image
              src="/LoreIntroductionLettering.png"
              alt="Idria: D&D Roleplay"
              width={400}
              height={120}
              className="py-6 object-contain"
              priority
            />

            <p className="text-primary text-sm flex items-start gap-2">
              <BadgeInfo className="w-4 h-4 mt-0.5 shrink-0" />
              Idria is currently in early development. The website and in-game systems are still in the works! Everything is highly subject to change. Enjoy following along in the development process with us. </p>
            <p> Idria is located within Faerûn within the Forgotten Realms setting. The current year is 1495  </p>
            <p>For lore regarding the Forgotten Realms Setting, check out {" "}
                <Link
                    href="https://forgottenrealms.fandom.com/wiki/Main_Page"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-80"
                    >
                        the Forgotten Realms Wiki
                </Link>
            </p>


            <h3>The Kingdom of Idria</h3>
            <p>Once counted among the most prosperous kingdoms, Idria was a land of fertile fields, ancient forests, and thriving trade. Powerful sorcerous shaped much of the kingdom's history, with House Vigar ruling from the magnificent capital of Thoremere. The kingdom's arcane achievements became renowned throughout the region, aided by the legendary order of mages known as the Virtuosos.</p>
            <p>Not all power within Idria was held openly. The elusive Shadowsilk Guild operated from the darkness, whispered to be nothing more than folklore by many, while others quietly acknowledged their influence stretched throughout the realm.</p>

            <hr className="border-border-medium my-6" />

            <h3>The Fall of Thoremere</h3>
            <p>Deep beneath the capital, an ancient and malevolent entity was discovered. What it was, where it came from, and how long it had slumbered beneath Thoremere are questions history can no longer answer.</p>
            <p>House Vigar was the first to uncover the truth. As attempts to destroy the entity failed, the kingdom sought aid from the elves. Realizing the creature could not be slain, the elves performed an act of High Magic rarely seen in the history of Faerûn.</p>
            <p>A great mythal was woven over the lands surrounding Thoremere. The prison trapped not only the entity, but everyone within its borders.</p>
            <p>The battle that followed devastated the capital. Thoremere was left in ruins, the surrounding countryside transformed into a scarred wasteland, and countless lives were lost. Though the entity was grievously wounded, it was never found again.</p>

            <hr className="border-border-medium my-6" />

            <h3>Centuries of Isolation</h3>
            <p>Those who survived had no choice but to rebuild. Libraries burned, records vanished, and much of Idria's history was lost alongside its greatest city. Survival became more important than preserving the past, and over generations the truth behind Thoremere's destruction faded into myth.</p>
            <p>To the outside world, Idria became known only as the site of an ancient magical catastrophe. The mythal's lingering power cloaked the region in strange magical phenomena, with arcane storms, shifting sands, and distorted paths turning away all but the most determined travelers. Over time, the surrounding kingdoms abandoned any effort to reclaim or explore the land, believing it forever cursed. Those entrusted with the truth swore solemn oaths to preserve the secret of the imprisoned entity, fearing that knowledge of its existence would invite those who sought to awaken or control it.</p>
            <p>House Vigar endured, though its influence diminished greatly with time. The Virtuosos helped rebuild a new capital, becoming one of the most influential institutions in the region. Meanwhile, the Order of Talvor, an ancient elven order of paladins, chose to remain within the mythal to stand watch against the imprisoned darkness should it ever rise again.</p>

            <hr className="border-border-medium my-6" />

            <h3>The Present Day</h3>
            <p>The year is<strong> 1495 DR</strong>.</p>
            <p>The mythal has weakened with age. The magical phenomena that once discouraged all who approached have gradually faded, allowing determined travelers to once again reach the lands surrounding Thoremere. Yet while entry has become possible, no one has ever successfully left. Whether this lingering prison is the final purpose of the ancient High Magic or the influence of the entity imprisoned beneath the capital, none can say with certainty.</p>
            <p>Though a new capital has risen, much of Idria remains untouched by recovery. The ruins of old Thoremere and countless forgotten settlements still lie scattered across the wasteland, where corrupted creatures roam and the lingering influence of the ancient catastrophe continues to shape the land.</p>
            <p>Most dismiss the old stories as little more than legend, believing the ancient evil to have perished with the fall of Old Thoremere. Yet others whisper that whatever fled the final battle still lies hidden beneath the scarred land, waiting for the day it is strong enough to emerge once more. Such rumors have risen and faded for centuries, and few still give them any credence.</p>
            
            <hr className="border-border-medium my-6" />

          </div>
        </div>
      </div>
    </div>
  );
}