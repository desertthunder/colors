<script setup lang="ts">
import { computed, watchEffect } from 'vue'

const SITE_ORIGIN = 'https://colors.desertthunder.dev'

type TwitterCard = 'summary' | 'summary_large_image' | 'player' | 'app'

type Meta = { title: string; description: string; url?: string }

type OG = {
  image?: string
  type?: string
  siteName?: string
  card?: TwitterCard
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
}

type HelmetProps = Meta & OG

const props = withDefaults(defineProps<HelmetProps>(), {
  url: SITE_ORIGIN,
  image: '/og.png',
  type: 'website',
  siteName: 'Colors',
  card: 'summary_large_image',
  imageAlt: 'Colors — a practical little color palette viewer.',
  imageWidth: 1200,
  imageHeight: 630,
})

const canonicalUrl = computed(() => toAbsolute(props.url, SITE_ORIGIN))
const imageUrl = computed(() => toAbsolute(props.image, SITE_ORIGIN))

watchEffect(() => {
  const { title, description, type, siteName, card, imageAlt, imageWidth, imageHeight } = props

  document.title = title
  setLink('canonical', canonicalUrl.value)

  setMeta({ name: 'description', content: description })

  setMeta({ property: 'og:title', content: title })
  setMeta({ property: 'og:description', content: description })
  setMeta({ property: 'og:url', content: canonicalUrl.value })
  setMeta({ property: 'og:type', content: type })
  setMeta({ property: 'og:site_name', content: siteName })
  setMeta({ property: 'og:image', content: imageUrl.value })
  setMeta({ property: 'og:image:width', content: String(imageWidth) })
  setMeta({ property: 'og:image:height', content: String(imageHeight) })
  setMeta({ property: 'og:image:alt', content: imageAlt })

  setMeta({ name: 'twitter:card', content: card })
  setMeta({ name: 'twitter:title', content: title })
  setMeta({ name: 'twitter:description', content: description })
  setMeta({ name: 'twitter:image', content: imageUrl.value })
  setMeta({ name: 'twitter:image:alt', content: imageAlt })
})

function toAbsolute(value: string, base: string): string {
  if (/^https?:\/\//i.test(value)) return value
  try {
    return new URL(value, base).toString()
  } catch {
    return value
  }
}

function setMeta(attrs: { name?: string; property?: string; content: string }): void {
  const key = attrs.name ?? attrs.property ?? ''
  const selector = attrs.name ? `meta[name="${key}"]` : `meta[property="${key}"]`
  let meta = document.head.querySelector<HTMLMetaElement>(selector)
  if (!meta) {
    meta = document.createElement('meta')
    if (attrs.name) meta.name = attrs.name
    else if (attrs.property) meta.setAttribute('property', attrs.property)
    document.head.appendChild(meta)
  }
  meta.content = attrs.content
}

function setLink(rel: string, href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    document.head.appendChild(link)
  }
  link.href = href
}
</script>
