# Portal ST - Sistema de Cadastro de Empresas

Sistema web para gerenciamento de cadastro de empresas com autenticação via certificado digital, desenvolvido para Aurora da Amazônia Terminais e Serviços Ltda.

## 📋 Sobre o Projeto

O Portal ST é uma solução completa para cadastro e gestão de empresas (Pessoa Jurídica, Física e Estrangeira), permitindo que usuários externos e internos realizem operações de CRUD com diferentes níveis de permissão e fluxos de aprovação.

### Funcionalidades Principais

- ✅ Cadastro de empresas (PJ, PF e Estrangeira)
- 🔐 Autenticação via certificado digital
- 📄 Upload e validação de documentos comprobatórios
- ⚡ Aprovação automática para usuários internos
- 🔄 Fluxo de aprovação para usuários externos
- 👥 Gestão de perfis (Despachante, Beneficiário, Consignatário, Armador, Agente de Carga, Transportadora)
- 💰 Opção de faturamento direto

---

## 🏗️ Arquitetura do Projeto

```
portal-st/
├── portal-st-frontend/     # Aplicação Next.js
└── portal-st-backend/      # API NestJS
```

---

## 🚀 Portal ST Frontend

### Tecnologias

- **Next.js 14+** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes UI
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Axios** - Cliente HTTP

### Instalação e Configuração

```bash
cd portal-st-frontend
npm install
```

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Portal ST
```

### Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linter
```

### Perfis de Usuário

#### Usuário Externo
- Despachante
- Beneficiário
- Consignatário
- Armador
- Agente de Carga
- Transportadora
- Novo usuário

**Permissões:** `EMPRESA_CADASTRO`

#### Usuário Interno
- Interno

**Permissões:** `EMPRESA_MASTER`, `EMPRESA_LISTA`, `EMPRESA_EDICAO`

---

## ⚙️ Portal ST Backend

### Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Tipagem estática
- **Prisma ORM** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Passport.js** - Autenticação
- **Class Validator** - Validação de DTOs
- **Multer** - Upload de arquivos

### Instalação e Configuração

```bash
cd portal-st-backend
npm install
```

### Schema Prisma

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Usuario {
  id        String   @id @default(uuid())
  nome      String
  email     String   @unique
  tipo      TipoUsuario
  perfil    Perfil?
  empresas  Empresa[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Empresa {
  id                    String          @id @default(uuid())
  tipoPessoa            TipoPessoa
  razaoSocial           String?
  cnpj                  String?         @unique
  nome                  String?
  cpf                   String?         @unique
  identificadorEstr     String?
  nomeFantasia          String
  perfil                Perfil
  faturamentoDireto     Boolean         @default(false)
  status                StatusEmpresa   @default(PENDENTE)
  usuarioResponsavel    Usuario?        @relation(fields: [usuarioResponsavelId], references: [id])
  usuarioResponsavelId  String?
  documentos            Documento[]
  createdAt             DateTime        @default(now())
  updatedAt             DateTime        @updatedAt
  aprovadoEm            DateTime?
  reprovadoEm           DateTime?
  motivoReprovacao      String?
}

model Documento {
  id          String    @id @default(uuid())
  tipo        TipoDocumento
  nomeArquivo String
  caminho     String
  tamanho     Int
  empresa     Empresa   @relation(fields: [empresaId], references: [id])
  empresaId   String
  createdAt   DateTime  @default(now())
}

enum TipoUsuario {
  EXTERNO
  INTERNO
}

enum TipoPessoa {
  JURIDICA
  FISICA
  ESTRANGEIRA
}

enum Perfil {
  DESPACHANTE
  BENEFICIARIO
  CONSIGNATARIO
  ARMADOR
  AGENTE_CARGA
  TRANSPORTADORA
}

enum StatusEmpresa {
  PENDENTE
  APROVADO
  REPROVADO
}

enum TipoDocumento {
  OBRIGATORIO
  OPCIONAL
}
```

### Configuração do Prisma

```bash
# Gerar cliente Prisma
npx prisma generate

# Criar migrações
npx prisma migrate dev --name init

# Visualizar banco de dados
npx prisma studio
```

### Scripts Disponíveis

```bash
npm run start:dev      # Inicia servidor de desenvolvimento
npm run build          # Build para produção
npm run start:prod     # Inicia servidor de produção
npm run prisma:studio  # Abre Prisma Studio
npm run prisma:migrate # Cria nova migração
```

### Endpoints Principais

#### Empresas

```
POST   /empresas                    # Criar empresa
GET    /empresas                    # Listar empresas
GET    /empresas/:id                # Obter empresa por ID
PUT    /empresas/:id                # Atualizar empresa
DELETE /empresas/:id                # Deletar empresa
PATCH  /empresas/:id/aprovar        # Aprovar empresa
PATCH  /empresas/:id/reprovar       # Reprovar empresa
```

#### Documentos

```
POST   /documentos                  # Upload de documento
DELETE /documentos/:id              # Remover documento
```

---

## 🔒 Regras de Negócio

### RN01 - Aprovação Automática (Usuário Interno)
Quando um usuário interno cadastra uma empresa, o cadastro é aprovado automaticamente e deve-se atribuir um usuário externo como responsável.

### RN02 - Aguardar Aprovação (Usuário Externo)
Quando um usuário externo cadastra uma empresa, o cadastro fica pendente de aprovação.

### RN03 - Integração Siscomex
Após aprovação de cadastro via integração Siscomex, deve-se atribuir um usuário externo como responsável.

---

## 📝 Validações de Documentos

### Formatos Aceitos
- PDF (.pdf)
- PNG (.png)
- JPG (.jpg)
- JPEG (.jpeg)

### Tamanho Máximo
- 5MB por arquivo

### Tipos de Documento
- **Obrigatório:** Conforme perfil selecionado
- **Opcional:** Documentos complementares

---

## 🔄 Fluxos de Cadastro

### Fluxo Principal - Pessoa Jurídica

1. Usuário acessa Menu > Cadastro de Empresa
2. Seleciona Tipo Pessoa = Jurídica
3. Preenche: Razão Social, CNPJ, Nome Fantasia, Perfil
4. Opcionalmente marca Faturamento Direto
5. Anexa documento comprobatório
6. Salva o cadastro
7. Sistema registra e exibe modal de sucesso
8. Aguarda aprovação (se usuário externo)

---

## ⚠️ Validações e Mensagens de Erro

| Código | Mensagem | Quando Ocorre |
|--------|----------|---------------|
| FE01 | "Mínimo de [X] caracteres" | Campo com menos caracteres que o mínimo |
| FE02 | "CNPJ inválido" | CNPJ não tem 14 caracteres |
| FE03 | "CPF inválido" | CPF não tem 11 caracteres |
| FE04 | "CNPJ fornecido inválido" | CNPJ com formato inválido (modal) |
| FE05 | "CPF inválido" | CPF com formato inválido (modal) |
| FE07 | "Selecione um perfil para a empresa" | Campo Perfil vazio |
| FE08 | "Ocorreu um erro ao encontrar o perfil" | Perfil não encontrado |
| FE09 | "É necessário enviar os arquivos obrigatórios" | Documento obrigatório não anexado |
| FE10 | "São válidos somente arquivos do tipo: pdf, png, jpg ou jpeg" | Formato de arquivo inválido |
| FE11 | "Arquivo duplicado" | Mesmo arquivo usado duas vezes |

---

## 🚀 Como Executar o Projeto Completo

### 1. Backend

```bash
cd portal-st-backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

O backend estará disponível em: `http://localhost:3001`

### 2. Frontend

```bash
cd portal-st-frontend
npm install
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`


Parte 02
1. De acordo com as tabelas abaixo, desenvolva as Querys solicitadas:

### a) Query para listar todos os funcionários com os nomes dos cargos e departamentos
```bash
SELECT 
    F.ID_Func,
    F.Nome_Func,
    C.Nome_CAR_Cargo AS Cargo,
    D.Nome_DEP_Depto AS Departamento
FROM FUNCIONARIO F
JOIN CARGO C ON F.Id_FUN_Cargo = C.Id_CAR_Cargo
JOIN DEPARTAMENTO D ON F.Id_FUN_Depto = D.Id_DEP_Depto;
```

### b) Query para listar todos os funcionários que estão ativos na empresa

Funcionários ativos têm Data_Demis nula

```bash
SELECT 
    F.ID_Func,
    F.Nome_Func,
    F.Data_Contrata,
    F.Salario
FROM FUNCIONARIO F
WHERE F.Data_Demis IS NULL;

c) Query para listar todos os funcionários que trabalham na área de Controladoria
SELECT 
    F.ID_Func,
    F.Nome_Func,
    D.Nome_DEP_Depto
FROM FUNCIONARIO F
JOIN DEPARTAMENTO D ON F.Id_FUN_Depto = D.Id_DEP_Depto
WHERE D.Nome_DEP_Depto = 'Controladoria';
```

### d) Query para listar todos os funcionários com salário superior a R$ 2.900,00
```bash
SELECT 
    F.ID_Func,
    F.Nome_Func,
    F.Salario
FROM FUNCIONARIO F
WHERE F.Salario > 2900;
```
### e) Query para listar a quantidade de pessoas em cada departamento
```bash
SELECT 
    D.Nome_DEP_Depto AS Departamento,
    COUNT(F.ID_Func) AS Qtde_Funcionarios
FROM FUNCIONARIO F
JOIN DEPARTAMENTO D ON F.Id_FUN_Depto = D.Id_DEP_Depto
GROUP BY D.Nome_DEP_Depto
ORDER BY Qtde_Funcionarios DESC;
```
