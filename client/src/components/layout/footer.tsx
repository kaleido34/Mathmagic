import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  Phone, 
  Send
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="mr-3 text-white text-3xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                  <path d="M12 3v6" />
                </svg>
              </div>
              <h2 className="text-2xl font-heading font-extrabold">
                Math<span className="text-secondary">Joy</span>
              </h2>
            </div>
            <p className="text-gray-300 mb-4">
              Making math fun and stress-free for students in grades 6-8.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white hover:text-secondary transition"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-white hover:text-secondary transition"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-white hover:text-secondary transition"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-white hover:text-secondary transition"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-white transition">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-300 hover:text-white transition">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/topics">
                  <a className="text-gray-300 hover:text-white transition">Curriculum</a>
                </Link>
              </li>
              <li>
                <Link href="/games">
                  <a className="text-gray-300 hover:text-white transition">Games</a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-gray-300 hover:text-white transition">Blog</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-300 hover:text-white transition">Contact</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold mb-4 text-lg">Grade Topics</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/topics?grade=6">
                  <a className="text-gray-300 hover:text-white transition">Grade 6 Math</a>
                </Link>
              </li>
              <li>
                <Link href="/topics?grade=7">
                  <a className="text-gray-300 hover:text-white transition">Grade 7 Math</a>
                </Link>
              </li>
              <li>
                <Link href="/topics?grade=8">
                  <a className="text-gray-300 hover:text-white transition">Grade 8 Math</a>
                </Link>
              </li>
              <li>
                <Link href="/topics?category=algebra">
                  <a className="text-gray-300 hover:text-white transition">Algebra Basics</a>
                </Link>
              </li>
              <li>
                <Link href="/topics?category=geometry">
                  <a className="text-gray-300 hover:text-white transition">Geometry Fundamentals</a>
                </Link>
              </li>
              <li>
                <Link href="/topics?category=statistics">
                  <a className="text-gray-300 hover:text-white transition">Statistics & Probability</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold mb-4 text-lg">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-secondary" />
                <a
                  href="mailto:hello@mathjoy.edu"
                  className="text-gray-300 hover:text-white transition"
                >
                  hello@mathjoy.edu
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-secondary" />
                <a
                  href="tel:+1234567890"
                  className="text-gray-300 hover:text-white transition"
                >
                  (123) 456-7890
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Subscribe to our newsletter</h4>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-r-none focus:ring-secondary text-neutral-dark"
                />
                <Button
                  className="bg-secondary hover:bg-secondary/90 rounded-l-none"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Subscribe</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} MathJoy. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy">
              <a className="text-gray-400 hover:text-white text-sm transition">
                Privacy Policy
              </a>
            </Link>
            <Link href="/terms">
              <a className="text-gray-400 hover:text-white text-sm transition">
                Terms of Service
              </a>
            </Link>
            <Link href="/cookies">
              <a className="text-gray-400 hover:text-white text-sm transition">
                Cookie Policy
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
