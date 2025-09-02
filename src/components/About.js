import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Award, Briefcase, ArrowRight } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { primaryButton, secondaryButton, buttonHoverEffect, buttonWrapper, buttonMotionProps } from '../utils/buttonStyles';

const About = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const [activeTab, setActiveTab] = useState('skills');
  
  const features = [
    {
      icon: '✨',
      title: 'Clean Code',
      description: 'Writing maintainable, readable, and efficient code that scales.'
    },
    {
      icon: '🔍',
      title: 'Problem Solving',
      description: 'Breaking down complex problems into elegant, simple solutions.'
    },
    {
      icon: '🚀',
      title: 'Performance',
      description: 'Optimizing applications for speed and efficiency.'
    },
    {
      icon: '🧩',
      title: 'Modular Design',
      description: 'Building reusable and maintainable components.'
    },
    {
      icon: '🔄',
      title: 'Agile Development',
      description: 'Adapting to changes and delivering value incrementally.'
    },
    {
      icon: '🔒',
      title: 'Security',
      description: 'Implementing best practices to protect user data.'
    }
  ];




  const experiences = [
    {
      role: 'Full Stack Developer',
      company: 'Self-Employed',
      period: '2023 - Present',
      description: 'Building personal projects and contributing to open source while continuously learning new technologies.',
      icon: <Briefcase className="w-5 h-5" />
    },
    {
      role: 'Coding Bootcamp',
      company: 'Self-Taught',
      period: '2022 - 2023',
      description: 'Completed various online courses and built projects to master full-stack development.',
      icon: <Award className="w-5 h-5" />
    }
  ];

  const education = [
    {
      degree: 'B.Tech in Information Technology',
      institution: 'Kalasalingam Academy of Research and Education, Tamil Nadu',
      period: '2022 - Present',
      score: '7.88 CGPA (Till 6th Sem)',
      icon: <Award className="w-5 h-5" />
    },
    {
      degree: '12th Standard (CBSE)',
      institution: 'Pitts Modern School, Gomia',
      period: '2021 - 2022',
      // score: '67%',
      icon: <Award className="w-5 h-5" />
    },
    {
      degree: '10th Standard (CBSE)',
      institution: 'Pitts Modern School, Gomia',
      period: '2019 - 2020',
      // score: '77%',
      icon: <Award className="w-5 h-5" />
    }
  ];


  return (
    <section id="about" className="relative overflow-hidden py-20 lg:py-28">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-white/10 dark:bg-grid-dark-800/10 [mask-image:linear-gradient(0deg,transparent,black_20%)]"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/80 dark:from-dark-900/90 dark:via-dark-900/70 dark:to-dark-900/90"></div>

      <div className="container-custom relative z-10 px-4 sm:px-6">
        <div className="text-center mb-16">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="inline-block text-sm font-medium text-primary-600 dark:text-primary-400 mb-4 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Get to know me
            </motion.span>
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              About {" "}
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 0%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'linear'
                }}
                style={{
                  backgroundSize: '200% 100%',
                  display: 'inline-block'
                }}
              >
                Me
              </motion.span>
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-dark-600 dark:text-dark-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              I'm a passionate developer who loves turning ideas into reality through clean, efficient code. 
              My journey in tech is driven by curiosity and a constant desire to learn and grow.
            </motion.p>
          </motion.div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: 'skills', name: 'Skills' },
            { id: 'experience', name: 'Experience' },
            { id: 'education', name: 'Education' }
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-[1.02]"
                    : "bg-white dark:bg-dark-700 text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-600 hover:shadow-md"
                }`}
                aria-pressed={active}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                <div className="text-center max-w-4xl mx-auto mb-12">
                  <h3 className="text-2xl md:text-3xl font-bold text-dark-900 dark:text-white mb-4">
                    My {" "}
                    <motion.span 
                      className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 0%'],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'linear'
                      }}
                      style={{
                        backgroundSize: '200% 100%',
                        display: 'inline-block'
                      }}
                    >
                      Development
                    </motion.span> Approach
                  </h3>
                  <p className="text-dark-600 dark:text-dark-300">
                    I believe in writing clean, efficient, and maintainable code. Here's what guides my development process:
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-primary-500/20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="text-3xl mb-4 group-hover:text-primary-500 transition-colors duration-300">
                        {feature.icon}
                      </div>
                      <h4 className="text-xl font-semibold text-dark-900 dark:text-white mb-3">
                        {feature.title}
                      </h4>
                      <p className="text-dark-600 dark:text-dark-300 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'experience' && (
              <motion.div
                key="experience"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-center text-dark-900 dark:text-white mb-12">
                  My {" "}
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 0%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'linear'
                }}
                style={{
                  backgroundSize: '200% 100%',
                  display: 'inline-block'
                }}
              >
                Experience
              </motion.span>
                </h3>
                <div className="space-y-8">
                  {experiences.map((exp, index) => (
                    <motion.div
                      key={exp.role}
                      className="relative pl-8 border-l-2 border-gray-200 dark:border-dark-700 group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                    >
                      <div className="absolute -left-2.5 top-0 w-4 h-4 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500 border-4 border-white dark:border-dark-900"></div>
                      <div className="absolute -left-8 top-0 w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 group-hover:bg-primary-500/20 transition-colors duration-300">
                        {exp.icon}
                      </div>
                      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-dark-900 dark:text-white">{exp.role}</h4>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                            {exp.period}
                          </span>
                        </div>
                        <div className="text-primary-600 dark:text-primary-400 font-medium mb-3">{exp.company}</div>
                        <p className="text-dark-600 dark:text-dark-300">{exp.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Education Section */}
          <AnimatePresence mode="wait">
            {activeTab === 'education' && (
              <motion.div
                key="education"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-center text-dark-900 dark:text-white mb-12">
                  My {" "}
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 0%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'linear'
                }}
                style={{
                  backgroundSize: '200% 100%',
                  display: 'inline-block'
                }}
              >
                Education
              </motion.span>
                </h3>
                <div className="space-y-8">
                  {education.map((edu, index) => (
                    <motion.div
                      key={edu.degree}
                      className="relative pl-8 border-l-2 border-gray-200 dark:border-dark-700 group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                    >
                      <div className="absolute -left-2.5 top-0 w-4 h-4 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500 border-4 border-white dark:border-dark-900"></div>
                      <div className="absolute -left-8 top-0 w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 group-hover:bg-primary-500/20 transition-colors duration-300">
                        {edu.icon}
                      </div>
                      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-dark-900 dark:text-white">{edu.degree}</h4>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                            {edu.period}
                          </span>
                        </div>
                        <div className="text-primary-600 dark:text-primary-400 font-medium mb-1">{edu.institution}</div>
                        {edu.score && (
                          <div className="text-sm text-dark-500 dark:text-dark-400 mb-3">
                            <span className="font-medium">Score:</span> {edu.score}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="relative inline-block w-full max-w-3xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-2xl opacity-20 blur-lg"></div>
            <div className="relative bg-gradient-to-r from-white to-white/90 dark:from-dark-800 dark:to-dark-800/90 p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-dark-900 dark:text-white mb-4">
                Let's Build Something {" "}
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 0%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'linear'
                }}
                style={{
                  backgroundSize: '200% 100%',
                  display: 'inline-block'
                }}
              >Amazing</motion.span> Together
              </h3>
              <p className="text-lg text-dark-600 dark:text-dark-300 mb-6">
                Have a project in mind or want to collaborate? I'd love to hear about it!
              </p>
              <div className="mt-6 flex justify-center">
                <motion.div className={buttonWrapper} {...buttonMotionProps}>
                  <div className={buttonHoverEffect}></div>
                  <a href="#contact" aria-label="Go to contact section">
                    <button className={`${primaryButton}`}>
                      <span className="relative z-10 flex items-center gap-2">
                        Get in Touch
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </button>
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <Tooltip id="skill-tooltip" place="top" effect="solid" className="z-50" />
      </div>

    </section>
  );

};

export default About;