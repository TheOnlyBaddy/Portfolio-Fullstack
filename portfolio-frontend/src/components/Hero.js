import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, Download, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Typewriter from 'typewriter-effect';

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const resumeUrl = process.env.PUBLIC_URL + '/Resume.pdf';

  const socialLinks = [
    { icon: Github, href: 'https://github.com/TheOnlyBaddy', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/shubh-barnwal', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:barnwalshubh8002434@gmail.com', label: 'Email' },
  ];

  const scrollToNext = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-1000">
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute top-1/4 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/2 -right-4 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white/10 dark:bg-grid-gray-800/10 [mask-image:linear-gradient(0deg,transparent,black_20%)]"></div>

      <div className="container-custom relative z-10 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <motion.p
              className="text-lg text-primary-600 dark:text-primary-400 mb-3 font-mono"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Hi there, I&apos;m
            </motion.p>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-dark-900 dark:text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Shubh Barnwal
              </span>
            </motion.h1>

            <div className="h-12 md:h-14 lg:h-16 flex items-center">
              <Typewriter
                options={{
                  strings: [
                    'Full Stack Developer',
                    'Problem Solver',
                    'Tech Enthusiast',
                    'Lifelong Learner',
                  ],
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 50,
                  delay: 50,
                  wrapperClassName:
                    'text-2xl md:text-3xl font-semibold text-dark-700 dark:text-dark-300',
                  cursorClassName: 'text-primary-600 dark:text-primary-400 text-3xl',
                }}
              />
            </div>

            {/* Description */}
            <motion.p
              className="text-lg text-dark-600 dark:text-dark-400 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              I craft digital experiences with clean code and innovative solutions. Passionate about
              building scalable applications and turning ideas into reality.
            </motion.p>

            {/* Technology Badges */}
            <motion.div
              className="flex flex-wrap justify-center gap-3 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              {[
                'JavaScript',
                'React',
                'Node.js',
                'Python',
                'MongoDB',
                'SQL',
                'Tailwind',
                'Git',
              ].map((tech, index) => (
                <motion.span
                  key={tech}
                  className="px-3 py-1.5 text-sm font-medium rounded-full bg-white dark:bg-dark-700 text-dark-700 dark:text-dark-200 shadow-sm border border-gray-200 dark:border-dark-600 hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -3, scale: 1.05 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.4,
                    delay: 1.1 + index * 0.05,
                    type: 'spring',
                    stiffness: 100,
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <motion.div
                className="relative group"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-70 blur transition duration-500 group-hover:duration-200"></div>
                <motion.a
                  href={resumeUrl}
                  download
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="relative px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isHovered ? 'download' : 'arrow'}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center gap-2"
                    >
                      {isHovered ? (
                        <Download className="h-5 w-5" />
                      ) : (
                        <ArrowRight className="h-5 w-5" />
                      )}
                      {isHovered ? 'Download CV' : 'Get My Resume'}
                    </motion.span>
                  </AnimatePresence>
                </motion.a>
              </motion.div>

              <motion.div
                className="relative group"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full opacity-0 group-hover:opacity-70 blur transition duration-500 group-hover:duration-200"></div>
                <motion.button
                  onClick={scrollToNext}
                  className="relative px-6 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>View My Work</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex items-center gap-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                  aria-label={link.label}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <link.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Element */}
          <motion.div
            className="hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              {/* Floating Card */}
              <motion.div
                className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/5 dark:to-purple-400/5"></div>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                      <img
                        src="/pfp.jpg"
                        alt="Shubh Barnwal"
                        className="w-full h-full object-cover"
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src =
                            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIj48L3BhdGg+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ij48L2NpcmNsZT48L3N2Zz4=';
                        }}
                      />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 mb-3">
                      Shubh Barnwal
                    </h3>
                    <p className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-gray-400 dark:from-gray-300 dark:to-gray-500">
                      Full Stack Developer
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-6 -left-6 w-16 h-16 bg-blue-500/10 dark:bg-blue-400/10 rounded-2xl"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: 0.5,
                  ease: 'easeInOut',
                }}
              ></motion.div>

              <motion.div
                className="absolute -bottom-6 -right-6 w-20 h-20 bg-purple-500/10 dark:bg-purple-400/10 rounded-2xl"
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  delay: 1,
                  ease: 'easeInOut',
                }}
              ></motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div
          className="absolute bottom left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToNext}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: 1.8,
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 0.5,
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">Scroll Down</span>
            <div className="w-8 h-12 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center p-1">
              <motion.div
                className="w-1 h-2 bg-gray-600 dark:bg-gray-300 rounded-full"
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
