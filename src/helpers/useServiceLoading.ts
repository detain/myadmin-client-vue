import { watch, onUnmounted, type Ref } from 'vue';
import Swal from 'sweetalert2';
import { useI18n } from 'vue-i18n';

export function useServiceLoading(loading: Ref<boolean>) {
    const { t } = useI18n();

    watch(
        loading,
        (isLoading) => {
            if (isLoading) {
                Swal.fire({
                    html: t('common.labels.loading'),
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: () => Swal.showLoading(),
                });
            } else {
                Swal.close();
            }
        },
        { immediate: true }
    );

    onUnmounted(() => {
        if (loading.value) {
            Swal.close();
        }
    });
}
