'use client'

import Button, { IconButton, LinkButton } from '~/component/Button'
import CenterLayout from './component/CenterLayout'
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
import TextInput from '~/component/TextInput'
import Label from '~/component/Label'
import Field from '~/component/Field'
import { useState } from 'react'
import Text from '~/component/Text'
import { useFonts } from '~/hook/useConfiguration'
import { DEFAULT_SETTINGS } from '~/constant/setting'
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

const BUTTON_COLORS = [
  'purple',
  'green',
  'blue',
  'red',
  'contrast',
] as const
const BUTTON_SIZES = ['small', 'medium', 'large'] as const

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
  return (
    <CenterLayout>
      <Content />
    </CenterLayout>
  )
}

function Content() {
  useFonts([
    DEFAULT_SETTINGS.fonts.NotoSansSC,
    DEFAULT_SETTINGS.fonts.NotoSerifTibetan,
  ])

  return (
    <>
      <H1>Leaf</H1>
      <P>
        Welcome to TermSurf's Leaf UI kit. Here is an overview of the
        components. Click into each one to see variations.
      </P>
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
      <H2>Icon</H2>
      <div className="p-16">
        <Grid
          maxColumns={12}
          minWidth={48}
          gap={16}
        >
          {[
            <HomeIcon />,
            <AlertIcon />,
            <BackIcon />,
            <CheckIcon />,
            <CloseIcon />,
            <CopyIcon />,
            <DownloadIcon />,
            <ExpandIcon />,
            <GearIcon />,
            <GitHubIcon />,
            <MenuIcon />,
            <MessageIcon />,
            <ScissorsIcon />,
            <TriangleUpIcon />,
            <TriangleRightIcon />,
            <TriangleDownIcon />,
            <TriangleLeftIcon />,
            <UserIcon />,
            <ListIcon />,
            <SearchIcon />,
            <LinkIcon />,
            <GridIcon />,
            <YouTubeIcon />,
            <XTwitterIcon />,
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
      <H2>Font</H2>
      <div className="p-16">
        <Text
          tag="div"
          size={24}
        >
          hello
        </Text>
        <Text
          tag="div"
          script="chinese"
          size={32}
        >
          鉴于对人类家庭所有成员的固
        </Text>
        <Text
          tag="div"
          script="tibetan"
          size={32}
        >
          དགའ་ལྡན་
        </Text>
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
