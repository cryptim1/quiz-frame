import { NextRequest } from 'next/server';
import { questions } from '@/data/questions';
import { init, fetchQuery } from "@airstack/node";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
init(process.env.AIRSTACK_API_KEY as string);

async function validateFarcasterUser(fid: string): Promise<boolean> {
  const query = `
    query MyQuery {
      Socials(
        input: {filter: {userId: {_eq: "${fid}"}, dappName: {_eq: farcaster}}, blockchain: ethereum}
      ) {
        Social {
          userId
          profileName
        }
      }
    }
  `;

  try {
    const { data, error } = await fetchQuery(query);
    
    if (error) {
      console.error("Error validating Farcaster user:", error);
      return false;
    }

    return data?.Socials?.Social?.length > 0;
  } catch (error) {
    console.error("Error in Airstack API call:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { untrustedData } = data;
    
    // Add state management
    const { buttonIndex, fid } = untrustedData;
    const stateString = untrustedData.stateString || '';
    const [questionIndexStr, scoreStr] = stateString.split(',');
    const questionIndex = parseInt(questionIndexStr) || 0;
    const score = parseInt(scoreStr) || 0;

    const isFinished = questionIndex >= questions.length;

    let html = '';
    if (isFinished) {
      const imageUrl = `${BASE_URL}/api/og?title=${encodeURIComponent(`Final Score: ${score}/${questions.length}`)}`;
      html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${imageUrl}" />
            <meta property="fc:frame:button:1" content="Share Result" />
            <meta property="fc:frame:button:2" content="Play Again" />
            <meta property="fc:frame:post_url" content="${BASE_URL}/api/frame" />
          </head>
        </html>
      `;
    } else {
      const currentQuestion = questions[questionIndex];
      const imageUrl = `${BASE_URL}/api/og?question=${encodeURIComponent(currentQuestion.question)}&number=${questionIndex + 1}`;
      html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${imageUrl}" />
            <meta property="fc:frame:button:1" content="${currentQuestion.answers[0]}" />
            <meta property="fc:frame:button:2" content="${currentQuestion.answers[1]}" />
            <meta property="fc:frame:button:3" content="${currentQuestion.answers[2]}" />
            <meta property="fc:frame:button:4" content="${currentQuestion.answers[3]}" />
            <meta property="fc:frame:post_url" content="${BASE_URL}/api/frame" />
          </head>
        </html>
      `;
    }

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in /api/frame:', error);
    return new Response('Error', { status: 500 });
  }
}