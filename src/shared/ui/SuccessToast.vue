<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-vue-next';

type Props = {
  title?: string;
  message: string;
};

withDefaults(defineProps<Props>(), {
  title: 'Success',
});
</script>

<template>
  <Alert class="border-green-500 bg-green-50 text-green-900 mb-4">
    <CheckCircle2 class="h-4 w-4 text-green-600" />
    <AlertTitle>{{ title }}</AlertTitle>
    <AlertDescription>{{ message }}</AlertDescription>
  </Alert>
</template>
