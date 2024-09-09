import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata: Metadata = {
  title: 'Are You Smarter Than a 5th Grader?',
  description: 'Test your knowledge with this quiz!',
  openGraph: {
    title: 'Are You Smarter Than a 5th Grader?',
    description: 'Test your knowledge with this quiz!',
    images: [`${BASE_URL}/api/og`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${BASE_URL}/api/og`,
    'fc:frame:button:1': 'Start Quiz',
    'fc:frame:post_url': `${BASE_URL}/api/frame`,
  },
};

export default function Home() {
  return (
    <main>
      <h1>Are You Smarter Than a 5th Grader?</h1>
      <p>Welcome to the quiz! Use a Farcaster client to interact with this frame.</p>
    </main>
  );
}