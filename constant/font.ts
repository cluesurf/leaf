import FontFaceObserver from 'fontfaceobserver'

export const FONT_OBSERVER_TIMEOUT = 30000

export function addStylesheetURL(url: string) {
  var link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  document.getElementsByTagName('head')[0].appendChild(link)
}

export type GoogleFontStyleDeclaration = {
  italic?: boolean
  weight: number
}

export type GoogleFontDeclaration = {
  google: true
  family: string
  string?: string
  styles: Array<GoogleFontStyleDeclaration>
}

export type FontDataType = {
  family: string
  string: string
}

export async function loadFonts(
  fonts: Array<FontDataType | GoogleFontDeclaration>,
) {
  const localFonts = fonts.filter(x => !('google' in x))
  const googleFonts = fonts.filter(x => 'google' in x && x.google)

  await Promise.all([
    loadLocalFonts(localFonts as any),
    loadGoogleFonts(googleFonts as any),
  ])

  // await wait(160)
}

export async function loadLocalFonts(fonts: Array<FontDataType>) {
  const promiseList: Array<Promise<FontFaceObserverResult>> = []

  for (const font of fonts) {
    const promise = makeFontFaceObserver(font)
    promiseList.push(promise)
  }

  const result = await Promise.all(promiseList)
  // TODO: maybe send an error back if one failed.
}

export async function loadGoogleFonts(
  fonts: Array<GoogleFontDeclaration>,
) {
  if (!(await loadGoogleFontCss(fonts))) {
    // already loaded
    return Promise.resolve()
  }
  const promiseList: Array<Promise<FontFaceObserverResult>> = []

  for (const font of fonts) {
    const promise = makeFontFaceObserver(font)
    promiseList.push(promise)
  }

  const result = await Promise.all(promiseList)
  // TODO: maybe send an error back if one failed.
}

export type FontFaceObserverResult =
  | FontFaceObserverRise
  | FontFaceObserverFall

export type FontFaceObserverRise = {
  form: 'rise'
  font: GoogleFontDeclaration | FontDataType
}

export type FontFaceObserverFall = {
  form: 'kink'
  kink: any
  font: GoogleFontDeclaration | FontDataType
}

async function makeFontFaceObserver(
  font: GoogleFontDeclaration | FontDataType,
) {
  return new Promise<FontFaceObserverResult>(async res => {
    let attempt = 0

    while (true) {
      try {
        const observer = new FontFaceObserver(font.family)
        await observer.load(font.string, FONT_OBSERVER_TIMEOUT)
        return res({
          form: 'rise',
          font,
        })
      } catch (e) {
        console.error(e)
        if (attempt === 2) {
          return res({
            form: 'kink',
            kink: e,
            font,
          })
        }
      }

      attempt++
    }
  })
}

const loadGoogleFontStyle = (url: string) => {
  // addStylesheetURL(url)

  return new Promise<void>(res => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        let css = xhr.responseText
        css = css.replace(/}/g, 'font-display: swap; }')

        const head = document.getElementsByTagName('head')[0]
        const style = document.createElement('style')
        style.appendChild(document.createTextNode(css))
        head.appendChild(style)

        res()
      }
    }
    xhr.send()
  })
}

export async function loadGoogleFontCss(
  fonts: Array<GoogleFontDeclaration>,
) {
  const list: Array<string> = []
  for (const dec of fonts) {
    const italics = dec.styles.filter(x => x.italic)
    const regulars = dec.styles.filter(x => !x.italic)
    const text: Array<string> = []
    text.push(`family=${dec.family.replace(/\s+/g, '+')}:`)

    const types: Array<string> = []

    if (italics.length) {
      types.push(`ital`)
    }

    if (regulars.length) {
      types.push(`wght`)
    }

    text.push(`${types.join(',')}@`)

    const weights: Array<string> = []

    regulars.forEach(x => {
      const key = `${dec.family}:regular:${x.weight}`
      // if (!LOADED_FONTS[key]) {
      weights.push(`${italics.length ? '0,' : ''}${x.weight}`)
      //   LOADED_FONTS[key] = true
      // }
    })

    italics.forEach(x => {
      const key = `${dec.family}:italic:${x.weight}`
      // if (!LOADED_FONTS[key]) {
      weights.push(`${regulars.length ? '1,' : ''}${x.weight}`)
      //   LOADED_FONTS[key] = true
      // }
    })

    if (weights.length) {
      text.push(weights.join(';'))

      list.push(text.join(''))
    }
  }

  if (list.length) {
    const link = `https://fonts.googleapis.com/css2?${list.join(
      '&',
    )}&display=swap`

    // addStylesheetURL(link)
    await loadGoogleFontStyle(link)

    return true
  }

  return false
}
