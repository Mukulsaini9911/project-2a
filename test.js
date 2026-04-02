// Get table number from URL
const urlParams = new URLSearchParams(window.location.search);
const tableNumber = urlParams.get('table');

console.log("Table Number:", tableNumber);

let order = [];
let totalPrice = 0;

function addToOrder(itemName, itemPrice) {
    // Add item to order
    order.push({ name: itemName, price: itemPrice });
    totalPrice += itemPrice;

    // Update the order summary list and total price
    updateOrderSummary();
    alert(`${itemName} has been added to your order.`);
    smartRecommendation();

}
function smartRecommendation() {

    let suggestion = "";

    const orderedItems = order.map(item => item.name.toLowerCase());

    if (orderedItems.some(item => item.includes("biryani"))) {
        suggestion = "🥤 Cold Drink goes best with Biryani!";
    }
    else if (orderedItems.some(item => item.includes("butter"))) {
        suggestion = "🫓 Add Garlic Naan with Butter Chicken!";
    }
    else if (orderedItems.some(item => item.includes("paneer"))) {
        suggestion = "🥛 Sweet Lassi is perfect with Paneer!";
    }
    else {
        suggestion = "🍮 Try our Chef Special Dessert!";
    }

    const text = document.getElementById("recommendation-text");
    const card = document.getElementById("recommendation-card");

    text.innerText = suggestion;

    // Animation effect
    card.style.transform = "scale(1.05)";
    card.style.boxShadow = "0 15px 35px rgba(0,0,0,0.3)";

    setTimeout(() => {
        card.style.transform = "scale(1)";
    }, 300);
}



function updateOrderSummary() {
    const orderList = document.getElementById('order-list');
    if (!orderList) {
        console.error("Element with id 'order-list' not found.");
        return;
    }
    orderList.innerHTML = ''; // Clear current list

    // Loop through each order item and format price in ₹
    order.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} - ₹${item.price.toFixed(2)}`; // Display price in ₹
        orderList.appendChild(li);
    });

    const totalPriceElement = document.getElementById('total-price');
    if (!totalPriceElement) {
        console.error("Element with id 'total-price' not found.");
        return;
    }
    totalPriceElement.innerText = `₹${totalPrice.toFixed(2)}`; // Display total price in ₹
}

function checkout() {

    if (order.length === 0) {
        alert("Please add items to your order before proceeding.");
        return;
    }

    showPaymentForm();
}

function resetOrder() {
    order = [];
    totalPrice = 0;
    updateOrderSummary();
    const paymentSection = document.getElementById('payment-section');
    if (paymentSection) {
        paymentSection.style.display = 'none';
    }
    alert("Your order has been reset.");
}

function showPaymentForm() {
    const paymentSection = document.getElementById('payment-section');
    if (paymentSection) {
        paymentSection.style.display = 'block';
    } else {
        console.error("Element with id 'payment-section' not found.");
    }
}

// Handle payment form submission

const paymentForm = document.getElementById('payment-form');
const cardNumber = document.getElementById("card-number").value;
const cvv = document.getElementById("cvv").value;

if (!/^\d{16}$/.test(cardNumber)) {
    alert("Card number must be exactly 16 digits.");
    return;
}

if (!/^\d{3}$/.test(cvv)) {
    alert("CVV must be exactly 3 digits.");
    return;
}
if (paymentForm) {
    paymentForm.addEventListener('submit', function (event) {
        event.preventDefault();

        alert("Payment Successful!");

        if (order.length === 0) {
            alert("Your order is empty. Please add items to your order.");
            return;
            console.log("Sending Order:", order);
        } let orderData = {
            phone: tableNumber,
            order: order,
            total: totalPrice,
            timestamp: new Date().toISOString()
        };

        fetch("/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Server Response:", data);
                alert("Order saved successfully in Google Sheet!");
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error saving order!");
            });


        alert(`Payment of ₹${totalPrice.toFixed(2)} was successful. Thank you for your order!`);

        resetOrder();
    });
} else {
    console.error("Element with id 'payment-form' not found.");
}

// Placeholder for dynamic menu management
function addMenuItem(name, price, image) {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <img src="${image}" alt="${name}">
            <h3>${name}</h3>
            <p>Price: ₹${price.toFixed(2)}</p> <!-- Display price in ₹ -->
            <button class="order-btn" onclick="addToOrder('${name}', ${price})">Order for ₹${price.toFixed(2)}</button> <!-- Order button in ₹ -->
        `;


        menuSection.appendChild(menuItem);
    } else {
        console.error("Menu section not found.");
    }
}

// Other functions remain unchanged...

// Placeholder for reservation handling
function bookTable(date, time, guests) {
    alert(`Table booked for ${guests} guests on ${date} at ${time}.`);
}

// Placeholder for admin controls
function adminLogin(username, password) {
    if (username === 'admin' && password === 'password') {
        alert('Welcome, Admin!');
        window.location.href = 'admin.html';
    } else {
        alert('Invalid credentials.');
    }
}

// Generate QR code for ordering
function generateQRCode(orderId) {
    const qrCodeContainer = document.getElementById('qr-code');
    if (!qrCodeContainer) {
        console.error("QR code container not found.");
        return;
    }
    qrCodeContainer.innerHTML = ''; // Clear existing QR code
    
    // Get table number from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tableNumber = urlParams.get('table') || '1';
    
    // Your ngrok URL
    const ngrokUrl = "https://gestureless-nonuniversally-julio.ngrok-free.dev";
    
    // Generate QR code with ngrok URL and table number
    const qrUrl = ngrokUrl + "/htmlpage.html?table=" + tableNumber;
    const qrCode = new QRCode(qrCodeContainer, {
        text: qrUrl,
        width: 128,
        height: 128,
    });
}

// AI-powered recommendations (placeholder)


// Manage Orders
function viewOrders() {
    const ordersSection = document.getElementById('orders-section');
    ordersSection.classList.toggle('hidden');
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = ''; // Clear existing orders
    const sampleOrders = [
        { id: 1, item: 'Burger', quantity: 2, total: 11.98 },
        { id: 2, item: 'Pizza', quantity: 1, total: 8.99 },
    ];
    sampleOrders.forEach(order => {
        const li = document.createElement('li');
        li.textContent = `Order #${order.id}: ${order.item} x${order.quantity} - ₹${order.total.toFixed(2)}`; // Updated to show in ₹
        ordersList.appendChild(li);
    });
}

// Manage Menu
function editMenu() {
    const menuSection = document.getElementById('menu-section');
    if (!menuSection) {
        console.error("Element with id 'menu-section' not found.");
        return;
    }
    menuSection.classList.toggle('hidden');

    const menuList = document.getElementById('menu-list');
    if (!menuList) {
        console.error("Element with id 'menu-list' not found.");
        return;
    }
    menuList.innerHTML = ''; // Clear existing menu

    const sampleMenu = [
        { name: 'Burger', price: 5.99 },
        { name: 'Pizza', price: 8.99 },
    ];
    sampleMenu.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ₹${item.price.toFixed(2)}`; // Updated to show in ₹
        menuList.appendChild(li);
    });

    const addMenuItemForm = document.getElementById('add-menu-item-form');
    if (!addMenuItemForm) {
        console.error("Element with id 'add-menu-item-form' not found.");
        return;
    }
    addMenuItemForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const nameInput = document.getElementById('menu-item-name');
        const priceInput = document.getElementById('menu-item-price');
        const imageInput = document.getElementById('menu-item-image');

        if (!nameInput || !priceInput || !imageInput) {
            console.error("One or more input fields for adding menu items are missing.");
            return;
        }

        const name = nameInput.value;
        const price = parseFloat(priceInput.value);
        const image = imageInput.value;

        if (!name || isNaN(price) || !image) {
            alert("Please provide valid inputs for all fields.");
            return;
        }

        addMenuItem(name, price, image);
        alert(`${name} has been added to the menu.`);
        addMenuItemForm.reset();
    });
}

// View Reservations
function viewReservations() {
    const reservationsSection = document.getElementById('reservations-section');
    reservationsSection.classList.toggle('hidden');
    const reservationsList = document.getElementById('reservations-list');
    reservationsList.innerHTML = ''; // Clear existing reservations
    const sampleReservations = [
        { id: 1, date: '2023-10-01', time: '18:00', guests: 4 },
        { id: 2, date: '2023-10-02', time: '19:30', guests: 2 },
    ];
    sampleReservations.forEach(reservation => {
        const li = document.createElement('li');
        li.textContent = `Reservation #${reservation.id}: ${reservation.date} at ${reservation.time} for ${reservation.guests} guests`;
        reservationsList.appendChild(li);
    });
}

function loadTestimonials() {
    const testimonials = [
        { text: "we are very glad to come here ", author: "John Doe" },
        { text: "Satyug darshan delight is most expensive and good restaurant for us.", author: "Jane Smith" },
        { text: "here our chef are very good .", author: "Alex Brown" },
    ];

    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection) {
        const grid = testimonialsSection.querySelector('.grid');
        testimonials.forEach(testimonial => {
            const div = document.createElement('div');
            div.className = 'bg-white p-6 rounded-lg shadow-lg';
            div.innerHTML = `
                <p class="text-gray-700 italic">"${testimonial.text}"</p>
                <p class="mt-4 text-right font-bold">- ${testimonial.author}</p>
            `;
            grid.appendChild(div);
        });
    }
}

// Call the function to load testimonials dynamically
document.addEventListener('DOMContentLoaded', loadTestimonials);
/*const orderData = {};
fetch("http://localhost:3000/order", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
});*/
function recommend(item) {
    if (item === "Pizza") return "Coke";
    if (item === "Biryani") return "Lassi";
    return "";
}
// jo item order hua
document.addEventListener("DOMContentLoaded", () => {
    smartRecommendation();
});

window.addEventListener("DOMContentLoaded", function () {
    generateQRCode();
});


