import { useEffect, useRef } from 'react';
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import '../landing.css';
import { ArrowDown } from 'lucide-react';

gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollTrigger);

export const Landing = () => {
    gsap.registerPlugin(SplitText);
    const logo = useRef<HTMLAnchorElement | null>(null);
    const mainHeader = useRef<HTMLHeadingElement | null>(null);
    const subHeader = useRef<HTMLHeadingElement | null>(null);
    const image = useRef<HTMLImageElement  | null>(null);
    const arrow = useRef<SVGSVGElement  | null>(null);
    const scrollDown = useRef<HTMLHeadingElement | null>(null);

    console.log("Absolute Cinema");

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
            y: 7,              // move 100px to the right
            duration: .35,       // duration of one direction
            ease: "power1.inOut",// smooth easing
            repeat: -1,          // infinite loop
            yoyo: true           // reverse the animation
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

        // Animate to English after delay
        gsap.to(logo.current, {
            delay: .5,
            duration: 2,
            text: "INTERNHUB",
            ease: "power2.inOut"
        });

        // const subSplit = new SplitText(subHeader.current, { type: "chars" });
        // gsap.from(subSplit.chars, {
        //     duration: .5,
        //     opacity: 0,
        //     y: 50,
        //     stagger: 0.05,
        //     ease: "back.out",
        // });

        // gsap.fromTo(
        //     subHeader.current,
        //     { scale: 0.3, opacity: 0 },
        //     {
        //         scale: 1,
        //         opacity: 1,
        //         ease: "elastic.out(1, 0.4)",
        //         duration: 1.5,
        //         scrollTrigger: {
        //             trigger: subHeader.current,
        //             start: "top 80%", // when 80% of viewport height
        //         },
        //     }
        // );

        return () => {
            mainSplit.revert();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            // subSplit.revert();
        };
    }, []);

    return (
        <div className="bg-[#000000] h-full w-full overflow-hidden">
            <div className='flex w-full'>
                <a ref={logo} href='#' className="text-[#ffffff] font-[Space_Grotesk] font-black text-2xl xl:p-8 md:p-6 p-4">インターンハブ</a>
                <div className='flex justify-end ml-auto'>
                    <a href='#about' className="text-[#ffffff] font-[Space_Grotesk] font-black text-xl xl:p-8 md:p-6 p-4">About</a>
                    <a href='/register' className="text-[#ffffff] font-[Space_Grotesk] font-black text-xl xl:p-8 md:p-6 p-4">Join</a>
                </div>
            </div>
            <div className="relative w-full h-[75vh]">
                <img ref={image} src="landing-main.jpg" alt="Background" className="landingImage absolute xl:right-16 right-4 xl:top-16 top-4 xl:w-[50%] w-[80%] xl:h-[70%] h-[75%] xl:scale-down object-cover" />
                <div className='w-[65%] absolute xl:top-16 top-8 xl:left-4 left-2'>
                    <h2 ref={mainHeader} className="text-[#ffffff] font-[Helvetica] font-black xl:text-8xl lg:text-7xl md:text-5xl text-4xl xl:p-8 p-4 xl:w-auto w-[90vw]">MANGE INTERNSHIPS EFFORTLESSLY</h2>
                </div>
                <div className="absolute xl:bottom-16 bottom-0 xl:left-4">
                    <h2 ref={subHeader} className="text-[#ffffff] font-[Space_Grotesk] font-black xl:text-6xl lg:text-5xl text-4xl p-8">ONE PLATFORM TO POST, APPLY, AND TRACK INTERNSHIPS</h2>
                </div>
            </div>
            <div ref={scrollDown} className='flex justify-center items-center'>
                <div className='flex flex-col justify-center items-center'>
                    <h3 className='scrollDown text-[#ffffff] font-[Space_Grotesk] font-bold text-xl pt-8 pb-2'>Scroll Down</h3>
                    <ArrowDown ref={arrow}/>
                </div>
            </div>
            <div id="about" className='h-1000'></div>
        </div>
    );
};