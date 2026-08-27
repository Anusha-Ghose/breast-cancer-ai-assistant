import { createContext, useContext, useState } from 'react'
import { chatExamples } from '../data/mockData.js'
import { chatWithAssistant } from '../services/api.js'

const AssistantContext = createContext()

export const AssistantProvider = ({ children }) => {
  const [messages, setMessages] = useState(chatExamples)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const send = async (text, lang) => {
    if (!text.trim()) return
    
    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    setIsTyping(true)
    
    try {
      const res = await chatWithAssistant(text, lang)
      let replyText = res.data.answer || "I could not find an answer."
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: replyText,
          grounded: true,
        },
      ])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "I encountered an error while trying to process your request.",
          grounded: false,
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <AssistantContext.Provider value={{ messages, setMessages, input, setInput, isTyping, setIsTyping, send }}>
      {children}
    </AssistantContext.Provider>
  )
}

export const useAssistant = () => useContext(AssistantContext)
