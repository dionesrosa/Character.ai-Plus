# Character.AI Extras

Extensão Userscript para melhorar a leitura e organização das mensagens no Character.AI.

Transforma o chat em um formato mais legível, separando falas, ações e narrações com destaque visual.

---

## ✨ O que esse script faz

- Remove anúncios do layout
- Destaca falas com travessão (—)
- Converte narrações em estilo de pensamento (itálico + cor)
- Remove ruído de formatação do CharacterAI:
  - aspas externas
  - `*` e `_` de markdown
  - travessões duplicados
- Separa visualmente falas e ações
- Organiza mensagens em blocos mais fáceis de ler

---

## 🎯 Exemplo de transformação

### Antes:
```

"Qualquer horário mesmo?" *Ele perguntou baixo.*

```

### Depois:
```

— Qualquer horário mesmo? (Ele perguntou baixo.)

```

---

## 🧠 Como funciona

O script intercepta mensagens já renderizadas pelo Character.AI e:

- Analisa os elementos `<p>` da mensagem
- Detecta:
  - texto normal → fala
  - `<em>` → ação / narração
- Reestrutura o HTML para melhorar leitura
- Aplica limpeza de texto antes de exibir

---

## 🎨 Estilo visual

- Falas:
  - Negrito
  - Prefixo: `—`
- Narração / pensamento:
  - Itálico
  - Cor rosa suave
  - Entre parênteses

---

## ⚙️ Instalação

1. Instale um gerenciador de userscript:
   - Tampermonkey (Chrome / Firefox)

2. Adicione o script:
   - Cole o conteúdo do `script.js`
   - Ou use o link de update direto do GitHub

3. Acesse o Character.AI normalmente

---

## 🔧 Tecnologias

- JavaScript (Userscript)
- MutationObserver
- Manipulação direta de DOM
- GM_addStyle (Tampermonkey)

---

## 📌 Observações

- O script altera apenas a visualização local
- Não interfere nos dados do Character.AI
- Funciona em tempo real conforme novas mensagens aparecem

---

## 📄 Licença

MIT — uso livre com modificação permitida