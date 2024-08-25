import type { EditorView } from '@uiw/react-codemirror'
import { CSSProperties } from 'react'

export type TextEditorInput = {
  value?: string
  language?: TextEditorLanguage
  onChange?: (text?: string) => void
  height?: string
  theme?: TextEditorTheme
  className?: string
  readOnly?: boolean
  editorRef?: React.MutableRefObject<EditorView | undefined>
  style?: CSSProperties
}

export type TextEditorLanguage =
  | 'javascript'
  | 'typescript'
  | 'cpp'
  | 'html'
  | 'java'
  | 'markdown'
  | 'php'
  | 'python'
  | 'rust'
  | 'sql'
  | 'xml'
  | 'less'
  | 'sass'
  | 'clojure'
  | 'csharp'
  | 'json'
  | 'latex'
  | 'brainfuck'
  | 'css'
  | 'yaml'
  | 'wast'
  | 'lua'
  | 'ruby'
  | 'makefile'
  | 'cobol'
  | 'coffeescript'
  | 'common-lisp'
  | 'crystal'
  | 'dockerfile'
  | 'elm'
  | 'erlang'
  | 'fortran'
  | 'gherkin'
  | 'go'
  | 'haskell'
  | 'haxe'
  | 'http'
  | 'julia'
  | 'mathematica'
  | 'nginx'
  | 'pascal'
  | 'pegjs'
  | 'perl'
  | 'pig'
  | 'powershell'
  | 'protobuf'
  | 'puppet'
  | 'r'
  | 'scheme'
  | 'shell'
  | 'smalltalk'
  | 'sparql'
  | 'swift'
  | 'textile'
  | 'toml'
  | 'vb'
  | 'vbscript'
  | 'verilog'

export type TextEditorTheme = 'purple' | 'blue' | 'base'
