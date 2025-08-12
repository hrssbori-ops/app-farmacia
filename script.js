// Base de datos de productos (simulada)
const products = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        category: "medicamentos",
        price: 5.99,
        requiresPrescription: false
    },
    {
        id: 2,
        name: "Ibuprofeno 400mg",
        category: "medicamentos",
        price: 7.50,
        requiresPrescription: false
    },
    {
        id: 3,
        name: "Jabón Antibacterial",
        category: "cuidado-personal",
        price: 3.25,
        requiresPrescription: false
    },
    {
        id: 4,
        name: "Vitamina C 1000mg",
        category: "vitaminas",
        price: 12.99,
        requiresPrescription: false
    },
    {
        id: 5,
        name: "Omeprazol 20mg",
        category: "medicamentos",
        price: 8.75,
        requiresPrescription: false
    },
    {
        id: 6,
        name: "Shampoo Anticaspa",
        category: "cuidado-personal",
        price: 6.40,
        requiresPrescription: false
    },
    {
        id: 7,
        name: "Multivitamínico",
        category: "vitaminas",
        price: 15.50,
        requiresPrescription: false
    },
    {
        id: 8,
        name: "Amoxicilina 500mg",
        category: "medicamentos",
        price: 10.20,
        requiresPrescription: true
    },
    {
        id: 9,
        name: "Crema Hidratante",
        category: "cuidado-personal",
        price: 9.99,
        requiresPrescription: false
    },
    {
        id: 10,
        name: "Ácido Fólico",
        category: "maternidad",
        price: 7.30,
        requiresPrescription: false
    }
];

// Variables del carrito
let cart = [];
let cartTotal = 0;

// Elementos del DOM
const productsContainer = document.getElementById('products-container');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.querySelector('.cart-count');
const cartOverlay = document.getElementById('cart-overlay');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const checkoutBtn = document.getElementById('checkout-btn');
const categoryButtons = document.querySelectorAll('.category-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
});

// Mostrar productos en el grid
function displayProducts(productsToDisplay) {
    productsContainer.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        productCard.dataset.category = product.category;
        
        productCard.innerHTML = `
            <div class="product-image">
                <i class="fas ${product.category === 'medicamentos' ? 'fa-pills' : 
                                product.category === 'cuidado-personal' ? 'fa-soap' : 
                                product.category === 'vitaminas' ? 'fa-capsules' : 'fa-baby'}"></i>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${formatCategory(product.category)}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Añadir al carrito</button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Agregar event listeners a los botones de añadir al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Formatear categoría para mostrar
function formatCategory(category) {
    const categories = {
        'medicamentos': 'Medicamento',
        'cuidado-personal': 'Cuidado Personal',
        'vitaminas': 'Vitaminas',
        'maternidad': 'Maternidad'
    };
    return categories[category] || category;
}

// Añadir producto al carrito
function addToCart(e) {
    const productId = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === productId);
    
    if (product.requiresPrescription) {
        alert('Este producto requiere receta médica. Por favor, preséntela al realizar la compra.');
    }
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification();
}

// Mostrar notificación de producto añadido
function showCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Producto añadido al carrito';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Actualizar el carrito
function updateCart() {
    // Actualizar contador
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Actualizar lista de productos en el carrito
    cartItemsContainer.innerHTML = '';
    
    cartTotal = 0;
    
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;
        
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-price">$${item.price.toFixed(2)} c/u</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </div>
            <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Actualizar total
    cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
    
    // Agregar event listeners a los botones de cantidad y eliminar
    document.querySelectorAll('.minus').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.plus').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Disminuir cantidad de un item
function decreaseQuantity(e) {
    const productId = parseInt(e.target.dataset.id);
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1;
    } else {
        cart.splice(itemIndex, 1);
    }
    
    updateCart();
}

// Aumentar cantidad de un item
function increaseQuantity(e) {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    
    item.quantity += 1;
    updateCart();
}

// Eliminar item del carrito
function removeItem(e) {
    const productId = parseInt(e.target.dataset.id);
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    cart.splice(itemIndex, 1);
    updateCart();
}

// Filtrar productos por categoría
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover clase active de todos los botones
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Agregar clase active al botón clickeado
        button.classList.add('active');
        
        const category = button.dataset.category;
        
        if (category === 'all') {
            displayProducts(products);
        } else {
            const filteredProducts = products.filter(product => product.category === category);
            displayProducts(filteredProducts);
        }
    });
});

// Buscar productos
searchBtn.addEventListener('click', searchProducts);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchProducts();
    }
});

function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        displayProducts(products);
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.category.toLowerCase().includes(searchTerm)
    );
    
    displayProducts(filteredProducts);
}

// Mostrar/ocultar carrito
cartBtn.addEventListener('click', () => {
    cartOverlay.style.display = 'flex';
});

closeCartBtn.addEventListener('click', () => {
    cartOverlay.style.display = 'none';
});

// Finalizar compra
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    // Verificar si hay productos que requieren receta
    const requiresPrescription = cart.some(item => item.requiresPrescription);
    
    if (requiresPrescription) {
        alert('Algunos productos en su carrito requieren receta médica. Por favor, preséntela al retirar su pedido.');
    }
    
    alert(`Compra realizada por un total de $${cartTotal.toFixed(2)}\n¡Gracias por su compra!`);
    cart = [];
    updateCart();
    cartOverlay.style.display = 'none';
});

// Cerrar carrito al hacer clic fuera
cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) {
        cartOverlay.style.display = 'none';
    }
});