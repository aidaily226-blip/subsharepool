'use client'
import { useEffect, useRef } from 'react'

export default function AdsterraAd() {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (adRef.current && !adRef.current.querySelector('script')) {
      const script = document.createElement('script')
      script.async = true
      script.dataset.cfasync = 'false'
      script.src = 'https://pl29290402.profitablecpmratenetwork.com/11913838880defd0ff54d22f910990ca/invoke.js'
      adRef.current.appendChild(script)
    }
  }, [])

  return (
    <div className="w-full flex justify-center my-6 overflow-hidden min-h-[50px] bg-white border border-gray-100 rounded-xl p-2 sm:p-4">
      <div id="container-11913838880defd0ff54d22f910990ca"></div>
      {/* We inject the script next to the container so it runs correctly */}
      <div ref={adRef} className="hidden"></div>
    </div>
  )
}
