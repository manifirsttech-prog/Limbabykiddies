import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  noindex?: boolean;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const DEFAULT_DOMAIN = 'https://limbabykiddies.com';
const DEFAULT_TITLE = 'Limbaby Kiddies | Baby & Kids Products in Nigeria';
const DEFAULT_DESCRIPTION = 'Shop quality baby and kids clothing, shoes, toys, school bags, bicycles, water bottles and accessories at Limbaby Kiddies in Nigeria.';
const DEFAULT_KEYWORDS = 'baby products Nigeria, kids clothing Nigeria, baby shoes Nigeria, toys Nigeria, school bags kids Nigeria, bicycles kids Nigeria, baby accessories Lagos';
const DEFAULT_OG_IMAGE = `${DEFAULT_DOMAIN}/logo.png`;

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogTitle,
  ogDescription,
  ogType = 'website',
  noindex = false,
  jsonLd,
}: SEOProps) {
  const metaOgTitle = ogTitle || title;
  const metaOgDescription = ogDescription || description;
  const canonicalUrl = canonical 
    ? (canonical.startsWith('http') ? canonical : `${DEFAULT_DOMAIN}${canonical}`) 
    : DEFAULT_DOMAIN;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={metaOgTitle} />
      <meta property="og:description" content={metaOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Limbaby Kiddies" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaOgTitle} />
      <meta name="twitter:description" content={metaOgDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
