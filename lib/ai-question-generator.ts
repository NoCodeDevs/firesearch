import OpenAI from 'openai';
import { AI_QUESTION_CONFIG } from './config';

// Initialize OpenAI client with error handling
let openai: OpenAI | null = null;

try {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY not found in environment variables');
  } else {
    openai = new OpenAI({
      apiKey: apiKey,
    });
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

export interface AIQuestion {
  id: string;
  text: string;
  category: 'market-size' | 'competition' | 'trends' | 'challenges' | 'opportunities' | 'strategy' | 'monetization' | 'regulatory';
  estimatedValue?: string;
}

export interface IndustryQuestions {
  industry: string;
  questions: AIQuestion[];
  generatedAt: Date;
  metadata: {
    model: string;
    temperature: number;
    totalTokens: number;
  };
}

/**
 * Generate AI-powered research questions for a given industry
 */
export async function generateIndustryQuestions(
  industryName: string,
  industryDescription?: string
): Promise<IndustryQuestions> {
  // Check if OpenAI client is available
  if (!openai) {
    console.error('OpenAI client not initialized - falling back to static questions');
    return generateFallbackQuestions(industryName);
  }

  const prompt = createQuestionGenerationPrompt(industryName, industryDescription);

  try {
    const completion = await openai.chat.completions.create({
      model: AI_QUESTION_CONFIG.MODEL,
      messages: [
        {
          role: 'system',
          content: `You are an expert market research consultant specializing in startup and entrepreneurial questions. Generate highly valuable, actionable research questions that entrepreneurs would actually want to know when building businesses in various industries.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: AI_QUESTION_CONFIG.TEMPERATURE,
      max_tokens: AI_QUESTION_CONFIG.MAX_TOKENS,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsedResponse = JSON.parse(content);
    const questions = processAIResponse(parsedResponse, industryName);

    return {
      industry: industryName,
      questions,
      generatedAt: new Date(),
      metadata: {
        model: AI_QUESTION_CONFIG.MODEL,
        temperature: AI_QUESTION_CONFIG.TEMPERATURE,
        totalTokens: completion.usage?.total_tokens || 0
      }
    };

  } catch (error) {
    console.error('Error generating AI questions:', error);
    // Fallback to predefined questions if AI generation fails
    return generateFallbackQuestions(industryName);
  }
}

/**
 * Create a comprehensive prompt for question generation
 */
function createQuestionGenerationPrompt(industryName: string, industryDescription?: string): string {
  const baseDescription = industryDescription || getIndustryDescription(industryName);

  return `Generate ${AI_QUESTION_CONFIG.QUESTION_COUNT} high-value research questions for entrepreneurs in the ${industryName} industry.

Industry Context: ${baseDescription}

Requirements:
1. Questions should be strategic and actionable for startup founders
2. Focus on market opportunities, competitive advantages, and growth potential
3. Include questions about market size, competition, trends, challenges, and opportunities
4. Make questions specific and measurable where possible
5. Cover different aspects: TAM/SAM/SOM, competition, monetization, regulatory, technology, customer acquisition

Return a JSON object with this exact structure:
{
  "questions": [
    {
      "text": "Question text here",
      "category": "market-size|competition|trends|challenges|opportunities|strategy|monetization|regulatory",
      "estimatedValue": "Brief explanation of why this question is valuable"
    }
  ]
}

Ensure questions are:
- Specific to ${industryName}
- Valuable for decision-making
- Measurable or answerable through research
- Strategic in nature
- Not generic or obvious`;
}

/**
 * Get industry-specific description for better question generation
 */
function getIndustryDescription(industryName: string): string {
  const descriptions: Record<string, string> = {
    'saas': 'Software as a Service companies providing cloud-based business software solutions',
    'fintech': 'Financial technology companies innovating in payments, lending, insurance, and wealth management',
    'healthcare': 'Healthcare technology and services companies improving patient care and medical processes',
    'ecommerce': 'Online retail and marketplace platforms connecting buyers and sellers',
    'edtech': 'Education technology companies providing learning platforms and educational tools',
    'real-estate': 'Real estate technology companies modernizing property transactions and management',
    'automotive': 'Automotive technology companies working on electric vehicles, autonomous driving, and mobility',
    'content-creation': 'Companies providing tools and platforms for content creators and digital media',
    'foodtech': 'Food technology companies innovating in food production, delivery, and sustainability',
    'cleantech': 'Clean technology companies working on renewable energy and environmental solutions',
    'gaming': 'Gaming companies and platforms for entertainment and esports',
    'hr-tech': 'Human resources technology companies improving talent acquisition and management',
    'proptech': 'Property technology companies modernizing real estate and construction',
    'agritech': 'Agriculture technology companies improving farming efficiency and sustainability',
    'legaltech': 'Legal technology companies modernizing legal services and compliance',
    'insurtech': 'Insurance technology companies innovating in insurance products and processes',
    'marketplace': 'Marketplace platforms connecting different types of buyers and sellers',
    'cybersecurity': 'Cybersecurity companies protecting digital assets and infrastructure',
    'blockchain': 'Blockchain and cryptocurrency companies building decentralized solutions',
    'traveltech': 'Travel technology companies improving booking, planning, and experiences',
    'logistics': 'Logistics and supply chain technology companies optimizing transportation',
    'retailtech': 'Retail technology companies enhancing in-store and online shopping',
    'martech': 'Marketing technology companies improving customer acquisition and retention',
    'biotech': 'Biotechnology companies developing medical and agricultural innovations',
    'spacetech': 'Space technology companies working on satellite and space exploration',
    'robotics': 'Robotics and automation companies building intelligent machines',
    'iot': 'Internet of Things companies connecting physical devices to digital networks',
    'ai-ml': 'Artificial Intelligence and Machine Learning companies developing intelligent systems',
    'vr-ar': 'Virtual and Augmented Reality companies creating immersive experiences',
    'energy': 'Energy technology companies working on power generation and distribution',
    'construction': 'Construction technology companies modernizing building processes',
    'fashion': 'Fashion technology companies innovating in apparel and lifestyle',
    'sports': 'Sports technology companies enhancing athletic performance and fan experiences',
    'media': 'Media technology companies transforming content creation and distribution',
    'telecom': 'Telecommunications companies building communication infrastructure',
    'transportation': 'Transportation technology companies improving mobility solutions',
    'real-estate-tech': 'Real estate technology companies enhancing property transactions',
    'pharma': 'Pharmaceutical technology companies developing new medicines',
    'banking': 'Banking technology companies modernizing financial services',
    'insurance-tech': 'Insurance technology companies innovating risk management'
  };

  return descriptions[industryName.toLowerCase().replace(/\s+/g, '-')] ||
         `${industryName} companies providing innovative solutions and services`;
}

/**
 * Process AI response and format questions
 */
function processAIResponse(response: any, industryName: string): AIQuestion[] {
  if (!response.questions || !Array.isArray(response.questions)) {
    throw new Error('Invalid response format from AI');
  }

  return response.questions.slice(0, AI_QUESTION_CONFIG.QUESTION_COUNT).map((q: any, index: number) => ({
    id: `${industryName.toLowerCase().replace(/\s+/g, '-')}-q${index + 1}`,
    text: q.text,
    category: q.category || 'strategy',
    estimatedValue: q.estimatedValue || 'Strategic insight for business planning'
  }));
}

/**
 * Fallback question generation when AI fails
 */
function generateFallbackQuestions(industryName: string): IndustryQuestions {
  const fallbackQuestions: AIQuestion[] = [
    {
      id: `${industryName.toLowerCase().replace(/\s+/g, '-')}-fallback-1`,
      text: `What is the current market size and growth potential for ${industryName.toLowerCase()}?`,
      category: 'market-size',
      estimatedValue: 'Understanding market opportunity and scalability'
    },
    {
      id: `${industryName.toLowerCase().replace(/\s+/g, '-')}-fallback-2`,
      text: `Who are the main competitors in the ${industryName.toLowerCase()} space and what are their strengths?`,
      category: 'competition',
      estimatedValue: 'Competitive analysis for positioning'
    },
    {
      id: `${industryName.toLowerCase().replace(/\s+/g, '-')}-fallback-3`,
      text: `What are the biggest challenges facing ${industryName.toLowerCase()} companies today?`,
      category: 'challenges',
      estimatedValue: 'Risk assessment and problem identification'
    },
    {
      id: `${industryName.toLowerCase().replace(/\s+/g, '-')}-fallback-4`,
      text: `What emerging trends are shaping the future of ${industryName.toLowerCase()}?`,
      category: 'trends',
      estimatedValue: 'Future planning and innovation opportunities'
    },
    {
      id: `${industryName.toLowerCase().replace(/\s+/g, '-')}-fallback-5`,
      text: `What are the most promising opportunities in ${industryName.toLowerCase()} for new entrants?`,
      category: 'opportunities',
      estimatedValue: 'Market entry strategy and growth potential'
    },
    {
      id: `${industryName.toLowerCase().replace(/\s+/g, '-')}-fallback-6`,
      text: `How do successful ${industryName.toLowerCase()} companies typically monetize their offerings?`,
      category: 'monetization',
      estimatedValue: 'Revenue model analysis and optimization'
    },
    {
      id: `${industryName.toLowerCase().replace(/\s+/g, '-')}-fallback-7`,
      text: `What regulatory challenges affect ${industryName.toLowerCase()} businesses?`,
      category: 'regulatory',
      estimatedValue: 'Compliance planning and risk management'
    },
    {
      id: `${industryName.toLowerCase().replace(/\s+/g, '-')}-fallback-8`,
      text: `What strategic decisions should ${industryName.toLowerCase()} startups prioritize in their first 2 years?`,
      category: 'strategy',
      estimatedValue: 'Strategic planning and prioritization'
    }
  ];

  return {
    industry: industryName,
    questions: fallbackQuestions,
    generatedAt: new Date(),
    metadata: {
      model: 'fallback',
      temperature: 0,
      totalTokens: 0
    }
  };
}

/**
 * Cache for generated questions to avoid repeated API calls
 */
const questionCache = new Map<string, IndustryQuestions>();

export async function getIndustryQuestions(
  industryName: string,
  useCache: boolean = true
): Promise<IndustryQuestions> {
  const cacheKey = industryName.toLowerCase().replace(/\s+/g, '-');

  if (useCache && questionCache.has(cacheKey)) {
    return questionCache.get(cacheKey)!;
  }

  const questions = await generateIndustryQuestions(industryName);
  questionCache.set(cacheKey, questions);

  return questions;
}

/**
 * Clear question cache (useful for development/testing)
 */
export function clearQuestionCache(): void {
  questionCache.clear();
}
