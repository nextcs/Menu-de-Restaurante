// Dados do Menu - Geladinhos Gourmet
const menuData = [
  // Tradicionais
  {
    id: 1,
    name: "Geladinho de Chocolate",
    category: "tradicionais",
    description: "Creme de chocolate belga com raspas",
    price: 8.9,
    icon: "🍫",
  },
  {
    id: 2,
    name: "Geladinho de Morango",
    category: "tradicionais",
    description: "Morango fresco com leite condensado",
    price: 8.9,
    icon: "🍓",
  },
  {
    id: 3,
    name: "Geladinho de Coco",
    category: "tradicionais",
    description: "Coco ralado com leite de coco",
    price: 8.9,
    icon: "🥥",
  },
  // Premium
  {
    id: 4,
    name: "Geladinho de Pistache",
    category: "premium",
    description: "Pistache italiano com creme de leite",
    price: 12.9,
    icon: "🍨",
  },
  {
    id: 5,
    name: "Geladinho de Nutella",
    category: "premium",
    description: "Nutella cremosa com avelãs",
    price: 14.9,
    icon: "🍫",
  },
  {
    id: 6,
    name: "Geladinho de Doce de Leite",
    category: "premium",
    description: "Doce de leite argentino com flor de sal",
    price: 11.9,
    icon: "🍯",
  },
  // Diet
  {
    id: 7,
    name: "Geladinho Diet de Frutas",
    category: "diet",
    description: "Mix de frutas vermelhas, zero açúcar",
    price: 10.9,
    icon: "🍇",
  },
  {
    id: 8,
    name: "Geladinho Diet de Coco",
    category: "diet",
    description: "Coco com adoçante natural, zero lactose",
    price: 10.9,
    icon: "🥥",
  },
  // Especiais
  {
    id: 9,
    name: "Geladinho de Maracujá",
    category: "especiais",
    description: "Maracujá com pedaços da fruta",
    price: 9.9,
    icon: "🍈",
  },
  {
    id: 10,
    name: "Geladinho de Café",
    category: "especiais",
    description: "Café especial com creme de leite",
    price: 10.9,
    icon: "☕",
  },
]

// Estado do carrinho
let cart = []
let currentFilter = "all"

// DOM Elements
const menuGrid = document.getElementById("menuGrid")
const cartIcon = document.querySelector(".cart-icon")
const cartCount = document.querySelector(".cart-count")
const cartModal = document.getElementById("cartModal")
const cartItems = document.getElementById("cartItems")
const cartTotal = document.getElementById("cartTotal")
const closeModal = document.querySelector(".close-modal")
const checkoutBtn = document.getElementById("checkoutBtn")
const filterBtns = document.querySelectorAll(".filter-btn")

// Renderizar itens do menu
function renderMenuItems(category = "all") {
  const filteredItems =
    category === "all"
      ? menuData
      : menuData.filter((item) => item.category === category)

  if (filteredItems.length === 0) {
    menuGrid.innerHTML = `<p style="text-align:center; grid-column: 1/-1; padding: 40px; color: #7F8C8D;">
            <i class="fas fa-ice-cream" style="font-size: 3rem; display: block; margin-bottom: 10px;"></i>
            Nenhum geladinho encontrado nesta categoria.
        </p>`
    return
  }

  menuGrid.innerHTML = filteredItems
    .map(
      (item) => `
        <div class="menu-item" data-category="${item.category}">
            <div class="menu-item-image">
                <span>${item.icon}</span>
            </div>
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p class="description">${item.description}</p>
                <div class="menu-item-footer">
                    <span class="price">R$ ${item.price.toFixed(2)}</span>
                    <button class="btn-add" onclick="addToCart(${item.id})">
                        <i class="fas fa-plus"></i> Adicionar
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Adicionar ao carrinho
function addToCart(itemId) {
  const item = menuData.find((i) => i.id === itemId)
  const existingItem = cart.find((i) => i.id === itemId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      ...item,
      quantity: 1,
    })
  }

  updateCartUI()
  showNotification(`🍧 ${item.name} adicionado!`)
}

// Remover do carrinho
function removeFromCart(itemId) {
  const itemIndex = cart.findIndex((i) => i.id === itemId)
  if (itemIndex !== -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1
    } else {
      cart.splice(itemIndex, 1)
    }
  }
  updateCartUI()
}

// Atualizar interface do carrinho
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">🍧 Seu carrinho está vazio</p>`
    cartTotal.textContent = "R$ 0,00"
    return
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.icon} ${item.name}</h4>
                <p>R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="removeFromCart(${item.id})">-</button>
                <span>${item.quantity}</span>
                <button onclick="addToCart(${item.id})">+</button>
            </div>
        </div>
    `,
    )
    .join("")

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  cartTotal.textContent = `R$ ${total.toFixed(2)}`
}

// Mostrar notificação
function showNotification(message) {
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--secondary, #4ECDC4);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: fadeIn 0.3s ease;
        font-weight: 500;
    `
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.opacity = "0"
    notification.style.transition = "opacity 0.3s ease"
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Filtrar itens
function filterItems(category) {
  currentFilter = category
  renderMenuItems(category)

  filterBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === category)
  })
}

// Event Listeners
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterItems(btn.dataset.filter)
  })
})

cartIcon.addEventListener("click", () => {
  cartModal.style.display = "block"
  document.body.style.overflow = "hidden"
})

closeModal.addEventListener("click", () => {
  cartModal.style.display = "none"
  document.body.style.overflow = "auto"
})

window.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.style.display = "none"
    document.body.style.overflow = "auto"
  }
})

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    showNotification("Adicione alguns geladinhos primeiro! 🍧")
    return
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemNames = cart
    .map((item) => `${item.icon} ${item.name} (${item.quantity}x)`)
    .join("\n")

  alert(
    `🍧 Pedido finalizado!\n\n${itemNames}\n\nTotal: R$ ${total.toFixed(2)}\n\nObrigado por escolher a Cataratas de Sabores!`,
  )
  cart = []
  updateCartUI()
  cartModal.style.display = "none"
  document.body.style.overflow = "auto"
  showNotification("Pedido enviado com sucesso! 🎉")
})

// Scroll suave para navegação
document.querySelectorAll("nav a, .btn-banner").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href")
    if (href && href.startsWith("#")) {
      e.preventDefault()
      const targetId = href
      const target = document.querySelector(targetId)
      if (target) {
        target.scrollIntoView({ behavior: "smooth" })
        if (targetId !== "#menu") {
          const category = targetId.replace("#", "")
          filterItems(category)
        }
      }
    }
  })
})

// Inicializar
renderMenuItems()

console.log("🍧 Menu Cataratas de Sabores Gourmet carregado!")
console.log("📱 Siga no Instagram: @cataratasdesaboresgourmet")
