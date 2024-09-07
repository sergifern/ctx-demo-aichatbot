'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Send, Sparkles, User, Image as ImageIcon, Bot, CheckCircle, ExternalLink } from 'lucide-react'

type MessageType = {
  type: 'ai' | 'user'
  content: string
  isImage?: boolean,
  verified?: boolean,
}

export function Chatbot() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<MessageType[]>([
    {type: 'ai', content: 'How can Web3GPT help you today?'}
  ])
  const [currentResponse, setCurrentResponse] = useState('')
  const [lastUploadWasImage, setLastUploadWasImage] = useState(false)
  const [messageStep, setMessageStep] = useState(0)
  const chatRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages(prev => [...prev, {type: 'user', content: userMessage}])
    setInput('')
    setIsLoading(true)

    if (inputRef.current) {
      inputRef.current.blur()
    }

    await new Promise(resolve => setTimeout(resolve, 2000))

    let aiResponse = ''
    let verification = false
    if (messageStep === 1) {
      aiResponse = `I can't provide the latest awards or production details for Vega Sicilia Único 2013, as my knowledge is only up to my last training cut-off and I don't have real-time information.`
      setMessageStep(2)
    }
    if (messageStep === 2) {
      aiResponse = `Vega Sicilia Único 2013 is a renowned wine celebrated for its exceptional quality and aging potential. It has received 98 points from Robert Parker's Wine Advocate, reflecting its high status among wine connoisseurs. The vineyards are located at latitude 41.6052° N and longitude 3.7331° W in Ribera del Duero, Spain, where vines aged between 40 to 60 years produce concentrated and complex flavors.

To clarify, Vega Sicilia Único 2013 is made from a blend of 95% Tempranillo and 5% Cabernet Sauvignon, not Garnacha. The winery is committed to sustainability, with a carbon footprint of approximately 1.2 kg CO2 per bottle. The wine contains sulfite levels of around 70-100 mg/L, with minimal additives to maintain its natural characteristics. The production is highly limited, with only 3,000 bottles, and each bottle is aged for 10 years in a combination of French and American oak barrels.`

      verification = true
      setMessageStep(3)
    }


    setMessages(prev => [...prev, {type: 'ai', content: aiResponse, verified: verification}])
    setCurrentResponse(aiResponse)
    setIsLoading(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const imageDataUrl = event.target?.result as string
        setMessages(prev => [...prev, {type: 'user', content: imageDataUrl, isImage: true}])
        setIsLoading(true)

        await new Promise(resolve => setTimeout(resolve, 2000))

        const aiResponse = `Vega Sicilia Único 2013 is a highly regarded wine from the Ribera del Duero region in Spain. The wine is primarily made from a blend of Tempranillo and Garnacha grapes, with each vintage carefully aged for extended periods in a combination of French and American oak barrels.`
        setMessages(prev => [...prev, {type: 'ai', content: aiResponse}])
        setCurrentResponse(aiResponse)
        setIsLoading(false)
        setLastUploadWasImage(true)
        setMessageStep(1)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (currentResponse) {
      let i = 0
      const intervalId = setInterval(() => {
        setMessages(prev => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          if (lastMessage.type === 'ai') {
            lastMessage.content = currentResponse.slice(0, i)
          }
          return newMessages
        })
        i++
        if (i > currentResponse.length) {
          clearInterval(intervalId)
          setCurrentResponse('')
        }
      }, 15)

      return () => clearInterval(intervalId)
    }
  }, [currentResponse])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sofia+Sans+Semi+Condensed:wght@400;700&display=swap');
        body {
          font-family: 'Sofia Sans Semi Condensed', sans-serif;
        }

        @keyframes flowIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .flow-in {
          animation: flowIn 0.5s ease-out forwards;
        }
      `}</style>
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-800 gap-10">
        <img src={"img/ctx-logo-white.png"} alt={"logo"} className="max-h-6" />
        <div className="w-full md:w-3/4 lg:w-3/4 xl:w-3/4 bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden">
          <div className="text-center py-6 border-b border-gray-700 flex items-center justify-center">
            <Bot className="w-8 h-8 mr-3 text-blue-400" />
            <h1 className="text-2xl font-bold">Good morning, Alex</h1>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4 h-[60vh]" ref={chatRef}>
            {messages.map((message, index) => (
              <div key={index} className={`flex items-end space-x-2 ${message.type === 'user' ? 'justify-end' : ''}`}>
                {message.type === 'ai' && <Sparkles className="text-blue-400 mb-2" />}
                <div className={`rounded-lg p-3 text-lg max-w-[80%] ${message.type === 'user' ? 'bg-blue-600' : 'bg-gray-800'}`}>
                  {message.verified && (
                    <div className="mt-2 mb-2 flex items-center text-xs text-green-400">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span>Data verified by Context Protocol</span>
                    </div>
                  )}
                  {message.isImage ? (
                    <img 
                      src={message.content} 
                      alt="Uploaded image" 
                      className="max-w-40 h-auto rounded-lg flow-in" 
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                  
                </div>
                {message.type === 'user' && <User className="text-blue-400 mb-2" />}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <Loader2 className="animate-spin text-blue-400" />
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-700">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Web3GPT"
                className="flex-1 bg-gray-800 border-gray-700 text-white text-lg "
              />
              <Button type="button" size="icon" onClick={() => fileInputRef.current?.click()} className='bg-blue-600 hover:bg-blue-900'>
                <ImageIcon className="h-5 w-5" />
              </Button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <Button type="submit" size="icon" disabled={isLoading} className='bg-blue-600 hover:bg-blue-900'>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}