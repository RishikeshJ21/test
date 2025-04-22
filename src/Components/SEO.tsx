import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  status?: number;
  ogImage?: string;
  noindex?: boolean;
}

/**
 * SEO component for managing document head metadata and HTTP status codes
 */
export const SEO = ({
  title,
  description,
  canonical,
  status = 200,
  ogImage = '/Logotype.svg',
  noindex = false
}: SEOProps) => {
  // Set the correct HTTP status code for the response
  if (typeof window !== 'undefined' && status !== 200) {
    // This is a client-side way to simulate status codes
    // For true server status codes, this needs server-side rendering
    document.documentElement.setAttribute('data-status', status.toString());
  }

  const fullUrl = canonical ?
    (canonical.startsWith('http') ? canonical : `${window.location.origin}${canonical}`)
    : window.location.href;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={fullUrl} />
      <meta name="twitter:card" content="summary_large_image" />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {canonical && <link rel="canonical" href={fullUrl} />}

      {/* For status code handling in server environments */}
      <meta name="http-status" content={status.toString()} />
    </Helmet>
  );
};

export default SEO;