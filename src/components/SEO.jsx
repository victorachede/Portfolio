import { useEffect } from 'react';

const SEO = ({ 
  title = "Victor Achede // Engineer", 
  description = "Architecting high-performance web engines and real-time interfaces." 
}) => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // 3. Update Social (OG) Tags
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', '/vic2.png');
    }
  }, [title, description]);

  return null; 
};

// THIS IS THE LINE YOU ARE MISSING:
export default SEO;