import React, { Component, type ReactNode } from 'react';
import { YStack, Text } from 'tamagui';
import { Button } from '@/components/button';
import { AlertTriangle } from 'lucide-react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <YStack flex={1} justifyContent="center" alignItems="center" padding={24} gap={16} backgroundColor="background">
          <AlertTriangle size={48} color="primary" />
          <Text fontSize={20} fontWeight="600" color="textPrimary" textAlign="center">
            Something went wrong
          </Text>
          <Text fontSize={14} color="textSecondary" textAlign="center">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </Text>
          <Button variant="filled" size="md" onPress={this.handleReset}>
            Try Again
          </Button>
        </YStack>
      );
    }

    return this.props.children;
  }
}
