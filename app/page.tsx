"use client";

import TimelineItem from "./components/TimelineItem/page";

export default function Home() {
  return (
    <main className="relative min-h-[250vh] bg-black text-white">

      {/* Vertical Line Left */}
      <div className="fixed left-24 top-16 h-[calc(100vh-4rem)] w-[2px] bg-white" />

      <div className="flex flex-col items-center gap-40 pt-40">

        <TimelineItem title="🧑 About Me">
          <b>Nguyen Hoang Minh Thanh</b>
          <br /><b>Software Engineer</b>
          <br /><b>Da Nang, Vietnam 📍</b>
          <br /><b>201000thanhnguyen@gmail.com 📧</b>
        </TimelineItem>

        <TimelineItem title="🎓 Education">
          <b>2018 – 2021:</b>
          <br />&nbsp;&nbsp;&nbsp;&nbsp; Vietnam – Korea University of Information and Communication Technology
          <br /><b>2021 – 2022:</b>
          <br /> &nbsp;&nbsp;&nbsp;&nbsp; Internship - IOTLink
          <br /><b>2022 – Present:</b>
          <br /> &nbsp;&nbsp;&nbsp;&nbsp; FPT Software Da Nang
        </TimelineItem>

        <TimelineItem title="💻 Skills">
          <b>Languages:</b>
          <br />&nbsp;&nbsp;&nbsp;&nbsp; Java, JavaScript, TypeScript ..
          <br /><b>Frameworks:</b>
          <br /> &nbsp;&nbsp;&nbsp;&nbsp; Spring Framework, Next.js ..
          <br /><b>Styling:</b>
          <br /> &nbsp;&nbsp;&nbsp;&nbsp; TailwindCSS, Bootstrap
          <br /><b>Dev tools:</b> 
          <br /> &nbsp;&nbsp;&nbsp;&nbsp; IntelliJ IDEA, Eclipse, Visual Studio Code, Docker, Nginx, Git..
          <br /><b>Database:</b> 
          <br /> &nbsp;&nbsp;&nbsp;&nbsp; MySQL, Oracle  
        </TimelineItem>

        <TimelineItem title="🧠 Currently Learning">
          <b>DevOps & CI/CD</b>
        </TimelineItem>

        <TimelineItem title="🏆 Achievements">
          (To be filled in the future)
        </TimelineItem>

        <div className="pb-20"></div>
      </div>
    </main>
  );
}