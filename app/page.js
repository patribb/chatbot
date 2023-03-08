/* eslint-disable @next/next/no-img-element */
'use client'
import {useRef, useState} from 'react'
import Image from 'next/image'
// import { marked } from 'marked'
// import parse from 'html-react-parser'

export default function Home() {
  const messageRef = useRef()
  const [messages, setMessages] = useState([])
  const [displayMessage, setDisplayMessage] = useState('Hola, qué tal?!')
  const [loading, setLoading] = useState(false)

  const hadleSubmit = async (e) => {
    e.preventDefault()
    const prompt = messageRef.current.value
    setLoading(true)
    let newMessageList = [...messages, { role: 'user', content: prompt }]
    try {
      const response = await fetch('/api/bot', {
        method: 'POST', headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({messages: newMessageList})
      })
      if(!response.ok) return
      const data = await response.json()
      newMessageList.push({ role: data.response.message.role, content: data.response.message.content })
      setMessages(newMessageList)
      setDisplayMessage(data.response.message.content)
      messageRef.current.value = ''
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto p-3 max-w-4xl">
      <div className="grid grid-cols-2 mt-10">
        <div className={`bg-[#B3EBF1] relative rounded-xl py-4 px-4 flex flex-col justify-center ${ loading ? "animate-pulse" : ""}`}>
        <div className="absolute h-[15px] w-[15px] bg-[#B3EBF1] -right-[7px] top-[50%] rotate-45"></div>
          <h3 className="text-2xl text-gray-700 font-black">Botty dice:</h3>
          <p className="text-gray-700">{loading ? '[Botty está pensando...]' : displayMessage}</p>
        </div>
        <div>
          <Image priority src='/bot.png' alt="Botty" width={512} height={512} />
        </div>
      </div>
      <form className='mt-6' onSubmit={hadleSubmit}>
        <div className="flex flex-col gap-4 mt-5">
          <label className="font-bold text-gray-700">Di algo...</label>
          <input 
            ref={messageRef}
            type="text" 
            required 
            className='outline-none text-sm px-4 py-2 text-gray-700 placeholder:text-gray-500 border border-[#B3EBF1] rounded-full' 
            placeholder='Haz una pregunta o di algo bonito ...' 
          />
        </div>
        <button 
          type='submit'
          className='px-4 py-2 mt-2 text-gray-700 font-bold bg-[#B3EBF1] rounded-full hover:scale-110 transition-all duration-200'>
          Enviar 🚀
        </button>
      </form>
      <div className="mt-6">
        {messages.map((message, idx) => {
          return (
            <div key={idx} className="flex items-center gap-4 py-2">
              <div className="w-[10%] flex items-center">
                {message.role === "assistant" ? (
                  <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                    <img
                      alt='Botty'
                      src="/bot.png"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-xl text-gray-700 font-bold">Tú:</div>
                )}
              </div>

              <div className="bg-gray-100 py-5 px-4 border tex-gray-700  border-[#B3EBF1] rounded-full">
                {message.content}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  )
}
