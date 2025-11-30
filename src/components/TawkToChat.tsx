import { useEffect } from 'react';

const TawkToChat = () => {
  useEffect(() => {
    // Tawk.to Live Chat Widget
    const TAWK_PROPERTY_ID = '6764a682af5bfec1dbde8516';
    const TAWK_WIDGET_ID = '1ifgiks1e';

    // בדוק אם הסקריפט כבר נטען
    if (document.getElementById('tawk-to-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'tawk-to-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    document.body.appendChild(script);

    return () => {
      // ניקוי הסקריפט בעת unmount
      const existingScript = document.getElementById('tawk-to-script');
      if (existingScript) {
        existingScript.remove();
      }
      // הסר את הצ'אט widget
      const tawkWidget = document.getElementById('tawk-widget-container');
      if (tawkWidget) {
        tawkWidget.remove();
      }
    };
  }, []);

  return null; // הקומפוננטה לא מרנדרת כלום - הצ'אט מוסף באופן אוטומטי
};

export default TawkToChat;
