import React, { useEffect, useRef, memo } from 'react';

function EconomicCalendar() {
    const container = useRef();

    useEffect(() => {
        if (!container.current) return;

        // Clean up previous script if any
        container.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "colorTheme": "dark",
            "isTransparent": false,
            "width": "100%",
            "height": "100%",
            "locale": "es",
            "importanceFilter": "-1,0,1",
            "currencyFilter": "USD,EUR,GBP,JPY,AUD,CAD,CHF,NZD,CNY"
        });

        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'tradingview-widget-container__widget';
        widgetContainer.style.height = '100%';
        widgetContainer.style.width = '100%';

        container.current.appendChild(widgetContainer);
        container.current.appendChild(script);
    }, []);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%", minHeight: "600px" }}>
            {/* Widget will be injected here */}
        </div>
    );
}

export default memo(EconomicCalendar);
