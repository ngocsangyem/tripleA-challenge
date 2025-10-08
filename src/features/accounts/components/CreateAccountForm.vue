<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { createAccount } from '@/shared/api'
import { required, accountId, moneyAmount } from '@/shared/utils/validation'
import { LoadingSpinner, ErrorAlert } from '@/shared/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { CheckCircle2 } from 'lucide-vue-next'

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: {
    account_id: [required, accountId],
    initial_balance: [required, moneyAmount],
  },
})

const [accountIdField, accountIdAttrs] = defineField('account_id')
const [initialBalanceField, initialBalanceAttrs] = defineField('initial_balance')

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  error.value = null
  success.value = false

  try {
    await createAccount({
      account_id: Number(values.account_id),
      initial_balance: values.initial_balance,
    })

    success.value = true
    resetForm()

    // Hide success message after 3 seconds
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (err: any) {
    error.value = err.message || 'Failed to create account'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-2xl">Create Account</CardTitle>
    </CardHeader>

    <CardContent>
      <form @submit="onSubmit" class="space-y-6">
        <FormField v-slot="{ componentField }" name="account_id">
          <FormItem>
            <FormLabel>Account ID</FormLabel>
            <FormControl>
              <Input
                v-bind="{ ...componentField, ...accountIdAttrs }"
                v-model="accountIdField"
                type="text"
                placeholder="e.g., 123"
                :disabled="loading"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="initial_balance">
          <FormItem>
            <FormLabel>Initial Balance</FormLabel>
            <FormControl>
              <Input
                v-bind="{ ...componentField, ...initialBalanceAttrs }"
                v-model="initialBalanceField"
                type="text"
                placeholder="e.g., 1000.00"
                :disabled="loading"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <ErrorAlert v-if="error" :message="error" />

        <div
          v-if="success"
          class="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800"
        >
          <CheckCircle2 class="h-5 w-5" />
          <span class="text-sm font-medium">Account created successfully!</span>
        </div>
      </form>
    </CardContent>

    <CardFooter>
      <Button type="submit" :disabled="loading" class="w-full" @click="onSubmit">
        <LoadingSpinner v-if="loading" class="mr-2 h-4 w-4" />
        <span v-else>Create Account</span>
      </Button>
    </CardFooter>
  </Card>
</template>
