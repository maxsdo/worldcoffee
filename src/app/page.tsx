import { Page } from '@/components/PageLayout';
import { AuthButton } from '../components/AuthButton';

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-start justify-between h-full py-12">
        <div className="w-full">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">World Coffee</h1>
          </div>

          <ul className="space-y-6 text-lg">
            <li className="flex items-start gap-3">
              <span className="text-2xl mt-1">☕</span>
              <span>Order your favorite coffee drinks with crypto</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl mt-1">🌐</span>
              <span>Verify your identity with World ID</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl mt-1">🏪</span>
              <span>Support local coffee shops in your area</span>
            </li>
          </ul>
        </div>
      </Page.Main>

      <Page.Footer>
        <AuthButton />
      </Page.Footer>
    </Page>
  );
}
