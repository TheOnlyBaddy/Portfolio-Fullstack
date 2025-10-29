import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Code, Mail, ArrowUp } from 'lucide-react';

const Wave = () => {
  return (
    <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
      <svg
        className="w-full h-20 md:h-24"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512,54.67,583,72c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          className="fill-current text-primary-900/10 dark:text-primary-900/20"
        />
        <path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          className="fill-current text-primary-900/5 dark:text-primary-900/10"
          opacity=".5"
        />
      </svg>
    </div>
  );
};

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/TheOnlyBaddy',
      label: 'GitHub',
      color: 'from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800',
      hover: 'hover:shadow-lg hover:-translate-y-1',
      iconColor: 'text-white',
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/shubh-barnwal',
      label: 'LinkedIn',
      color: 'from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700',
      hover: 'hover:shadow-lg hover:-translate-y-1',
      iconColor: 'text-white',
    },
  ];

  const quickLinks = ['Home', 'About', 'Skills', 'Projects', 'Contact'];

  useEffect(() => {
    const checkScroll = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <footer className="relative bg-gradient-to-b from-dark-900 to-dark-800 dark:from-dark-950 dark:to-black text-white pt-24 pb-16 overflow-hidden">
      {/* Animated Wave */}
      <Wave />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary-500/10 dark:bg-primary-400/10"
            style={{
              width: Math.random() * 15 + 5,
              height: Math.random() * 15 + 5,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10 pt-8" ref={ref}>
        <div className="grid md:grid-cols-3 gap-12 items-start">
          {/* Logo & Description */}
          <motion.div
            className="text-center md:text-left"
            variants={container}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
          >
            <motion.div
              className="flex items-center justify-center md:justify-start space-x-3 mb-6"
              variants={item}
            >
              <motion.div
                className="p-2 bg-gradient-to-br from-primary-500/20 to-cyan-500/20 rounded-xl backdrop-blur-sm"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Code className="h-8 w-8 text-primary-400" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                DevPortfolio
              </span>
            </motion.div>
            <motion.p className="text-gray-400 text-sm leading-relaxed mb-6" variants={item}>
              Crafting digital experiences with clean code and innovative solutions. Let&apos;s
              build something amazing together.
            </motion.p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="text-center md:text-left"
            variants={container}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
          >
            <motion.h3
              className="text-lg font-semibold mb-6 bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent inline-block"
              variants={item}
            >
              Quick Links
            </motion.h3>
            <motion.div className="space-y-3" variants={container}>
              {quickLinks.map(link => (
                <motion.div
                  key={link}
                  variants={item}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="flex items-center text-gray-400 hover:text-white transition-colors duration-300 text-sm group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span>{link}</span>
                    <span className="ml-auto opacity-0 group-hover:opacity-100 text-primary-400 transition-all duration-300">
                      →
                    </span>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="text-center md:text-left"
            variants={container}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
          >
            <motion.h3
              className="text-lg font-semibold mb-6 bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent inline-block"
              variants={item}
            >
              Connect With Me
            </motion.h3>
            <motion.div
              className="flex flex-wrap gap-3 justify-center md:justify-start"
              variants={item}
            >
              {socialLinks.map(social => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-xl bg-gradient-to-br ${social.color} ${social.hover} transition-all duration-300 flex items-center space-x-2`}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  aria-label={social.label}
                >
                  <social.icon className={`h-5 w-5 ${social.iconColor}`} />
                  <span className="text-sm font-medium text-white">{social.label}</span>
                </motion.a>
              ))}
            </motion.div>
            <motion.div
              className="mt-6 p-4 bg-white/5 rounded-xl backdrop-blur-sm"
              variants={item}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-cyan-400" />
                <div>
                  <p className="text-xs text-gray-400">Email me at</p>
                  <a
                    href="mailto:barnwalshubh8002434@gmail.com"
                    className="text-sm text-white hover:text-cyan-400 transition-colors font-medium"
                  >
                    barnwalshubh8002434@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="relative my-12 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-24 h-0.5 bg-gradient-to-r from-primary-400 to-cyan-400 rounded-full"></div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.p className="text-gray-500 text-sm">
            © {currentYear} Shubh Barnwal. All rights reserved.
          </motion.p>

          <motion.div
            className="flex items-center space-x-6 text-sm text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <button
              type="button"
              className="hover:text-primary-400 hover:underline underline-offset-4 decoration-primary-400/50 transition-all duration-300 bg-transparent border-none p-0 cursor-pointer text-current"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              className="hover:text-cyan-400 hover:underline underline-offset-4 decoration-cyan-400/50 transition-all duration-300 bg-transparent border-none p-0 cursor-pointer text-current"
            >
              Terms of Service
            </button>
          </motion.div>

          {/* Back to Top Button */}
          <motion.button
            onClick={scrollToTop}
            className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <span className="text-sm font-medium">Back to Top</span>
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-primary-500/20 transition-colors duration-300">
              <ArrowUp className="w-4 h-4" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
