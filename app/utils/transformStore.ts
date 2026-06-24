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
        ].filter(item => item.link),
    };
};