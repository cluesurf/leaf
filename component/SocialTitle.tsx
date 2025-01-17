import React from 'react'

type SocialTitlePropsType = {
  author: string
  title: string
}

export default function SocialTitle({
  title,
  author,
}: SocialTitlePropsType) {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginTop: 32,
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 48,
          lineHeight: 1,
          width: '100%',
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 24,
          lineHeight: 1.7,
          width: '100%',
        }}
      >
        at
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 32,
          width: '100%',
        }}
      >
        FormSurf
      </div>
    </div>
  )
}
