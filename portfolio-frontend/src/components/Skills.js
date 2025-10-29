import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fetchGitHubLanguages, mapLanguagesToSkills, defaultSkills } from '../utils/github';

const categories = [
  { id: 'all', name: 'All Skills' },
  { id: 'frontend', name: 'Frontend' },
  { id: 'backend', name: 'Backend' },
  { id: 'tools', name: 'Tools' },
];

// Skills data will be loaded from GitHub API
const GITHUB_USERNAME = 'TheOnlyBaddy'; // Your GitHub username

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [skillsData, setSkillsData] = useState(defaultSkills);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Fetch GitHub languages on component mount
  useEffect(() => {
    const loadGitHubLanguages = async () => {
      try {
        setIsLoading(true);
        const languages = await fetchGitHubLanguages(GITHUB_USERNAME);

        if (languages.length > 0) {
          const githubSkills = mapLanguagesToSkills(languages);
          // Combine with default skills, removing duplicates by name
          const combinedSkills = [
            ...defaultSkills,
            ...githubSkills.filter(
              skill => !defaultSkills.some(s => s.name.toLowerCase() === skill.name.toLowerCase())
            ),
          ];
          setSkillsData(combinedSkills);
        }
      } catch (err) {
        console.error('Failed to load GitHub languages:', err);
        setError('Failed to load GitHub languages. Using default skills.');
      } finally {
        setIsLoading(false);
      }
    };

    loadGitHubLanguages();
  }, []);

  const filteredSkills = useMemo(() => {
    if (activeCategory === 'all') return skillsData;
    return skillsData.filter(s => s.category.includes(activeCategory));
  }, [activeCategory, skillsData]);

  return (
    <section
      id="skills"
      className="relative py-20 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-dark-900 dark:to-dark-800"
    >
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl dark:bg-blue-400/10" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl dark:bg-purple-400/10" />
      </div>

      <div className="container-custom relative z-10 px-4 sm:px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <motion.span
            className="inline-block text-sm font-medium text-primary-600 dark:text-primary-400 mb-3 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                delay: 0.2,
              },
            }}
          >
            My Expertise
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-dark-900 dark:text-white mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                delay: 0.3,
              },
            }}
          >
            Technical{' '}
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
              Skills
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-lg text-dark-600 dark:text-dark-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                delay: 0.4,
              },
            }}
          >
            Explore the tools and technologies I use to build modern web apps.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(cat => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  active
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-[1.02]'
                    : 'bg-white dark:bg-dark-700 text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-600 hover:shadow-md'
                }`}
                aria-pressed={active}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-dark-600 dark:text-dark-400">Loading skills from GitHub...</p>
          </div>
        )}

        {error && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSkills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 100,
                    damping: 12,
                    delay: i * 0.03,
                  },
                }}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2 },
                }}
                className="bg-white dark:bg-dark-700 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ease-out"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className={`p-3 rounded-lg bg-gradient-to-br ${skill.color} text-white shadow-md`}
                    aria-hidden
                    whileHover={{
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    <motion.span
                      className="text-2xl block"
                      animate={{
                        scale: [1, 1.1, 1],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                          repeatType: 'reverse',
                        },
                      }}
                    >
                      {skill.icon}
                    </motion.span>
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white">
                      {skill.name}
                    </h3>
                    <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">
                      {skill.description}
                    </p>
                    {/* Animated tags */}
                    <motion.div
                      className="mt-3 flex flex-wrap gap-2"
                      initial="hidden"
                      animate={inView ? 'show' : 'hidden'}
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1,
                          },
                        },
                      }}
                    >
                      {skill.category.map((c, _idx) => (
                        <motion.span
                          key={`${skill.name}-${c}`}
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-300 shadow-sm"
                          variants={{
                            hidden: { y: 10, opacity: 0 },
                            show: {
                              y: 0,
                              opacity: 1,
                              transition: { type: 'spring', stiffness: 300 },
                            },
                          }}
                        >
                          {c}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
