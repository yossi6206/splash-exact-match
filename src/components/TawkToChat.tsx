import { useEffect } from 'react';

const TawkToChat = () => {
  useEffect(() => {
    // Chatwoot Live Chat Widget
    const BASE_URL = "https://chat.yositsupport.com";

    // בדוק אם הסקריפט כבר נטען
    if (document.getElementById('chatwoot-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'chatwoot-script';
    script.src = BASE_URL + "/packs/js/sdk.js";
    script.async = true;
    
    script.onload = function() {
      (window as any).chatwootSDK.run({
        websiteToken: 'B6cssDX4aH4BqGvV6PjFCwCE',
        baseUrl: BASE_URL
      });
    };
    
    document.body.appendChild(script);

    return () => {
      // ניקוי הסקריפט בעת unmount
      const existingScript = document.getElementById('chatwoot-script');
      if (existingScript) {
        existingScript.remove();
      }
      // הסר את הצ'אט widget
      const chatwootWidget = document.querySelector('.woot-widget-bubble');
      if (chatwootWidget) {
        chatwootWidget.remove();
      }
      const chatwootHolder = document.querySelector('.woot-widget-holder');
      if (chatwootHolder) {
        chatwootHolder.remove();
      }
      // נקה את chatwootSDK
      delete (window as any).chatwootSDK;
      delete (window as any).$chatwoot;
    };
  }, []);

  return null; // הקומפוננטה לא מרנדרת כלום - הצ'אט מוסף באופן אוטומטי
};

export default TawkToChat;
