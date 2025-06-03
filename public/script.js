let data = [];
// Carrega os dados do servidor ao iniciar
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/data');
    data = await res.json();
    console.log('📦 Dados carregados:', data);
  } catch (err) {
    console.error('❌ Erro ao carregar os dados:', err);
  }
});

// Quando o botão for clicado, executa a busca
document.getElementById('searchButton').addEventListener('click', async () => {
  const query = document.getElementById('searchInput').value;
  const result = await searchData(query);
  displayResults(result);
});

document.getElementById('searchInput').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // evita comportamento padrão
    document.getElementById('searchButton').click(); // dispara a busca
  }
});

// Função que busca o item correspondente e chama a API
async function searchData(query) {
  const keywords = query.toLowerCase().split(' ');

  const item = data.find(item =>
    keywords.some(k =>
      new RegExp(k, 'i').test(item.detail) || new RegExp(k, 'i').test(item.category)
    )
  );

  if (item) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ detail: item.detail, query })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      return { answer: 'Erro ao se comunicar com o servidor.' };
    }
  }

  return { answer: 'Informação não encontrada.' };
}

// Função que exibe a resposta na tela
function displayResults(results) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = `<p>${results.answer || 'Nenhum resultado encontrado.'}</p>`;
}
