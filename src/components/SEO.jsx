import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Generates the JSON-LD schema data for Google's rich snippets.
 * This is crucial for strong SEO and better presentation in search results.
 */
const generateSchemaData = (title, description, name, absoluteOgUrl, absoluteOgImage) => {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                // 1. Person Schema: Identifies you (Victor Achede)
                "@type": "Person",
                "name": name,
                "url": absoluteOgUrl,
                "image": absoluteOgImage,
                "sameAs": [
                    // IMPORTANT: REPLACE THESE WITH YOUR ACTUAL SOCIAL LINKS!
                    "https://www.linkedin.com/in/victorachede", 
                    "https://github.com/Vic16-tech", 
                    "https://x.com/KiddosNG" 
                ],
                "jobTitle": "Fullstack Developer & Designer",
                "worksFor": {
                    "@type": "Organization",
                    "name": "Asuir" // Assuming Asuir is your organization/brand
                }
            },
            {
                // 2. WebSite Schema: Identifies the portfolio site
                "@type": "WebSite",
                "url": absoluteOgUrl,
                "name": title,
                "description": description,
                "publisher": {
                    "@id": `${absoluteOgUrl}#person` // Links to the Person schema above
                },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${absoluteOgUrl}?s={search_term_string}`,
                    "query-input": "required name=search_term_string"
                }
            }
        ]
    };
};


const SEO = ({
    title = "Victor A. | Fullstack Developer & Designer", // Default title for your portfolio
    description = "I'm Victor, a fullstack developer and designer building high-impact, elegant digital experiences with React, Node.js, Firebase, and Tailwind CSS. Open for internships and freelance projects.", // Default description
    name = "Victor Achede", // Your full name
    type = "website", // Type of content (e.g., website, article, profile)
    keywords = "Victor Achede, fullstack developer, web developer, React, Node.js, Firebase, Tailwind CSS, portfolio, web design, freelance, internships, Nigeria, Asuir, hire developer", // Updated keywords for maximum reach
    ogImage = "/og.png", // Path to your Open Graph image in the public folder
    ogUrl = "https://victor.pxxl.click", // UPDATED: Your primary custom domain!
    twitterHandle = "@victorachede" // Added specific twitter handle for better targeting
}) => {
    
    // Ensure absolute URLs are correctly constructed
    const absoluteOgUrl = ogUrl.startsWith('http') ? ogUrl : `https://${ogUrl}`;
    const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${absoluteOgUrl}${ogImage}`;

    const schemaData = generateSchemaData(title, description, name, absoluteOgUrl, absoluteOgImage);

    return (
        <Helmet>
            {/* 1. Primary Meta Tags for SEO */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={absoluteOgUrl} /> {/* Canonical URL is vital */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" /> {/* Mobile SEO */}

            {/* 2. Structured Data (JSON-LD) for Rich Snippets */}
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>

            {/* 3. Open Graph / Social Media Cards (INTACT) */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={absoluteOgUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={absoluteOgImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:locale" content="en_US" /> {/* Added locale */}

            {/* 4. Twitter Card Meta Tags (INTACT) */}
            <meta name="twitter:card" content="summary_large_image" />
            {/* Uses the specific handle for the creator tag */}
            <meta name="twitter:creator" content={twitterHandle} /> 
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteOgImage} />

            {/* 5. Favicons */}
            <link rel="icon" href="/favicon.ico" sizes="any" /> 
            <link rel="icon" href="/favicon 16x16.png" type="image/svg+xml" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> 
            <link rel="manifest" href="/site.webmanifest" /> {/* Best practice for manifest link */}

        </Helmet>
    );
};

export default SEO;