<script setup lang="ts">
import { computed } from 'vue';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
};

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  label: 'Loading...',
});

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };
  return sizes[props.size];
});
</script>

<template>
  <div class="flex items-center justify-center gap-2">
    <div
      :class="['animate-spin rounded-full border-primary border-t-transparent', sizeClasses]"
      role="status"
      aria-label="Loading"
    />
    <span v-if="label" class="text-sm text-muted-foreground">
      {{ label }}
    </span>
  </div>
</template>
