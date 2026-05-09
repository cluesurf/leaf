import { toPascalCase } from '@/tool'
import {
  Form,
  FormLike,
  LinkMesh,
  Hash,
  List,
  Base,
  FormLikeCase,
} from '@/form'
import { detectEnumStyleNesting } from './shared'

const TYPE: Record<string, string> = {
  boolean: 'boolean',
  number: 'number',
  decimal: 'number',
  integer: 'number',
  natural_number: 'number',
  array_buffer: 'ArrayBuffer',
  blob: 'Blob',
  json: 'object',
  string: 'string',
  timestamp: 'Date',
  date: 'Date',
  uuid: 'string',
  unknown: 'unknown',
}

function castType(base: Base, like: string): string | undefined {
  return base.cast?.form?.[like] ?? TYPE[like]
}

export type HoldFile = {
  file: FileName
  form?: 'form' | 'hash' | 'list' | 'test'
}

export type Hold = {
  // map export to file
  save: Record<TypeName, HoldFile>
  // map file to import
  load: Load
}

export type FileName = string

export type TypeName = string

export type Load = Record<FileName, Record<TypeName, boolean>>

/**
 * Make types in the `[...path]/index.ts` file.
 */

export default function make(base: Base, hold: Hold, need = true) {
  const hash: Record<string, string[]> = {}

  for (const name in base.link) {
    const site = base.link[name]!
    const file = `${site.save}/index`
    hold.load[file] ??= {}
    hash[file] ??= []
  }

  for (const name in base.link) {
    const site = base.link[name]!
    const file = `${site.save}/index`
    const list = hash[file]!

    switch (site.form) {
      case 'form':
        makeForm({ form: site, base, name, hold, file, need }).forEach(
          line => {
            list.push(line)
          },
        )
        break
      case 'hash':
        makeHash({ hash: site, base, name, hold, file, need }).forEach(
          line => {
            list.push(line)
          },
        )
        break
      case 'list':
        makeList({ list: site, base, name, hold, file, need }).forEach(
          line => {
            list.push(line)
          },
        )
        break
      case 'flow':
      case 'fold':
        // Input codegen for Flow / Fold comes from their
        // referenced Form (via `take: '<form_name>'`). Nothing
        // to emit here.
        break
    }
  }

  return hash
}

export function makeForm({
  name,
  form,
  base,
  hold,
  file,
  need = false,
}: {
  name: string
  form: Form
  base: Base
  hold: Hold
  file: string
  need?: boolean
}) {
  const list: string[] = []
  const load = (hold.load[file] ??= {})

  const formName = makePascalName(name, need)

  if ('link' in form) {
    hold.save[formName] ??= { file, form: 'form' }
    list.push(`export type ${formName} = {`)
  } else if ('case' in form) {
    hold.save[formName] ??= { file, form: 'form' }
    list.push(`export type ${formName} =`)
  }

  makeLinkList({
    form,
    base,
    hold,
    file,
    need,
  }).forEach(line => {
    list.push(`  ${line}`)
  })

  if ('link' in form) {
    list.push(`}`)
  }

  return list
}

export function makeHash({
  name,
  hash,
  base,
  file,
  hold,
  need = false,
}: {
  name: string
  hash: Hash
  base: Base
  file: string
  hold: Hold
  need?: boolean
}) {
  if (!need) {
    return []
  }

  const list: string[] = []

  const typeValueName = makePascalName(`${name}_value`, need)

  list.push(`export type ${typeValueName} = `)

  const bond = hash.bond!
  if ('case' in bond) {
    makeFormCase({
      form: bond as FormLikeCase,
      base,
      file,
      hold,
      need,
    }).forEach(line => {
      list.push(line)
    })
  } else {
    makeFormLike({
      form: bond,
      base,
      hold,
      file,
      need,
    }).forEach(line => {
      list.push(line)
    })
  }

  list.push(``)

  const load = (hold.load[file] ??= {})

  const typeName = makePascalName(name, need)

  hold.save[typeName] ??= { file, form: 'form' }
  hold.save[typeValueName] ??= { file, form: 'form' }

  if (hash.link) {
    const linkTypeName = findAndLinkName({
      like: hash.link,
      base,
      file,
      hold,
      need,
    })
    load[linkTypeName] = true
    list.push(
      `export type ${typeName} = Record<${linkTypeName}, ${typeValueName}>`,
    )
  } else {
    const keyList = Object.keys(hash.hash ?? {})
    const typeKeyName = makePascalName(`${name}_key`, need)

    hold.save[typeKeyName] ??= { file, form: 'list' }

    list.push(``)
    list.push(`export type ${typeKeyName} =
${keyList.map(key => `  | '${key}'`).join('\n')}`)

    list.push(``)
    list.push(
      `export type ${typeName} = Record<${typeKeyName}, ${typeValueName}>`,
    )
  }

  return list
}

export function makeList({
  name,
  list,
  base,
  file,
  hold,
  need = false,
}: {
  name: string
  list: List
  base: Base
  file: string
  hold: Hold
  need?: boolean
}) {
  if (!need) {
    return []
  }

  const text: string[] = []

  const typeName = makePascalName(name, need)

  hold.save[typeName] ??= { file, form: 'list' }

  text.push(``)
  text.push(`export type ${typeName} =
${(list.list ?? []).map(key => `  | '${key}'`).join('\n')}`)

  return text
}

export function makeLinkList({
  form,
  base,
  hold,
  file,
  need = false,
}: {
  form: Form | LinkMesh
  base: Base
  hold: Hold
  file: string
  need?: boolean
}) {
  const list: string[] = []

  if ('link' in form) {
    for (const name in form.link) {
      const link = form.link[name]
      if (!link) {
        continue
      }
      const optional = link.need === false ? '?' : need ? '' : '?'
      const aS = link.list === true ? 'Array<' : ''
      const aE = link.list === true ? '>' : ''
      if (typeof link.like === 'string') {
        const type = findAndLinkName({
          like: link.like as string,
          base,
          file,
          hold,
          need,
        })
        list.push(`  ${name}${optional}: ${aS}${type}${aE}`)
      } else if (link.case) {
        if (Array.isArray(link.case)) {
          const likeCase: string[] = []
          link.case.forEach(c => {
            if (c.like) {
              const type = findAndLinkName({
                like: c.like as string,
                base,
                file,
                hold,
                need,
              })
              likeCase.push(type)
            } else if (c.link) {
              const lines: string[] = []
              lines.push('{')
              makeLinkList({
                form: c as LinkMesh,
                base,
                hold,
                file,
                need,
              }).forEach(line => {
                lines.push(`  ${line}`)
              })
              lines.push('}')
              likeCase.push(lines.join('\n'))
            }
          })
          list.push(
            `  ${name}${optional}: ${aS}${likeCase.join(' | ')}${aE}`,
          )
        } else {
          const likeCase: string[] = []
          for (const name in link.case) {
            likeCase.push(`'${name}'`)
          }
          list.push(
            `  ${name}${optional}: ${aS}${likeCase.join(' | ')}${aE}`,
          )
        }
      } else if (link.link) {
        const enumStyle = detectEnumStyleNesting(link.link)
        if (enumStyle.isEnum) {
          const union = enumStyle.keys
            .map(key => `'${key}'`)
            .join(' | ')
          list.push(`  ${name}${optional}: ${aS}${union}${aE}`)
        } else {
          list.push(`  ${name}${optional}: ${aS}{`)
          makeLinkList({
            form: link as LinkMesh,
            base,
            hold,
            file,
            need,
          }).forEach(line => {
            list.push(`  ${line}`)
          })
          list.push(`}${aE}`)
        }
      } else if (link.take) {
        list.push(
          `  ${name}${optional}: ${aS}${link.take
            .map(x => `'${x}'`)
            .join(' | ')}${aE}`,
        )
      }
    }
  } else if ('case' in form) {
    makeFormCase({
      form: form as unknown as FormLikeCase,
      base,
      file,
      hold,
      need,
    }).forEach(line => {
      list.push(line)
    })
  }

  return list
}

function makeFormCase({
  form,
  base,
  hold,
  file,
  need = false,
}: {
  form: FormLikeCase
  base: Base
  hold: Hold
  file: string
  need?: boolean
}) {
  const formList: string[] = []
  const baseList: any[] = []
  const formCase = form.case

  formCase.forEach(item => {
    if (typeof item === 'object' && 'like' in item) {
      const type = findAndLinkName({
        like: item.like,
        base,
        file,
        hold,
        need,
      })
      formList.push(type)
    } else if (typeof item === 'object' && 'link' in item) {
      const lines: string[] = []
      lines.push('{')
      makeLinkList({
        form: item as LinkMesh,
        base,
        hold,
        file,
        need,
      }).forEach(line => {
        lines.push(`  ${line}`)
      })
      lines.push('}')
      formList.push(lines.join('\n'))
    }
  })

  const baseSite =
    baseList.length > 0 ? `${baseList.join(' | ')}` : undefined

  if (baseSite) {
    formList.push(baseSite)
  }

  const formSite = `${formList.join(' | ')}`
  return [formSite]
}

function makeFormLike({
  form,
  base,
  hold,
  file,
  need = false,
}: {
  form: FormLike
  base: Base
  hold: Hold
  file: string
  need?: boolean
}) {
  const formList: string[] = []
  const baseList: any[] = []
  const type = findAndLinkName({
    like: form.like,
    base,
    file,
    hold,
    need,
  })
  formList.push(type)
  return formList
}

function findAndLinkName({
  like,
  base,
  file,
  hold,
  need = false,
}: {
  like: string
  base: Base
  file: string
  hold: Hold
  need?: boolean
}): string {
  const type = castType(base, like)
  if (typeof type === 'string') {
    return type
  }

  const name = base.name[like]

  if (typeof name === 'string') {
    return name
  }

  const holdName = toPascalCase(like)
  const holdFile = hold.save[holdName]

  const load = (hold.load[file] ??= {})

  if (holdFile) {
    if (holdFile.form === 'list' || holdFile.form === 'hash') {
      load[holdName] = true
      return holdName
    }
  }

  const headName = makePascalName(like, need)

  load[headName] = true

  return headName
}

function makePascalName(base: string, need = false) {
  return `${toPascalCase(base)}${need ? '' : 'Optional'}`
}
