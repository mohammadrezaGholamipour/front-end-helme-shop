import type { StoreUI } from '~/types';

export const useGlobalStore = defineStore('global', () => {
    const state = reactive({
        store: {} as StoreUI,
        loading: true
    })

    const setStores = (items: StoreUI) => { state.store = items }
    const setLoading = (status: boolean) => { state.loading = status }

    return { state, setStores, setLoading };
});
