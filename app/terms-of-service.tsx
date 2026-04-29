import { Text, YStack } from 'tamagui';
import { LegalPage } from '@/components/legal-page';

export default function TermsOfServiceScreen() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="April 27, 2026"
    >
      <YStack gap={16}>
        <Section title="1. Acceptance of Terms">
          <Text fontSize={14} color="$textSecondary" lineHeight={22}>
            By using Chi Expense, you agree to these Terms of Service. If you do not agree, please do not use the app.
          </Text>
        </Section>

        <Section title="2. Description of Service">
          <Text fontSize={14} color="$textSecondary" lineHeight={22}>
            Chi Expense provides personal expense tracking with AI-powered receipt scanning. The service is provided &quot;as is&quot; without warranties of any kind.
          </Text>
        </Section>

        <Section title="3. User Accounts">
          <Text fontSize={14} color="$textSecondary" lineHeight={22}>
            You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information when creating an account.
          </Text>
        </Section>

        <Section title="4. Acceptable Use">
          <Text fontSize={14} color="$textSecondary" lineHeight={22}>
            You agree not to:
          </Text>
          <BulletList
            items={[
              'Use the app for illegal purposes',
              'Attempt to gain unauthorized access to our systems',
              'Upload malicious content or viruses',
              'Interfere with other users access to the service',
            ]}
          />
        </Section>

        <Section title="5. Limitation of Liability">
          <Text fontSize={14} color="$textSecondary" lineHeight={22}>
            Chi Expense is not liable for any financial decisions made based on the app&apos;s data. Always verify important financial information independently.
          </Text>
        </Section>

        <Section title="6. Changes to Terms">
          <Text fontSize={14} color="$textSecondary" lineHeight={22}>
            We may update these terms from time to time. Continued use of the app after changes constitutes acceptance of the new terms.
          </Text>
        </Section>

        <Section title="7. Contact">
          <Text fontSize={14} color="$textSecondary" lineHeight={22}>
            For questions about these terms, contact us at support@chiexpense.app
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
