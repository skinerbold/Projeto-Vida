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
          <span className="text-sm font-medium text-gray-700">
            Olá, {session.user?.name?.split(' ')[0] || 'Usuário'}!
          </span>
        </div>
        
        <button
          onClick={() => signOut()}
          className="btn-secondary py-2 px-4 text-sm flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </motion.div>
    )
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => signIn('google')}
      className="btn-primary py-2 px-4 text-sm flex items-center space-x-2"
    >
      <LogIn className="w-4 h-4" />
      <span>Entrar com Google</span>
    </motion.button>
  )
}
