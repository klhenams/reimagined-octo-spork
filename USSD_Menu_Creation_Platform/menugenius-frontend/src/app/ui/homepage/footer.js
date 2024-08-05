import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer bg-white text-base-content p-10 text-black mt-[50px]">
      <aside>
        <Image
          src="/images/navbar-logo.png"
          alt="Menugenius-logo"
          width={180}
          height={100}
          className="cursor-pointer"
        />
        <p>&copy;{currentYear} Menugenius. All rights reserved </p>
      </aside>
      <nav>
        <h6 className="footer-title">Services</h6>
        <a className="link link-hover">Branding</a>
        <a className="link link-hover">Design</a>
        <a className="link link-hover">Marketing</a>
        <a className="link link-hover">Advertisement</a>
      </nav>
      <nav>
        <h6 className="footer-title">Company</h6>
        <Link href="/" className="link link-hover">
          About us
        </Link>
        <Link href="/" className="link link-hover">
          Contact
        </Link>
        <Link href="/" className="link link-hover">
          Jobs
        </Link>
        <Link href="/" className="link link-hover">
          Press kit
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <Link href="/" className="link link-hover">
          Terms of use
        </Link>
        <Link href="/" className="link link-hover">
          Privacy policy
        </Link>
        <Link href="/" className="link link-hover">
          Cookie policy
        </Link>
      </nav>
    </footer>
  );
}
