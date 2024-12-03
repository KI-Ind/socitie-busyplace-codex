'use client';

interface JsonLdProps {
  organizationData?: any;
  breadcrumbData?: any;
  localBusinessData?: any;
}

export function JsonLd({ organizationData, breadcrumbData, localBusinessData }: JsonLdProps) {
  const baseOrganizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://societe.busyplace.fr/#organization",
    "name": "SocieteBusyplace",
    "url": "https://societe.busyplace.fr",
    "logo": {
      "@type": "ImageObject",
      "url": "https://societe.busyplace.fr/images/newlogo.svg",
      "width": 112,
      "height": 112,
      "caption": "Logo SocieteBusyplace"
    },
    "description": "Trouvez des informations détaillées sur les entreprises françaises, leurs dirigeants et suivez leurs actualités.",
    "sameAs": [
      "https://twitter.com/societebusyplace",
      "https://www.linkedin.com/company/societebusyplace",
      "https://www.facebook.com/societebusyplace"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "FR",
      "addressLocality": "Paris",
      "addressRegion": "Île-de-France",
      "postalCode": "75000"
    }
  };

  const baseLocalBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://societe.busyplace.fr/#localbusiness",
    "name": "SocieteBusyplace",
    "image": "https://societe.busyplace.fr/images/og-image.jpg",
    "url": "https://societe.busyplace.fr",
    "telephone": "+33000000000",
    "priceRange": "€€",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "FR",
      "addressLocality": "Paris",
      "addressRegion": "Île-de-France",
      "postalCode": "75000"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "48.8566",
      "longitude": "2.3522"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData || baseOrganizationData)
        }}
      />
      {breadcrumbData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData)
          }}
        />
      )}
      {localBusinessData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessData || baseLocalBusinessData)
          }}
        />
      )}
    </>
  );
}
