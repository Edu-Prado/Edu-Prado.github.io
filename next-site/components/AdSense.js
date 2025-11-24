import { useEffect } from 'react';

export default function AdSense({ slot, style = { display: 'block' }, format = 'auto', responsive = 'true' }) {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className="adsense-container my-8 text-center">
            <ins
                className="adsbygoogle"
                style={style}
                data-ad-client="ca-pub-7782077901383981"
                data-ad-slot={slot}
                data-ad-format={format}
                data-ad-full-width-responsive={responsive}
            />
        </div>
    );
}
