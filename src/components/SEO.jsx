import { useEffect } from 'react';

const SEO = ({ 
  title = "Victor Achede // Engineer", 
  description = "Architecting high-performance web engines and real-time interfaces." 
}) => {
  useEffect(() => {
    // Set the page title
    document.title = title;

    // Set the meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, [title, description]);

  return null; // This component doesn't render anything to the DOM
};

export default SEO;