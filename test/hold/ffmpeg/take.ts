import { z } from 'zod'

import {
  FfmpegAudioCodec,
  FfmpegSubtitleCodec,
  FfmpegVideoCodec,
} from '~/test/hold/ffmpeg'
import {
  FFMPEG_AUDIO_CODEC,
  FFMPEG_SUBTITLE_CODEC,
  FFMPEG_VIDEO_CODEC,
} from '~/test/hold/ffmpeg/base'

export const FfmpegAudioCodecParser = z.enum(
  FFMPEG_AUDIO_CODEC as readonly [string, ...string[]],
) as z.ZodType<FfmpegAudioCodec>

export const FfmpegSubtitleCodecParser = z.enum(
  FFMPEG_SUBTITLE_CODEC as readonly [string, ...string[]],
) as z.ZodType<FfmpegSubtitleCodec>

export const FfmpegVideoCodecParser = z.enum(
  FFMPEG_VIDEO_CODEC as readonly [string, ...string[]],
) as z.ZodType<FfmpegVideoCodec>
