# Character.ai Plus

Userscript para o Character.ai desenvolvido por Diones Souza com Tampermonkey.

[![Licença MIT](https://img.shields.io/badge/licença-MIT-green)](LICENSE)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-suportado-orange)](https://www.tampermonkey.net/)

[![Instalar](https://img.shields.io/badge/Instalar-Userscript-blue?style=for-the-badge&logo=Tampermonkey)](https://raw.githubusercontent.com/dionesrosa/Character.ai-Plus/main/dist/character-ai-plus.user.js)

---

## ✨ O que o script faz

Este userscript melhora a leitura das mensagens do Character.ai, organizando falas, ações e narrações em um visual mais limpo e consistente.

## 🔧 Funcionalidades

- Remove blocos de anúncios do layout
- Destaca falas com travessão (—)
- Converte narrações para um estilo visual mais legível
- Limpa ruídos de formatação como aspas, asteriscos e underscores
- Organiza as mensagens em blocos mais fáceis de acompanhar

## 🚀 Instalação

1. Instale a extensão [Tampermonkey](https://www.tampermonkey.net/) no navegador.
2. Instale o userscript disponível no link acima.
3. Acesse o Character.ai normalmente e confira a nova organização visual.

## 🖱️ Como usar

O script entra em ação automaticamente assim que as mensagens são renderizadas na interface. Não é necessário fazer nenhuma configuração adicional.

## 🛠️ Compilação com userscript-builder

Esta seção é destinada a desenvolvedores que quiserem gerar e publicar o userscript localmente.

O [userscript-builder](https://github.com/dionesrosa/userscript-builder) lê os metadados do arquivo [userscript.config.json](userscript.config.json), usa a entrada principal em [src/index.js](src/index.js) e gera o arquivo final com o cabeçalho do Tampermonkey automaticamente.

### Comandos mais usados

- `usb build` — gera o arquivo final em `dist/`
- `usb release patch|minor|major` — atualiza a versão e cria um release
- `usb publish` — publica o build no GitHub Releases

> Para quem apenas vai usar o script, o fluxo mais simples é instalar o userscript diretamente pelo link de instalação acima.

## 🧩 Estrutura do projeto

- [src/index.js](src/index.js): lógica principal do userscript
- [userscript.config.json](userscript.config.json): metadados e configuração do build

## 👤 Autor

Diones Souza

## 📜 Licença

MIT