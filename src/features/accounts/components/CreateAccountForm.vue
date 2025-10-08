<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { useFocus } from '@vueuse/core'
import { useAccountsStore } from '@/stores/accounts'
import { required, accountId, moneyAmount } from '@/shared/utils/validation'
import { LoadingSpinner } from '@/shared/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { storeToRefs } from 'pinia'

const emit = defineEmits<{
  accountCreated: []
}>()

const accountsStore = useAccountsStore()
const { loading } = storeToRefs(accountsStore)

const accountIdInputRef = ref<HTMLInputElement | null>(null)

// Auto-focus on first input when component mounts
useFocus(accountIdInputRef, { initialValue: true })

const { defineField, handleSubmit, resetForm } = useForm({
  validationSchema: {
    account_id: [required, accountId],
    initial_balance: [required, moneyAmount],
  },
})

const [accountIdField, accountIdAttrs] = defineField('account_id')
const [initialBalanceField, initialBalanceAttrs] = defineField('initial_balance')

const onSubmit = handleSubmit(async (values) => {
  try {
    const account = await accountsStore.createAccount({
      account_id: Number(values.account_id),
      initial_balance: values.initial_balance,
    })

    toast.success('Account created successfully!', {
      description: `Account #${account.account_id} created with balance of $${account.balance}`,
    })

    resetForm()
    emit('accountCreated')
  } catch (err: unknown) {
    toast.error('Failed to create account', {
      description: (err as Error).message || 'An error occurred while creating the account',
    })
  }
})
</script>

<template>
  <Card data-cy="create-account-form-card">
    <CardContent>
      <form @submit="onSubmit" class="space-y-6">
        <FormField v-slot="{ componentField }" name="account_id">
          <FormItem>
            <FormLabel>Account ID</FormLabel>
            <FormControl>
              <Input
                ref="accountIdInputRef"
                v-bind="{ ...componentField, ...accountIdAttrs }"
                v-model="accountIdField"
                type="text"
                placeholder="e.g., 123"
                :disabled="loading"
                data-cy="create-account-form-account-id-input"
              />
            </FormControl>
            <FormDescription>Unique identifier for the account (positive integer)</FormDescription>
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
                data-cy="create-account-form-initial-balance-input"
              />
            </FormControl>
            <FormDescription>Starting balance amount (decimal format)</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </form>
    </CardContent>

    <CardFooter>
      <Button
        type="submit"
        :disabled="loading"
        class="w-full"
        @click="onSubmit"
        data-cy="create-account-form-submit-button"
      >
        <LoadingSpinner v-if="loading" class="mr-2 h-4 w-4" />
        <span v-else>Create Account</span>
      </Button>
    </CardFooter>
  </Card>
</template>
