"use client";

import TimelineItem from "./components/TimelineItem/page";

export default function Home() {
  return (
    <main className="relative min-h-[250vh] bg-black text-white">

      {/* Vertical Line Left */}
      <div className="fixed left-24 top-16 h-[calc(100vh-4rem)] w-[2px] bg-white" />

      <div className="flex flex-col items-center gap-40 pt-40">

        <TimelineItem title="About Me">
          I'm a software engineer.
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente odio, nobis similique nulla atque possimus voluptas veniam est saepe nihil perferendis, modi blanditiis rem soluta doloribus sequi, odit aliquid impedit!
        </TimelineItem>

        <TimelineItem title="Skills">
          Next.js, Node.js, DevOps...
          <br />Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente odio, nobis similique nulla atque possimus voluptas veniam est saepe nihil perferendis, modi blanditiis rem soluta doloribus sequi, odit aliquid impedit!
        </TimelineItem>

        <TimelineItem title="Contact">
          your@email.com
          <>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor non numquam sint ducimus libero nulla fugiat, nisi saepe ipsa? Provident impedit nesciunt explicabo laborum delectus sunt? Repudiandae atque fugiat nulla!
          </>
        </TimelineItem>

      </div>
    </main>
  );
}