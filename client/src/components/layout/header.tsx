import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { Moon, Sun, Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => location === path;

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Topics", path: "/topics" },
    { label: "Games", path: "/games" },
    { label: "Progress", path: "/progress" },
    { label: "Help", path: "/help" },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-3 text-primary text-3xl">
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
          <Link href="/">
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-primary dark:text-primary cursor-pointer">
              Math<span className="text-secondary">Joy</span>
            </h1>
          </Link>
        </div>

        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a
                className={`font-heading font-semibold transition ${
                  isActive(item.path)
                    ? "text-primary dark:text-primary"
                    : "text-foreground dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                }`}
              >
                {item.label}
              </a>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden md:flex"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            className="hidden md:block"
            variant="default"
          >
            Login
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <nav className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={`font-heading font-semibold py-2 transition ${
                    isActive(item.path)
                      ? "text-primary dark:text-primary"
                      : "text-foreground dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                  }`}
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              </Link>
            ))}
            <div className="flex items-center justify-between py-2">
              <span className="font-heading font-semibold">Theme</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
            <Button
              className="w-full mt-2"
              variant="default"
            >
              Login
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
