import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  console.warn('WARNING: GROQ_API_KEY is not defined in environment variables.');
}

const groq = new Groq({ apiKey });

/**
 * Request code review from Groq AI with structured JSON response
 * @param {string} code 
 * @param {string} language 
 * @param {string} mode 
 * @param {string} explanationLanguage 
 */
export async function getCodeReview(code, language, mode, explanationLanguage) {
  const prompt = `
You are an expert AI code reviewer. Review the following code snippet.

Programming Language: ${language}
Review Mode Focus: ${mode}
Explanation Output Language: ${explanationLanguage}

Code to review:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Analyze the code and return a STRICT JSON response ONLY. Do not include markdown code block syntax (like \`\`\`json) or any pre-text/post-text outside of the valid JSON structure.

JSON format expected:
{
  "score": 0 to 100 integer representing code quality,
  "issues": [
    {
      "line": number representing the line number or 0 if general,
      "severity": "high" | "medium" | "low",
      "message": "clear explanation of the issue"
    }
  ],
  "suggestions": [
    "actionable suggestion 1",
    "actionable suggestion 2"
  ],
  "optimizedCode": "fully refactored, optimized, clean code matching all recommendations",
  "lineByLine": [
    {
      "line": number,
      "explanation": "detailed breakdown explanation of this line or block in ${explanationLanguage}"
    }
  ],
  "resources": [
    {
      "title": "useful link title",
      "url": "valid documentation url (MDN, Python docs, official docs, etc.)"
    }
  ]
}
`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a senior developer who reviews code. You respond ONLY in valid JSON. No conversational text, no wrappers.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Groq API Error in getCodeReview:', error);
    throw new Error(`AI Review failed: ${error.message}`);
  }
}

/**
 * Handle AI chat assistant follow-ups
 * @param {string} code 
 * @param {string} question 
 * @param {Array} history 
 */
export async function getChatResponse(code, question, history = []) {
  const messages = [
    {
      role: 'system',
      content: 'You are a helpful, senior coding assistant. The user will ask questions about a code snippet. Be precise, helpful, and return responses with clear markdown and explanations.',
    },
    {
      role: 'user',
      content: `Here is the code context we are discussing:\n\`\`\`\n${code}\n\`\`\``
    },
    ...history,
    {
      role: 'user',
      content: question,
    }
  ];

  try {
    const response = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
    });

    return response.choices[0]?.message?.content || 'No response generated.';
  } catch (error) {
    console.error('Groq API Error in getChatResponse:', error);
    throw new Error(`AI Chat assistant failed: ${error.message}`);
  }
}
