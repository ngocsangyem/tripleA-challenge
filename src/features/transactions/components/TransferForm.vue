<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { executeTransfer } from '@/shared/api'
import { required, accountId, moneyAmount } from '@/shared/utils/validation'
import { formatMoney } from '@/shared/utils'
import { LoadingSpinner } from '@/shared/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'

const emit = defineEmits<{
  transferCompleted: []
}>()

const sourceAccountInputRef = ref<HTMLInputElement | null>(null)

// Auto-focus on first input when component mounts
onMounted(() => {
  setTimeout(() => {
    if (sourceAccountInputRef.value && typeof sourceAccountInputRef.value.focus === 'function') {
      sourceAccountInputRef.value.focus()
    }
  }, 100)
})

const loading = ref(false)

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
    toast.error('Validation error', {
      description: differentAccountsCheck,
    })
    return
  }

  loading.value = true

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

    toast.success('Transfer completed successfully!', {
      description: `${formatMoney(transferDetails.amount)} transferred from Account #${transferDetails.source} to Account #${transferDetails.destination}`,
    })

    // Reset form after successful transfer
    resetForm()
    emit('transferCompleted')
  } catch (err: any) {
    toast.error('Transfer failed', {
      description: err.message || 'An error occurred while processing the transfer',
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Card data-cy="transfer-form-card">
    <CardContent>
      <form @submit="onSubmit" class="space-y-6">
        <FormField v-slot="{ componentField }" name="source_account_id">
          <FormItem>
            <FormLabel>From Account</FormLabel>
            <FormControl>
              <Input ref="sourceAccountInputRef" v-bind="{ ...componentField, ...sourceAccountAttrs }"
                v-model="sourceAccountField" type="text" placeholder="e.g., 123" :disabled="loading"
                data-cy="transfer-form-source-account-input" />
            </FormControl>
            <FormDescription>Account ID to transfer funds from</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="destination_account_id">
          <FormItem>
            <FormLabel>To Account</FormLabel>
            <FormControl>
              <Input v-bind="{ ...componentField, ...destinationAccountAttrs }" v-model="destinationAccountField"
                type="text" placeholder="e.g., 456" :disabled="loading"
                data-cy="transfer-form-destination-account-input" />
            </FormControl>
            <FormDescription>Account ID to receive the funds</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="amount">
          <FormItem>
            <FormLabel>Amount</FormLabel>
            <FormControl>
              <Input v-bind="{ ...componentField, ...amountAttrs }" v-model="amountField" type="text"
                placeholder="e.g., 100.00" :disabled="loading" data-cy="transfer-form-amount-input" />
            </FormControl>
            <FormDescription>Amount to transfer (decimal format)</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </form>
    </CardContent>

    <CardFooter>
      <Button type="submit" :disabled="loading" class="w-full" @click="onSubmit" data-cy="transfer-form-submit-button">
        <LoadingSpinner v-if="loading" class="mr-2 h-4 w-4" />
        <span v-else>Transfer Funds</span>
      </Button>
    </CardFooter>
  </Card>
</template>
