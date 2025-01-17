import React from 'react'

export type DownloadIconInput = {
  colorClassName?: string
}

export default function DownloadIcon({
  colorClassName = 'fill-zinc-800 dark:fill-zinc-100',
}: DownloadIconInput) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 14V9.25C12 8.42157 11.3284 7.75 10.5 7.75C9.67157 7.75 9 8.42157 9 9.25V14H6C3.79086 14 2 12.2091 2 10C2 7.79086 3.79086 6 6 6H6.12602C6.57006 4.27477 8.13616 3 10 3H11C12.9002 3 14.4909 4.32493 14.8987 6.10135C16.6751 6.50915 18 8.09985 18 10C18 12.2091 16.2091 14 14 14H12Z"
        className={colorClassName}
      />
      <path
        d="M9.5 9.5C9.5 8.94771 9.94772 8.5 10.5 8.5C11.0523 8.5 11.5 8.94771 11.5 9.5L11.5 17C11.5 17.5523 11.0523 18 10.5 18C9.94772 18 9.5 17.5523 9.5 17V9.5Z"
        className={colorClassName}
      />
      <path
        d="M12.3753 14.7191C12.8066 14.3741 13.4359 14.444 13.7809 14.8753C14.1259 15.3065 14.056 15.9358 13.6247 16.2808L11.1247 18.2808C10.6934 18.6258 10.0641 18.5559 9.71913 18.1247C9.37412 17.6934 9.44404 17.0641 9.87531 16.7191L12.3753 14.7191Z"
        className={colorClassName}
      />
      <path
        d="M7.37531 16.2808C6.94404 15.9358 6.87412 15.3065 7.21913 14.8753C7.56414 14.444 8.19343 14.3741 8.6247 14.7191L11.1247 16.7191C11.556 17.0641 11.6259 17.6934 11.2809 18.1247C10.9359 18.5559 10.3066 18.6258 9.87531 18.2808L7.37531 16.2808Z"
        className={colorClassName}
      />
    </svg>
  )
}
