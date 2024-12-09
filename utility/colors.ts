import uniq from 'lodash/uniq'

const COLORS = {
  used: ['bg-violet-500'],
  tailwind: {
    gray50: 'rgb(249, 250, 251)',
    gray100: 'rgb(243, 244, 246)',
    gray200: 'rgb(229, 231, 235)',
    gray300: 'rgb(209, 213, 219)',
    gray400: 'rgb(156, 163, 175)',
    gray500: 'rgb(107, 114, 128)',
    gray600: 'rgb(75, 85, 99)',
    gray700: 'rgb(55, 65, 81)',
    gray800: 'rgb(31, 41, 55)',
    gray900: 'rgb(17, 24, 39)',
    gray950: 'rgb(3, 7, 18)',
    zinc50: 'rgb(250, 250, 250)',
    zinc100: 'rgb(244, 244, 245)',
    zinc200: 'rgb(228, 228, 231)',
    zinc300: 'rgb(212, 212, 216)',
    zinc400: 'rgb(161, 161, 170)',
    zinc400Half: 'rgba(161, 161, 170, 0.5)',
    zinc500: 'rgb(113, 113, 122)',
    zinc500Half: 'rgba(113, 113, 122, 0.5)',
    zinc600: 'rgb(82, 82, 91)',
    zinc700: 'rgb(63, 63, 70)',
    zinc800: 'rgb(39, 39, 42)',
    zinc900: 'rgb(24, 24, 27)',
    zinc950: 'rgb(9, 9, 11)',
    violet50: 'rgb(245, 243, 255)',
    violet100: 'rgb(237, 233, 254)',
    violet200: 'rgb(221, 214, 254)',
    violet300: 'rgb(196, 181, 253)',
    violet400: 'rgb(167, 139, 250)',
    violet500: 'rgb(139, 92, 246)',
    violet600: 'rgb(124, 58, 237)',
    violet700: 'rgb(109, 40, 217)',
    violet800: 'rgb(91, 33, 182)',
    violet900: 'rgb(76, 29, 149)',
    violet950: 'rgb(46, 16, 101)',
    blue50: 'rgb(239, 246, 255)',
    blue100: 'rgb(219, 234, 254)',
    blue200: 'rgb(191, 219, 254)',
    blue300: 'rgb(147, 197, 253)',
    blue400: 'rgb(96, 165, 250)',
    blue500: 'rgb(59, 130, 246)',
    blue600: 'rgb(37, 99, 235)',
    blue700: 'rgb(29, 78, 216)',
    blue800: 'rgb(30, 64, 175)',
    blue900: 'rgb(30, 58, 138)',
    blue950: 'rgb(23, 37, 84)',
  },
  constrast: {
    base: '',
    baseDark: '',
  },
  focus: {
    heavy:
      'focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-blue-300',
  },
  button: {
    purple:
      'bg-violet-500 text-zinc-100 dark:bg-violet-800 dark:text-violet-200 hover:opacity-70 enabled:dark:hover:opacity-100 enabled:dark:hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50',
    green:
      'bg-emerald-500 text-zinc-100 dark:bg-emerald-800 dark:text-emerald-200 hover:opacity-70 enabled:dark:hover:opacity-100 enabled:dark:hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50',
    red: 'bg-rose-500 text-zinc-100 dark:bg-rose-800 dark:text-rose-200 hover:opacity-70 enabled:dark:hover:opacity-100 enabled:dark:hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50',
    blue: 'bg-blue-500 text-zinc-100 dark:bg-blue-800 dark:text-blue-200 hover:opacity-70 enabled:dark:hover:opacity-100 enabled:dark:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50',
    base: 'bg-zinc-800 text-zinc-100 dark:text-zinc-800 dark:bg-zinc-200 hover:opacity-70 enabled:dark:hover:opacity-100 enabled:dark:hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50',
    neutral:
      'bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-200 hover:opacity-70 enabled:dark:hover:opacity-100 enabled:dark:hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50',
  },
  input: {
    purple:
      'bg-violet-100 text-violet-700 [&>input]:placeholder:text-violet-400 dark:bg-violet-950 dark:text-violet-300',
    blue: 'bg-blue-100 text-blue-700 [&>input]:placeholder:text-blue-300 dark:bg-blue-950 dark:text-blue-300',
    neutral:
      'bg-zinc-100 text-zinc-950 [&>input]:placeholder:text-zinc-300 dark:bg-zinc-900 dark:text-zinc-300',
    base: 'bg-white [&>input]:placeholder:text-zinc-100 dark:bg-zinc-800 dark:text-zinc-300',
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
    base: 'border-4 border-solid border-zinc-800 text-zinc-800 hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed',
    neutral:
      'border-4 border-solid border-zinc-400 text-zinc-400 hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed',
  },
}

COLORS.constrast.base = COLORS.tailwind.zinc800
COLORS.constrast.baseDark = COLORS.tailwind.zinc300

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
