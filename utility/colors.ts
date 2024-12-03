import uniq from 'lodash/uniq'

const COLORS = {
  used: ['bg-violet-500'],
  focus: {
    heavy:
      'focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-blue-300',
  },
  button: {
    purple:
      'bg-violet-500 text-gray-100 dark:bg-violet-800 dark:text-violet-200 hover:opacity-70 enabled:dark:hover:opacity-100 enabled:dark:hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50',
    green:
      'bg-emerald-500 text-gray-100 dark:bg-emerald-800 dark:text-emerald-200 hover:opacity-70 enabled:dark:hover:opacity-100 enabled:dark:hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50',
    red: 'bg-rose-500 text-gray-100 dark:bg-rose-800 dark:text-rose-200 hover:opacity-70 enabled:dark:hover:opacity-100 enabled:dark:hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50',
    blue: 'bg-blue-500 text-gray-100 dark:bg-blue-800 dark:text-blue-200 hover:opacity-70 enabled:dark:hover:opacity-100 enabled:dark:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50',
    base: 'bg-gray-800 text-gray-100 dark:text-gray-800 dark:bg-gray-200 hover:opacity-70 enabled:dark:hover:opacity-100 enabled:dark:hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
    neutral:
      'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:opacity-70 enabled:dark:hover:opacity-100 enabled:dark:hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
  },
  input: {
    purple:
      'bg-violet-100 text-violet-700 [&>input]:placeholder:text-violet-400 dark:bg-violet-950 dark:text-violet-300',
    blue: 'bg-blue-100 text-blue-700 [&>input]:placeholder:text-blue-300 dark:bg-blue-950 dark:text-blue-300',
    neutral:
      'bg-gray-100 text-gray-950 [&>input]:placeholder:text-gray-300 dark:bg-gray-900 dark:text-gray-300',
    base: 'bg-white [&>input]:placeholder:text-gray-100 dark:bg-gray-800 dark:text-gray-300',
    green:
      'bg-emerald-100 text-emerald-700 [&>input]:placeholder:text-emerald-400 dark:bg-emerald-950 dark:text-emerald-300',
    red: 'bg-rose-100 text-rose-700 [&>input]:placeholder:text-rose-300 dark:bg-rose-950 dark:text-rose-300',
  },
  border: {
    purple:
      'border-4 border-solid dark:border-violet-900 border-violet-400 dark:border-violet-900 text-violet-400 hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed',
    green:
      'border-4 border-solid dark:border-emerald-900 border-emerald-400 dark:border-emerald-900 text-emerald-400 hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed',
    blue: 'border-4 border-solid dark:border-blue-900 border-blue-400 dark:border-blue-900 text-blue-400 hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed',
    red: 'border-4 border-solid border-rose-700 text-rose-700 hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed',
    base: 'border-4 border-solid border-gray-800 text-gray-800 hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed',
    neutral:
      'border-4 border-solid border-gray-400 text-gray-400 hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed',
  },
}

export default COLORS

for (const key in COLORS.button) {
  const vals = COLORS.button[key].split(/\s+/)
  // .map(selector => selector.split(':'))
  COLORS.used.push(...vals.flat())
}

for (const key in COLORS.border) {
  const vals = COLORS.border[key].split(/\s+/)
  // .map(selector => selector.split(':'))
  COLORS.used.push(...vals.flat())
}

for (const key in COLORS.input) {
  const vals = COLORS.input[key].split(/\s+/)
  // .map(selector => selector.split(':'))
  COLORS.used.push(...vals.flat())
}

COLORS.used = uniq(COLORS.used)
