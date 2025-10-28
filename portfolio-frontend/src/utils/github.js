/**
 * Fetches the languages used in a user's GitHub repositories
 * @param {string} username - GitHub username
 * @returns {Promise<Array>} - Array of unique languages with their usage data
 */
export async function fetchGitHubLanguages(username) {
  try {
    // First, fetch the user's public repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`
    );

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`);
    }

    const repos = await reposResponse.json();

    // Skip forks and archived repos, filter out repos with no language
    const validRepos = repos.filter(repo => !repo.fork && !repo.archived && repo.language);

    // Fetch languages for each repository
    const languagesPromises = validRepos.map(async repo => {
      const langResponse = await fetch(repo.languages_url);
      if (!langResponse.ok) return null;
      return await langResponse.json();
    });

    const languagesResults = await Promise.all(languagesPromises);

    // Aggregate language data
    const languageTotals = {};

    languagesResults.forEach(langData => {
      if (!langData) return;

      Object.entries(langData).forEach(([lang, bytes]) => {
        if (!languageTotals[lang]) {
          languageTotals[lang] = 0;
        }
        languageTotals[lang] += bytes;
      });
    });

    // Convert to array and sort by usage
    const sortedLanguages = Object.entries(languageTotals)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: (bytes / Object.values(languageTotals).reduce((a, b) => a + b, 0)) * 100,
      }))
      .sort((a, b) => b.bytes - a.bytes);

    return sortedLanguages;
  } catch (error) {
    console.error('Error fetching GitHub languages:', error);
    return [];
  }
}

/**
 * Maps GitHub languages to skill objects with icons and categories
 * @param {Array} languages - Array of language objects from fetchGitHubLanguages
 * @returns {Array} - Formatted skills array
 */
export function mapLanguagesToSkills(languages) {
  const languageIcons = {
    JavaScript: '📜',
    TypeScript: '🔷',
    Python: '🐍',
    Java: '☕',
    'C++': '🔷',
    'C#': '🔷',
    Ruby: '💎',
    PHP: '🐘',
    Go: '🐹',
    Rust: '🦀',
    Swift: '🐦',
    Kotlin: '🔶',
    Dart: '🎯',
    HTML: '🌐',
    CSS: '🎨',
    SCSS: '🎨',
    Shell: '💻',
    Dockerfile: '🐳',
    'Jupyter Notebook': '📓',
    Vue: '🟢',
    React: '⚛️',
    Angular: '🅰️',
    Svelte: '💫',
    Elixir: '💧',
    Clojure: '()',
    Haskell: 'λ',
    Scala: '🆎',
    R: '📊',
    Matlab: '🧮',
    'Objective-C': '🍏',
    Perl: '🐪',
    Lua: '🌙',
  };

  const languageCategories = {
    JavaScript: ['frontend'],
    TypeScript: ['frontend'],
    Python: ['backend'],
    Java: ['backend'],
    'C++': ['backend'],
    'C#': ['backend'],
    Ruby: ['backend'],
    PHP: ['backend'],
    Go: ['backend'],
    Rust: ['backend', 'tools'],
    Swift: ['mobile'],
    Kotlin: ['mobile', 'backend'],
    Dart: ['mobile'],
    HTML: ['frontend'],
    CSS: ['frontend'],
    SCSS: ['frontend'],
    Shell: ['tools'],
    Dockerfile: ['tools', 'devops'],
    'Jupyter Notebook': ['data'],
    Vue: ['frontend'],
    React: ['frontend'],
    Angular: ['frontend'],
    Svelte: ['frontend'],
    Elixir: ['backend'],
    Clojure: ['backend'],
    Haskell: ['backend'],
    Scala: ['backend'],
    R: ['data'],
    Matlab: ['data'],
    'Objective-C': ['mobile'],
    Perl: ['backend'],
    Lua: ['backend'],
  };

  return languages.map(lang => ({
    name: lang.name,
    description: `${Math.round(lang.percentage)}% of my GitHub code`,
    icon: languageIcons[lang.name] || '💻',
    color: getRandomGradient(),
    category: languageCategories[lang.name] || ['tools'],
    bytes: lang.bytes,
    percentage: lang.percentage,
  }));
}

// Helper function to generate random gradient classes
function getRandomGradient() {
  const gradients = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-400',
    'from-yellow-400 to-orange-500',
    'from-red-500 to-pink-500',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500',
    'from-amber-500 to-yellow-400',
    'from-lime-500 to-green-500',
    'from-cyan-500 to-blue-500',
    'from-violet-500 to-purple-500',
    'from-fuchsia-500 to-pink-500',
    'from-rose-500 to-pink-500',
    'from-sky-500 to-blue-500',
    'from-emerald-500 to-teal-500',
  ];

  return gradients[Math.floor(Math.random() * gradients.length)];
}

export const defaultSkills = [
  // Frontend
  {
    name: 'React.js',
    description: 'Hooks, context, performance optimization',
    icon: '⚛️',
    color: 'from-blue-500 to-cyan-400',
    category: ['frontend'],
  },
  {
    name: 'JavaScript',
    description: 'ES6+, async/await, functional programming',
    icon: '📜',
    color: 'from-yellow-400 to-orange-500',
    category: ['frontend', 'backend'],
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first styling and responsive UI',
    icon: '🎨',
    color: 'from-cyan-400 to-blue-500',
    category: ['frontend'],
  },
  {
    name: 'Python',
    description: 'Automation, data processing, web backends',
    icon: '🐍',
    color: 'from-blue-600 to-cyan-400',
    category: ['backend'],
  },
  {
    name: 'MongoDB',
    description: 'NoSQL design, aggregation, indexing',
    icon: '🍃',
    color: 'from-green-500 to-emerald-400',
    category: ['backend', 'tools'],
  },
  {
    name: 'Git & GitHub',
    description: 'Version control, PRs, CI/CD workflows',
    icon: '🔀',
    color: 'from-gray-700 to-gray-500',
    category: ['tools'],
  },
];
