# 🔐 Configuração de Autenticação Google OAuth

## Para habilitar o login com Google, siga estes passos:

### 1. **Criar Projeto no Google Cloud Console**

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Ative a API "Google+ API" ou "Google Identity"

### 2. **Configurar OAuth 2.0**

1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure:
   - **Application Type**: Web application
   - **Name**: Projeto de Vida App
   - **Authorized JavaScript origins**: `http://localhost:3001`
   - **Authorized redirect URIs**: `http://localhost:3001/api/auth/callback/google`

### 3. **Copiar Credenciais**

Após criar, você receberá:
- **Client ID** (exemplo: `123456789-abcdefg.apps.googleusercontent.com`)
- **Client Secret** (exemplo: `GOCSPX-abcdefgh123456789`)

### 4. **Atualizar .env.local**

Substitua no arquivo `.env.local`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=SEU_CLIENT_ID_AQUI
GOOGLE_CLIENT_SECRET=SEU_CLIENT_SECRET_AQUI

# NextAuth Secret (gere uma chave segura)
NEXTAUTH_SECRET=sua-chave-secreta-super-forte-aqui
```

### 5. **Gerar NEXTAUTH_SECRET**

Execute no terminal:
```bash
openssl rand -base64 32
```

### 6. **Reiniciar a Aplicação**

```bash
npm run dev
```

## ✅ **Funcionalidades Implementadas:**

### 🔐 **Sistema de Autenticação**
- Login/Logout com Google
- Sessão persistente
- Proteção de dados

### 💾 **Armazenamento de Dados**
- **Com Login**: Dados salvos na nuvem (SQLite/Prisma)
- **Sem Login**: Dados salvos no localStorage (temporário)
- Auto-save automático para usuários logados

### 🔄 **Migração de Dados**
- Dados do localStorage são preservados ao fazer login
- Sincronização automática entre dispositivos

### 🎨 **Interface Atualizada**
- Botão de login/logout no cabeçalho
- Indicador visual de status de autenticação
- Mensagem de confirmação de salvamento

## 📱 **Como Funciona**

1. **Sem Login**: 
   - Dados salvos no navegador (localStorage)
   - Funciona normalmente, mas dados podem ser perdidos

2. **Com Login**:
   - Dados salvos no banco de dados
   - Sincronização entre dispositivos
   - Recuperação de dados mesmo após limpar cache

3. **Auto-Save**:
   - Usuários logados: salvamento automático na nuvem
   - Usuários anônimos: salvamento no localStorage

## 🚀 **Próximos Passos**

Após configurar o OAuth:
1. Teste o login com sua conta Google
2. Verifique se os dados são salvos corretamente
3. Teste em diferentes dispositivos
4. Configure produção com domínio real

## 🔧 **Para Produção**

Lembre-se de:
1. Adicionar domínio de produção no Google Console
2. Usar variáveis de ambiente seguras
3. Configurar banco de dados em produção (PostgreSQL recomendado)
4. Implementar backups dos dados dos usuários
