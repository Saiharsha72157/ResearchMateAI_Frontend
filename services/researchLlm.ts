import axios from 'axios';

// Ensure you have EXPO_PUBLIC_GROQ_API_KEY in your .env file
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const generateWithGroq = async (prompt: string, returnJson: boolean = false): Promise<any> => {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key is not configured. Please add EXPO_PUBLIC_GROQ_API_KEY to your .env file.');
  }

  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: 'llama-3.1-8b-instant', // Updated from deprecated llama3-8b-8192
        messages: [{ role: 'user', content: prompt }],
        response_format: returnJson ? { type: 'json_object' } : { type: 'text' },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        }
      }
    );

    const text = response.data?.choices?.[0]?.message?.content;
    
    if (returnJson) {
      try {
        return JSON.parse(text);
      } catch (e) {
        return JSON.parse(text.replace(/```json\n|\n```/g, ''));
      }
    }
    
    return text || 'No response generated.';
  } catch (error) {
    console.error('[Groq API Error]', error);
    throw new Error('Failed to generate content with AI.');
  }
};

export const generateSummary = async (abstract: string, mode: "Short" | "Detailed" | "Executive") => {
  const prompt = `You are an expert academic researcher. Summarize the following research abstract in a ${mode} format. \n\nAbstract: ${abstract}`;
  return await generateWithGroq(prompt);
};

export const generateInsights = async (text: string) => {
  const prompt = `Analyze the following research text and extract key insights. Return ONLY a valid JSON object matching exactly this structure (no markdown, no quotes):
  {
    "findings": ["finding 1", "finding 2"],
    "contributions": ["contribution 1", "contribution 2"],
    "novelIdeas": ["idea 1", "idea 2"]
  }
  
  Text: ${text}`;
  
  return await generateWithGroq(prompt, true);
};

export const generateLiteratureReview = async (papers: any[]) => {
  const abstracts = papers.map(p => `- ${p.title}: ${p.abstract}`).join('\n\n');
  const prompt = `Act as an expert academic researcher. Write a concise literature review based on the following papers:\n\n${abstracts}\n\nInclude a synthesis of their common themes, methodologies, and identify any potential research gaps.`;
  return await generateWithGroq(prompt);
};

export const generateCitation = (paper: any, format: "IEEE" | "APA" | "MLA" | "Chicago" | "Harvard") => {
  const authors = paper.authors?.map((a: any) => a.name).join(", ") || "Unknown Authors";
  const year = paper.year || "n.d.";
  const title = paper.title || "Unknown Title";
  const venue = paper.venue || "Unpublished";
  
  if (format === "IEEE") {
    return `${authors}, "${title}," ${venue}, ${year}.`;
  }
  if (format === "APA") {
    return `${authors} (${year}). ${title}. ${venue}.`;
  }
  if (format === "MLA") {
    return `${authors}. "${title}." ${venue} (${year}).`;
  }
  if (format === "Chicago") {
    return `${authors}. "${title}." ${venue} (${year}).`;
  }
  if (format === "Harvard") {
    return `${authors} (${year}) '${title}', ${venue}.`;
  }
  
  return `${authors}. "${title}." ${venue} (${year}).`;
};
