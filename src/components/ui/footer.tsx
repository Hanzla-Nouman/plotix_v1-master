import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Icons } from "../Icons";
import { Button } from "./button";
import starCombo from './../../../public/star-combo-2.svg';
import Image from "next/image";
import Link from "next/link";
import { StarCombo2 } from "../StarCombo";

const footerLinks = [
  'About',
  'Careers',
  'FAQ',
  'Experts',
  'Contact',
  'Give us feedback',
  'Blog'
];

const socialMedias = [Youtube, Linkedin, Twitter, Instagram];

export default function Footer() {
  return (
    <MaxWidthWrapper
      className="relative 
    bg-gray-950 py-5 md:py-8 2xl:p-10 grid grid-cols-4 gap-y-12 md:grid-cols-6 2xl:grid-cols-12 
    2xl:gap-x-4 2xl:gap-y-28 overflow-hidden rounded-t-3xl"
    >
      <div className="relative z-10 flex flex-col gap-8 col-span-4 md:col-span-3 2xl:col-span-3">
        <Link href="/">
          <Icons.logoWhite />
        </Link>

        <p className="text-white text-[14px] lg:text-[20px]">
          Find creative coaches to accelerate your growth.
        </p>

        <Button className="rounded-full w-1/2">Become an expert</Button>
      </div>

      <div className="relative z-10 col-span-4 sm:col-span-2 md:col-start-5 md:col-span-2 2xl:col-start-8 2xl:col-span-4 flex justify-between">
        <div className="flex flex-col gap-4">
          {footerLinks.slice(0, 4).map(footerLink => (
            <Link
              key={footerLink}
              className="text-[12px] lg:text-[16px] text-white"
              href={`./${footerLink}`}
            >
              {footerLink}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {footerLinks.slice(4).map(footerLink => (
            <Link
              key={footerLink}
              className="text-[12px] lg:text-[16px] text-white"
              href={footerLink}
            >
              {footerLink}
            </Link>
          ))}
        </div>
      </div>

      <div className="relative z-10 col-span-4 md:col-span-6 2xl:col-span-12 flex flex-col items-end gap-4 md:flex-row md:justify-between md:items-center">
        <div className="flex gap-2 items-center">
          <p className="text-white text-[10px] lg:text-[12px]">
            {`© Plotix ${new Date().getFullYear()}. All rights reserved`}
          </p>
          <p className="text-white text-[10px] lg:text-[12px]">·</p>
          <p className="text-white text-[10px] lg:text-[12px]">Policy</p>
          <p className="text-white text-[10px] lg:text-[12px]">·</p>
          <p className="text-white text-[10px] lg:text-[12px]">Terms</p>
        </div>

        <div className="flex gap-4">
          {socialMedias.map((SocialMedia, i) => (
            <Link href="/" key={i} className="p-2 bg-white rounded-full">
              <SocialMedia width={20} height={20} color="black" />
            </Link>
          ))}
        </div>
      </div>

      <div className="absolute -top-24 sm:-top-10 md:-right-10 md:-top-20 xl:right-8 2xl:right-52 2xl:-top-80 z-0">
        <StarCombo2 />
      </div>
    </MaxWidthWrapper>
  );
}
