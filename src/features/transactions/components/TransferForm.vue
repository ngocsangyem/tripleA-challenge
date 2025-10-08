<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { executeTransfer } from '@/shared/api'
import { required, accountId, moneyAmount } from '@/shared/utils/validation'
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
  CardDescription,
} from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ArrowRightLeft, CheckCircle2 } from 'lucide-vue-next'

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const lastTransfer = ref<{ source: number; destination: number; amount: string } | null>(null)

const { defineField, handleSubmit, resetForm } = useForm({
  validationSchema: {
    source_account_id: [required, accountId],
    destination_account_id: [required, accountId],
    amount: [required, moneyAmount],
  },
})

const [sourceAccountField, sourceAccountAttrs] = defineField('source_account_id')
const [destinationAccountField, destinationAccountAttrs] = defineField('destination_account_id')
const [amountField, amountAttrs] = defineField('amount')

// Custom validation for ensuring accounts are different
const validateDifferentAccounts = (): string | true => {
  const source = sourceAccountField.value
  const destination = destinationAccountField.value

  if (!source || !destination) {
    return true
  }

  if (source === destination) {
    return 'Source and destination accounts must be different'
  }

  return true
}

const onSubmit = handleSubmit(async (values) => {
  // Additional validation for different accounts
  const differentAccountsCheck = validateDifferentAccounts()
  if (differentAccountsCheck !== true) {
    error.value = differentAccountsCheck
    return
  }

  loading.value = true
  error.value = null
  success.value = false

  // Save the transfer details BEFORE making API call and resetting form
  const transferDetails = {
    source: Number(values.source_account_id),
    destination: Number(values.destination_account_id),
    amount: values.amount,
  }

  try {
    await executeTransfer({
      source_account_id: transferDetails.source,
      destination_account_id: transferDetails.destination,
      amount: transferDetails.amount,
    })

    // Set the saved transfer details for display
    lastTransfer.value = transferDetails
    success.value = true
    
    // Reset form after successful transfer
    resetForm()

    // Hide success message after 5 seconds
    setTimeout(() => {
      success.value = false
      lastTransfer.value = null
    }, 5000)
  } catch (err: any) {
    error.value = err.message || 'Failed to execute transfer'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center gap-3">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
          <ArrowRightLeft class="h-6 w-6 text-white" />
        </div>
        <div>
          <CardTitle class="text-2xl">Transfer Funds</CardTitle>
          <CardDescription>Move money between accounts</CardDescription>
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <form @submit="onSubmit" class="space-y-6">
        <FormField v-slot="{ componentField }" name="source_account_id">
          <FormItem>
            <FormLabel>From Account</FormLabel>
            <FormControl>
              <Input v-bind="{ ...componentField, ...sourceAccountAttrs }" v-model="sourceAccountField" type="text"
                placeholder="e.g., 123" :disabled="loading" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="destination_account_id">
          <FormItem>
            <FormLabel>To Account</FormLabel>
            <FormControl>
              <Input v-bind="{ ...componentField, ...destinationAccountAttrs }" v-model="destinationAccountField"
                type="text" placeholder="e.g., 456" :disabled="loading" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="amount">
          <FormItem>
            <FormLabel>Amount</FormLabel>
            <FormControl>
              <Input v-bind="{ ...componentField, ...amountAttrs }" v-model="amountField" type="text"
                placeholder="e.g., 100.00" :disabled="loading" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <ErrorAlert v-if="error" :message="error" />

        <div v-if="success && lastTransfer" class="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <div class="flex items-center gap-2 text-green-800">
            <CheckCircle2 class="h-5 w-5" />
            <span class="font-medium">Transfer completed successfully!</span>
          </div>
          <div class="space-y-1 text-sm text-green-700">
            <div class="flex justify-between">
              <span class="text-gray-600">From:</span>
              <span class="font-medium">Account #{{ lastTransfer.source }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">To:</span>
              <span class="font-medium">Account #{{ lastTransfer.destination }}</span>
            </div>
            <div class="flex justify-between border-t border-green-200 pt-2">
              <span class="text-gray-600">Amount:</span>
              <span class="font-bold text-green-800">{{ formatMoney(lastTransfer.amount) }}</span>
            </div>
          </div>
        </div>
      </form>
    </CardContent>

    <CardFooter>
      <Button type="submit" :disabled="loading" class="w-full" @click="onSubmit">
        <LoadingSpinner v-if="loading" class="mr-2 h-4 w-4" />
        <span v-else>Transfer Funds</span>
      </Button>
    </CardFooter>
  </Card>
</template>
