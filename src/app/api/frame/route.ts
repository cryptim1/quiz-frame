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
  console.log('Received POST request to /api/frame');
  
  try {
    const data = await req.json();
    console.log('Received data:', JSON.stringify(data, null, 2));
    
    const { untrustedData } = data;
    let questionIndex = 0;
    let score = 0;
    let isInitialLoad = true;

    if (untrustedData?.state) {
      try {
        const state = JSON.parse(decodeURIComponent(untrustedData.state));
        questionIndex = Number(state.questionIndex) || 0;
        score = Number(state.score) || 0;
        isInitialLoad = false;
      } catch (e) {
        console.error('Error parsing state:', e);
      }
    }

    const buttonIndex = untrustedData?.buttonIndex 
      ? Number(untrustedData.buttonIndex) 
      : undefined;

    console.log(`Received: questionIndex=${questionIndex}, score=${score}, buttonIndex=${buttonIndex}, isInitialLoad=${isInitialLoad}`);

    // Validate Farcaster user if FID is available
    if (untrustedData?.fid) {
      const isValidUser = await validateFarcasterUser(untrustedData.fid);
      if (!isValidUser) {
        console.log('Invalid Farcaster user');
        return new Response('Invalid Farcaster user', { status: 403 });
      }
    }

    if (!isInitialLoad && buttonIndex !== undefined) {
      if (questionIndex < questions.length) {
        const currentQuestion = questions[questionIndex];
        if (buttonIndex === currentQuestion.correctAnswer + 1) {
          score++;
        }
        questionIndex++;
      } else if (buttonIndex === 1) { // Share Result button was pressed
        console.log('Share button pressed');
        const shareText = `I scored ${score}/${questions.length} on "Are You Smarter Than a 5th Grader?" quiz!`;
        
        const html = `
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${BASE_URL}/api/og?title=${encodeURIComponent('Share Successful!')}" />
              <meta property="fc:frame:button:1" content="Back to Results" />
              <meta property="fc:frame:post_url" content="${BASE_URL}/api/frame" />
            </head>
            <body>
              <p>${shareText}</p>
              <p>Share functionality would go here.</p>
            </body>
          </html>
        `;
        
        console.log('Sending share confirmation frame');
        return new Response(html, {
          headers: { 'Content-Type': 'text/html' },
          status: 200,
        });
      } else if (buttonIndex === 2) { // Play Again button was pressed
        questionIndex = 0;
        score = 0;
      }
    }

    console.log(`Updated: questionIndex=${questionIndex}, score=${score}`);

    const isFinished = questionIndex >= questions.length;

    let html = '';
    if (isFinished) {
      const imageUrl = `${BASE_URL}/api/og?title=${encodeURIComponent(`Final Score: ${score}/${questions.length}`)}`;
      const resultText = score >= 4 
        ? "Congratulations! You are smarter than a 5th grader!" 
        : "Oops! You are not smarter than a 5th grader.";
      
      html = `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${imageUrl}" />
            <meta property="fc:frame:button:1" content="Share Result" />
            <meta property="fc:frame:button:2" content="Play Again" />
            <meta property="fc:frame:post_url" content="${BASE_URL}/api/frame" />
            <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ questionIndex, score, isInitialLoad: false }))}" />
          </head>
          <body>
            <h1>Quiz Completed!</h1>
            <p>Your Final Score: ${score}/${questions.length}</p>
            <p>${resultText}</p>
          </body>
        </html>
      `;
    } else {
      const currentQuestion = questions[questionIndex];
      const imageUrl = `${BASE_URL}/api/og?question=${encodeURIComponent(currentQuestion.question)}&number=${questionIndex + 1}`;
      html = `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${imageUrl}" />
            ${currentQuestion.answers.map((answer, index) => 
              `<meta property="fc:frame:button:${index + 1}" content="${answer}" />`
            ).join('')}
            <meta property="fc:frame:post_url" content="${BASE_URL}/api/frame" />
            <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ questionIndex, score, isInitialLoad: false }))}" />
          </head>
          <body>
            <h1>Question ${questionIndex + 1}</h1>
            <p>${currentQuestion.question}</p>
          </body>
        </html>
      `;
    }

    console.log(`Sending HTML response for ${isFinished ? 'final result' : `question ${questionIndex + 1}`}`);
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in /api/frame:', error);
    return new Response(`Internal Server Error: ${(error as Error).message || 'Unknown error'}`, { status: 500 });
  }
}