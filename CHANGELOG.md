# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.0.5] - 2024-12-10

### Adicionado
- Nova estrutura de pastas `src/` para melhor organização
- Camada de serviços (`storageService.js`) para centralizar operações de dados
- Sistema de design completo com tema global (`src/theme/`)
- Funções utilitárias de formatação (`src/utils/formatters.js`)
- Arquivo CONTRIBUTING.md com guia de contribuição
- Navegação separada em `src/navigation/RootNavigator.js`
- Constantes de rotas para evitar erros de digitação

### Corrigido
- Bug crítico de hooks condicionais em `ConfirmSeriesScreen.js`
- Inconsistência de licença (GPL-3.0 → MIT)
- Campo "author" vazio no package.json

### Removido
- Dependências não utilizadas:
  - axios
  - cheerio
  - glob
  - rimraf
  - victory-native
  - @react-navigation/drawer
  - @react-navigation/bottom-tabs
  - react-native-webview
  - @react-native-async-storage/root (duplicada)

### Alterado
- Versão sincronizada para 0.0.5 no package.json
- README.md completamente reescrito com badges e estrutura profissional
- App.js simplificado usando RootNavigator

## [0.0.4] - 2024-XX-XX

### Adicionado
- Funcionalidade de vincular exercícios a alunos
- Tela de confirmação de série

## [0.0.3] - 2024-XX-XX

### Adicionado
- Cadastro de séries de exercícios
- Gerenciamento de exercícios

## [0.0.2] - 2024-XX-XX

### Adicionado
- Tela de gerenciamento de alunos
- Informações financeiras (mensalidade, vencimento)
- Dias de frequência

## [0.0.1] - 2024-XX-XX

### Adicionado
- Versão inicial do aplicativo
- Cadastro básico de alunos
- Tela de boas-vindas
- Navegação básica
