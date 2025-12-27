import { Helmet } from "react-helmet-async";

interface SEOProps {
    title: string;
    description: string;
    name?: string;
    type?: string;
    image?: string;
    url?: string;
    keywords?: string[];
}

const SEO = ({ title, description, name = "Bridge Studio", type = "article", image, url, keywords }: SEOProps) => {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords?.join(", ") || "desarrollo de apps móviles, aplicaciones ios, aplicaciones android, software a la medida, bridge studio, méxico"} />
            <link rel="canonical" href={url || window.location.href} />

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}
            <meta property="og:url" content={url || window.location.href} />
            {/* End Facebook tags */}

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
            {/* End Twitter tags */}

            <script type="application/ld+json">
                {JSON.stringify(
                    type === "article" ? {
                        "@context": "https://schema.org",
                        "@type": "Article",
                        headline: title,
                        description: description,
                        image: image,
                        url: url || window.location.href,
                        keywords: keywords?.join(", "),
                        publisher: {
                            "@type": "Organization",
                            name: name,
                            url: "https://bridgestudio.mx",
                            logo: {
                                "@type": "ImageObject",
                                url: "https://bridgestudio.mx/logo.png"
                            }
                        },
                        author: {
                            "@type": "Organization",
                            name: name,
                            url: "https://bridgestudio.mx"
                        },
                        datePublished: new Date().toISOString(),
                        mainEntityOfPage: {
                            "@type": "WebPage",
                            "@id": url || window.location.href
                        }
                    } : {
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        name: title,
                        description: description,
                        url: url || window.location.href,
                        potentialAction: {
                            "@type": "SearchAction",
                            target: `${url || window.location.href}?q={search_term_string}`,
                            "query-input": "required name=search_term_string"
                        },
                        publisher: {
                            "@type": "Organization",
                            name: "Bridge Studio",
                            url: "https://bridgestudio.mx",
                            logo: {
                                "@type": "ImageObject",
                                url: "https://bridgestudio.mx/logo.png"
                            },
                            sameAs: [
                                "https://www.facebook.com/Bridgestudio.mx",
                                "https://www.instagram.com/bridgestudiomx",
                                "https://www.linkedin.com/company/bridge-studio-mx/"
                            ]
                        }
                    }
                )}
            </script>
        </Helmet>

    );
};

export default SEO;
