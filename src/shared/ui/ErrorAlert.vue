<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-vue-next'

type Props = {
  title?: string
  message: string
  showRetry?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Error',
  showRetry: false,
})

type Emits = {
  (e: 'retry'): void
}

const emit = defineEmits<Emits>()

const handleRetry = (): void => {
  emit('retry')
}
</script>

<template>
  <Alert variant="destructive" class="mb-4">
    <AlertCircle class="h-4 w-4" />
    <AlertTitle>{{ title }}</AlertTitle>
    <AlertDescription class="flex items-center justify-between gap-4">
      <span>{{ message }}</span>
      <Button v-if="showRetry" variant="outline" size="sm" @click="handleRetry"> Retry </Button>
    </AlertDescription>
  </Alert>
</template>
