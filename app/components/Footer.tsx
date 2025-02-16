import { FOOTER_LINKS } from "../constants/index";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Particles from "./Particles";
import DefrostLogo from "../../public/Logo Defrost Launcher.png";

const CURRENT_YEAR = new Date().getFullYear();

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
};

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div className="flex flex-col gap-5">
      <h4 className="font-bold whitespace-nowrap">{title}</h4>
      {children}
    </div>
  );
};
export function Footer() {
  return (
    <footer className="relative  bg-[#1D114F] text-white overflow-hidden h-96">


      <span className="absolute inset-0 flex items-center justify-center text-[200px] font-bold text-white opacity-5 z-0 mt-20">
        DEFROST
      </span>

      <div className="relative z-10 flex w-full flex-col gap-14 px-10 pt-10">
      <div className="absolute inset-0 opacity-50 h-full w-full z-20">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
        <div className="flex flex-col items-start justify-center gap-[10%] md:flex-row z-30">
          <div className="flex items-center flex-shrink-0 transition-transform transform hover:-translate-y-1 duration-300 p-3">
            <Image src={DefrostLogo} alt="Logo" className="h-10 w-10 mr-2" />
            <Link href={"/"}>
              <span className="text-xl tracking-tight text-white font-bold">
                Defrost
              </span>
            </Link>
          </div>

          <div className="flex flex-wrap gap-16 sm:justify-end md:flex-1">
            {FOOTER_LINKS.map((columns, index) => (
              <FooterColumn key={index} title={columns.title}>
                <ul className="regular-14 flex flex-col gap-4 text-gray-30 ">
                  {columns.links.map((link) => (
                    <Link
                      href="/"
                      key={link}
                      className="hover:text-[#A71E82] duration-200"
                    >
                      {link}
                    </Link>
                  ))}
                </ul>
              </FooterColumn>
            ))}
          </div>
        </div>

        <p className="regular-14 w-full text-center text-gray-30 pt-10 opacity-35 mt-20">
          &copy; {CURRENT_YEAR} Made by Solidithi Squad
        </p>
      </div>
    </footer>
  );
}

export default Footer;
