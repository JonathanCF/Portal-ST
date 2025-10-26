-- CreateTable
CREATE TABLE "usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "perfil" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipoPessoa" TEXT NOT NULL,
    "razaoSocial" TEXT,
    "nome" TEXT,
    "nomeFantasia" TEXT NOT NULL,
    "identificador" TEXT NOT NULL,
    "identificadorEstrangeiro" TEXT,
    "perfil" TEXT NOT NULL,
    "faturamentoDireto" BOOLEAN NOT NULL DEFAULT false,
    "documentoObrigatorio" TEXT NOT NULL,
    "documentosOpcionais" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "motivoReprovacao" TEXT,
    "criadoPorId" INTEGER NOT NULL,
    "responsavelId" INTEGER,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    "aprovadoEm" DATETIME,
    CONSTRAINT "empresas_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "empresas_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "usuarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_identificador_key" ON "empresas"("identificador");
