document.addEventListener('DOMContentLoaded', function() {
    let cart = [];
    
    // Sepete Ürün Ekleme
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = {
                name: this.dataset.product,
                price: parseFloat(this.dataset.price),
                quantity: 1
            };
            
            const existingProduct = cart.find(item => item.name === product.name);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push(product);
            }
            
            updateCart();
            alert('Ürün sepete eklendi!');
        });
    });

    // Resim Modalı
    document.querySelectorAll('.product-image').forEach(img => {
        img.addEventListener('click', function() {
            document.querySelector('.modal-img').src = this.src;
        });
    });

    // Toast Bildirimi Gösterme
    function showToast(message) {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.innerHTML = `
            <div class="toast" role="alert">
                <div class="toast-header">
                    <strong class="me-auto">Sepete Eklendi</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        document.body.appendChild(toastContainer);
        const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
        toast.show();
    }

    // Sepeti Güncelleme
    function updateCart() {
        const cartItems = document.getElementById('cartItems');
        cartItems.innerHTML = '';
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const total = item.price * item.quantity;
            subtotal += total;
            
            cartItems.innerHTML += `
                <div class="cart-item d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h6 class="mb-0">${item.name}</h6>
                        <small class="text-muted">${item.price.toFixed(2)} TL x ${item.quantity}</small>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="me-3">${total.toFixed(2)} TL</span>
                        <button class="btn btn-sm btn-danger remove-from-cart" data-product="${item.name}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        const tax = subtotal * 0.18;
        const total = subtotal + tax;
        
        document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' TL';
        document.getElementById('tax').textContent = tax.toFixed(2) + ' TL';
        document.getElementById('total').textContent = total.toFixed(2) + ' TL';
        
        // Sepet badge güncelleme
        document.querySelector('.cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Sepetten Ürün Silme
    document.getElementById('cartItems').addEventListener('click', function(e) {
        if (e.target.closest('.remove-from-cart')) {
            const productName = e.target.closest('.remove-from-cart').dataset.product;
            cart = cart.filter(item => item.name !== productName);
            updateCart();
            alert('Ürün sepetten çıkarıldı!');
        }
    });

    // Ödeme İşlemi
    document.getElementById('checkoutButton').addEventListener('click', function() {
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        cartModal.hide();
        const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        checkoutModal.show();
    });

    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Ödeme işlemi simülasyonu
        showToast('Siparişiniz alındı! Teşekkür ederiz.');
        cart = [];
        updateCart();
        const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
        checkoutModal.hide();
    });

    // Kredi Kartı Numarası Formatı
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = value;
    });

    // Scroll to Top Button
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.querySelector('.scroll-top').style.display = 'block';
        } else {
            document.querySelector('.scroll-top').style.display = 'none';
        }
    };

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Ürün Arama Fonksiyonu
    document.querySelector('.search-box input').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            const title = product.querySelector('.card-title').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });

    // Quick View Fonksiyonu
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const image = card.querySelector('.product-image').src;
            const title = card.querySelector('.card-title').textContent;
            const price = card.querySelector('.card-text.fw-bold').textContent;
            const features = card.querySelector('.list-unstyled').innerHTML;

            document.querySelector('.quick-view-image').src = image;
            document.querySelector('.quick-view-title').textContent = title;
            document.querySelector('.quick-view-price').textContent = price;
            document.querySelector('.quick-view-features').innerHTML = features;
        });
    });

    // Favorilere Ekleme
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.classList.toggle('bi-heart');
            icon.classList.toggle('bi-heart-fill');
            icon.classList.toggle('text-danger');
            
            showToast('Ürün favorilere eklendi!');
        });
    });

    // Lazy Loading
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });

    // Filtreleme Fonksiyonu
    function filterProducts() {
        const brandFilter = document.querySelector('.brand-filter').value;
        const priceFilter = document.querySelector('.price-filter').value;
        
        document.querySelectorAll('.product-card').forEach(card => {
            const brand = card.querySelector('.card-title').textContent;
            const price = parseInt(card.querySelector('[data-price]').dataset.price);
            
            let showCard = true;
            
            if (brandFilter && !brand.includes(brandFilter)) {
                showCard = false;
            }
            
            if (priceFilter) {
                const [min, max] = priceFilter.split('-').map(Number);
                if (price < min || (max && price > max)) {
                    showCard = false;
                }
            }
            
            card.style.display = showCard ? 'block' : 'none';
        });
    }
}); 