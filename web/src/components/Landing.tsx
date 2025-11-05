import { useEffect, useRef } from 'react';
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from 'lucide-react';

gsap.registerPlugin(TextPlugin, ScrollTrigger, SplitText);

export const Landing = () => {
    const logo = useRef(null);
    const mainHeader = useRef(null);
    const subHeader = useRef(null);
    const image = useRef(null);
    const arrow = useRef(null);
    const scrollDown = useRef(null);
    const sections = useRef<(HTMLElement | null)[]>([]);
    useEffect(() => {
        const mainSplit = new SplitText(mainHeader.current, { type: "chars" });
        gsap.from(mainSplit.chars, {
            duration: 0.25,
            opacity: 0,
            y: 50,
            stagger: 0.05,
            ease: "back.out",
        });

        gsap.to(image.current, {
            x: 500,
            scrollTrigger: {
                trigger: ".landingImage",
                start: 0,
                markers: true,
                toggleActions: "restart pause reverse pause",
                scrub: true
            }
        });

        gsap.to(arrow.current, {
            y: 7,
            duration: .35,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true
        });

        gsap.to(scrollDown.current, {
            opacity: 0,
            scrollTrigger: {
                trigger: ".scrollDown",
                start: 0,
                markers: true,
                toggleActions: "restart pause reverse pause",
                scrub: true
            }
        });

        gsap.set(logo.current, { text: "インターンハブ" });

        gsap.to(logo.current, {
            delay: .5,
            duration: 2,
            text: "INTERNHUB",
            ease: "power2.inOut"
        });

        // Pin each section for a "full page scroll" feel
        sections.current.forEach((sec, i) => {
            ScrollTrigger.create({
                trigger: sec,
                start: "top top",
                pin: true,
                pinSpacing: false,
                end: "+=100%",
                markers: false,
            });
        });

        return () => {
            mainSplit.revert();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="bg-[#000003] w-full overflow-x-hidden">
            <section ref={el => sections.current[0] = el} className="h-screen flex flex-col justify-between">
                <div className='flex w-full'>
                    <a ref={logo} href='#' className="text-white font-[Space_Grotesk] font-black text-2xl xl:p-8 md:p-6 p-4">インターンハブ</a>
                    <div className='flex justify-end ml-auto'>
                        <a href='#about' className="text-white font-[Space_Grotesk] font-black text-xl xl:p-8 md:p-6 p-4">About</a>
                        <a href='#join' className="text-white font-[Space_Grotesk] font-black text-xl xl:p-8 md:p-6 p-4">Join</a>
                    </div>
                </div>
                <div className="relative w-full h-[75vh]">
                    <img ref={image} src="landing-main.jpg" alt="Background" className="landingImage absolute xl:right-16 right-4 xl:top-16 top-4 xl:w-[50%] w-[80%] xl:h-[70%] h-[75%] object-cover" />
                    <div className='w-[65%] absolute xl:top-16 top-8 xl:left-4 left-2'>
                        <h2 ref={mainHeader} className="text-white font-[Helvetica] font-black xl:text-8xl lg:text-7xl md:text-5xl text-4xl xl:p-8 p-4">MANAGE INTERNSHIPS EFFORTLESSLY</h2>
                    </div>
                    <div className="absolute xl:bottom-16 bottom-0 xl:left-4">
                        <h2 ref={subHeader} className="text-white font-[Space_Grotesk] font-black xl:text-6xl lg:text-5xl text-4xl p-8">ONE PLATFORM TO POST, APPLY, AND TRACK INTERNSHIPS</h2>
                    </div>
                </div>
                <div ref={scrollDown} className='flex justify-center items-center pb-8'>
                    <div className='flex flex-col justify-center items-center'>
                        <h3 className='scrollDown text-white font-[Space_Grotesk] font-bold text-xl pt-8 pb-2'>Scroll Down</h3>
                        <ArrowDown ref={arrow} />
                    </div>
                </div>
            </section>

            {/* Section 2 */}
            <section id='about' ref={el => sections.current[1] = el} className="h-screen flex flex-col justify-center items-center bg-[#1aa9bc] text-white">
                <h2 className="text-6xl font-bold mb-4">About Our Platform</h2>
                <p className="text-2xl w-3/4 text-center">
          InternHub connects companies and interns through a seamless application, tracking, and management experience.
                </p>
            </section>

            {/* Section 3 */}
            <section ref={el => sections.current[2] = el} className="h-screen flex flex-col justify-center items-center bg-[#007500] text-white">
                <h2 className="text-6xl font-bold mb-4">For Students</h2>
                <p className="text-2xl w-3/4 text-center">
          Apply to curated internships and manage all your applications in one place.
                </p>
            </section>

            {/* Section 4 */}
            <section id='join' ref={el => sections.current[3] = el} className="h-screen flex flex-col justify-center items-center bg-[#e6c700] text-white">
                <h2 className="text-6xl font-bold mb-4">For Employers</h2>
                <p className="text-2xl w-3/4 text-center">
          Post positions, review applicants, and track intern performance with ease.
                </p>
            </section>
        </div>
    );
};
