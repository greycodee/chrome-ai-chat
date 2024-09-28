"use client"

import React, { useEffect, useState,useRef } from 'react'
import { Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function Home() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you today?", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    console.log(scrollAreaRef.current);
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // 初始化模型
  const [model, setModel] = useState<any>(null);
  useEffect(() => {
    const initializeModel = async () => {
      try {
        const model = await window.ai.assistant.create();
        setModel(model);
      } catch (error) {
        console.error('Error initializing model:', error);
      }
    };
    initializeModel();
  }, []);

  // const model = await window.ai.assistant.create();
  // const res = await model.prompt("how to request http api in nodejs and use es6?");
  // return res;
      


  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: input, sender: 'user' }]);
      setInput('');
      let res = await model.prompt(input);
      console.log(res);
      setMessages(msgs => [...msgs, { id: msgs.length + 1, text: res, sender: 'bot' }]);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Chat Interface</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`flex items-end ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{message.sender === 'user' ? 'U' : 'B'}</AvatarFallback>
                  <AvatarImage src={message.sender === 'user' ? "/placeholder-user.jpg" : "/placeholder-bot.jpg"} />
                </Avatar>
                <div className={`mx-2 py-2 px-3 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {message.text}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full items-center space-x-2">
          <Input 
            placeholder="Type your message..." 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}