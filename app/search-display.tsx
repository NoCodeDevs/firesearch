'use client';

import { SearchEvent, SearchStep, SearchPhase } from '@/lib/langgraph-search-engine';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { MarkdownRenderer } from './markdown-renderer';
import { getFaviconUrl, getDefaultFavicon, markFaviconFailed } from '@/lib/favicon-utils';
import { UI_CONFIG } from '@/lib/config';

// Clean, modern progress indicator
function ProgressIndicator({ steps, elapsedSeconds, sourcesFound }: {
  steps: SearchStep[];
  elapsedSeconds: number;
  sourcesFound: number;
}) {
  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200">Research Progress</h3>
        <div className="flex items-center gap-4 text-xs text-slate-200">
          <span>⏱️ {formatTime(elapsedSeconds)}</span>
          <span>📊 {sourcesFound} sources</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {step.status === 'completed' ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : step.status === 'active' ? (
                <div className="w-6 h-6 rounded-full bg-emerald-400 animate-pulse flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-600"></div>
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm transition-colors ${
                step.status === 'active' 
                  ? 'text-slate-200 font-medium' 
                  : step.status === 'completed'
                  ? 'text-slate-300'
                  : 'text-slate-500'
              }`}>
                {step.label}
              </p>
              {step.status === 'active' && (
                <p className="text-xs text-slate-400 mt-1">Processing...</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Clean event renderer
function EventRenderer({ event, events }: { event: SearchEvent; events: SearchEvent[] }) {
  switch (event.type) {
    case 'thinking':
      const messages = event.message.split('|');
      const isAnimated = messages.length > 1;
      
      if (isAnimated) {
        return <AnimatedThinkingLine messages={messages} />;
      }
      
      const isInitialThinking = event.message.includes('###') || event.message.includes('**');
      
      if (isInitialThinking) {
        return (
          <div className="text-slate-300 text-sm">
            <MarkdownRenderer content={event.message} />
          </div>
        );
      }
      
      return (
        <div className="flex items-start gap-3 text-slate-300">
          <div className="w-5 h-5 mt-0.5 rounded bg-slate-700 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="text-sm">{event.message}</span>
        </div>
      );
    
    case 'searching':
      const searchingQuery = event.query.toLowerCase().trim();
      const searchCompleted = events.some(e => {
        if (e.type !== 'found') return false;
        const foundQuery = e.query.toLowerCase().trim();
        return foundQuery === searchingQuery;
      });
      
      return (
        <div className="flex items-start gap-3 text-slate-300">
          <div className="w-5 h-5 mt-0.5 rounded bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            {searchCompleted ? (
              <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>
          <span className="text-sm">
            Search {event.index} of {event.total}: <span className="font-medium text-slate-200">&quot;{event.query}&quot;</span>
            {!searchCompleted && <span className="text-xs text-slate-400 ml-2">Finding sources...</span>}
          </span>
        </div>
      );
    
    case 'found':
      return (
        <div className="flex items-start gap-3 text-slate-300">
          <div className="w-5 h-5 mt-0.5 rounded bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm">
            Found <span className="font-semibold text-slate-200">{event.sources.length} sources</span> for &quot;{event.query}&quot;
          </span>
        </div>
      );
    
    case 'scraping':
      return (
        <div className="flex items-start gap-3">
          <Image 
            src={getFaviconUrl(event.url)} 
            alt=""
            width={20}
            height={20}
            className="w-5 h-5 mt-0.5 flex-shrink-0 rounded"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = getDefaultFavicon(20);
              markFaviconFailed(event.url);
            }}
          />
          <div className="flex-1">
            <div className="text-sm text-slate-200">
              Browsing <span className="font-medium text-emerald-400">{new URL(event.url).hostname}</span> for &quot;{event.query}&quot;
            </div>
          </div>
        </div>
      );
    
    case 'phase-update':
      return (
        <div className="flex items-start gap-3 text-slate-200 font-medium">
          <div className="w-5 h-5 mt-0.5 rounded bg-slate-700 flex items-center justify-center">
            <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm">{event.message}</span>
        </div>
      );
    
    case 'error':
      return (
        <div className="flex items-start gap-3 text-red-400">
          <div className="w-5 h-5 mt-0.5 rounded bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm">
            <span className="font-medium">Error: </span>
            <span>{event.error}</span>
            {event.errorType && <span className="text-xs ml-2">({event.errorType})</span>}
          </div>
        </div>
      );
    
    default:
      return null;
  }
}

// Animated thinking line component
function AnimatedThinkingLine({ messages }: { messages: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (messages.length <= 1) return;
    
    const cycleMessages = () => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 150);
    };
    
    const interval = setInterval(cycleMessages, 2000);
    return () => clearInterval(interval);
  }, [messages]);
  
  return (
    <div className="flex items-start gap-3 text-slate-300">
      <div className="w-5 h-5 mt-0.5 rounded bg-slate-700 flex items-center justify-center flex-shrink-0">
        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <span className={`text-sm transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {messages[currentIndex]}
      </span>
    </div>
  );
}

export function SearchDisplay({ events }: { events: SearchEvent[] }) {
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [, setCompletedPhases] = useState<Set<string>>(new Set());
  const [currentPhase, setCurrentPhase] = useState<SearchPhase | null>(null);
  const [scrapedCount, setScrapedCount] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Initialize steps and start timer
  useEffect(() => {
    if (steps.length === 0 && events.length > 0) {
      setSteps([
        { id: 'understanding', label: 'Understanding request', status: 'pending' },
        { id: 'planning', label: 'Planning search', status: 'pending' },
        { id: 'searching', label: 'Searching sources', status: 'pending' },
        { id: 'analyzing', label: 'Analyzing content', status: 'pending' },
        { id: 'synthesizing', label: 'Synthesizing answer', status: 'pending' },
        { id: 'complete', label: 'Complete', status: 'pending' }
      ]);
      setStartTime(Date.now());
    }
  }, [events.length, steps.length]);

  // Update timer every second
  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        if (!showFinalResult) {
          setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [startTime, showFinalResult]);

  // Auto-scroll to bottom when new events are added
  useEffect(() => {
    if (!UI_CONFIG.AUTO_SCROLL_ENABLED || !contentRef.current) return;
    
    const element = contentRef.current;
    const shouldScroll = element.scrollTop + element.clientHeight >= element.scrollHeight - UI_CONFIG.AUTO_SCROLL_THRESHOLD;
    
    if (shouldScroll) {
      // Add a small delay for better UX
      setTimeout(() => {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: UI_CONFIG.AUTO_SCROLL_BEHAVIOR as ScrollBehavior
        });
      }, UI_CONFIG.AUTO_SCROLL_DELAY);
    }
  }, [events.length]);

  // Update steps based on events
  useEffect(() => {
    const searchEvents = events.filter(e => e.type === 'searching');
    const uniqueQueries = [...new Set(searchEvents.map(e => e.type === 'searching' ? e.query : ''))];
    
    const latestPhaseEvent = events.findLast(e => e.type === 'phase-update');
    if (latestPhaseEvent?.type === 'phase-update') {
      setCurrentPhase(latestPhaseEvent.phase);
      
      const phases: SearchPhase[] = ['understanding', 'planning', 'searching', 'analyzing', 'synthesizing', 'complete'];
      const currentPhaseIndex = phases.indexOf(latestPhaseEvent.phase);
      if (currentPhaseIndex > 0) {
        setCompletedPhases(prev => {
          const newCompleted = new Set(prev);
          for (let i = 0; i < currentPhaseIndex; i++) {
            newCompleted.add(phases[i]);
          }
          return newCompleted;
        });
      }
      
      setSteps(() => {
        const baseSteps = [
          { id: 'understanding', label: 'Understanding request', status: 'pending' },
          { id: 'planning', label: 'Planning search', status: 'pending' },
          { id: 'searching', label: 'Searching sources', status: 'pending' }
        ] as SearchStep[];
        
        if (['searching', 'analyzing', 'synthesizing', 'complete'].includes(latestPhaseEvent.phase) && uniqueQueries.length > 0) {
          uniqueQueries.forEach((query, idx) => {
            const queryLabel = query.length > 25 ? query.substring(0, 25) + '…' : query;
            baseSteps.push({
              id: `search-${idx}`,
              label: queryLabel,
              status: 'pending'
            });
          });
        }
        
        baseSteps.push(
          { id: 'analyzing', label: 'Analyzing content', status: 'pending' },
          { id: 'synthesizing', label: 'Synthesizing answer', status: 'pending' },
          { id: 'complete', label: 'Complete', status: 'pending' }
        );
        
        const phases: SearchPhase[] = ['understanding', 'planning', 'searching', 'analyzing', 'synthesizing', 'complete'];
        const currentPhaseIndex = phases.indexOf(latestPhaseEvent.phase);
        
        baseSteps.forEach((step) => {
          if (step.id.startsWith('search-')) {
            const searchIndex = parseInt(step.id.split('-')[1]);
            const searchQuery = uniqueQueries[searchIndex];
            const foundEvent = events.find(e => 
              e.type === 'found' && e.query.toLowerCase().trim() === searchQuery.toLowerCase().trim()
            );
            
            if (foundEvent) {
              step.status = 'completed';
            } else if (currentPhaseIndex >= 2) {
              step.status = 'active';
            } else {
              step.status = 'pending';
            }
          } else {
            const stepPhaseIndex = phases.indexOf(step.id as SearchPhase);
            if (stepPhaseIndex < currentPhaseIndex) {
              step.status = 'completed';
            } else if (stepPhaseIndex === currentPhaseIndex) {
              step.status = 'active';
            }
          }
        });
        
        return baseSteps;
      });
    }
  }, [events]);

  // Handle final result
  useEffect(() => {
    const finalResult = events.find(e => e.type === 'final-result');
    if (finalResult) {
      setShowFinalResult(true);
    }
    
    const foundEvents = events.filter(e => e.type === 'found');
    const totalSourcesFound = foundEvents.reduce((acc, event) => {
      return acc + (event.type === 'found' ? event.sources.length : 0);
    }, 0);
    setScrapedCount(totalSourcesFound);
  }, [events]);

  const latestResult = events.findLast(e => e.type === 'final-result');
  
  // Show final result if complete
  if (showFinalResult && latestResult?.type === 'final-result') {
    return (
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-slate-200 font-semibold">Research Complete</h3>
            <p className="text-slate-400 text-sm">Found {scrapedCount} sources in {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {events.filter(e => e.type !== 'content-chunk' && e.type !== 'final-result').map((event, i) => (
            <div key={i}>
              <EventRenderer event={event} events={events} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show search progress
  return (
    <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Sidebar */}
        <div className="lg:col-span-1">
          <ProgressIndicator 
            steps={steps} 
            currentPhase={currentPhase} 
            elapsedSeconds={elapsedSeconds} 
            sourcesFound={scrapedCount} 
          />
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div 
            ref={contentRef}
            className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-custom"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(148, 163, 184, 0.3) transparent'
            }}
          >
            {events.filter(e => e.type !== 'content-chunk' && e.type !== 'final-result').map((event, i) => (
              <div key={i} className="animate-fade-in">
                <EventRenderer event={event} events={events} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}