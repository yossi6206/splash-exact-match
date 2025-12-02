import { useEffect } from 'react';

const TawkToChat = () => {
  useEffect(() => {
    const BASE_URL = "https://chat.yositsupport.com";
    
    // בדוק אם כבר נטען
    if (document.getElementById('chatwoot-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'chatwoot-script';
    script.async = true;
    script.innerHTML = `
      (function(d,t) {
        var BASE_URL="${BASE_URL}";
        var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
        g.src=BASE_URL+"/packs/js/sdk.js";
        g.async = true;
        s.parentNode.insertBefore(g,s);
        g.onload=function(){
          window.chatwootSDK.run({
            websiteToken: 'B6cssDX4aH4BqGvV6PjFCwCE',
            baseUrl: BASE_URL
          })
        }
      })(document,"script");
    `;
    
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById('chatwoot-script');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
};

export default TawkToChat;
