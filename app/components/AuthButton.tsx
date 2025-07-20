'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { LogIn, LogOut, User } from 'lucide-react'

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
        <span className="text-sm">Carregando...</span>
      </div>
    )
  }

  if (session) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        {/* Informações do Usuário */}
        <div className="flex items-center space-x-2">
          {session.user?.image ? (
            <img 
              src={session.user.image} 
              alt={session.user.name || 'Usuário'} 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          <span className="hidden sm:inline text-sm font-medium text-gray-700">
            Olá, {session.user?.name?.split(' ')[0] || 'Usuário'}!
          </span>
        </div>
        
        {/* Botão Sair */}
        <button
          onClick={() => signOut()}
          className="btn-secondary p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
          title="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </motion.div>
    )
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => signIn('google', { callbackUrl: '/' })}
      className="btn-primary py-2 px-4 text-sm flex items-center space-x-2"
    >
      <LogIn className="w-4 h-4" />
      <span>Entrar com Google</span>
    </motion.button>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 p-4">
      <div className="container mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20">
        <div className="relative flex items-center justify-center h-16 px-4 sm:px-6 lg:px-8">
          {/* Título Centralizado */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-xl md:text-2xl font-serif font-bold gradient-text whitespace-nowrap">
              Projeto de Vida
            </h1>
          </div>

          {/* Botão de Autenticação à Direita */}
          <div className="absolute right-4">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  )
}
