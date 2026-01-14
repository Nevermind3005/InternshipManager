import { useEffect, useRef } from 'react';
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from 'lucide-react';
import { Link } from '@tanstack/react-router';

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
                toggleActions: "restart pause reverse pause",
                scrub: true
            }
        });

        // Your requested Japanese logo animation preserved
        gsap.set(logo.current, { text: "インターンハブ" });

        gsap.to(logo.current, {
            delay: .5,
            duration: 2,
            text: "INTERNHUB",
            ease: "power2.inOut"
        });

        sections.current.forEach((sec, i) => {
            if (sec) {
                ScrollTrigger.create({
                    trigger: sec,
                    start: "top top",
                    pin: true,
                    pinSpacing: false,
                    end: "+=100%",
                });
            }
        });

        return () => {
            mainSplit.revert();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="bg-[#000003] w-full overflow-x-hidden">
            {/* SECTION 1: HERO */}
            <section ref={el => sections.current[0] = el} className="h-screen flex flex-col justify-between">
                <div className='flex w-full'>
                    <p ref={logo} className="text-white font-[Space_Grotesk] font-black text-2xl xl:p-8 md:p-6 p-4">インターンハブ</p>
                    <div className='flex justify-end ml-auto items-center'>
                        <Link to="/login">
                            <span className="text-white font-[Space_Grotesk] font-black text-xl xl:p-8 md:p-6 p-4">Prihlásenie</span>
                        </Link>
                        <Link to='/register'>
                            <span className="bg-white text-black font-[Space_Grotesk] font-black text-xl xl:m-8 m-4 px-6 py-2 rounded shadow-lg hover:bg-gray-200 transition-colors">Registrácia</span>
                        </Link>
                    </div>
                </div>
                <div className="relative w-full h-[75vh]">
                    <img ref={image} src="landing-main.jpg" alt="Background" className="landingImage absolute xl:right-16 right-4 xl:top-16 top-4 xl:w-[50%] w-[80%] xl:h-[70%] h-[75%] object-cover opacity-70" />
                    <div className='w-[65%] absolute xl:top-16 top-8 xl:left-4 left-2 z-10'>
                        <h2 ref={mainHeader} className="text-white font-[Helvetica] font-black xl:text-8xl lg:text-7xl md:text-5xl text-4xl xl:p-8 p-4 leading-[1.1]">
                            EFEKTÍVNA SPRÁVA ODBORNEJ PRAXE
                        </h2>
                    </div>
                    <div className="absolute xl:bottom-16 bottom-0 xl:left-4 z-10">
                        <h2 ref={subHeader} className="text-white font-[Space_Grotesk] font-black xl:text-4xl lg:text-3xl text-2xl p-8 max-w-4xl">
                            Digitalizujeme procesy pre študentov, firmy a garantov.
                        </h2>
                    </div>
                </div>
                <div ref={scrollDown} className='flex justify-center items-center pb-8'>
                    <div className='flex flex-col justify-center items-center'>
                        <h3 className='scrollDown text-white font-[Space_Grotesk] font-bold text-xl pt-8 pb-2'>Zistiť viac</h3>
                        <ArrowDown ref={arrow} color="white" />
                    </div>
                </div>
            </section>

            {/* SECTION 2: ABOUT - Expanded Text */}
            <section id='about' ref={el => sections.current[1] = el} className="h-screen flex flex-col justify-center items-center bg-[#1aa9bc] text-white p-12">
                <div className="max-w-5xl text-center">
                    <h2 className="text-6xl font-bold mb-8">Moderný CRM pre vzdelávanie</h2>
                    <p className="text-2xl mb-6 leading-relaxed">
                        Náš systém slúži ako komplexný procesný rámec pre predmet Odborná prax. Integrujeme existujúce administratívne postupy do jedného prehľadného digitálneho prostredia, ktoré čiastočne automatizuje rutinné úlohy a znižuje chybovosť pri spracovaní dokumentov.
                    </p>
                    <p className="text-2xl leading-relaxed opacity-90">
                        Cieľom je vytvoriť jednotnú a transparentnú databázu študentov a partnerských firiem. Či už ide o sledovanie aktívnych stáží alebo vyhľadávanie v archíve, systém poskytuje okamžitý prehľad o priebehu praxe pre všetky zainteresované strany v reálnom čase.
                    </p>
                </div>
            </section>

            {/* SECTION 3: STUDENTS - Expanded Text */}
            <section ref={el => sections.current[2] = el} className="h-screen flex flex-col justify-center items-center bg-[#007500] text-white p-12">
                <div className="max-w-5xl text-center">
                    <h2 className="text-6xl font-bold mb-8">Jednoduchý štart pre študentov</h2>
                    <p className="text-2xl mb-8 leading-relaxed">
                        Zabudnite na zložité papierovanie. Po registrácii si študent môže založiť novú prax v priebehu pár sekúnd – stačí využiť naše fulltextové vyhľadávanie firiem, nastaviť dátumy a semestrálny plán.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="bg-white/10 p-6 rounded-lg border border-white/20">
                            <h3 className="text-2xl font-bold mb-3">Automatizácia dokumentov</h3>
                            <p className="text-lg">Po založení praxe systém okamžite vygeneruje oficiálnu PDF „Dohodu o odbornej praxi“, ktorú stačí stiahnuť a nechať podpísať.</p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-lg border border-white/20">
                            <h3 className="text-2xl font-bold mb-3">Sledovanie progresu</h3>
                            <p className="text-lg">Majte dokonalý prehľad o stave vašej žiadosti – od prvotného vytvorenia cez schválenie firmou až po úspešnú obhajobu.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: EMPLOYERS & GARANTS - Expanded Text */}
            <section id='join' ref={el => sections.current[3] = el} className="h-screen flex flex-col justify-center items-center bg-[#e6c700] text-black p-12">
                <div className="max-w-6xl">
                    <h2 className="text-6xl font-bold mb-12 text-center">Riadenie a Kontrola</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h3 className="text-4xl font-black uppercase">Pre Firmy</h3>
                            <p className="text-xl leading-relaxed">
                                Firmy získavajú dedikovaný portál na správu budúcich talentov. Systém umožňuje rýchle potvrdzovanie alebo zamietanie žiadostí o prax. Po potvrdení je automaticky notifikovaný študent aj garant praxe, čím odpadá nutnosť manuálnej emailovej komunikácie.
                            </p>
                            <p className="text-xl leading-relaxed">
                                Zástupcovia firiem môžu nahrávať a schvaľovať pracovné výkazy, čím zabezpečujú validitu vykonanej práce študenta priamo v systéme.
                            </p>
                        </div>
                        <div className="space-y-6 border-l-4 border-black pl-8">
                            <h3 className="text-4xl font-black uppercase">Pre Garanta</h3>
                            <p className="text-xl leading-relaxed">
                                Garant odbornej praxe má absolútnu kontrolu nad celým ekosystémom. Môže flexibilne meniť atribúty praxí, filtrovať študentov podľa odborov alebo ročníkov a dohliadať na povinné dokumenty.
                            </p>
                            <p className="text-xl leading-relaxed font-bold">
                                Vďaka funkcii hromadného exportu do CSV môže garant generovať reporty a štatistiky pre potreby katedry jediným kliknutím.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};