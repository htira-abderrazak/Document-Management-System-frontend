export interface ChatbotIcons {
  chatbotIcon: string;
  userIcon: string;
}

export interface ChatbotRequest {
  model: string;
  messages: ChatbotMsg[];
}

export interface ChatbotMsg {
  role: 'assistant' | 'user';
  content: string;
}

export interface ChatbotResponse {
  role: 'assistant';
  content: string;
}
