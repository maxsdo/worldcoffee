import { Page } from '@/components/PageLayout';
import { AuthButton } from '../components/AuthButton';
import Image from 'next/image';

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-start justify-between h-full py-12">
        <div className="w-full">
          <div className="mb-12 flex flex-col items-center">
            <Image
              src="/coffee-logo.svg"
              alt="Orbuccino Logo"
              width={80}
              height={80}
              className="mb-4"
            />
            <h1 className="text-4xl font-bold">orbuccino</h1>
          </div>

          <ul className="space-y-6 text-lg">
            <li className="flex items-start gap-3">
              <span className="text-2xl mt-1">👆</span>
              <span>One click login</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl mt-1">🌍</span>
              <span>Support anyone on the world app</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl mt-1">🔗</span>
              <span>Deep link to share outside the world app</span>
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
