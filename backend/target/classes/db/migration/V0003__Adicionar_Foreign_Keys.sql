-- Adicionar coluna materia_id como BIGINT
ALTER TABLE movimentacoes ADD COLUMN materia_id BIGINT;

-- Adicionar coluna turma_id como BIGINT
ALTER TABLE movimentacoes ADD COLUMN turma_id BIGINT;

-- Adicionar FOREIGN KEY para materia_id (referenciando tabela materias)
ALTER TABLE movimentacoes ADD CONSTRAINT fk_movimentacoes_materia FOREIGN KEY (materia_id) REFERENCES materia(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Adicionar FOREIGN KEY para turma_id (referenciando tabela turmas)
ALTER TABLE movimentacoes ADD CONSTRAINT fk_movimentacoes_turma FOREIGN KEY (turma_id) REFERENCES turmas(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Atualizar os dados existentes (opcional - se necessário)
-- UPDATE movimentacoes m
-- JOIN materias ma ON m.materia = ma.nome
-- SET m.materia_id = ma.id;

-- UPDATE movimentacoes m
-- JOIN turmas t ON m.turma = t.nome
-- SET m.turma_id = t.id;