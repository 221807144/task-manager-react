// src/config/theme.js
export const theme = {
  colors: {
    primary: {
      bg: 'bg-indigo-600',
      hover: 'hover:bg-indigo-700',
      text: 'text-white',
      border: 'border-indigo-600',
      focus: 'focus:ring-indigo-500'
    },
    secondary: {
      bg: 'bg-white',
      hover: 'hover:bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300'
    },
    status: {
      todo: 'bg-blue-100 text-blue-800',
      progress: 'bg-yellow-100 text-yellow-800',
      done: 'bg-green-100 text-green-800'
    },
    background: 'bg-blue-50',
    card: 'bg-white',
    header: 'text-blue-900'
  },
  spacing: {
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6'
  },
  rounded: {
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl'
  },
  shadows: {
    small: 'shadow-sm',
    medium: 'shadow',
    large: 'shadow-lg'
  }
};