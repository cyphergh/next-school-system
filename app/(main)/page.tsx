import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/public/logo.png";
import Img from "@/public/img4.jpg";
import { getSession } from "@/actions/session";
import NavBar from "./navbar";
import { Post } from "@/types";
import { FaArrowDown } from "react-icons/fa";
import WebFooter from "./footer";

export default async function Home() {
  const session = await getSession();
  const posts: Post[] = [
    {
      id: 1,
      title: "About Us",
      image: "bg-[url(../public/logo.png)]",
      description: `Welcome to Golden Heart Academy, an esteemed educational institution located in the heart of Amanfrom, Kumasi, Ghana. Since our founding, we have been dedicated to fostering a culture of excellence, both academically and morally, in our students. At Golden Heart Academy, we believe that education extends beyond the classroom, shaping not only the intellect but also the character of each student.
Our mission is to provide a well-rounded and holistic education that equips students with the knowledge, skills, and values needed to thrive in an ever-evolving world. We offer a comprehensive curriculum designed to meet the highest educational standards, complemented by an array of extracurricular activities that encourage creativity, critical thinking, and collaboration.`,
      likes: 20,
      reviews: [],
    },
    {
      id: 1,
      title: "Our Vision",
      image: "bg-[url(../public/img2.jpg)]",
      description: `At Golden Heart Academy, our vision is to become a beacon of excellence in education, where every student is empowered to achieve academic distinction while developing strong moral and ethical foundations. We aspire to shape well-rounded individuals who are not only equipped with the skills and knowledge necessary for personal and professional success but also possess the compassion, integrity, and leadership qualities required to positively impact their communities and the world.

We envision a future where our students are critical thinkers, innovative problem solvers, and responsible global citizens, prepared to embrace the challenges and opportunities of an ever-evolving world. Our aim is to cultivate a lifelong love of learning and a passion for service, inspiring each child to unlock their full potential and contribute meaningfully to society.

At Golden Heart Academy, we are dedicated to setting the highest standards in education, continuously evolving to meet the needs of our students and preparing them to thrive in a diverse and interconnected global landscape.`,
      likes: 20,
      reviews: [],
    },
    {
      id: 1,
      title: "Empowering Future Innovators: Our ICT and Science Lab",
      image: "bg-[url(../public/it.jpg)]",
      description: `At Golden Heart Academy, we recognise the vital role that technology and scientific inquiry play in modern education. Our state-of-the-art ICT and Science Lab is designed to provide students with hands-on experience and the tools they need to explore, experiment, and innovate.
Our ICT Lab is equipped with the latest computers and software, enabling students to develop essential digital skills that are critical in today’s tech-driven world. From coding and programming to digital design and multimedia production, our students are encouraged to harness technology creatively and effectively. Regular workshops and training sessions are conducted to keep our students abreast of current trends and advancements in the digital landscape. With high-speed internet access and a collaborative learning environment, students can engage in group projects, conduct research, and work on presentations that enhance their learning experience..`,
      likes: 20,
      reviews: [],
    },
    {
      id: 1,
      title: "Our Robotics Club",
      image: "bg-[url(../public/robotics.jpg)]",
      description: `At Golden Heart Academy, we are proud to offer a Robotics Club that ignites students' passion for technology, engineering, and innovation. This club serves as a vibrant community where students of all skill levels come together to explore the exciting world of robotics and develop essential skills for the future.

Members of the Robotics Club engage in hands-on activities that include designing, building, and programming robots. Through collaborative projects, students learn the fundamentals of engineering principles, coding, and problem-solving, while also fostering creativity and teamwork. The club provides access to state-of-the-art tools and resources, allowing students to experiment with various robotics kits and technologies.

Our dedicated club advisors guide students through competitions and challenges, encouraging them to apply their knowledge in real-world scenarios. Participation in local and national robotics competitions not only enhances technical skills but also promotes critical thinking, resilience, and a spirit of innovation.

The Robotics Club is more than just a technical program; it cultivates leadership qualities and confidence in students as they work together to overcome challenges and achieve their goals. By fostering a love for STEM (Science, Technology, Engineering, and Mathematics), we prepare our students for future careers in an increasingly technology-driven world.

At Golden Heart Academy, the Robotics Club exemplifies our commitment to providing a comprehensive education that inspires the next generation of innovators and problem-solvers. Join us in exploring the limitless possibilities of robotics!`,
      likes: 20,
      reviews: [],
    },
    {
      id: 1,
      title: "Exploring Boundless Knowledge: Our Virtual Science Lab",
      image: "bg-[url(../public/science.jpg)]",
      description: `
At Golden Heart Academy, we embrace the power of technology to enhance learning through our Virtual Science Lab. This innovative space provides students with a dynamic and interactive platform to explore scientific concepts and conduct experiments, all from the comfort of their own devices.

The Virtual Science Lab is designed to make science accessible and engaging. Equipped with a wide range of digital simulations and virtual experiments, students can dive into various scientific disciplines, including biology, chemistry, and physics. These simulations allow them to visualize complex processes, manipulate variables, and observe outcomes in real-time, fostering a deeper understanding of scientific principles.

Guided by our dedicated teachers, students can collaborate on group projects, conduct research, and participate in interactive lessons that encourage inquiry-based learning. The Virtual Science Lab promotes critical thinking and problem-solving skills as students tackle challenges and explore scientific phenomena.

In addition to enhancing academic learning, the Virtual Science Lab prepares students for future careers in science, technology, engineering, and mathematics (STEM) by equipping them with the digital literacy skills essential in today's world.

At Golden Heart Academy, our commitment to innovative education ensures that students are not only consumers of technology but also creators and innovators in the field of science.`,
      likes: 20,
      reviews: [],
    },
  ];
  return (
    <div className="flex flex-col  fixed w-full overflow-y-scroll snap-y snap-mandatory h-[100vh] ">
      <div className="bg-[url('../public/img1.jpg')] bg-cover bg-center lg:bg-cover w-full min-h-screen flex-col flex justify-center items-center snap-start h-screen">
        <NavBar loggedIn={session.isLoggedIn}></NavBar>
        <Image src={Logo} alt="logo" className="w-[50%] sm:w-[300px] "></Image>
        <div className="text-[3rem] lg:text-[5rem] font-bold text-shadow text-white animate-pulse">
          Welcome
        </div>
        <div className="flex flex-col items-center justify-center space-y-2 mt-14 text-shadow text-2xl text-white">
          Scroll Down for More
          <FaArrowDown className="text-2xl animate-bounce" />
        </div>
      </div>
      {/*  */}
      {posts.map((post) => {
        return (
          <div
            key={post.id}
            className="lg:bg-cover w-full min-h-screen flex-col flex justify-start items-start snap-start h-screen lg:flex-row overflow-y-scroll sm:overflow-y-hidden"
          >
            {post.image && (
              <div
                className={`${post.image!} bg-cover  lg:bg-cover lg:flex-1 h-[300px] lg:h-full w-full min-h-[300px] shrink-0`}
              ></div>
            )}
            <div className="lg:flex-1 flex flex-col justify-center items-center lg:h-full">
              <div className="text-2xl font-bold text-shadow p-4 lg:text-4xl">
                {post.title}
              </div>
              <p className="p-2 lg:text-2xl">{post.description}</p>
            </div>
          </div>
        );
      })}
      <WebFooter></WebFooter>
    </div>
  );
}
