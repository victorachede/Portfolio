import { useEffect } from 'react';

const SEO = ({ 
  title = "Victor Achede // Engineer", 
  description = "Architecting high-performance web engines and real-time interfaces.",
  image = "https://victorachede.pxxl.click/vic2.png" // MUST BE ABSOLUTE
}) => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // 2. Helper function to update or create meta tags
    const setMetaTag = (attr, value, content, isProperty = false) => {
      let element = document.querySelector(`meta[${attr}="${value}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Update Standard & Social Tags
    setMetaTag('name', 'description', description);
    
    // Open Graph (Facebook / LinkedIn / WhatsApp)
    setMetaTag('property', 'og:title', title, true);
    setMetaTag('property', 'og:description', description, true);
    setMetaTag('property', 'og:image', image, true);
    setMetaTag('property', 'og:type', 'website', true);

    // Twitter
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);

  }, [title, description, image]);

  return null; 
};

export default SEO;