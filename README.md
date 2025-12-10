<div align="center">
  <img src="assets/icon.png" alt="RotinaPlus Logo" width="120" height="120">
  
  # RotinaPlus 🏋️
  
  **Aplicativo para Academias e Profissionais de Educação Física**
  
  [![Versão](https://img.shields.io/badge/versão-0.0.5-blue.svg)](https://github.com/JonJonesBR/RotinaPlus-App-para-Academia/releases)
  [![Licença](https://img.shields.io/badge/licença-MIT-green.svg)](LICENSE)
  [![React Native](https://img.shields.io/badge/React%20Native-0.76.3-61DAFB.svg?logo=react)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-52.0-000020.svg?logo=expo)](https://expo.dev/)
  
  [📱 Download APK](https://github.com/JonJonesBR/RotinaPlus-App-para-Academia/releases/download/v0.0.5/ROTINA+.ALPHA.0.0.5.apk) • [📖 Documentação](#-uso) • [🤝 Contribuir](#-contribuição)
</div>

---

## 📖 Sobre

O **RotinaPlus** é um aplicativo desenvolvido para facilitar a gestão de academias e otimizar o trabalho de profissionais autônomos de educação física. Com foco em organização e personalização, oferece ferramentas práticas para gerenciar alunos, treinos e informações de forma eficiente.

### 🎯 Objetivo

Otimizar o gerenciamento de treinos e a organização de informações relacionadas aos alunos, promovendo um ambiente mais organizado e funcional para academias e treinadores.

---

## ✨ Funcionalidades

### 📋 Cadastro e Gerenciamento de Alunos
- Cadastro completo de informações pessoais: nome, CPF, idade, peso, altura e observações
- Registro de frequência semanal
- Informações financeiras, como mensalidade e vencimento
- Edição e exclusão de dados dos alunos
- Acesso a detalhes completos do aluno

### 🏋️ Gerenciamento de Exercícios e Séries
- Criação de séries de exercícios personalizadas
- Vinculação de séries aos alunos cadastrados
- Edição e exclusão de séries de forma individual
- Registro de número de séries e repetições

### 🏠 Navegação Simplificada
- Tela inicial clara e intuitiva, com atalhos para gerenciamento de alunos e exercícios
- Opção de retornar à tela inicial diretamente em qualquer funcionalidade

---

## 🚀 Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Dispositivo Android/iOS ou emulador

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/JonJonesBR/RotinaPlus-App-para-Academia.git
   cd RotinaPlus-App-para-Academia
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npx expo start
   ```

4. **Abra no dispositivo**
   - Escaneie o QR code com o app [Expo Go](https://expo.dev/client)
   - Ou pressione `a` para abrir no emulador Android
   - Ou pressione `i` para abrir no simulador iOS

---

## 📂 Estrutura do Projeto

```
RotinaPlus-App-para-Academia/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   ├── screens/            # Telas do aplicativo
│   │   ├── WelcomeScreen.js
│   │   ├── StudentForm.js
│   │   ├── StudentListScreen.js
│   │   ├── StudentManagementScreen.js
│   │   ├── StudentDetailsScreen.js
│   │   ├── ExerciseLogScreen.js
│   │   ├── SeriesFormScreen.js
│   │   └── ConfirmSeriesScreen.js
│   ├── navigation/         # Configuração de rotas
│   ├── services/           # Lógica de negócio
│   ├── utils/              # Funções utilitárias
│   └── theme/              # Estilos e tema global
├── assets/                 # Imagens e recursos
├── App.js                  # Ponto de entrada
├── app.json                # Configuração Expo
└── package.json            # Dependências
```

---

## 📱 Uso

### Tela Inicial
Acesse as opções principais, como **Gerenciar Alunos** e **Registro de Exercícios**.

### Cadastro de Alunos
Registre os alunos preenchendo campos como nome, CPF, idade, altura, peso e dias de frequência.

### Gerenciamento de Treinos
Crie séries de exercícios, configure séries e repetições, e vincule-as aos alunos.

### Exclusões e Ajustes
Gerencie e exclua séries ou informações de alunos diretamente nas telas de gerenciamento.

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| [React Native](https://reactnative.dev/) | 0.76.3 | Framework mobile cross-platform |
| [Expo](https://expo.dev/) | 52.0 | Plataforma de desenvolvimento |
| [React Navigation](https://reactnavigation.org/) | 6.x | Sistema de navegação |
| [React Native Paper](https://callstack.github.io/react-native-paper/) | 5.12.5 | Biblioteca de componentes UI |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | 1.23.1 | Armazenamento local persistente |

---

## 🗺️ Roadmap

- [ ] 🍽️ Planejamento de refeições e contagem de calorias
- [ ] 🎥 Visualização integrada de vídeos de exercícios
- [ ] ☁️ Backup e sincronização na nuvem
- [ ] 📊 Relatórios e gráficos de progresso
- [ ] 🔔 Notificações de vencimento de mensalidades
- [ ] 📱 Versão para iOS na App Store

---

## 🤝 Contribuição

Contribuições são bem-vindas! Siga os passos abaixo para colaborar:

1. **Fork** o projeto
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b feature/nova-feature
   ```
3. Faça commit das suas alterações:
   ```bash
   git commit -m 'Add: nova feature'
   ```
4. Faça push para a branch:
   ```bash
   git push origin feature/nova-feature
   ```
5. Abra um **Pull Request** e descreva suas alterações

### Padrões de Commit

- `Add:` para novas funcionalidades
- `Fix:` para correções de bugs
- `Docs:` para atualizações de documentação
- `Refactor:` para refatorações de código
- `Style:` para alterações de estilo/formatação

---

## 📜 Licença

Este projeto está licenciado sob a **Licença MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  
  Desenvolvido com ❤️ por [JonJonesBR](https://github.com/JonJonesBR)
  
  ⭐ Se este projeto te ajudou, considere dar uma estrela!
  
</div>
