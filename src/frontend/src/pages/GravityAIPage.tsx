import { useState } from 'react';
import { useGetCallerUserProfile } from '../hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send } from 'lucide-react';
import { generateAIResponse } from '../lib/gravityAI/respond';
import ProGate from '../components/subscription/ProGate';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

export default function GravityAIPage() {
  const { data: profile } = useGetCallerUserProfile();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "I'm GravityAI. Direct. Athletic. Performance-focused. Ask me about load recommendations, plan creation, recovery, technique, or product features.",
      suggestions: ['Recommend my starting load', 'Help me build a plan', 'Recovery advice']
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages([...messages, userMessage]);

    const response = generateAIResponse(input, profile || null);
    const assistantMessage: Message = {
      role: 'assistant',
      content: response.message,
      suggestions: response.suggestions
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInput('');
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <ProGate>
      <div className="flex h-[calc(100vh-8rem)] flex-col pb-24">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">GravityAI</h1>
          <p className="text-muted-foreground">Your performance coach.</p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index}>
              <Card className={message.role === 'user' ? 'ml-12 bg-accent' : 'mr-12'}>
                <CardContent className="p-4">
                  <p className="text-sm whitespace-pre-wrap selectable-text">{message.content}</p>
                </CardContent>
              </Card>
              {message.suggestions && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handleSuggestion(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about load, plans, recovery, technique..."
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.4_0.243_264.376)]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </ProGate>
  );
}
