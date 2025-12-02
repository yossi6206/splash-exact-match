import { useEffect } from 'react';

const TawkToChat = () => {
  useEffect(() => {
    console.log('TawkToChat: Component mounted, attempting to load Chatwoot...');
    
    // Chatwoot Live Chat Widget
    const BASE_URL = "https://chat.yositsupport.com";

    // בדוק אם הסקריפט כבר נטען
    if ((window as any).$chatwoot) {
      console.log('TawkToChat: Chatwoot already loaded');
      return;
    }

    // הגדר את chatwootSettings לפני טעינת הסקריפט
    (window as any).chatwootSettings = {
      hideMessageBubble: false,
      position: "right",
      locale: "he",
      type: "standard"
    };

    console.log('TawkToChat: Creating script element...');
    const script = document.createElement('script');
    script.id = 'chatwoot-script';
    script.src = BASE_URL + "/packs/js/sdk.js";
    script.async = true;
    script.defer = true;
    
    script.onload = function() {
      console.log('TawkToChat: Script loaded successfully');
      if ((window as any).chatwootSDK) {
        console.log('TawkToChat: Running chatwootSDK.run()');
        (window as any).chatwootSDK.run({
          websiteToken: 'B6cssDX4aH4BqGvV6PjFCwCE',
          baseUrl: BASE_URL
        });
      } else {
        console.error('TawkToChat: chatwootSDK not found after script load');
      }
    };

    script.onerror = function(e) {
      console.error('TawkToChat: Failed to load Chatwoot script', e);
    };
    
    console.log('TawkToChat: Appending script to head...');
    document.head.appendChild(script);
    console.log('TawkToChat: Script appended, URL:', script.src);

    return () => {
      console.log('TawkToChat: Component unmounting, cleaning up...');
      const existingScript = document.getElementById('chatwoot-script');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
};

export default TawkToChat;
