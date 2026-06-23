import type { StoreOut } from '~/types';

export const useGlobalStore = defineStore('global', () => {
    const state = reactive({
        store: {} as StoreOut
    })

    const setStores = (items: StoreOut) => { state.store = items }

    return { state, setStores, };
});
