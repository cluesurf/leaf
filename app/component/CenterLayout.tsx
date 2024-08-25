import React, { ComponentType, useState } from 'react'
import AppCenterLayout, {
  AppCenterLayoutInput,
} from '~/component/layout/AppCenter'
import { Setting, Settings } from './useSettings'
import HomeIcon from '~/component/icon/Home'
// import ToolList from '../ToolList'
// import Footer from '../Footer'
// import Translations from '~/hook/useTranslations'
// import loadLocaleData, {
//   LocaleName,
//   parseLocale,
// } from '~/site/shared/base/value/translation'
import { useViewportLayout3Section } from '~/hook/useViewportLayout'
import {
  UseInteractionManagerShortcuts,
  useInteractionShortcuts,
} from '~/hook/useInteractionManager'
import SettingsOverlay from '~/component/SettingsOverlay'
// import SettingsTabs from '../SettingsTabs'
import { config, ConfigurationProvider } from '~/hook/useConfiguration'

export default function CenterLayout({
  messages,
  children,
  hideFooter,
  needs = ['FONT'],
  locale = 'en',
  form,
  code,
  onSave,
  onSubmit,
  onCopy,
  onPaste,
  onSelectAll,
  onFullscreen,
  onSettings,
  onEscape,
  onSearch,
  ...props
}: Omit<
  AppCenterLayoutInput,
  'middleOverlay' | 'onOpenSettings' | 'state'
> &
  UseInteractionManagerShortcuts & {
    needs?: Array<Setting>
    hideFooter?: boolean
    locale?: LocaleName
    form?: ComponentType<any>
    code?: ComponentType<any>
    messages?: Record<string, string>
  }) {
  const Form = form
  const Code = code

  const layout = useViewportLayout3Section()
  const [middleOverlay, setMiddleOverlay] = useState<React.ReactNode>()

  const right = null
  // props.right ??
  // (Form && (
  //   <div className="h-full w-full overflow-y-auto pb-64">
  //     <SettingsTabs
  //       form={<Form aside />}
  //       code={Code && <Code />}
  //     />
  //   </div>
  // ))

  useInteractionShortcuts({
    onSave,
    onSubmit,
    onCopy,
    onPaste,
    onSelectAll,
    onFullscreen,
    onSettings,
    onEscape,
    onSearch,
  })

  const handleOpenSettings =
    Form &&
    (() => {
      setMiddleOverlay(
        <SettingsOverlay onHide={() => setMiddleOverlay(undefined)}>
          <SettingsTabs form={<Form />} />
        </SettingsOverlay>,
      )
    })

  return (
    // <Translations
    //   messages={messages}
    //   load={loadLocaleData}
    //   locale={locale}
    //   parse={parseLocale}
    // >
    <ConfigurationProvider config={config}>
      <Settings needs={needs}>
        <AppCenterLayout
          {...props}
          right={right}
          state={layout}
          middleOverlay={middleOverlay}
          onOpenSettings={handleOpenSettings}
          // menuContent={<ToolList />}
          logo={<HomeIcon />}
        >
          <div className="relative pt-32 min-h-screen-minus-nav flex flex-col justify-between">
            <main className="relative flex-1">{children}</main>
            {/* {!hideFooter && <Footer />} */}
          </div>
        </AppCenterLayout>
      </Settings>
    </ConfigurationProvider>
    // </Translations>
  )
}
