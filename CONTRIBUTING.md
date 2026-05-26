# Contribuindo para o RotinaPlus

Obrigado pelo interesse em contribuir com o RotinaPlus! 

##  Como Contribuir

### 1. Fork e Clone

1. Faça um fork do projeto clicando no botão "Fork" no GitHub
2. Clone seu fork localmente:
   ```bash
   git clone https://github.com/seu-usuario/RotinaPlus-App-para-Academia.git
   cd RotinaPlus-App-para-Academia
   ```

### 2. Configure o Ambiente

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o projeto:
   ```bash
   npx expo start
   ```

### 3. Crie uma Branch

Crie uma branch descritiva para sua feature ou correção:

```bash
git checkout -b feature/nova-funcionalidade
# ou
git checkout -b fix/corrigir-bug
```

### 4. Faça suas Alterações

- Siga os padrões de código existentes
- Adicione comentários quando necessário
- Teste suas alterações

### 5. Commit

Siga os padrões de commit:

| Prefixo | Uso |
|---------|-----|
| `Add:` | Nova funcionalidade |
| `Fix:` | Correção de bug |
| `Docs:` | Documentação |
| `Style:` | Formatação/estilo |
| `Refactor:` | Refatoração |
| `Test:` | Testes |
| `Chore:` | Tarefas de manutenção |

Exemplo:
```bash
git commit -m "Add: tela de histórico de treinos"
```

### 6. Push e Pull Request

1. Envie suas alterações:
   ```bash
   git push origin feature/nova-funcionalidade
   ```

2. Abra um Pull Request no GitHub
3. Descreva suas alterações detalhadamente

---

##  Padrões de Código

### JavaScript/React Native

- Use ES6+ (arrow functions, destructuring, etc.)
- Componentes funcionais com Hooks
- Nomes de componentes em PascalCase
- Nomes de funções e variáveis em camelCase
- Constantes em UPPER_SNAKE_CASE

### Estrutura de Arquivos

```
src/
├── components/     # Componentes reutilizáveis
├── screens/        # Telas do app
├── navigation/     # Configuração de rotas
├── services/       # Lógica de negócio
├── utils/          # Funções utilitárias
└── theme/          # Estilos globais
```

### Estilização

- Use o tema global (`src/theme/index.js`)
- Evite cores hardcoded, use as do tema
- Use os tokens de espaçamento definidos

---

##  Reportando Bugs

1. Verifique se o bug já foi reportado nas [Issues](https://github.com/JonJonesBR/RotinaPlus-App-para-Academia/issues)
2. Se não, crie uma nova issue com:
   - Título descritivo
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Versão do app e dispositivo

---

##  Sugerindo Features

Adoramos novas ideias! Abra uma issue com:

- Descrição clara da funcionalidade
- Por que seria útil
- Mockups ou exemplos (se possível)

---

##  Código de Conduta

- Seja respeitoso
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros contribuidores

---

## ❓ Dúvidas?

Abra uma issue com a tag `question` ou entre em contato via GitHub.

Obrigado por contribuir! 
