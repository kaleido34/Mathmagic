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
  Send,
  BookOpen
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="mr-3 text-primary text-3xl">
                <BookOpen className="h-8 w-8" />
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
            <h3 className="font-heading font-bold mb-4 text-lg text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-gray-300 hover:text-secondary transition cursor-pointer">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/topics">
                  <span className="text-gray-300 hover:text-secondary transition cursor-pointer">Curriculum</span>
                </Link>
              </li>
              <li>
                <Link href="/games">
                  <span className="text-gray-300 hover:text-secondary transition cursor-pointer">Games</span>
                </Link>
              </li>
              <li>
                <Link href="/progress">
                  <span className="text-gray-300 hover:text-secondary transition cursor-pointer">Progress</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold mb-4 text-lg text-primary">Grade Topics</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/topics?grade=6">
                  <span className="text-gray-300 hover:text-secondary transition cursor-pointer">Grade 6 Math</span>
                </Link>
              </li>
              <li>
                <Link href="/topics?grade=7">
                  <span className="text-gray-300 hover:text-secondary transition cursor-pointer">Grade 7 Math</span>
                </Link>
              </li>
              <li>
                <Link href="/topics?grade=8">
                  <span className="text-gray-300 hover:text-secondary transition cursor-pointer">Grade 8 Math</span>
                </Link>
              </li>
              <li>
                <Link href="/topics?category=algebra">
                  <span className="text-gray-300 hover:text-secondary transition cursor-pointer">Algebra Basics</span>
                </Link>
              </li>
              <li>
                <Link href="/topics?category=geometry">
                  <span className="text-gray-300 hover:text-secondary transition cursor-pointer">Geometry Fundamentals</span>
                </Link>
              </li>
              <li>
                <Link href="/topics?category=statistics">
                  <span className="text-gray-300 hover:text-secondary transition cursor-pointer">Statistics & Probability</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold mb-4 text-lg text-primary">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-secondary" />
                <a
                  href="mailto:hello@mathjoy.edu"
                  className="text-gray-300 hover:text-secondary transition"
                >
                  hello@mathjoy.edu
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-secondary" />
                <a
                  href="tel:+1234567890"
                  className="text-gray-300 hover:text-secondary transition"
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
                  className="rounded-r-none text-black"
                />
                <Button
                  className="bg-secondary hover:bg-secondary/90 text-black rounded-l-none"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Subscribe</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} MathJoy. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy">
              <span className="text-gray-400 hover:text-secondary text-sm transition cursor-pointer">
                Privacy Policy
              </span>
            </Link>
            <Link href="/terms">
              <span className="text-gray-400 hover:text-secondary text-sm transition cursor-pointer">
                Terms of Service
              </span>
            </Link>
            <Link href="/cookies">
              <span className="text-gray-400 hover:text-secondary text-sm transition cursor-pointer">
                Cookie Policy
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
