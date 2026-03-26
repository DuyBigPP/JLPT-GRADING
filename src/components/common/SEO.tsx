import { Helmet } from "react-helmet-async"

const SITE_NAME = "Chấm điểm JLPT"
const BASE_URL = "https://jlpt-grading.vercel.app"
const DEFAULT_DESCRIPTION =
  "Ứng dụng chấm điểm bài làm đề thi JLPT N1-N5. Tính điểm ước tính theo từng mondai, kiểm tra điều kiện đỗ và điểm liệt. Miễn phí, không cần đăng nhập."
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`

interface SEOProps {
  title?: string
  description?: string
  path?: string
  image?: string
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_IMAGE,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const canonicalUrl = `${BASE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}
