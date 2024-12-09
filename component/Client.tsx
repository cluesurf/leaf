import Container from '~/component/Container'
import MicrosoftClarity from '~/component/script/Clarity'
import GA from '~/component/script/GA'
import { Viewport } from '~/hook/useViewport'
import Script from 'next/script'

export default function Client({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Viewport>
      <Container>
        <MicrosoftClarity />
        <GA />
        <Script id="disable-scroll-restoration">{`window.history.scrollRestoration = "manual"`}</Script>
        {children}
        {/* <Analytics /> */}
      </Container>
    </Viewport>
  )
}
