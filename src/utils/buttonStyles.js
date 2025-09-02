export const primaryButton = "relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group hover:from-blue-700 hover:to-purple-700";

export const secondaryButton = "relative px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800";

export const buttonHoverEffect = "absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-70 blur transition duration-500 group-hover:duration-200";

export const buttonWrapper = "relative group";

export const buttonMotionProps = {
  whileHover: { y: -3 },
  whileTap: { scale: 0.98 }
};
