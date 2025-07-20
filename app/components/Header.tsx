'use client'

import AuthButton from './AuthButton'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 p-4">
      <div className="container mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20">
        <div className="relative flex items-center justify-center h-16 px-4 sm:px-6 lg:px-8">
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-xl md:text-2xl font-serif font-bold gradient-text whitespace-nowrap">
              Projeto de Vida
            </h1>
          </div>
          <div className="absolute right-4">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  )
}