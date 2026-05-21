import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

let groqClient = null;

// Instantiate the Groq client lazily inside a helper function.
// This prevents module import crash if GROQ_API_KEY environment variable is not defined.
const getGroqClient = () => {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is missing or empty. Please check your Vercel Dashboard Environment Variables.');
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
};

export const getCodeReview = async (code, language, mode, explanationLanguage) => {
  const client = getGroqClient();

  const prompt = `
  You are an expert AI code reviewer. Review the following code snippet:
  Language: ${language}
  Focus Mode: ${mode}
  Explanation Language: ${explanationLanguage}

  Target Code:
  \`\`\`
  ${code}
  \`\`\`

  Analyze this code for bugs, optimization issues, vulnerabilities, and coding style.
  Provide a rating score from 0 (very poor) to 100 (excellent production-ready).
  Return a strict JSON response containing the properties:
  - "score": number
  - "issues": array of objects with keys "line" (number/null), "severity" ("high"|"medium"|"low"), and "message" (string explanation)
  - "suggestions": array of strings (actionable refactoring steps)
  - "optimizedCode": string (refactored clean version of the code snippet)
  - "lineByLine": array of objects with keys "line" (number) and "explanation" (string) explaining key lines
  - "resources": array of objects with keys "title" (string) and "url" (string) referencing official documentation links or tutorials
  
  Do not return any extra markdown formatting or conversational text. Return ONLY raw valid JSON matching this schema:
  {
    "score": 90,
    "issues": [
      { "line": 2, "severity": "high", "message": "X is not defined" }
    ],
    "suggestions": [
      "Use let instead of var"
    ],
    "optimizedCode": "...",
    "lineByLine": [
      { "line": 1, "explanation": "Initializes the factorial count" }
    ],
    "resources": [
      { "title": "MDN JavaScript guide", "url": "https://developer.mozilla.org" }
    ]
  }
  `;

  const chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' }
  });

  const rawText = chatCompletion.choices[0]?.message?.content;
  return JSON.parse(rawText);
};

export const getChatResponse = async (codeContext, question, history) => {
  const client = getGroqClient();

  const messages = [
    {
      role: 'system',
      content: `You are an AI code developer. The user is asking about the following source code workspace context:\n\`\`\`\n${codeContext}\n\`\`\`\nAnswer their question accurately and concisely.`,
    },
    ...history,
    {
      role: 'user',
      content: question,
    },
  ];

  const chatCompletion = await client.chat.completions.create({
    messages,
    model: 'llama-3.3-70b-versatile',
  });

  return chatCompletion.choices[0]?.message?.content || 'No response generated.';
};
