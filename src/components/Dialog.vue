<template>
    <el-dialog>
        <dialog  id="dialog" ref="dialogRef" aria-labelledby="dialog-title" class="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent">
            <el-dialog-backdrop class="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>
            <div tabindex="0" class="modal-open flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
                <el-dialog-panel class="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                    <slot name="dialog-conent"></slot>
                </el-dialog-panel>
            </div>
        </dialog>
    </el-dialog>
</template>
<script setup lang="ts">
    import { ref } from "vue";
    const dialogRef = ref<HTMLDialogElement | null>(null);
    const show = () => {
        if (dialogRef.value) {
            dialogRef.value.show();
        }
        document.body.style.overflow = "hidden";
    };
    const close = () => {
        if (dialogRef.value) {
            dialogRef.value.close();
        }
        document.body.style.overflow = "auto";
    };
    defineExpose({ show: show, close: close });
</script>
<style>

body.modal-open {
  overflow: hidden !important;
  overflow: hidden !important;
}

</style>