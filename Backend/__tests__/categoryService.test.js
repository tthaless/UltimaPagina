const db = require('../dataBase');
const categoryService = require('../services/categoryService');
const categoryPersistence = require('../persistence/categoryPersistence');

// Simula toda a camada de persistência
jest.mock('../persistence/categoryPersistence');

afterAll(async () => {
  await db.promise().end();
});

// Mudamos o nome para descrever todos os testes do serviço
describe('Testes para categoryService', () => {

  // Teste 1 
  test('createCategory: Deve lançar um erro se o nome não for fornecido', async () => {
    await expect(categoryService.createCategory(null, 'Uma descrição')).rejects.toThrow('O nome da categoria é obrigatório.');
  });

  // Teste 2: Testando a operação deleteCategory
  test('deleteCategory: Deve lançar um erro se a categoria estiver em uso', async () => {
    // 1. Preparamos nossa simulação (Mock)
    // Dizemos ao Jest: "Quando a função countAnunciosByCategoriaId for chamada, finja que o resultado é 1".
    categoryPersistence.countAnunciosByCategoriaId.mockResolvedValue([[{ total: 1 }]]);

    // 2. Agimos e Verificamos
    // Esperamos que, ao chamar deleteCategory, ela lance o erro correto.
    await expect(categoryService.deleteCategory(1)).rejects.toThrow('Esta categoria está em uso e não pode ser excluída.');
  });
  
  // Teste 3: Testando a operação updateCategory
  test('updateCategory: Deve lançar um erro se tentar atualizar uma categoria que não existe', async () => {
    // 1. Preparamos nossa simulação (Mock)
    // Dizemos ao Jest: "Quando a função update for chamada, finja que nenhuma linha foi afetada (ou seja, o ID não foi encontrado)".
    categoryPersistence.update.mockResolvedValue([{ affectedRows: 0 }]);

    // 2. Agimos e Verificamos
    // Esperamos que, ao chamar updateCategory, ela lance o erro de "não encontrada".
    await expect(categoryService.updateCategory(99, 'Novo Nome', 'Nova Descrição')).rejects.toThrow('Categoria não encontrada.');
  });

});