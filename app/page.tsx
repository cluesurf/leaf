'use client'

import clsx from 'clsx'
import React, { useState } from 'react'
import Button from '~/component/Button'
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from '~/component/Content'
import HomeIcon from '~/component/icon/Home'
import AlertIcon from '~/component/icon/Alert'
import BackIcon from '~/component/icon/Back'
import CheckIcon from '~/component/icon/Check'
import Grid from '~/component/Grid'
import CloseIcon from '~/component/icon/Close'
import CopyIcon from '~/component/icon/Copy'
import DownloadIcon from '~/component/icon/Download'
import ExpandIcon from '~/component/icon/Expand'
import GearIcon from '~/component/icon/Gear'
import GitHubIcon from '~/component/icon/GitHub'
import MenuIcon from '~/component/icon/Menu'
import MessageIcon from '~/component/icon/Message'
import ScissorsIcon from '~/component/icon/Scissors'
import TriangleDownIcon from '~/component/icon/TriangleDown'
import TriangleUpIcon from '~/component/icon/TriangleUp'
import UserIcon from '~/component/icon/User'
import Input from '~/component/Input'
import Label from '~/component/Label'
import Field from '~/component/Field'
import Text from '~/component/Text'
import TriangleLeftIcon from '~/component/icon/TriangleLeft'
import TriangleRightIcon from '~/component/icon/TriangleRight'
import ListIcon from '~/component/icon/List'
import SearchIcon from '~/component/icon/Search'
import LinkIcon from '~/component/icon/Link'
import GridIcon from '~/component/icon/Grid'
import YouTubeIcon from '~/component/icon/YouTube'
import Link from 'next/link'
import XTwitterIcon from '~/component/icon/XTwitter'
import Gloss from '~/component/Gloss'
import List from '~/component/List'
import Switch from '~/component/Switch'
import Environment from './Environment'
import { FONT, SCRIPT } from '~/constant/settings'
import useFonts from '~/hook/useFonts'
import Loading from '~/component/Loading'
import FileDropzone from '~/component/FileDropzone'
import Dots from '~/component/Dots'
import SettingsOverlay from '~/component/SettingsOverlay'
import useScripts from '~/hook/useScripts'
import store from './redux'

const FONT_LIST = [
  'Noto Sans Mono',
  'Noto Sans SC',
  'Noto Serif Tibetan',
]

const NECESSARY_FONT_LIST = ['Noto Sans Mono' /*, 'Tone Etch']*/]

const BUTTON_COLORS = [
  'purple',
  'green',
  'blue',
  'red',
  'contrast',
] as const
const BUTTON_SIZES = ['small', 'medium', 'large'] as const

const filteredScripts = [
  {
    slug: 'latin',
    script: 'latin',
    name: 'Latin',
    symbol: 'A',
  },
  {
    slug: 'chinese',
    script: 'chinese',
    name: 'Chinese',
    symbol: '大',
  },
  {
    slug: 'arabic',
    script: 'arabic',
    name: 'Arabic',
    symbol: 'ح',
  },
  {
    slug: 'devanagari',
    script: 'devanagari',
    name: 'Devanagari',
    symbol: 'ॐ',
  },
  {
    slug: 'hebrew',
    script: 'hebrew',
    name: 'Hebrew',
    symbol: 'א',
  },
  {
    slug: 'tibetan',
    script: 'tibetan',
    name: 'Tibetan',
    symbol: 'ཀ',
  },
  {
    slug: 'tamil',
    script: 'tamil',
    name: 'Tamil',
    symbol: 'க',
  },
  {
    slug: 'greek',
    script: 'greek',
    name: 'Greek',
    symbol: 'Π',
  },
  {
    slug: 'telugu',
    script: 'telugu',
    name: 'Telugu',
    symbol: 'జ',
  },
]

function ControlledInput(props: any) {
  const [value, setValue] = useState('')
  return (
    <Input
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  )
}

function ControlledSwitch(props: any) {
  const [value, setValue] = useState(true)
  return (
    <Switch
      {...props}
      checked={value}
      onChange={setValue}
    />
  )
}

export default function Page() {
  // const handleHide
  // const [configuration, setConfiguration] = useState<React.ReactNode>(
  //   <SettingsOverlay onHide={}>
  //     <div className="bg-red-400 w-full h-256" />
  //   </SettingsOverlay>,
  // )

  return (
    <Environment
      // configuration={configuration}
      store={store}
      settings={{ fonts: FONT, scripts: SCRIPT }}
    >
      <Content />
    </Environment>
  )
}

function Content() {
  useFonts(NECESSARY_FONT_LIST)
  useScripts(filteredScripts.map(s => s.slug))

  useFonts(FONT_LIST)

  return (
    <>
      <H1 className="mt-64">Leaf</H1>
      <P>
        Welcome to TermSurf&apos;s Leaf UI kit. Here is an overview of
        the components. Click into each one to see variations.
      </P>
      <H2>Font</H2>
      <div className="p-16 flex flex-col gap-16">
        <Grid
          minWidth={160}
          gap={16}
          maxColumns={4}
          align="center"
        >
          {filteredScripts.map(script => (
            <ScriptLink
              key={script.slug}
              {...script}
            />
          ))}
        </Grid>
        {/* <Textext
          tag="div"
          size={24}
        >
          hello
        </Text> */}
        {/* <Text
          tag="div"
          script="chinese"
          size={32}
        >
          鉴于对人类家庭所有成员的固
        </Text> */}
        <Text
          tag="div"
          script="tibetan"
          size={32}
        >
          དགའ་ལྡན་
        </Text>
        <Body
          symbols={'Ⲁ Ⲃ Ⲅ Ⲇ Ⲉ Ⲋ Ⲍ Ⲑ Ⲗ Ⲝ Ⲡ Ⲯ ⲁ ⲃ ⲅ ⲇ ⲉ ⲋ ⲍ ⲑ ⲗ ⲝ ⲡ ⲯ'.split(
            /\s+/,
          )}
        />
      </div>
      <H2 className="flex justify-between cursor-pointer items-center">
        <span>Button</span>
        <Link href="/button">
          <span className="inline-block w-32 h-32 p-4 mr-12">
            <TriangleRightIcon />
          </span>
        </Link>
      </H2>
      <div className="flex flex-col gap-16 p-16">
        {BUTTON_SIZES.map(size => (
          <div
            key={size}
            className="flex justify-center gap-16"
          >
            {BUTTON_COLORS.map(color => (
              <Button
                key={color}
                size={size}
                color={color}
              >
                Button
              </Button>
            ))}
          </div>
        ))}
        {BUTTON_SIZES.map(size => (
          <div
            key={`ghost-${size}`}
            className="flex justify-center gap-16"
          >
            {BUTTON_COLORS.map(color => (
              <Button
                key={color}
                size={size}
                color={color}
                ghost
              >
                Ghost
              </Button>
            ))}
          </div>
        ))}
      </div>
      <H2>File Dropzone</H2>

      <div className="p-16">
        <FileDropzone
          simulateDragging
          color="base"
        >
          <Text>drop file</Text>
        </FileDropzone>
      </div>
      <H2>Loading</H2>

      <div className="p-16">
        <div className="bg-gray-800 w-64 h-32 flex justify-center items-center rounded-sm">
          <Dots />
        </div>
      </div>
      <H2>Icon</H2>
      <div className="p-16">
        <Grid
          maxColumns={12}
          minWidth={48}
          gap={16}
        >
          {[
            <HomeIcon key="HomeIcon" />,
            <AlertIcon key="AlertIcon" />,
            <BackIcon key="BackIcon" />,
            <CheckIcon key="CheckIcon" />,
            <CloseIcon key="CloseIcon" />,
            <CopyIcon key="CopyIcon" />,
            <DownloadIcon key="DownloadIcon" />,
            <ExpandIcon key="ExpandIcon" />,
            <GearIcon key="GearIcon" />,
            <GitHubIcon key="GitHubIcon" />,
            <MenuIcon key="MenuIcon" />,
            <MessageIcon key="MessageIcon" />,
            <ScissorsIcon key="ScissorsIcon" />,
            <TriangleUpIcon key="TriangleUpIcon" />,
            <TriangleRightIcon key="TriangleRightIcon" />,
            <TriangleDownIcon key="TriangleDownIcon" />,
            <TriangleLeftIcon key="TriangleLeftIcon" />,
            <UserIcon key="UserIcon" />,
            <ListIcon key="ListIcon" />,
            <SearchIcon key="SearchIcon" />,
            <LinkIcon key="LinkIcon" />,
            <GridIcon key="GridIcon" />,
            <YouTubeIcon key="YouTubeIcon" />,
            <XTwitterIcon key="XTwitterIcon" />,
          ].map((icon, i) => (
            <div
              key={i}
              className="flex justify-center"
            >
              <span className="inline-block w-48 h-48 rounded-full bg-gray-200 p-8">
                {icon}
              </span>
            </div>
          ))}
        </Grid>
      </div>
      <H2>Input</H2>
      <div className="p-16 flex flex-col gap-16">
        <Input
          labelled
          placeholder="Small"
        />
        <Grid
          maxColumns={5}
          gap={16}
          minWidth={80}
          breakpoints={[5, 3, 1]}
        >
          <Field>
            <Label color="base">Label</Label>
            <ControlledInput
              labelled
              color="base"
              placeholder="Small"
            />
          </Field>
          <Field>
            <Label color="green">Label</Label>
            <ControlledInput
              labelled
              placeholder="Small"
              color="green"
            />
          </Field>
          <Field>
            <Label color="purple">Label</Label>
            <ControlledInput
              labelled
              placeholder="Small"
              color="purple"
            />
          </Field>
          <Field>
            <Label color="blue">Label</Label>
            <ControlledInput
              labelled
              placeholder="Small"
              color="blue"
            />
          </Field>
          <Field>
            <Label color="red">Label</Label>
            <ControlledInput
              labelled
              placeholder="Small"
              color="red"
            />
          </Field>
        </Grid>
        <Grid
          maxColumns={5}
          gap={16}
          minWidth={80}
          breakpoints={[5, 3, 1]}
        >
          <Field>
            <Label color="base">Label</Label>
            <ControlledInput
              labelled
              color="base"
              placeholder="Large"
              size="large"
            />
          </Field>
          <Field>
            <Label color="green">Label</Label>
            <ControlledInput
              labelled
              placeholder="Large"
              size="large"
              color="green"
            />
          </Field>
          <Field>
            <Label color="purple">Label</Label>
            <ControlledInput
              labelled
              placeholder="Large"
              size="large"
              color="purple"
            />
          </Field>
          <Field>
            <Label color="blue">Label</Label>
            <ControlledInput
              labelled
              placeholder="Large"
              size="large"
              color="blue"
            />
          </Field>
          <Field>
            <Label color="red">Label</Label>
            <ControlledInput
              labelled
              placeholder="Large"
              size="large"
              color="red"
            />
          </Field>
        </Grid>
      </div>
      <H2>Header</H2>
      <div className="p-16">
        <H2>H2</H2>
        <H3>H3</H3>
        <H4>H4</H4>
        <H5>H5</H5>
        <H6>H6</H6>
      </div>
      <H2>Table</H2>
      <div>
        <Table>
          <THead>
            <TR>
              <TH align="left">x</TH>
              <TH>y</TH>
              <TH align="right">z</TH>
            </TR>
          </THead>
          <TBody>
            <TR>
              <TD>a</TD>
              <TD>b</TD>
              <TD>c</TD>
            </TR>
            <TR>
              <TD>a</TD>
              <TD>b</TD>
              <TD>c</TD>
            </TR>
            <TR>
              <TD>a</TD>
              <TD>b</TD>
              <TD>c</TD>
            </TR>
          </TBody>
        </Table>
      </div>
      <H2>Switch</H2>
      <div className="p-16">
        <div className="flex justify-center gap-16">
          <ControlledSwitch size="large" />
        </div>
        <div className="flex justify-center">
          <ControlledSwitch size="small" />
        </div>
      </div>
      <H2>List</H2>
      <List>
        <List.Item href="/button">Button</List.Item>
        <List.Item>Foo bar</List.Item>
      </List>
      <H2>Gloss</H2>
      <List>
        <Gloss
          english="It is quickly eating a big apple."
          original="vala vuti kik reC grozi nif brat tapraka."
        />
        <Gloss
          english="It will have quickly eaten the apple."
          original="vala wid haz sup kik grozi dan tapraka."
        />
        <Gloss
          english="I was having doubts."
          original="suqa sup vut reC hazi yas skana."
        />
        <Gloss
          english="The swimming ducks overheard the dirt-covered black bear."
          original="dan reC swamo yas barva sup tub hiri dan dorta sup kovo vego nuqka."
        />
        <Gloss
          english="The red-headed sparrow plucked recently ripened berries."
          original="dan red hedo pasera sup plaki sorge sup baxali yas bariqa."
        />
        <Gloss
          english="The brightly lit screen has been shining for a long time."
          original="dan britane sup mari skrina sup haz vut reC xayni foru nif nuc kala."
        />
        <Gloss
          english="I saw the rock just under them."
          original="popa sup visi dan raka jas bito pema."
        />
        <Gloss
          english="The tree back behind us is taller and heavier than me."
          original="dan dipa lus lusu biba vuti mor talso jonu mor drasko Canu popa."
        />
        <Gloss
          english="I am connected to my experience."
          original="popa vuti dax bido palu bak pop siza."
        />
        <Gloss
          english="I saw the ants go get them."
          original="popa sup visi dan yas formika buq geti pema."
        />
        <Gloss
          english="The way they came over was weird."
          original="dan weka pema tube sup komi sup vuti wirdo."
        />
        <Gloss
          english="They had some interesting info."
          original="pema sup hazi sam reC triso vica."
        />
        <Gloss
          english="I could not wait to eventually see."
          original="popa nun kud weti palu sive visi."
        />
        <Gloss
          english="The bear goes hunting."
          original="dan nuqka buqi reC hanti."
        />
        <Gloss
          english="Yesterday I went swimming."
          original="last yoma popa sup buqi reC swami."
        />
        <Gloss
          english="Every molecule of water contributes to the vastness of the ocean."
          original="hez mala xal sloCa kontribi palu dan vast daxa xal dan vruna."
        />
      </List>
    </>
  )
}

function Body({
  symbols,
  fontSize,
}: {
  symbols: Array<string>
  fontSize?: number
}) {
  return (
    <>
      <div className="relative w-full pb-64 flex flex-col gap-16 p-16">
        <Grid
          minWidth={256}
          gap={16}
          maxColumns={3}
          breakpoints={[3, 1]}
        >
          <FontLink
            className="text-center"
            slug="chinese/fonts/handwritten"
            name="Handwritten"
            // font="TW Kai"
            sample={symbols}
            fontSize={fontSize}
          />
          <FontLink
            className="text-center"
            slug="chinese/fonts/traditional"
            name="Traditional"
            // font="Noto Serif SC"
            sample={symbols}
            fontSize={fontSize}
          />
          <FontLink
            className="text-center"
            slug="chinese/fonts/modern"
            name="Modern"
            // font="Noto Sans SC"
            sample={symbols}
            fontSize={fontSize}
          />
        </Grid>
      </div>
    </>
  )
}

function FontLink({
  className,
  slug,
  name,
  font,
  sample,
  disabled = false,
  weight,
  fontSize,
}: {
  className?: string
  slug: string
  name: string
  font?: string
  disabled?: boolean
  sample?: Array<string>
  weight?: string
  fontSize?: number
}) {
  return (
    <div
      className={clsx(
        className,
        'shadow-small1 hover:shadow-small2 flex flex-col gap-16 bg-gray-50 [&_span]:hover:text-violet-600 [&_span]:transition-colors transition-all duration-200 text-left p-16 pb-32 h-full rounded-sm w-full [&_i]:hover:text-violet-400',
      )}
    >
      <Text className="lowercase block font-semibold text-h4 transition-colors">
        {name}
      </Text>
      {sample && (
        <Grid
          // script={script}
          className="text-h1 text-gray-800"
          minWidth={48}
          gap={8}
          rowGap={24}
          maxColumns={6}
          breakpoints={[6, 4]}
          align="center"
        >
          {sample.slice(0, 24).map((glyph, i) => (
            <Text
              key={`${glyph}-${i}`}
              font={font}
              tag="i"
              size={fontSize}
              className={clsx(
                'transition-colors block !leading-1-2',
                weight && `font-${weight}`,
              )}
            >
              {glyph}
            </Text>
          ))}
        </Grid>
      )}
    </div>
  )
}

function ScriptLink({
  className,
  slug,
  name,
  script,
  symbol,
  disabled = false,
  weight,
}: {
  className?: string
  slug: string
  name: string
  script?: string
  disabled?: boolean
  symbol?: string
  weight?: string
}) {
  if (disabled) {
    return (
      <div
        className={clsx(
          className,
          'overflow-hidden shadow-small1 flex flex-col bg-gray-100 text-left p-16 h-full rounded-sm w-full',
        )}
      >
        {symbol && (
          <Text
            script={script}
            tag="i"
            className={clsx(
              weight && `font-${weight}`,
              'block text-mega sm:text-mega-large text-gray-800 h-156',
            )}
          >
            {symbol}
          </Text>
        )}
        <Text className="block font-semibold lowercase text-base sm:text-base-large text-gray-500">
          {name}
        </Text>
      </div>
    )
  }

  return (
    <Link
      href={`/scripts/${slug}`}
      className={clsx(
        className,
        'overflow-hidden text-center shadow-small1 hover:shadow-small2 flex flex-col bg-gray-50 [&>div]:hover:text-violet-600 [&>div]:transition-colors transition-all duration-200 p-16 h-full rounded-sm [&_span]:hover:text-violet-600 [&_i]:hover:text-violet-600',
      )}
    >
      {symbol && (
        <Text
          script={script}
          tag="i"
          className={clsx(
            weight && `font-${weight}`,
            'block text-mega sm:text-mega-large text-gray-800 transition-colors h-156',
          )}
        >
          {symbol}
        </Text>
      )}
      <Text className="block font-semibold lowercase text-lg sm:text-lg-large text-gray-500 transition-colors">
        {name}
      </Text>
    </Link>
  )
}
