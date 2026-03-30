<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { switchLocale, resolveAppLocale } from '@/i18n';

export interface LocaleOption {
    value: string;
    label: string;
    group?: string;
}

const props = withDefaults(
    defineProps<{
        modelValue: string;
        options: LocaleOption[];
        selectClass?: string;
        block?: boolean;
        displayLabel?: string;
        placeholder?: string;
        ariaLabel?: string;
    }>(),
    { selectClass: '', block: false, displayLabel: '', placeholder: '', ariaLabel: 'Language' }
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const open = ref(false);
const highlightIndex = ref(-1);
const containerRef = ref<HTMLElement | null>(null);
const listRef = ref<HTMLElement | null>(null);
const committedLocale = ref(props.modelValue);

watch(
    () => props.modelValue,
    (v) => {
        committedLocale.value = v;
    }
);

const selectedLabel = computed(() => {
    if (props.displayLabel) return props.displayLabel;
    const opt = props.options.find((o) => o.value === props.modelValue);
    return opt?.label ?? props.modelValue;
});

// Group options for rendering with headers
const groupedOptions = computed(() => {
    const result: { type: 'header' | 'option'; label: string; index: number }[] = [];
    let lastGroup: string | undefined;
    props.options.forEach((opt, i) => {
        if (opt.group && opt.group !== lastGroup) {
            result.push({ type: 'header', label: opt.group, index: -1 });
            lastGroup = opt.group;
        }
        result.push({ type: 'option', label: opt.label, index: i });
    });
    return result;
});

function toggle() {
    if (open.value) {
        close(true);
    } else {
        openDropdown();
    }
}

function openDropdown() {
    open.value = true;
    const idx = props.options.findIndex((o) => o.value === props.modelValue);
    highlightIndex.value = idx >= 0 ? idx : 0;
    nextTick(() => scrollToHighlighted());
}

function close(revert: boolean) {
    open.value = false;
    highlightIndex.value = -1;
    if (revert) {
        switchLocale(resolveAppLocale(committedLocale.value));
    }
}

function selectOption(index: number) {
    const opt = props.options[index];
    if (!opt) return;
    committedLocale.value = opt.value;
    emit('update:modelValue', opt.value);
    open.value = false;
    highlightIndex.value = -1;
    switchLocale(resolveAppLocale(opt.value));
}

function previewLocale(index: number) {
    highlightIndex.value = index;
    const opt = props.options[index];
    if (opt) {
        switchLocale(resolveAppLocale(opt.value));
    }
}

function onMouseLeaveList() {
    // Revert to committed locale while dropdown is still open
    switchLocale(resolveAppLocale(committedLocale.value));
    // Keep highlight for visual but revert language
}

function onKeydown(e: KeyboardEvent) {
    if (!open.value) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openDropdown();
        }
        return;
    }

    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            if (highlightIndex.value < props.options.length - 1) {
                previewLocale(highlightIndex.value + 1);
                nextTick(() => scrollToHighlighted());
            }
            break;
        case 'ArrowUp':
            e.preventDefault();
            if (highlightIndex.value > 0) {
                previewLocale(highlightIndex.value - 1);
                nextTick(() => scrollToHighlighted());
            }
            break;
        case 'Enter':
            e.preventDefault();
            if (highlightIndex.value >= 0) {
                selectOption(highlightIndex.value);
            }
            break;
        case 'Escape':
            e.preventDefault();
            close(true);
            break;
    }
}

function scrollToHighlighted() {
    if (!listRef.value) return;
    const el = listRef.value.querySelector('[data-highlighted="true"]') as HTMLElement | null;
    if (el) {
        el.scrollIntoView?.({ block: 'nearest' });
    }
}

function onClickOutside(e: MouseEvent) {
    if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
        close(true);
    }
}

onMounted(() => {
    document.addEventListener('mousedown', onClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onClickOutside);
});
</script>

<template>
    <div ref="containerRef" class="locale-preview-select" :class="{ 'locale-preview-select--block': block }" @keydown="onKeydown">
        <button type="button" class="locale-preview-select__trigger" :class="selectClass" :aria-label="ariaLabel" :aria-expanded="open" aria-haspopup="listbox" @click="toggle">
            <span class="locale-preview-select__label">{{ selectedLabel }}</span>
            <span class="locale-preview-select__arrow">&#9662;</span>
        </button>
        <ul v-show="open" ref="listRef" class="locale-preview-select__dropdown" role="listbox" @mouseleave="onMouseLeaveList">
            <template v-for="(row, ri) in groupedOptions" :key="ri">
                <li v-if="row.type === 'header'" class="locale-preview-select__group-header">{{ row.label }}</li>
                <li
                    v-else
                    role="option"
                    class="locale-preview-select__option"
                    :class="{ 'locale-preview-select__option--highlighted': highlightIndex === row.index, 'locale-preview-select__option--selected': options[row.index]?.value === modelValue }"
                    :data-highlighted="highlightIndex === row.index"
                    :aria-selected="options[row.index]?.value === modelValue"
                    @mouseenter="previewLocale(row.index)"
                    @click="selectOption(row.index)"
                >
                    {{ row.label }}
                </li>
            </template>
        </ul>
    </div>
</template>

<style scoped>
.locale-preview-select {
    position: relative;
    display: inline-block;
}

.locale-preview-select--block {
    display: block;
    width: 100%;
}

.locale-preview-select__trigger {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    border: 1px solid #ced4da;
    border-radius: 4px;
    padding: 4px 10px;
    font-size: 0.875rem;
    line-height: 1.25rem;
    background: inherit;
    color: inherit;
    text-align: left;
}

.locale-preview-select__trigger:focus {
    outline: none;
    border-color: #60a5fa;
}

.locale-preview-select__label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.locale-preview-select__arrow {
    flex-shrink: 0;
    font-size: 0.7em;
}

.locale-preview-select__dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 100%;
    width: max-content;
    max-height: 320px;
    overflow-y: auto;
    overflow-x: hidden;
    margin: 2px 0 0;
    padding: 0;
    list-style: none;
    border: 1px solid #6b7280;
    border-radius: 4px;
    background: #1f2937;
    color: #fff;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.locale-preview-select__group-header {
    padding: 6px 10px 4px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #9ca3af;
    cursor: default;
    border-top: 1px solid #374151;
}

.locale-preview-select__option {
    padding: 5px 10px;
    cursor: pointer;
    white-space: nowrap;
    font-size: 0.875rem;
}

.locale-preview-select__option--highlighted {
    background: #3b82f6;
    color: #fff;
}

.locale-preview-select__option--selected {
    font-weight: 600;
}
</style>
