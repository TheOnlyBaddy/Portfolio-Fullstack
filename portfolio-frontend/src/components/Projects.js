// src/components/Projects.js
import React, { useEffect, useState, useContext, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FiGithub, FiExternalLink, FiStar, FiGitBranch } from 'react-icons/fi';
import ThemeContext from '../context/ThemeContext';

// Custom styles for the component
const customStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  .project-card {
    transition: all 0.3s ease;
    transform-style: preserve-3d;
  }
  
  .tech-tag {
    @apply px-3 py-1 rounded-full text-xs font-medium transition-all duration-300;
    background: rgba(99, 102, 241, 0.1);
    color: #6366f1;
  }
  
  .skeleton {
    @apply bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md;
  }
`;

// Add this style tag to your component
const StyleTag = () => <style dangerouslySetInnerHTML={{ __html: customStyles }} />;

// Function to convert language name to CSS class name
const getLanguageClassName = lang => {
  if (!lang) return 'tech-tag-other';

  // Map of language names to their corresponding CSS class names
  const languageMap = {
    // Popular languages
    JavaScript: 'javascript',
    TypeScript: 'typescript',
    Python: 'python',
    Java: 'java',
    HTML: 'html',
    CSS: 'css',
    PHP: 'php',
    Ruby: 'ruby',
    'C++': 'cpp',
    'C#': 'csharp',
    Go: 'go',
    Rust: 'rust',
    Swift: 'swift',
    Kotlin: 'kotlin',
    Dart: 'dart',
    Shell: 'shell',
    PowerShell: 'powershell',

    // Frameworks
    Vue: 'vue',
    React: 'react',
    Angular: 'angular',
    Svelte: 'svelte',

    // Other
    Dockerfile: 'dockerfile',
    Makefile: 'makefile',
    'Jupyter Notebook': 'jupyter',
    Jupyter: 'jupyter',
    SCSS: 'css',
    Sass: 'css',
    Less: 'css',
    'TypeScript React': 'typescript',
    TSX: 'typescript',
    JSX: 'javascript',
    Markdown: 'markdown',
    JSON: 'json',
    YAML: 'yaml',
    GraphQL: 'graphql',
    SQL: 'sql',
    PLSQL: 'sql',
    PLpgSQL: 'sql',
  };

  // Find the language in our map, or use a default
  const className = languageMap[lang] || lang.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `tech-tag-${className}`;
};

// Function to get color for a programming language
const getLanguageColor = language => {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    HTML: '#e34c26',
    CSS: '#563d7c',
    PHP: '#4F5D95',
    Ruby: '#701516',
    'C++': '#f34b7d',
    'C#': '#178600',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    Shell: '#89e051',
    PowerShell: '#012456',
    Vue: '#2c3e50',
    React: '#61dafb',
    Angular: '#b52e31',
    Svelte: '#ff3e00',
    Dockerfile: '#384d54',
    Jupyter: '#DA5B0B',
    SCSS: '#c6538c',
    Sass: '#c6538c',
    Less: '#1d365d',
    TSX: '#2b7489',
    JSX: '#f1e05a',
    Markdown: '#083fa1',
    JSON: '#292929',
    YAML: '#cb171e',
    GraphQL: '#e10098',
    SQL: '#336791',
    PLSQL: '#336791',
    PLpgSQL: '#336791',
  };

  return colors[language] || '#cccccc';
};

const Projects = () => {
  const [repos, setRepos] = useState([]);
  const [languages, setLanguages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredProject, setHoveredProject] = useState(null);
  const { isDark } = useContext(ThemeContext);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const projectFilters = [
    { id: 'all', name: 'All Projects' },
    { id: 'web', name: 'Web Apps' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'api', name: 'APIs' },
    { id: 'tools', name: 'Dev Tools' },
  ];

  // Filter projects based on active filter
  const filteredRepos = repos.filter(repo => {
    if (activeFilter === 'all') return true;
    const repoName = repo.name.toLowerCase();
    const repoDesc = repo.description?.toLowerCase() || '';

    switch (activeFilter) {
      case 'web':
        return repoName.includes('web') || repoName.includes('react') || repoDesc.includes('web');
      case 'mobile':
        return (
          repoName.includes('mobile') ||
          repoName.includes('react-native') ||
          repoDesc.includes('mobile')
        );
      case 'api':
        return repoName.includes('api') || repoName.includes('server') || repoDesc.includes('api');
      case 'tools':
        return repoName.includes('cli') || repoName.includes('tool') || repoDesc.includes('tool');
      default:
        return true;
    }
  });

  // Project images mapping - add your project images to the public/images/projects directory
  const projectImages = {
    project1: '/images/projects/project1.jpg',
    project2: '/images/projects/project2.jpg',
    // Add more project images as needed
  };

  // Function to fetch languages for a repository
  const fetchLanguages = async repoName => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/TheOnlyBaddy/${repoName}/languages`
      );
      if (!response.ok) return [];
      const data = await response.json();
      return Object.entries(data)
        .sort((a, b) => b[1] - a[1]) // Sort by bytes (most used first)
        .map(([lang]) => lang);
    } catch (error) {
      console.error(`Error fetching languages for ${repoName}:`, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://api.github.com/users/TheOnlyBaddy/repos?sort=updated&per_page=100'
        );
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        const data = await response.json();
        const filtered = Array.isArray(data)
          ? data
              .filter(repo => !repo.fork && !repo.private)
              .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)) // Sort by stars
          : [];

        setRepos(filtered);

        // Fetch languages for each repository
        const languagesData = {};
        const languagePromises = filtered.map(async repo => {
          const repoLanguages = await fetchLanguages(repo.name);
          languagesData[repo.name] = repoLanguages;
        });

        await Promise.all(languagePromises);
        setLanguages(languagesData);
      } catch (err) {
        console.error(err);
        setRepos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`relative py-20 overflow-hidden transition-colors duration-500 ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
      }`}
    >
      <StyleTag />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2NDY0ZmEiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYuMzQgMTAuMzRjLTEuNDItMS40Mi0zLjY2LTEuNDItNS4wNyAwbC0yNiA2MmMtMS40MiAxLjQyLTEuNDIgMy42NiAwIDUuMDcuNy43IDEuNjIgMS4wNSAyLjU0IDEuMDVoNTJjMS45MiAwIDMuNS0xLjU3IDMuNS0zLjV2LTUyYzAtLjkyLS4zNS0xLjg0LTEuMDYtMi41NGwtMjUuOS0xMC4wM3oiLz48L2c+PC9nPjwvc3ZnPg==')] transform scale-100"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-sm font-semibold text-primary-500 dark:text-primary-400 mb-2">
            My Work
          </span>
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Featured Projects
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Here are some of my recent projects. Each one was built to solve a specific problem or
            explore new technologies.
          </motion.p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {projectFilters.map(filter => (
            <motion.button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800"
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredRepos.map((repo, index) => (
                  <motion.article
                    key={repo.id}
                    className={`project-card rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm ${
                      isDark
                        ? 'bg-gray-800/80 text-gray-200 border border-gray-700/50'
                        : 'bg-white/90 text-gray-900 border border-gray-100'
                    }`}
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.5,
                        delay: Math.min(index * 0.05, 0.3),
                        type: 'spring',
                        stiffness: 100,
                      },
                    }}
                    whileHover={{
                      y: -8,
                      boxShadow: isDark
                        ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
                        : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    }}
                    onMouseEnter={() => setHoveredProject(repo.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                    layout
                  >
                    {/* Project Image with Hover Overlay */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                      <motion.div
                        className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300"
                        animate={{ opacity: hoveredProject === repo.id ? 1 : 0 }}
                      >
                        <motion.div
                          className="flex gap-4"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{
                            y: hoveredProject === repo.id ? 0 : 20,
                            opacity: hoveredProject === repo.id ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-full bg-white/90 text-gray-800 flex items-center justify-center hover:bg-white transition-colors"
                            aria-label="View on GitHub"
                          >
                            <FiGithub size={20} />
                          </a>
                          {repo.homepage && (
                            <a
                              href={repo.homepage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 rounded-full bg-white/90 text-gray-800 flex items-center justify-center hover:bg-white transition-colors"
                              aria-label="View Live Demo"
                            >
                              <FiExternalLink size={20} />
                            </a>
                          )}
                        </motion.div>
                      </motion.div>
                      <img
                        src={
                          projectImages[repo.name] ||
                          `https://source.unsplash.com/random/600x400/?${repo.language || 'code'},programming`
                        }
                        alt={repo.name}
                        className="w-full h-full object-cover transition-all duration-700"
                        style={{
                          transform: hoveredProject === repo.id ? 'scale(1.05)' : 'scale(1)',
                          filter:
                            hoveredProject === repo.id ? 'brightness(0.9)' : 'brightness(0.8)',
                        }}
                        onError={e => {
                          e.target.src = `https://source.unsplash.com/random/600x400/?${repo.language || 'code'},programming`;
                        }}
                        loading="lazy"
                      />
                    </div>

                    {/* Project Content */}
                    <div className="p-6 relative">
                      {/* Project Header with Stats */}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                          {repo.name.replace(/-/g, ' ').replace(/(^|\s)\S/g, l => l.toUpperCase())}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FiStar className="mr-1" />
                            {repo.stargazers_count || 0}
                          </span>
                          <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FiGitBranch className="mr-1" />
                            {repo.forks_count || 0}
                          </span>
                        </div>
                      </div>

                      {/* Project Description */}
                      <div className="mb-5">
                        {repo.description ? (
                          <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                            {repo.description}
                          </p>
                        ) : (
                          <p className="text-gray-400 dark:text-gray-500 italic">
                            No description provided
                          </p>
                        )}
                      </div>

                      {/* Technology Tags */}
                      {languages[repo.name]?.length > 0 && (
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2">
                            {languages[repo.name].slice(0, 5).map(lang => {
                              const languageClass = getLanguageClassName(lang);
                              return (
                                <motion.span
                                  key={lang}
                                  className={`tech-tag ${languageClass} inline-flex items-center`}
                                  title={lang}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <span className="w-2 h-2 rounded-full bg-current opacity-70 mr-1"></span>
                                  {lang}
                                </motion.span>
                              );
                            })}
                            {languages[repo.name].length > 5 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                                +{languages[repo.name].length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Project Footer */}
                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <motion.a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors group"
                            whileHover={{ x: 2 }}
                          >
                            <FiGithub className="mr-1" />
                            <span>Code</span>
                          </motion.a>

                          {repo.homepage && (
                            <motion.a
                              href={repo.homepage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors group"
                              whileHover={{ x: 2 }}
                            >
                              <FiExternalLink className="mr-1" />
                              <span>Live Demo</span>
                            </motion.a>
                          )}
                        </div>

                        {repo.language && (
                          <div className="flex items-center">
                            <span
                              className="w-3 h-3 rounded-full mr-2"
                              style={{
                                backgroundColor: getLanguageColor(repo.language),
                              }}
                            ></span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {repo.language}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>

        {filteredRepos.length === 0 && !isLoading && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
              No projects found matching the selected filter.
            </h3>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
