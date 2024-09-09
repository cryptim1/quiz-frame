/* eslint-disable @typescript-eslint/no-unused-vars */
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const question = searchParams.get('question');
    const number = searchParams.get('number');
    const title = searchParams.get('title');

    console.log('OG Image Request:', { question, number, title });

    let mainContent;
    if (question && number) {
      mainContent = `Question ${number}: ${question}`;
    } else if (title) {
      const [score, _total] = title.split(':')[1].trim().split('/');
      const isSmarter = Number(score) >= 4;
      const resultText = isSmarter
        ? "✓ Congratulations! You are smarter than a 5th grader!"
        : "✗ Oops! You are not smarter than a 5th grader.";
      const _color = isSmarter ? '#4CAF50' : '#FF5252';
      mainContent = `${title}\n\n${resultText}`;
    } else {
      mainContent = 'Are You Smarter Than a 5th Grader?';
    }

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: '#2a3d45',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            whiteSpace: 'pre-wrap',
          }}>
            {mainContent}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.error('Error generating image:', e);
    return new Response(`Failed to generate image: ${(e as Error).message}`, { status: 500 });
  }
}