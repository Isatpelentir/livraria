document.addEventListener("DOMContentLoaded", function () {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartList = document.getElementById("cart-list");
    const cartTotal = document.getElementById("cart-total");
    const checkoutButton = document.getElementById("checkout");

    let cartItems = [];

    addToCartButtons.forEach(button => {
        button.addEventListener("click", function () {
            const product = button.parentElement;
            const productName = product.getAttribute("data-name");
            const productPrice = parseFloat(product.getAttribute("data-price"));
            const quantity = parseInt(product.querySelector("input[type=number]").value);

            addToCart(productName, productPrice, quantity);
            updateCartUI();
        });
    });

    function addToCart(name, price, quantity) {
        cartItems.push({ name, price, quantity });
        addToCartButtons.forEach(button => {
            button.addEventListener("click", function () {
                const product = button.parentElement;
                const productName = product.getAttribute("data-name");
                const productPrice = parseFloat(product.getAttribute("data-price"));
                const quantity = parseInt(product.querySelector("input[type=number]").value);
        
                addToCart(productName, productPrice, quantity);
                updateCartUI();
            });
        });
        
        function addToCart(name, price, quantity) {
            // Verificar se o produto já está no carrinho
            const existingItem = cartItems.find(item => item.name === name);
        
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cartItems.push({ name, price, quantity });
            }
        }
        
    }

    function updateCartUI() {
        cartList.innerHTML = "";
        let total = 0;

        cartItems.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.name} - R$${item.price.toFixed(2)}`;
            cartList.appendChild(listItem);

            total += item.price;
        });

        cartTotal.textContent = total.toFixed(2);
    }

    checkoutButton.addEventListener("click", function () {
        // Aqui você pode redirecionar para a página do formulário ou realizar outras ações necessárias.
        alert("Redirecionando para a página de finalização de compra");
    });
});
