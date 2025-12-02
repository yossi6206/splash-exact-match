import { useEffect } from 'react';

const TawkToChat = () => {
  useEffect(() => {
    // Chatwoot Live Chat Widget
    const BASE_URL = "https://chat.yositsupport.com";

    // בדוק אם הסקריפט כבר נטען
    if ((window as any).$chatwoot) {
      return;
    }

    // הגדר את chatwootSettings לפני טעינת הסקריפט
    (window as any).chatwootSettings = {
      hideMessageBubble: false,
      position: "right",
      locale: "he",
      type: "standard"
    };

    const script = document.createElement('script');
    script.id = 'chatwoot-script';
    script.src = BASE_URL + "/packs/js/sdk.js";
    script.async = true;
    script.defer = true;
    
    script.onload = function() {
      if ((window as any).chatwootSDK) {
        (window as any).chatwootSDK.run({
          websiteToken: 'B6cssDX4aH4BqGvV6PjFCwCE',
          baseUrl: BASE_URL
        });
      }
    };

    script.onerror = function() {
      console.error('Failed to load Chatwoot script');
    };
    
    document.head.appendChild(script);

    return () => {
      // ניקוי בעת unmount
      const existingScript = document.getElementById('chatwoot-script');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
};

export default TawkToChat;
