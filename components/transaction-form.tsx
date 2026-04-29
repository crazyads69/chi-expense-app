import { useState } from 'react';
import { YStack, Text, XStack } from 'tamagui';
import { api } from '@/services/api';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Card } from '@/components/card';
import { useUIStore } from '@/stores/ui';

export interface TransactionFormData {
  amount: string;
  merchant: string;
  category: string;
  date: string;
}

interface TransactionFormProps {
  initialData?: Partial<TransactionFormData>;
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TransactionForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: initialData?.amount?.toString() || '',
    merchant: initialData?.merchant || '',
    category: initialData?.category || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
  });

  const handleSubmit = () => {
    if (!formData.amount || !formData.merchant) return;
    onSubmit(formData);
  };

  return (
    <YStack gap={16}>
      <Input
        label="Amount"
        placeholder="45000"
        value={formData.amount}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, amount: text }))}
        keyboardType="numeric"
      />
      <Input
        label="Merchant"
        placeholder="Starbucks"
        value={formData.merchant}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, merchant: text }))}
      />
      <Input
        label="Category"
        placeholder="Food & Drink"
        value={formData.category}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, category: text }))}
      />
      <Input
        label="Date"
        placeholder="YYYY-MM-DD"
        value={formData.date}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, date: text }))}
      />

      <XStack gap={8}>
        <Button variant="outline" size="md" onPress={onCancel}>
          Cancel
        </Button>
        <Button
          variant="filled"
          size="md"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!formData.amount || !formData.merchant || isLoading}
        >
          Save
        </Button>
      </XStack>
    </YStack>
  );
}
