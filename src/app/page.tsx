import { Page } from '@/components/PageLayout';
import { AuthButton } from '../components/AuthButton';

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Hello! 👋</h1>
          <p className="text-lg text-gray-600">Welcome to the Worldcoin Mini App</p>
        </div>
        <AuthButton />
      </Page.Main>
    </Page>
  );
}
