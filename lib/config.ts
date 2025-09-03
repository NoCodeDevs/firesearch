// Search Engine Configuration
export const SEARCH_CONFIG = {
  // Search Settings
  MAX_SEARCH_QUERIES: 10,        // Maximum number of search queries to generate
  MAX_SOURCES_PER_SEARCH: 10,     // Maximum sources to return per search query
  MAX_SOURCES_TO_SCRAPE: 10,      // Maximum sources to scrape for additional content
  
  // Content Processing
  MIN_CONTENT_LENGTH: 100,       // Minimum content length to consider valid
  SUMMARY_CHAR_LIMIT: 100,       // Character limit for source summaries
  CONTEXT_PREVIEW_LENGTH: 500,   // Preview length for previous context
  ANSWER_CHECK_PREVIEW: 2500,    // Content preview length for answer checking
  MAX_SOURCES_TO_CHECK: 10,      // Maximum sources to check for answers
  
  // Retry Logic
  MAX_RETRIES: 3,                // Maximum retry attempts for failed operations
  MAX_SEARCH_ATTEMPTS: 3,        // Maximum attempts to find answers via search
  MIN_ANSWER_CONFIDENCE: 0.3,    // Minimum confidence (0-1) that a question was answered
  EARLY_TERMINATION_CONFIDENCE: 0.8, // Confidence level to skip additional searches
  
  // Timeouts
  SCRAPE_TIMEOUT: 15000,         // Timeout for scraping operations (ms)
  
  // Performance
  SOURCE_ANIMATION_DELAY: 45,    // Delay between source animations (ms) - reduced from 150
  PARALLEL_SUMMARY_GENERATION: true, // Generate summaries in parallel
} as const;

// You can also export individual configs for different components
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,       // Default animation duration (ms)
  SOURCE_FADE_DELAY: 50,         // Delay between source animations (ms)
  MESSAGE_CYCLE_DELAY: 2000,     // Delay for cycling through messages (ms)
  
  // Auto-scroll configuration
  AUTO_SCROLL_ENABLED: true,     // Enable auto-scroll functionality
  AUTO_SCROLL_THRESHOLD: 100,    // Distance from bottom to trigger auto-scroll (px)
  AUTO_SCROLL_BEHAVIOR: 'smooth', // Scroll behavior: 'smooth' or 'auto'
  AUTO_SCROLL_DELAY: 100,        // Delay before auto-scroll (ms)
} as const;

// Model Configuration
export const MODEL_CONFIG = {
  FAST_MODEL: "gpt-4o-mini",     // Fast model for quick operations
  QUALITY_MODEL: "gpt-4o",       // High-quality model for final synthesis
  TEMPERATURE: 0,                // Model temperature (0 = deterministic)
} as const;

// AI Question Generation Configuration
export const AI_QUESTION_CONFIG = {
  MODEL: "gpt-4o-mini",          // Model for question generation
  TEMPERATURE: 0.7,              // Creativity level for question generation
  MAX_TOKENS: 1500,              // Maximum tokens for question generation
  QUESTION_COUNT: 8,             // Number of questions to generate per industry
  MAX_RETRIES: 2,                // Maximum retry attempts
} as const;