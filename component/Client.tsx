import Container from '~/component/Container'
import MicrosoftClarity from '~/component/script/Clarity'
import GA from '~/component/script/GA'
import { ViewportDimensions } from '~/hook/useViewportDimensions'
import Script from 'next/script'

export default function Client({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ViewportDimensions>
      <Container>
        <MicrosoftClarity />
        <GA />
        <Script id="disable-scroll-restoration">{`window.history.scrollRestoration = "manual"`}</Script>
        {children}
        {/* <Analytics /> */}
      </Container>
    </ViewportDimensions>
  )
}
