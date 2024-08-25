import { useAppSettings } from './useAppSettings'
import { useFonts } from './useConfiguration'
import { useText } from '~/component/Text'

export default function useAppFonts() {
  const { FONT } = useAppSettings()

  useFonts([
    FONT.NotoSansMono,
    FONT.ToneEtch,
    // FONT.NotoSansSC,
    // FONT.NotoSansTibetan,
  ])

  const [isStarting, isReady, hasWaited] = useText([
    'Noto Sans Mono',
    'ToneEtch',
  ])

  return isStarting || (isReady && hasWaited)
}
