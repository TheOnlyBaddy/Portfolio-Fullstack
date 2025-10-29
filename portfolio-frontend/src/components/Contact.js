import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Mail, Send, Phone, Map, Github, Linkedin } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { primaryButton } from '../utils/buttonStyles';

// Particle background component
const ParticlesBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-primary-400/20 to-cyan-400/20"
          style={{
            width: Math.random() * 300 + 100,
            height: Math.random() * 300 + 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 200],
            y: [0, (Math.random() - 0.5) * 200],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// 3D Card Component
const ContactCard = ({ icon: Icon, title, value, link, color, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);
  const springConfig = { damping: 15, stiffness: 200 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xVal = ((e.clientX - rect.left) / rect.width - 0.5) * 50;
    const yVal = ((e.clientY - rect.top) / rect.height - 0.5) * 50;
    x.set(xVal);
    y.set(yVal);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="relative w-full mb-4 last:mb-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
    >
      <motion.a
        href={link}
        className="relative group flex items-center p-6 rounded-xl bg-white dark:bg-dark-800 shadow-sm hover:shadow transition-all duration-200 w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: 'perspective(1000px)',
          rotateX: springRotateX,
          rotateY: springRotateY,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div
          className={`w-14 h-14 ${color} rounded-xl flex-shrink-0 flex items-center justify-center mr-5`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0">
          <h4 className="text-lg font-medium text-dark-900 dark:text-white truncate">{title}</h4>
          <p className="text-base text-dark-600 dark:text-dark-400">{value}</p>
        </div>
        <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-primary-500/20 transition-all duration-200 pointer-events-none" />
      </motion.a>
    </motion.div>
  );
};

const Contact = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [activeField, setActiveField] = useState(null);
  const MailIcon = Mail;
  const PhoneCall = Phone;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSent(false);
    setSubmitting(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const apiUrl = `${backendUrl.replace(/\/+$/, '')}/api/contact`;
      console.log('Sending request to:', apiUrl);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (data.errors) {
          const errorMessage = data.errors.map(err => err.msg).join('\n');
          throw new Error(errorMessage);
        }
        throw new Error(data.message || 'Failed to send message');
      }

      setSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset sent status after 5 seconds
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      console.error('Error:', err);
      alert(err.message || 'There was an issue sending your message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MailIcon,
      title: 'Email',
      value: 'barnwalshubh8002434@gmail.com',
      link: 'mailto:barnwalshubh8002434@gmail.com',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    },
    {
      icon: PhoneCall,
      title: 'Phone',
      value: '+91 7479690496',
      link: 'tel:+917479690496',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
    },
    {
      icon: Map,
      title: 'Location',
      value: 'Chennai | Remote',
      link: '#',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/TheOnlyBaddy',
      label: 'GitHub',
      username: 'TheOnlyBaddy',
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-gray-800 dark:bg-gray-200',
      hoverBg: 'hover:bg-green-50 dark:hover:bg-green-900/20',
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/shubh-barnwal',
      label: 'LinkedIn',
      username: 'shubh-barnwal',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-600',
      hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
    },
    {
      icon: Mail,
      href: 'mailto:barnwalshubh8002434@gmail.com',
      label: 'Email',
      username: 'barnwalshubh',
      color: 'text-red-500 dark:text-red-400',
      bg: 'bg-red-500',
      hoverBg: 'hover:bg-red-50 dark:hover:bg-red-900/20',
    },
  ];

  // Form field variants for animations
  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
      },
    }),
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-dark-50 to-dark-100 dark:from-dark-900 dark:to-dark-800"
    >
      {/* Animated Background Elements */}
      <ParticlesBackground />

      {/* Decorative gradient blobs */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full filter blur-3xl -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full filter blur-3xl translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <motion.span
            className="inline-block text-sm font-semibold text-primary-600 dark:text-primary-400 mb-4 tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            GET IN TOUCH
          </motion.span>
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-dark-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-cyan-500"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Let&apos;s{' '}
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear',
              }}
              style={{
                backgroundSize: '200% 100%',
                display: 'inline-block',
              }}
            >
              Work
            </motion.span>{' '}
            Together
          </motion.h2>
          <motion.p
            className="text-xl text-dark-600 dark:text-dark-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Have a project in mind or want to chat? I&apos;d love to hear from you!
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 max-w-7xl mx-auto">
          {/* Left Column - Contact Form */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="relative p-8 bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 to-cyan-500"></div>
              <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-8">
                Send Me a Message
              </h3>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence>
                  {sent && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-4 mb-6 text-sm text-green-700 bg-green-100 dark:bg-green-900/50 dark:text-green-300 rounded-lg"
                    >
                      Message sent successfully! I&apos;ll get back to you soon.
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-6">
                  {/* Name Field */}
                  <motion.div
                    className="relative"
                    variants={fieldVariants}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    custom={0}
                  >
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setActiveField('name')}
                      onBlur={() => setActiveField(null)}
                      className="w-full px-4 pt-6 pb-2 rounded-xl border border-dark-200 dark:border-dark-700 bg-white/50 dark:bg-dark-700/50 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 peer"
                      required
                    />
                    <label
                      htmlFor="name"
                      className={`absolute left-4 transition-all duration-300 ${
                        activeField === 'name' || formData.name
                          ? 'text-xs top-2 text-primary-500'
                          : 'text-sm top-1/2 -translate-y-1/2 text-dark-500 dark:text-dark-400'
                      }`}
                    >
                      Your Name
                    </label>
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    className="relative"
                    variants={fieldVariants}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    custom={1}
                  >
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setActiveField('email')}
                      onBlur={() => setActiveField(null)}
                      className="w-full px-4 pt-6 pb-2 rounded-xl border border-dark-200 dark:border-dark-700 bg-white/50 dark:bg-dark-700/50 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 peer"
                      required
                    />
                    <label
                      htmlFor="email"
                      className={`absolute left-4 transition-all duration-300 ${
                        activeField === 'email' || formData.email
                          ? 'text-xs top-2 text-primary-500'
                          : 'text-sm top-1/2 -translate-y-1/2 text-dark-500 dark:text-dark-400'
                      }`}
                    >
                      Email Address
                    </label>
                  </motion.div>

                  {/* Subject Field */}
                  <motion.div
                    className="relative"
                    variants={fieldVariants}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    custom={2}
                  >
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      onFocus={() => setActiveField('subject')}
                      onBlur={() => setActiveField(null)}
                      className="w-full px-4 pt-6 pb-2 rounded-xl border border-dark-200 dark:border-dark-700 bg-white/50 dark:bg-dark-700/50 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 peer"
                      required
                    />
                    <label
                      htmlFor="subject"
                      className={`absolute left-4 transition-all duration-300 ${
                        activeField === 'subject' || formData.subject
                          ? 'text-xs top-2 text-primary-500'
                          : 'text-sm top-1/2 -translate-y-1/2 text-dark-500 dark:text-dark-400'
                      }`}
                    >
                      Subject
                    </label>
                  </motion.div>

                  {/* Message Field */}
                  <motion.div
                    className="relative"
                    variants={fieldVariants}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    custom={3}
                  >
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onFocus={() => setActiveField('message')}
                      onBlur={() => setActiveField(null)}
                      rows="5"
                      className="w-full px-4 pt-8 pb-4 rounded-xl border border-dark-200 dark:border-dark-700 bg-white/50 dark:bg-dark-700/50 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 peer resize-none"
                      required
                    ></textarea>
                    <label
                      htmlFor="message"
                      className={`absolute left-4 transition-all duration-300 ${
                        activeField === 'message' || formData.message
                          ? 'text-xs top-3 text-primary-500'
                          : 'text-sm top-5 text-dark-500 dark:text-dark-400'
                      }`}
                    >
                      Your Message
                    </label>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    className="relative group mt-6"
                    variants={fieldVariants}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    custom={4}
                  >
                    <motion.button
                      type="submit"
                      className={`${primaryButton} w-full justify-center`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={submitting}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {submitting ? 'Sending...' : 'Send Message'}
                        <Send className="w-4 h-4" />
                      </span>
                    </motion.button>
                  </motion.div>
                </div>
              </form>
            </motion.div>
          </motion.div>

          {/* Right Column - Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div>
              <h3 className="text-2xl font-semibold text-dark-900 dark:text-white mb-6">
                Contact Information
              </h3>
              <div className="space-y-2 w-full max-w-md">
                {contactInfo.map((info, index) => (
                  <ContactCard
                    key={info.title}
                    icon={info.icon}
                    title={info.title}
                    value={info.value}
                    link={info.link}
                    color={info.color}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* Social Links - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.0 }}
            >
              <h3 className="text-2xl font-semibold text-dark-900 dark:text-white mb-6">
                Let&apos;s Connect
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className={`relative group p-3 rounded-xl overflow-hidden bg-white dark:bg-dark-700 shadow-md hover:shadow-lg transition-all duration-300 ${social.hoverBg}`}
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 0.3,
                      delay: 0.5 + index * 0.1,
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <div className="relative z-10 flex items-center">
                      <social.icon
                        className={`h-5 w-5 ${social.color} transition-colors duration-300`}
                      />
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
