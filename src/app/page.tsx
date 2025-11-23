import { Page } from '@/components/PageLayout';
import { AuthButton } from '../components/AuthButton';

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center gap-6 px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">worldcoffee ☕</h1>
          <p className="text-lg text-gray-600 mb-2">Support your friends with coffee</p>
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-lg">✓</span>
            <span>Verified humans only</span>
          </div>
        </div>
        <AuthButton />
        <p className="text-xs text-gray-500 text-center max-w-sm">
          This app requires World ID Orb verification. Only verified humans can access the platform.
        </p>
      </Page.Main>
    </Page>
  );
}
