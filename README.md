<div align="center">
  <img src="assets/icon.png" alt="RotinaPlus Logo" width="120" height="120">
  
  # RotinaPlus ðŸ‹ï¸
  
  **A SoluÃ§Ã£o Completa para Academias e Personal Trainers**
  
  [![VersÃ£o](https://img.shields.io/badge/versÃ£o-0.0.5-blue.svg)](https://github.com/JonJonesBR/RotinaPlus-App-para-Academia/releases)
  [![LicenÃ§a](https://img.shields.io/badge/licenÃ§a-MIT-green.svg)](LICENSE)
  [![React Native](https://img.shields.io/badge/React%20Native-0.81+-61DAFB.svg?logo=react)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-SDK%2052+-000020.svg?logo=expo)](https://expo.dev/)
  
  [ðŸ“± Download APK v0.0.8](https://github.com/JonJonesBR/RotinaPlus-App-para-Academia/releases/download/v0.0.8/RotinaPlus-v0.0.8.apk) â€¢ [ðŸ“– DocumentaÃ§Ã£o](#-Funcionalidades) â€¢ [ðŸ¤ Contribuir](#-contribuiÃ§Ã£o)
</div>

---

## ðŸ“– Sobre

O **RotinaPlus** Ã© um aplicativo robusto e inovador desenvolvido para modernizar a gestÃ£o de treinos e alunos. Com sua arquitetura **Dual Mode**, ele atende tanto **Professores/Academias** quanto **Alunos**, oferecendo uma experiÃªncia personalizada e segura para cada perfil.

O app foca na seguranÃ§a dos dados (armazenamento local criptografado), facilidade de compartilhamento (QR Codes offline) e usabilidade premium.


---

## ðŸ“± Galeria do App

> Interface moderna, intuitiva e em Dark Mode para economizar bateria e oferecer a melhor experiÃªncia.

### ðŸ  Acesso e Boas-vindas
<div align="center">
  <img src="assets/screenshots/auth_01.jpeg" width="30%" alt="Tela Inicial" />
</div>

### ðŸ‘¨â€ðŸ« Ãrea do Professor
<div align="center">
  <img src="assets/screenshots/prof_01.jpeg" width="30%" alt="Dashboard Professor" />
  <img src="assets/screenshots/prof_02.jpeg" width="30%" alt="GestÃ£o Alunos" />
  <img src="assets/screenshots/prof_03.jpeg" width="30%" alt="Detalhe Aluno" />
</div>
<div align="center">
  <img src="assets/screenshots/prof_04.jpeg" width="30%" alt="Novo Treino" />
  <img src="assets/screenshots/prof_05.jpeg" width="30%" alt="FormulÃ¡rio Treino" />
  <img src="assets/screenshots/prof_06.jpeg" width="30%" alt="Lista ExercÃ­cios" />
</div>
<div align="center">
  <img src="assets/screenshots/prof_07.jpeg" width="30%" alt="QR Code" />
  <img src="assets/screenshots/prof_08.jpeg" width="30%" alt="Financeiro Prof" />
  <img src="assets/screenshots/prof_09.jpeg" width="30%" alt="Perfil Prof" />
</div>
<div align="center">
  <img src="assets/screenshots/prof_10.jpeg" width="30%" alt="ConfiguraÃ§Ãµes" />
  <img src="assets/screenshots/prof_11.jpeg" width="30%" alt="Ajuda" />
</div>

### ðŸ‹ï¸ Ãrea do Aluno
<div align="center">
  <img src="assets/screenshots/student_01.jpeg" width="30%" alt="Dashboard Aluno" />
  <img src="assets/screenshots/student_02.jpeg" width="30%" alt="Treino do Dia" />
  <img src="assets/screenshots/student_03.jpeg" width="30%" alt="ExecuÃ§Ã£o Treino" />
</div>
<div align="center">
  <img src="assets/screenshots/student_04.jpeg" width="30%" alt="Timer Descanso" />
  <img src="assets/screenshots/student_05.jpeg" width="30%" alt="QR Scanner" />
  <img src="assets/screenshots/student_06.jpeg" width="30%" alt="Financeiro Aluno" />
</div>
<div align="center">
  <img src="assets/screenshots/student_07.jpeg" width="30%" alt="Perfil Aluno" />
</div>

---

## âœ¨ Funcionalidades

### ðŸ” SeguranÃ§a e AutenticaÃ§Ã£o
- **Modo Dual**: Interface adaptativa para Professor ou Aluno.
- **ProteÃ§Ã£o BiomÃ©trica**: Suporte a FaceID/TouchID para acesso rÃ¡pido e seguro.
- **PIN de SeguranÃ§a**: Bloqueio por senha numÃ©rica como fallback.
- **Criptografia**: Dados sensÃ­veis armazenados com `SecureStore` e hash SHA-256.

### ðŸ‘¨â€ðŸ« Modo Professor
- **GestÃ£o de Alunos**: Cadastro completo, histÃ³rico e status de pagamento.
- **Montagem de Treinos**: Ferramenta flexÃ­vel para criar rotinas personalizadas (SÃ©ries, RepetiÃ§Ãµes, Carga, Descanso).
- **QR Code Export**: Compartilhe treinos e vÃ­nculos com alunos instantaneamente via QR Code.
- **GestÃ£o Financeira**: Controle de mensalidades, chaves PIX e status de pagamentos.

### ðŸ‹ï¸ Modo Aluno
- **Dashboard Personalizado**: VisualizaÃ§Ã£o clara dos treinos do dia.
- **QR Code Import**: Receba treinos e vincule-se ao professor escaneando um cÃ³digo.
- **HistÃ³rico**: Acompanhe a frequÃªncia e evoluÃ§Ã£o.
- **Carteira Digital**: InformaÃ§Ãµes de pagamento e status da mensalidade.

### ðŸ“¡ SincronizaÃ§Ã£o Offline (QR Sync)
- Tecnologia proprietÃ¡ria de transferÃªncia de dados via QR Code.
- Funciona sem internet: O professor gera o cÃ³digo, o aluno escaneia e os dados sÃ£o transferidos localmente.
- Assinatura digital para garantir a integridade dos dados.

---

## ðŸš€ InstalaÃ§Ã£o e Desenvolvimento

### PrÃ©-requisitos
- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Dispositivo Android/iOS ou Emulador

### ConfiguraÃ§Ã£o do Ambiente
1. **Clone o repositÃ³rio**
   ```bash
   git clone https://github.com/JonJonesBR/RotinaPlus-App-para-Academia.git
   cd RotinaPlus-App-para-Academia
   ```

2. **Instale as dependÃªncias**
   ```bash
   npm install
   ```

3. **Inicie o servidor**
   ```bash
   npx expo start
   ```

4. **Testes** (Opcional)
   ```bash
   npm test
   ```

---

## ðŸ“‚ Estrutura do Projeto

```
RotinaPlus-App-para-Academia/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/         # UI Kit reutilizÃ¡vel (Cards, Buttons, Inputs)
â”‚   â”œâ”€â”€ screens/
â”‚   â”‚   â”œâ”€â”€ auth/           # Telas de Login, PIN, Biometria
â”‚   â”‚   â”œâ”€â”€ professor/      # Dashboard e ferramentas do Professor
â”‚   â”‚   â”œâ”€â”€ aluno/          # Dashboard e ferramentas do Aluno
â”‚   â”‚   â””â”€â”€ common/         # Telas compartilhadas
â”‚   â”œâ”€â”€ services/           # Camada de ServiÃ§os
â”‚   â”‚   â”œâ”€â”€ authService.js      # LÃ³gica de AutenticaÃ§Ã£o
â”‚   â”‚   â”œâ”€â”€ cryptoService.js    # Criptografia e SeguranÃ§a
â”‚   â”‚   â”œâ”€â”€ storageService.js   # PersistÃªncia de Dados (AsyncStorage)
â”‚   â”‚   â”œâ”€â”€ qrCodeService.js    # GeraÃ§Ã£o/Leitura de QR Codes
â”‚   â”‚   â””â”€â”€ notificationService.js # NotificaÃ§Ãµes Locais
â”‚   â”œâ”€â”€ models/             # DefiniÃ§Ãµes de Tipos e Factories
â”‚   â”œâ”€â”€ utils/              # Formatadores e Helpers
â”‚   â””â”€â”€ theme/              # Tokens de Design e Tema Escuro/Claro
â”œâ”€â”€ assets/                 # Imagens e Fontes
â”œâ”€â”€ __tests__/              # Testes UnitÃ¡rios (Jest)
â”œâ”€â”€ App.js                  # Entry Point e ConfiguraÃ§Ã£o de Contextos
â””â”€â”€ app.json                # ConfiguraÃ§Ã£o Expo (Plugins, PermissÃµes)
```

---

## ðŸ—ºï¸ Roadmap & Status

- [x] âœ… **RefatoraÃ§Ã£o UI/UX (Design System Premium)**
- [x] âœ… **Modo Dual (Aluno/Professor)**
- [x] âœ… **Sistema de AutenticaÃ§Ã£o (PIN/Biometria)**
- [x] âœ… **SincronizaÃ§Ã£o via QR Code (QR Sync)**
- [x] âœ… **NotificaÃ§Ãµes Locais**
- [x] âœ… **Cobertura de Testes UnitÃ¡rios**
- [ ] â˜ï¸ Backup em Nuvem (Futuro)
- [ ] ðŸ“Š GrÃ¡ficos de EvoluÃ§Ã£o AvanÃ§ados (Futuro)
- [ ] ðŸŽ PublicaÃ§Ã£o na App Store (Futuro)

---

## ðŸ¤ ContribuiÃ§Ã£o

ContribuiÃ§Ãµes sÃ£o bem-vindas! Siga o fluxo de **Feature Branch**:

1. Fork o projeto.
2. Crie sua branch (`git checkout -b feature/AmazingFeature`).
3. Commit suas mudanÃ§as (`git commit -m 'feat: Add some AmazingFeature'`).
4. Push para a branch (`git push origin feature/AmazingFeature`).
5. Abra um Pull Request.

---

## ðŸ“œ LicenÃ§a

Este projeto estÃ¡ licenciado sob a **LicenÃ§a MIT**.

---

<div align="center">
  Desenvolvido com excelÃªncia por <b>JonJonesBR</b>
</div>

## Destaques tecnicos

- Codigo organizado para leitura rapida por avaliadores tecnicos.
- Configuracao local documentada sem exposicao de credenciais.
- Separacao entre arquivos versionados e dados sensiveis de ambiente.

## Seguranca e configuracao

Este repositorio nao deve conter credenciais reais. Use .env.example como modelo e mantenha chaves, tokens, senhas e URLs privadas fora do Git.

