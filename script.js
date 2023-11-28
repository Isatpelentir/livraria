const products = [
  { id: 1, name: 'Eu e Esse Meu Coração', price: 41.99 },
  { id: 2, name: 'Mil Beijos de Garoto', price: 32.99 },
  { id: 3, name: 'Teto Para Dois', price: 50.99 },
  { id: 4, name: 'Conectadas', price: 35.99 },
  { id: 5, name: 'Um Milhão de Finais Felizes', price: 36.99 },
  { id: 6, name: 'Vermelho, Branco e Sangue Azul', price: 37.99 },
];

let cart = [];

function renderProducts() {
  const productsList = document.querySelector('#products ul');
  productsList.innerHTML = '';
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `${product.name} - R$ ${product.price.toFixed(2)} <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>`;
    productsList.appendChild(li);
  });
}

function renderCart() {
  const cartList = document.querySelector('#cart-items');
  const totalElement = document.querySelector('#total');
  cartList.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `${item.name} - R$ ${item.price.toFixed(2)} x${item.quantity} <button onclick="removeFromCart(${item.id})">Remover</button>`;
    cartList.appendChild(li);
    total += item.price * item.quantity;
  });
  totalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
  return total;  // Retorna o valor total
}

function saveTotalToLocalStorage(total) {
  const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
  salesHistory.push(total);
  localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
}

function calculateTotalSales() {
  const totalSales = getTotal();
  console.log(`O total das vendas é: R$ ${totalSales.toFixed(2)}`);
}

function getTotal() {
  return renderCart();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    renderCart();
  }
}

function removeFromCart(productId) {
  const index = cart.findIndex(item => item.id === productId);
  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    renderCart();
  }
}

function checkout() {
  if (cart.length > 0) {
    const totalPrice = calculateTotal().toFixed(2);

    // Preencher o objeto com os dados do cliente
    const cliente = {
      nome: document.getElementById('nome').value,
      cpf: document.getElementById('cpf').value,
      email: document.getElementById('email').value,
      telefone: document.getElementById('telefone').value,
      cep: document.getElementById('cep').value,
    };

    // Validar os campos
    const isNomeValid = validator.isLength(cliente.nome, { min: 1, max: 255 });
    const isCpfValid = validator.isCPF(cliente.cpf);
    const isEmailValid = validator.isEmail(cliente.email);
    const isTelefoneValid = validator.isNumeric(cliente.telefone) && validator.isMobilePhone(cliente.telefone, 'any', { strictMode: false });
    const isCepValid = validator.isNumeric(cliente.cep) && validator.isLength(cliente.cep, { min: 8, max: 8 });

    if (!cliente.nome.trim() || !isNomeValid || !isCpfValid || !isEmailValid || !isTelefoneValid || !isCepValid) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const emailText = `Fulano comprou:\n${cart.map(item => `${item.quantity} de ${item.name} gastando R$ ${item.price * item.quantity}`).join('\n')}\n\nDados do comprador:\nNome: ${cliente.nome}\nCPF: ${cliente.cpf}\nE-mail: ${cliente.email}\nTelefone: ${cliente.telefone}\nCEP: ${cliente.cep}\n\nTotal da compra: R$ ${totalPrice}`;

    // Enviar dados para o servidor
    fetch('http://jkorpela.fi/cgi-bin/echo.cgi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ data: emailText }),
    })
    .then(response => response.text())
    .then(data => {
      console.log('Resposta do servidor:', data);
      alert('E-mail enviado para o professor com os detalhes da compra.');
    })
    .catch(error => {
      console.error('Erro ao enviar e-mail:', error);
      alert('Erro ao enviar e-mail. Por favor, tente novamente.');
    });
    // Redirecionar para a página de compra
    window.location.href = `compra.html?total=${totalPrice}&nome=${cliente.nome}&cpf=${cliente.cpf}&email=${cliente.email}&telefone=${cliente.telefone}&cep=${cliente.cep}`;
  } else {
    alert('Adicione produtos ao carrinho antes de finalizar a compra.');
  }
}

function calculateTotal() {
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
  });
  return total;
}

function resetCart() {
  cart = [];
} 

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});
