import { Text, YStack } from 'tamagui';
import { LegalPage } from '@/components/legal-page';

export default function PrivacyPolicyScreen() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="April 27, 2026"
    >
      <YStack gap={16}>
        <Section title="1. Information We Collect">
          <Text fontSize={14} color="$textSecondary" lineHeight={22}>
            Chi Expense collects the following information to provide expense tracking services:
          </Text>
          <BulletList
            items={[
              'Account information (email, name) via Better Auth authentication',
              'Expense data (amount, merchant, category, date, receipt images)',
              'Usage analytics for app improvement',
            ]}
          />
        </Section>

        <Section title="2. How We Use Your Information">
          <Text fontSize={14} color="$textSecondary" lineHeight={22}>
            We use your information to:
          </Text>
          <BulletList
            items={[
              'Process and store your expense records',
              'Provide AI-powered receipt scanning via OpenAI API',
              'Improve app functionality and user experience',
            ]}
          />
        </Section>

        <Section title="3. Data Storage & Security">
          <Text fontSize={14} color="$textSecondary" lineHeight={22}>
            Your data is stored on secure servers with encryption at rest. Receipt images are processed 
            through OpenAI's API and are subject to OpenAI's privacy policy. We do not sell your personal 
            data to third parties.
          </Text>
        </Section>

        <Section title="4. Your Rights">
          <Text fontSize={14} color="$textSecondary" lineHeight={22}>
            You can request data deletion by contacting support or using the delete account feature in 
            settings. You may also export your data at any time via the CSV export function.
          </Text>
        </Section>

        <Section title="5. Contact Us">
          <Text fontSize={14} color="$textSecondary" lineHeight={22}>
            For privacy-related questions, contact us at privacy@chiexpense.app
          </Text>
        </Section>
      </YStack>
    </LegalPage>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <YStack gap={8}>
      <Text fontSize={16} fontWeight="600" color="$textPrimary">
        {title}
      </Text>
      {children}
    </YStack>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <YStack gap={4} paddingLeft={16}>
      {items.map((item, index) => (
        <Text key={index} fontSize={14} color="$textSecondary" lineHeight={22}>
          • {item}
        </Text>
      ))}
    </YStack>
  );
}
