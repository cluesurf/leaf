import merge from 'lodash/merge'
import type { Metadata } from 'next'

export type CleanMetadata = Omit<Metadata, 'title'> & { title?: string }

export function buildMetadata(
  site: string,
  metadata: CleanMetadata,
): CleanMetadata {
  return merge(
    {},
    {
      openGraph: {
        siteName: site,
        // images: [{ url: post?.data?.url, width: 1200, height: 630 }], //make sure its a valid image url
      },
      twitter: {
        card: 'summary_large_image',
        site: '@termsurf',
        creator: '@termsurf',
        // images: [{ url: post?.data?.url, width: 1200, height: 630 }],
      },
      appleWebApp: {
        title: site,
        statusBarStyle: 'black-translucent',
        // startupImage: [
        //   '/assets/startup/apple-touch-startup-image-768x1004.png',
        //   {
        //     url: '/assets/startup/apple-touch-startup-image-1536x2008.png',
        //     media: '(device-width: 768px) and (device-height: 1024px)',
        //   },
        // ],
      },
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          url: '/view/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          url: '/view/favicon-16x16.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          url: '/view/apple-touch-icon.png',
        },
      ],
    },
    {
      openGraph: {
        title: metadata.title,
        description: metadata.description,
      },
      twitter: {
        title: metadata.title,
        description: metadata.description,
      },
    },
    metadata,
  )
}
