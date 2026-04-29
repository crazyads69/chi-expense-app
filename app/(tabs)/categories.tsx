import { useState } from 'react';
import { YStack, Text, XStack, ScrollView, useTheme } from 'tamagui';
import { Pressable } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Card } from '@/components/card';
import { SkeletonCard } from '@/components/skeleton';
import { useUIStore } from '@/stores/ui';
import { Plus, Tag } from 'lucide-react-native';

interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

export default function CategoriesScreen() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<Category[]>('/categories');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      await api.post('/categories', { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showToast('Category created', 'success');
      setIsModalVisible(false);
      setNewCategoryName('');
    },
    onError: () => {
      showToast('Failed to create category', 'error');
    },
  });

  const handleCreate = () => {
    if (!newCategoryName.trim()) return;
    createMutation.mutate(newCategoryName.trim());
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack padding={24} paddingBottom={8}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={20} fontWeight="600" color="$textPrimary">
            Categories
          </Text>
          <Button
            variant="outline"
            size="sm"
            onPress={() => setIsModalVisible(true)}
          >
            <Plus size={16} color={theme.primary.val} />
          </Button>
        </XStack>
      </YStack>

      {isLoading ? (
        <YStack padding={24} gap={12}>
          <SkeletonCard />
          <SkeletonCard />
        </YStack>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding={24} paddingTop={8} gap={12}>
            {categories?.length === 0 ? (
              <YStack alignItems="center" gap={16} paddingVertical={48}>
                <Text fontSize={16} fontWeight="600" color="$textPrimary" textAlign="center">
                  No categories yet
                </Text>
                <Text fontSize={14} color="$textSecondary" textAlign="center">
                  Create your first category to organize your spending.
                </Text>
              </YStack>
            ) : (
              categories?.map((category) => (
                <Card key={category.id} variant="compact">
                  <XStack alignItems="center" gap={12}>
                    <Tag size={20} color={theme.primary.val} />
                    <Text fontSize={16} color="$textPrimary">
                      {category.name}
                    </Text>
                  </XStack>
                </Card>
              ))
            )}
          </YStack>
        </ScrollView>
      )}

      {/* Create Category Modal */}
      {isModalVisible && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
          onPress={() => setIsModalVisible(false)}
        >
          <Pressable onPress={() => {}}>
            <YStack
              backgroundColor="$surface"
              borderRadius={16}
              padding={24}
              width="100%"
              maxWidth={400}
              gap={16}
            >
            <Text fontSize={18} fontWeight="600" color="$textPrimary">
              New Category
            </Text>
            <Input
              placeholder="Category name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            <XStack gap={8}>
              <Button
                variant="outline"
                size="md"
                onPress={() => setIsModalVisible(false)}
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                size="md"
                onPress={handleCreate}
                loading={createMutation.isPending}
                disabled={!newCategoryName.trim() || createMutation.isPending}
              >
                Create
              </Button>
            </XStack>
            </YStack>
          </Pressable>
        </Pressable>
      )}
    </YStack>
  );
}
