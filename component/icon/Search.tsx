import React from 'react'

export type SearchIconInput = {
  colorClassName?: string
}

export default function SearchIcon({
  colorClassName = 'stroke-zinc-800 dark:stroke-zinc-400',
}: SearchIconInput) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.47487 4.4749C2.32698 6.62279 2.32698 10.1052 4.47487 12.2531C6.62275 14.401 10.1052 14.401 12.253 12.2531C14.4009 10.1052 14.4009 6.62279 12.253 4.4749C10.1052 2.32702 6.62275 2.32702 4.47487 4.4749ZM10.8388 10.8389C9.47199 12.2057 7.25591 12.2057 5.88908 10.8389C4.52224 9.47203 4.52224 7.25595 5.88908 5.88912C7.25591 4.52228 9.47199 4.52228 10.8388 5.88912C12.2057 7.25595 12.2057 9.47203 10.8388 10.8389Z"
        className={colorClassName}
      />
      <path
        d="M11.1924 13.3137C10.6066 12.7279 10.6066 11.7782 11.1924 11.1924C11.7782 10.6066 12.7279 10.6066 13.3137 11.1924L16.8492 14.7279C17.435 15.3137 17.435 16.2635 16.8492 16.8492C16.2635 17.435 15.3137 17.435 14.7279 16.8492L11.1924 13.3137Z"
        className={colorClassName}
      />
    </svg>
  )
}
