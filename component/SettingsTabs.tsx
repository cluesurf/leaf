import * as Tabs from '@radix-ui/react-tabs'
import T from '~/component/Text'

export default function SettingsTabs({
  form,
  code,
}: {
  form: React.ReactNode
  code?: React.ReactNode
}) {
  if (!code) {
    return form
  }

  return (
    <Tabs.Root
      className=""
      defaultValue="formTab"
    >
      <Tabs.List
        className="flex"
        aria-label="Settings"
      >
        <Tabs.Trigger
          className="px-16 py-8 flex-1 text-center bg-zinc-50 radix-state-active:bg-zinc-200"
          value="formTab"
        >
          <T>Form</T>
        </Tabs.Trigger>
        <Tabs.Trigger
          className="px-16 py-8 flex-1 text-center bg-zinc-50 radix-state-active:bg-zinc-200"
          value="codeTab"
        >
          <T>Code</T>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        className=""
        value="formTab"
      >
        {form}
      </Tabs.Content>
      <Tabs.Content
        className=""
        value="codeTab"
      >
        {code}
      </Tabs.Content>
    </Tabs.Root>
  )
}
