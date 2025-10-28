import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Sun, Moon, Code } from 'lucide-react';
import ThemeContext from '../context/ThemeContext';
import {
  primaryButton,
  buttonHoverEffect,
  buttonWrapper,
  buttonMotionProps,
} from '../utils/buttonStyles';

// Custom hook for mouse position
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = e => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const mousePosition = useMousePosition();
  const navRef = useRef(null);

  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, 'change', latest => {
    const sections = ['home', 'about', 'skills', 'projects', 'contact'];
    const scrollPosition = window.scrollY + 100;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const { top, height } = element.getBoundingClientRect();
        const offsetTop = top + window.scrollY;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
          setActiveSection(section);
          break;
        }
      }
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = href => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  // Calculate gradient position based on mouse
  const gradientX =
    (mousePosition.x / (typeof window !== 'undefined' ? window.innerWidth : 1)) * 100;
  const gradientY =
    (mousePosition.y / (typeof window !== 'undefined' ? window.innerHeight : 1)) * 100;

  return (
    <motion.nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/70 dark:bg-dark-900/70 backdrop-blur-xl shadow-2xl shadow-primary-500/10 dark:shadow-primary-900/20'
          : 'bg-white/30 dark:bg-dark-900/30 backdrop-blur-lg'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        background: `radial-gradient(circle at ${gradientX}% ${gradientY}%, ${
          isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)'
        } 0%, ${isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(249, 250, 251, 0.9)'} 100%)`,
      }}
      transition={{
        duration: 0.8,
        background: { duration: 0.5, ease: 'easeOut' },
        delay: 0.2,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated border gradient */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{
          scaleX: isHovered ? 1 : 0.5,
          opacity: isHovered ? 1 : 0.7,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      <div className="container-custom px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="relative"
            whileHover="hover"
            initial="initial"
            animate={isHovered ? 'hover' : 'initial'}
          >
            <motion.button
              type="button"
              aria-label="Go to home"
              className="flex items-center space-x-2 cursor-pointer ml-1 sm:ml-0 relative z-10 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#home')}
            >
              <motion.span
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-blue-500/20 dark:from-primary-400/30 dark:to-blue-400/30 flex items-center justify-center backdrop-blur-sm"
                variants={{
                  initial: { rotate: 0 },
                  hover: { rotate: 15 },
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                <Code className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </motion.span>
              <motion.span
                className="text-xl font-bold relative overflow-hidden"
                variants={{
                  initial: { width: 0, opacity: 0, x: -10 },
                  hover: { width: 'auto', opacity: 1, x: 5, transition: { duration: 0.3 } },
                }}
              >
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 whitespace-nowrap">
                  Shubh Barnwal
                </span>
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-blue-500 z-20"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </motion.span>
            </motion.button>
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-primary-400/10 to-blue-400/10 rounded-2xl -z-10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              variants={{
                initial: { scale: 0.9, opacity: 0 },
                hover: { scale: 1, opacity: 1 },
              }}
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 bg-white/10 dark:bg-dark-800/20 backdrop-blur-sm rounded-full p-1.5 shadow-inner">
            {navItems.map(item => {
              const section = item.href.replace('#', '');
              const isActive = activeSection === section;

              return (
                <motion.div
                  key={item.name}
                  className="relative"
                  whileHover={!isActive ? "hover" : undefined}
                  initial="initial"
                  animate={isActive ? 'active' : 'initial'}
                >
                  <motion.div 
                    className="relative group"
                    initial={false}
                    animate={isActive ? 'active' : 'inactive'}
                  >
                    <motion.button
                      className={`relative z-10 px-4 py-1.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'text-white bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 shadow-md'
                          : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                      }`}
                      onClick={() => scrollToSection(item.href)}
                      whileHover={{
                        y: isActive ? 0 : -2,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-20 font-medium text-sm">
                        {item.name}
                      </span>
                    </motion.button>
                    {!isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 to-blue-400"
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileHover={{
                          scaleX: 1,
                          opacity: 1,
                          transition: { duration: 0.2, ease: 'easeOut' },
                        }}
                        style={{
                          transformOrigin: 'center',
                        }}
                      />
                    )}
                  </motion.div>

                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full shadow-lg shadow-primary-500/30 dark:shadow-primary-500/20 z-0"
                      layoutId="activeNavItem"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-200 relative overflow-hidden group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 1.2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <Sun className="h-5 w-5 text-yellow-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -90, opacity: 0, scale: 1.2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <Moon className="h-5 w-5 text-indigo-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 dark:from-indigo-500/20 dark:to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
            </motion.button>

            {/* Contact Button - Desktop */}
            <motion.div className={buttonWrapper} {...buttonMotionProps}>
              <div className={buttonHoverEffect}></div>
              <motion.a href="#contact" className={`${primaryButton} hidden md:flex`}>
                <span className="relative z-10 flex items-center gap-2">
                  <span>Hire Me</span>
                  <motion.span
                    initial={{ x: 0 }}
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'loop',
                    }}
                    className="inline-block"
                  >
                    👋
                  </motion.span>
                </span>
              </motion.a>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-200"
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 1.2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 1.2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: 'auto',
                transition: {
                  height: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                },
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: {
                  height: { delay: 0.2, duration: 0.3 },
                  opacity: { duration: 0.1 },
                },
              }}
            >
              <div className="py-4 space-y-2 border-t border-gray-200/20 dark:border-dark-700/50">
                {navItems.map((item, index) => {
                  const section = item.href.replace('#', '');
                  const isActive = activeSection === section;

                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: {
                          delay: 0.05 * index,
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        },
                      }}
                      exit={{
                        opacity: 0,
                        x: -20,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <button
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center ${
                          isActive
                            ? 'bg-gradient-to-r from-primary-500/10 to-blue-500/10 text-primary-600 dark:text-primary-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-800/50'
                        }`}
                        onClick={() => scrollToSection(item.href)}
                      >
                        <span className="font-medium">{item.name}</span>
                        {isActive && (
                          <motion.span
                            className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500"
                            layoutId="mobileActiveDot"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
