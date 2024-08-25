import { BlockQuote } from './Content'
import React, { FC } from 'react'
import Info from './icon/Info'
import Alert from './icon/Alert'
import Check from './icon/Check'

type ContainerInput = {
  children: React.ReactNode
  form: string
}

const COLOR_BG: Record<string, string> = {
  error: 'bg-rose-500',
  info: 'bg-blue-400',
  try: 'bg-emerald-400',
  warn: 'bg-yellow-200',
}

const COLOR_FG: Record<string, string> = {
  error: 'text-gray-50',
  info: 'text-gray-50',
  try: 'text-gray-900',
  warn: 'text-gray-900',
}

const ICON: Record<string, FC> = {
  error: Alert,
  info: Info,
  warn: Alert,
  try: Check,
}

function Container({ children, form }: ContainerInput) {
  // const Icon = ICON[form]
  return (
    <BlockQuote
      className={`${COLOR_BG[form]} rounded-sm`}
      style={{ fontStyle: 'normal' }}
    >
      <span className={`flex gap-8 items-center ${COLOR_FG[form]}`}>
        {/* {Icon && (
          <span className="w-24 h-24 inline-block">
            <Icon />
          </span>
        )} */}
        <span className="bg-inherit text-inherit">{children}</span>
      </span>
    </BlockQuote>
  )
}

type NoteInput = {
  children: React.ReactNode
  form?: string
}

export default function Note({ children, form = 'info' }: NoteInput) {
  return <Container form={form}>{children}</Container>
}
