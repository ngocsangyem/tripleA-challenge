<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { getAccountBalance } from '@/shared/api'
import { required, accountId } from '@/shared/utils/validation'
import { formatMoney } from '@/shared/utils'
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
import { Wallet } from 'lucide-vue-next'
import type { Account } from '@/shared/types'

const loading = ref(false)
const error = ref<string | null>(null)
const account = ref<Account | null>(null)

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: {
    account_id: [required, accountId],
  },
})

const [accountIdField, accountIdAttrs] = defineField('account_id')

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  error.value = null
  account.value = null

  try {
    const result = await getAccountBalance(Number(values.account_id))
    account.value = result
  } catch (err: any) {
    error.value = err.message || 'Failed to retrieve account balance'
    account.value = null
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-2xl">Check Balance</CardTitle>
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

        <ErrorAlert v-if="error" :message="error" />

        <div
          v-if="account"
          class="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6"
        >
          <div class="flex items-center gap-3 mb-2">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
              <Wallet class="h-5 w-5 text-white" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Account #{{ account.account_id }}</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ formatMoney(account.balance) }}
              </p>
            </div>
          </div>
        </div>
      </form>
    </CardContent>

    <CardFooter>
      <Button type="submit" :disabled="loading" class="w-full" @click="onSubmit">
        <LoadingSpinner v-if="loading" class="mr-2 h-4 w-4" />
        <span v-else>Check Balance</span>
      </Button>
    </CardFooter>
  </Card>
</template>
