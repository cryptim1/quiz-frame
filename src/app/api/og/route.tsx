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
      if (title.includes(':')) {
        const [scoreText, scoreValue] = title.split(':');
        const [score, total] = scoreValue.trim().split('/');
        const isSmarter = Number(score) >= 4;
        const resultText = isSmarter
          ? "✓ Congratulations! You are smarter than a 5th grader!"
          : "✗ Oops! You are not smarter than a 5th grader.";
        mainContent = `${scoreText}: ${scoreValue}\n\n${resultText}`;
      } else {
        mainContent = title;
      }
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
  } catch (e) {
    console.error('Error generating image:', e);
    // Return a simple error image instead of throwing an error
    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: 'red',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
          }}
        >
          Error generating image: {(e as Error).message}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}