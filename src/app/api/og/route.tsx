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
    let resultText = '';
    let backgroundColor = '#2a3d45'; // Default background color

    if (question && number) {
      mainContent = `Question ${number}: ${question}`;
    } else if (title) {
      if (title.includes(':')) {
        const [scoreText, scoreValue] = title.split(':');
        const [score, total] = scoreValue.trim().split('/');
        const isSmarter = Number(score) >= 4;
        resultText = isSmarter
          ? "Congratulations! You are smarter than a 5th grader!"
          : "You are not smarter than a 5th grader.";
        mainContent = `${scoreText}: ${scoreValue}`;
        backgroundColor = isSmarter ? '#4CAF50' : '#FF5252'; // Green for pass, red for fail
      } else {
        mainContent = title;
      }
    } else {
      mainContent = 'Are You Smarter Than a 5th Grader?';
      console.warn('No question, number, or title provided for OG image');
    }

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor,
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
            fontSize: '60px',
            whiteSpace: 'pre-wrap',
          }}>
            {mainContent}
          </div>
          {resultText && (
            <div style={{
              marginTop: '40px',
              fontSize: '40px',
            }}>
              {resultText}
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error('Error generating image:', e);
    return new Response(`Failed to generate image: ${(e as Error).message}`, { status: 500 });
  }
}