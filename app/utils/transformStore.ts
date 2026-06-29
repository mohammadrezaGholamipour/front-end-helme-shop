import type { StoreOut, StoreUI } from "~/types";
export const transformStore = (data: StoreOut): StoreUI => {
    return {
        ...data,
        social: [
            { icon: 'instagram', link: data.instagram || '', name: 'اینستاگرام' },
            { icon: 'whatsapp', link: data.whatsapp || '', name: 'واتساپ' },
            { icon: 'telegram', link: data.telegram || '', name: 'تلگرام' },
            { icon: 'bale', link: data.bale || '', name: 'بله' },
            { icon: 'eita', link: data.eita || '', name: 'ایتا' },
            { icon: 'rubika', link: data.rubika || '', name: 'روبیکا' },
            { icon: 'phone', link: `tel:${data.phone.split(' - ')[0]}` || '', name: 'شماره تماس' },
            { icon: 'website', link: 'https://www.sohangaz.com', name: 'وبسایت' },
        ].filter(item => item.link),
        logo: '/images/helma-logo.webp',

    };
};