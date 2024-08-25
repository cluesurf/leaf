import React, { CSSProperties, useEffect, useState } from 'react'
import cx from 'classnames'
import { color } from '@uiw/codemirror-extensions-color'
import CodeMirror, {
  EditorView,
  Extension,
} from '@uiw/react-codemirror'
import { stex } from '@codemirror/legacy-modes/mode/stex'
import {
  LRLanguage,
  Language,
  LanguageSupport,
  StreamLanguage,
} from '@codemirror/language'
// https://discuss.codemirror.net/t/custom-language-with-syntax-highlighting/6786/4
import { cppLanguage } from '@codemirror/lang-cpp'
import { htmlLanguage } from '@codemirror/lang-html'
import { javaLanguage } from '@codemirror/lang-java'
import { tsxLanguage, jsxLanguage } from '@codemirror/lang-javascript'
import { jsonLanguage } from '@codemirror/lang-json'
import { lezer } from '@codemirror/lang-lezer'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { phpLanguage } from '@codemirror/lang-php'
import { pythonLanguage } from '@codemirror/lang-python'
import { rustLanguage } from '@codemirror/lang-rust'
import { StandardSQL } from '@codemirror/lang-sql'
import { xmlLanguage } from '@codemirror/lang-xml'
import { lessLanguage } from '@codemirror/lang-less'
import { sassLanguage } from '@codemirror/lang-sass'
import { cssLanguage } from '@codemirror/lang-css'
import { clojureLanguage } from '@nextjournal/lang-clojure'
import { csharpLanguage } from '@replit/codemirror-lang-csharp'
import { purpleTheme } from '~/constant/codemirror/purple'
import { blueTheme } from '~/constant/codemirror/blue'

import { brainfuckLanguage } from 'codemirror-lang-brainfuck'
// import { yamlLanguage } from '@codemirror/lang-yaml'
import { wastLanguage } from '@codemirror/lang-wast'
import { yaml } from '@codemirror/legacy-modes/mode/yaml'
import { lua } from '@codemirror/legacy-modes/mode/lua'
import { ruby } from '@codemirror/legacy-modes/mode/ruby'
import { cmake } from '@codemirror/legacy-modes/mode/cmake'
import { cobol } from '@codemirror/legacy-modes/mode/cobol'
import { coffeeScript } from '@codemirror/legacy-modes/mode/coffeescript'
import { commonLisp } from '@codemirror/legacy-modes/mode/commonlisp'
import { crystal } from '@codemirror/legacy-modes/mode/crystal'
import { dockerFile } from '@codemirror/legacy-modes/mode/dockerfile'
import { elm } from '@codemirror/legacy-modes/mode/elm'
import { erlang } from '@codemirror/legacy-modes/mode/erlang'
import { fortran } from '@codemirror/legacy-modes/mode/fortran'
import { gherkin } from '@codemirror/legacy-modes/mode/gherkin'
import { go } from '@codemirror/legacy-modes/mode/go'
import { haskell } from '@codemirror/legacy-modes/mode/haskell'
import { haxe } from '@codemirror/legacy-modes/mode/haxe'
import { http } from '@codemirror/legacy-modes/mode/http'
import { julia } from '@codemirror/legacy-modes/mode/julia'
import { mathematica } from '@codemirror/legacy-modes/mode/mathematica'
import { nginx } from '@codemirror/legacy-modes/mode/nginx'
import { pascal } from '@codemirror/legacy-modes/mode/pascal'
import { pegjs } from '@codemirror/legacy-modes/mode/pegjs'
import { perl } from '@codemirror/legacy-modes/mode/perl'
import { pig } from '@codemirror/legacy-modes/mode/pig'
import { powerShell } from '@codemirror/legacy-modes/mode/powershell'
import { protobuf } from '@codemirror/legacy-modes/mode/protobuf'
import { puppet } from '@codemirror/legacy-modes/mode/puppet'
import { r } from '@codemirror/legacy-modes/mode/r'
import { scheme } from '@codemirror/legacy-modes/mode/scheme'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { smalltalk } from '@codemirror/legacy-modes/mode/smalltalk'
import { sparql } from '@codemirror/legacy-modes/mode/sparql'
import { swift } from '@codemirror/legacy-modes/mode/swift'
import { textile } from '@codemirror/legacy-modes/mode/textile'
import { toml } from '@codemirror/legacy-modes/mode/toml'
import { vb } from '@codemirror/legacy-modes/mode/vb'
import { vbScript } from '@codemirror/legacy-modes/mode/vbscript'
import { verilog } from '@codemirror/legacy-modes/mode/verilog'
import { useDarkMode } from '~/hook/useDarkMode'
import {
  TextEditorInput,
  TextEditorLanguage,
  TextEditorTheme,
} from './TextEditor.types'

export const TEXT_EDITOR_LANGUAGE: Record<
  TextEditorLanguage,
  LanguageSupport | StreamLanguage<any> | LRLanguage | Language
> = {
  wast: wastLanguage,
  yaml: StreamLanguage.define(yaml),
  css: cssLanguage,
  javascript: jsxLanguage,
  typescript: tsxLanguage,
  cpp: cppLanguage,
  html: htmlLanguage,
  java: javaLanguage,
  markdown: markdownLanguage,
  php: phpLanguage,
  python: pythonLanguage,
  rust: rustLanguage,
  sql: StandardSQL.language,
  xml: xmlLanguage,
  less: lessLanguage,
  sass: sassLanguage,
  clojure: clojureLanguage,
  csharp: csharpLanguage,
  json: jsonLanguage,
  brainfuck: brainfuckLanguage,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  latex: StreamLanguage.define(stex),
  lua: StreamLanguage.define(lua),
  ruby: StreamLanguage.define(ruby),
  makefile: StreamLanguage.define(cmake),
  cobol: StreamLanguage.define(cobol),
  coffeescript: StreamLanguage.define(coffeeScript),
  'common-lisp': StreamLanguage.define(commonLisp),
  crystal: StreamLanguage.define(crystal),
  dockerfile: StreamLanguage.define(dockerFile),
  elm: StreamLanguage.define(elm),
  erlang: StreamLanguage.define(erlang),
  fortran: StreamLanguage.define(fortran),
  gherkin: StreamLanguage.define(gherkin),
  go: StreamLanguage.define(go),
  haskell: StreamLanguage.define(haskell),
  haxe: StreamLanguage.define(haxe),
  http: StreamLanguage.define(http),
  julia: StreamLanguage.define(julia),
  mathematica: StreamLanguage.define(mathematica),
  nginx: StreamLanguage.define(nginx),
  pascal: StreamLanguage.define(pascal),
  pegjs: StreamLanguage.define(pegjs),
  perl: StreamLanguage.define(perl),
  pig: StreamLanguage.define(pig),
  powershell: StreamLanguage.define(powerShell),
  protobuf: StreamLanguage.define(protobuf),
  puppet: StreamLanguage.define(puppet),
  r: StreamLanguage.define(r),
  scheme: StreamLanguage.define(scheme),
  shell: StreamLanguage.define(shell),
  smalltalk: StreamLanguage.define(smalltalk),
  sparql: StreamLanguage.define(sparql),
  swift: StreamLanguage.define(swift),
  textile: StreamLanguage.define(textile),
  toml: StreamLanguage.define(toml),
  vb: StreamLanguage.define(vb),
  vbscript: StreamLanguage.define(vbScript),
  verilog: StreamLanguage.define(verilog),
}

export const TEXT_EDITOR_THEME: Record<
  TextEditorTheme,
  (options: any) => Extension
> = {
  purple: purpleTheme,
  blue: blueTheme,
  base: purpleTheme,
}

export default function TextEditor({
  editorRef,
  value,
  language,
  onChange,
  height,
  theme,
  className,
  readOnly,
  style,
}: TextEditorInput) {
  const extension = language && TEXT_EDITOR_LANGUAGE[language]
  const extensions: Array<LanguageSupport | Extension> = []
  const [editor, setEditor] = useState<EditorView>()
  const themeMode = useDarkMode()

  if (extension) {
    extensions.push(color, extension)
  }

  useEffect(() => {
    if (editorRef && editor) {
      editorRef.current = editor
    }
  }, [editorRef, editor])

  const handleCreateEditor = (editor: EditorView) => {
    setEditor(editor)
    if (editorRef) {
      editorRef.current = editor
    }
  }

  return (
    <CodeMirror
      className={cx('min-h-0 [&_div]:leading-content', className)}
      role="code"
      style={style}
      value={value}
      height={height}
      readOnly={readOnly}
      onCreateEditor={handleCreateEditor}
      basicSetup={{
        lineNumbers: false,
        defaultKeymap: false,
        searchKeymap: false,
        historyKeymap: false,
        foldKeymap: false,
        completionKeymap: false,
        lintKeymap: false,
        syntaxHighlighting: true,
        highlightSpecialChars: true,
        highlightSelectionMatches: true,
        bracketMatching: true,
        allowMultipleSelections: true,
        indentOnInput: true,
      }}
      theme={theme && TEXT_EDITOR_THEME[theme]({ theme: themeMode })}
      extensions={extensions}
      onChange={onChange}
    />
  )
}
