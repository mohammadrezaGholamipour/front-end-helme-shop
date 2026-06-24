import { ref, onMounted, onUnmounted } from "vue";

export const useDateTime = () => {
    const dateTime = ref("");

    let interval: ReturnType<typeof setInterval>;

    const update = () => {
        const now = new Date();

        const datePart = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
            weekday: "long",
            day: "numeric",
            month: "long",
        }).format(now);

        const timePart = new Intl.DateTimeFormat("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }).format(now);

        dateTime.value = `${timePart} | ${datePart}`;
    };

    onMounted(() => {
        update();
        interval = setInterval(update, 1000);
    });

    onUnmounted(() => {
        clearInterval(interval);
    });

    return {
        time: computed(() => dateTime.value.split(" | ")[0]),
        date: computed(() => dateTime.value.split(" | ")[1]),
    };
};