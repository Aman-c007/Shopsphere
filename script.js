// ShopSphere storefront. Online payment requires a trusted backend; see setup note below.
const products = [
  {id:1,name:"Classic Minimal Watch",category:"Accessories",price:2499,stock:12,image:"https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800",tag:"BESTSELLER"},
  {id:2,name:"The Everyday Tote",category:"Fashion",price:3299,stock:8,image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",tag:"EDITOR'S PICK"},
  {id:3,name:"Studio Wireless Headphones",category:"Electronics",price:4999,stock:15,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",tag:""},
  {id:4,name:"Sculpted Sunglasses",category:"Accessories",price:1499,stock:20,image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",tag:""},
  {id:5,name:"Retro Court Sneakers",category:"Fashion",price:2899,stock:10,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",tag:"POPULAR"},
  {id:6,name:"Ambient Table Lamp",category:"Lifestyle",price:1899,stock:7,image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",tag:""},
  {id:7,name:"Everyday Mirrorless Camera",category:"Electronics",price:15999,stock:5,image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",tag:"LIMITED"},
  {id:8,name:"No. 08 Eau de Parfum",category:"Lifestyle",price:2199,stock:18,image:"https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",tag:""},
  {id:9,name:"Relaxed Cotton Shirt",category:"Fashion",price:1799,stock:14,image:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",tag:"NEW"},
  {id:10,name:"Leather Card Holder",category:"Accessories",price:999,stock:25,image:"https://images.unsplash.com/photo-1627123424574-724758594e93?w=800",tag:""},
  {id:11,name:"Portable Bluetooth Speaker",category:"Electronics",price:3499,stock:9,image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",tag:""},
  {id:12,name:"Ceramic Coffee Set",category:"Lifestyle",price:1299,stock:16,image:"https://images.unsplash.com/photo-1514228742587-6b1558f0714d?w=800",tag:""},
  {id:13,name:"Classic Leather Sneakers",category:"Fashion",price:3999,stock:6,image:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800",tag:""},
  {id:14,name:"Steel Chronograph",category:"Accessories",price:4599,stock:4,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",tag:"LIMITED"},
  {id:15,name:"Smart Fitness Band",category:"Electronics",price:2799,stock:11,image:"https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800",tag:""},
  {id:16,name:"Soft Knit Throw",category:"Lifestyle",price:1599,stock:13,image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",tag:""},
  {id:17,name:"Structured Crossbody",category:"Fashion",price:2499,stock:8,image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",tag:""},
  {id:18,name:"Everyday Chain Necklace",category:"Accessories",price:1199,stock:19,image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800",tag:""},
  {id:19,name:"Mechanical Keyboard",category:"Electronics",price:5499,stock:7,image:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",tag:""},
  {id:20,name:"Minimal Desk Organizer",category:"Lifestyle",price:899,stock:22,image:"https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800",tag:""},
  {id:21,name:"Linen Weekend Shirt",category:"Fashion",price:2199,stock:12,image:"https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800",tag:"NEW"},
  {id:22,name:"Polarized Everyday Shades",category:"Accessories",price:1899,stock:17,image:"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",tag:""},
  {id:23,name:"Compact Instant Camera",category:"Electronics",price:6999,stock:3,image:"https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800",tag:"LIMITED"},
  {id:24,name:"Scented Candle Duo",category:"Lifestyle",price:1099,stock:20,image:"https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800",tag:""}
];

const $ = id => document.getElementById(id);
const money = n => Number(n).toLocaleString("en-IN");
let cart = safeRead("shopSphereCart", []);
let wishlist = safeRead("shopSphereWishlist", []);
let toastTimer;

function safeRead(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(key)); return Array.isArray(value) ? value : fallback; }
  catch { return fallback; }
}
function persist() {
  localStorage.setItem("shopSphereCart", JSON.stringify(cart));
  localStorage.setItem("shopSphereWishlist", JSON.stringify(wishlist));
}
function showToast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2600);
}
function stockFor(id) { return products.find(p => p.id === id)?.stock ?? 0; }

function displayProducts(list = products) {
  $("productGrid").innerHTML = "";
  $("resultsCount").textContent = `${list.length} ${list.length === 1 ? "piece" : "pieces"}`;
  if (!list.length) {
    $("productGrid").innerHTML = '<div class="empty-state"><span>⌕</span><h3>No pieces found</h3><p>Try another search or clear your filters.</p></div>';
    return;
  }
  list.forEach(product => {
    const wished = wishlist.includes(product.id);
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-visual">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('image-fallback')">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
        <button class="wish-btn ${wished ? "wished" : ""}" data-wish="${product.id}" aria-label="${wished ? "Remove from" : "Add to"} wishlist">${wished ? "♥" : "♡"}</button>
        <span class="stock-pill ${product.stock <= 5 ? "low-stock" : ""}">${product.stock > 0 ? `${product.stock} left` : "Sold out"}</span>
      </div>
      <div class="product-info"><p class="product-category">${product.category}</p><h3>${product.name}</h3>
      <div class="product-bottom"><strong>₹${money(product.price)}</strong><button class="add-btn" data-add="${product.id}" ${product.stock <= 0 ? "disabled" : ""}>${product.stock > 0 ? "Add to bag +" : "Unavailable"}</button></div></div>`;
    $("productGrid").appendChild(card);
  });
}
function applyFilters() {
  const query = $("searchInput").value.trim().toLowerCase();
  const category = $("categoryFilter").value;
  const sort = $("sortFilter").value;
  let result = products.filter(p => (category === "all" || p.category === category) &&
    `${p.name} ${p.category}`.toLowerCase().includes(query));
  if (sort === "low") result.sort((a,b) => a.price-b.price);
  if (sort === "high") result.sort((a,b) => b.price-a.price);
  if (sort === "name") result.sort((a,b) => a.name.localeCompare(b.name));
  displayProducts(result);
}
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const current = cart.find(i => i.id === id)?.quantity || 0;
  if (current >= product.stock) return showToast("You've reached the available stock.");
  const item = cart.find(i => i.id === id);
  if (item) item.quantity++; else cart.push({id, quantity:1});
  persist(); updateCart(); showToast(`${product.name} added to your bag.`);
}
function removeFromCart(id) { cart = cart.filter(i => i.id !== id); persist(); updateCart(); }
function changeQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  const next = item.quantity + delta;
  if (next < 1) return removeFromCart(id);
  if (next > stockFor(id)) return showToast("Maximum available stock reached.");
  item.quantity = next; persist(); updateCart();
}
function cartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (products.find(p => p.id === item.id)?.price || 0) * item.quantity, 0);
  const delivery = subtotal === 0 || subtotal >= 2999 ? 0 : 99;
  return {subtotal, delivery, total:subtotal+delivery, count:cart.reduce((n,i)=>n+i.quantity,0)};
}
function updateCart() {
  cart = cart.filter(i => products.some(p => p.id === i.id) && i.quantity > 0);
  const totals = cartTotals();
  $("cartCount").textContent = totals.count;
  $("drawerCount").textContent = `(${totals.count})`;
  $("cartTotal").textContent = money(totals.subtotal);
  $("cartItems").innerHTML = "";
  if (!cart.length) $("cartItems").innerHTML = '<div class="empty-bag"><span>♡</span><h3>Your bag is waiting.</h3><p>Find something lovely to take home.</p><button class="under-link" id="emptyShopLink">Explore the collection ↗</button></div>';
  cart.forEach(item => {
    const p = products.find(x => x.id === item.id);
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `<img src="${p.image}" alt=""><div class="cart-row-info"><p class="product-category">${p.category}</p><h4>${p.name}</h4><strong>₹${money(p.price)}</strong><div class="quantity"><button data-qty="${p.id}" data-delta="-1">−</button><span>${item.quantity}</span><button data-qty="${p.id}" data-delta="1">+</button><button class="remove-btn" data-remove="${p.id}">Remove</button></div></div>`;
    $("cartItems").appendChild(row);
  });
  $("checkoutBtn").disabled = !cart.length;
  $("wishlistCount").textContent = wishlist.length;
}
function openCart() { $("cartDrawer").classList.add("active"); $("cartOverlay").classList.add("active"); $("cartDrawer").setAttribute("aria-hidden","false"); document.body.classList.add("no-scroll"); }
function closeCart() { $("cartDrawer").classList.remove("active"); $("cartOverlay").classList.remove("active"); $("cartDrawer").setAttribute("aria-hidden","true"); if (!$("checkoutBackdrop").classList.contains("active")) document.body.classList.remove("no-scroll"); }
function openCheckout() {
  if (!cart.length) return showToast("Your bag is empty.");
  closeCart(); renderCheckout(); $("checkoutBackdrop").classList.add("active"); document.body.classList.add("no-scroll");
}
function closeCheckout() { $("checkoutBackdrop").classList.remove("active"); document.body.classList.remove("no-scroll"); }
function renderCheckout() {
  const {subtotal,delivery,total} = cartTotals();
  $("checkoutItems").innerHTML = cart.map(i => { const p=products.find(x=>x.id===i.id); return `<div class="summary-product"><span>${p.name} <small>× ${i.quantity}</small></span><strong>₹${money(p.price*i.quantity)}</strong></div>`; }).join("");
  $("checkoutSubtotal").textContent = `₹${money(subtotal)}`;
  $("deliveryFee").textContent = delivery ? `₹${money(delivery)}` : "Free";
  $("checkoutTotal").textContent = `₹${money(total)}`;
}
function orderReference() { return "SS" + Date.now().toString().slice(-9); }
function getAddress(form) {
  const d = Object.fromEntries(new FormData(form).entries());
  return {name:d.name.trim(),phone:d.phone.trim(),email:d.email.trim(),address1:d.address1.trim(),address2:d.address2.trim(),city:d.city.trim(),state:d.state.trim(),pincode:d.pincode.trim(),instructions:d.instructions.trim()};
}
function showSuccess(reference, payment) {
  $("successMessage").textContent = `Order ${reference} has been received. Payment method: ${payment}. Save this reference and your checkout phone number to track the order in the Track Order section.`;
  $("successModal").classList.add("active");
}
function finishDemoOrder(address) {
  const reference = orderReference();
  const snapshot = cart.map(i => ({...i, name:products.find(p=>p.id===i.id).name, price:products.find(p=>p.id===i.id).price}));
  const order = addTrackingData({reference, createdAt:new Date().toISOString(), address, items:snapshot, totals:cartTotals(), payment:"Cash on Delivery", status:"Order Confirmed"});
  const orders = safeRead("shopSphereOrders", []);
  orders.push(order); localStorage.setItem("shopSphereOrders", JSON.stringify(orders));
  cart.forEach(i => { const p=products.find(x=>x.id===i.id); if(p) p.stock=Math.max(0,p.stock-i.quantity); });
  localStorage.setItem("shopSphereStock", JSON.stringify(products.map(p=>({id:p.id,stock:p.stock}))));
  cart=[]; persist(); displayProducts(); updateCart(); closeCheckout(); showSuccess(reference,"Cash on Delivery");
}

// ---- Demo order tracking + delivery OTP ----
const ORDER_KEY = "shopSphereOrders";
const TRACKING_STEPS = ["Order Placed", "Order Confirmed", "Shipped", "Out for Delivery", "Delivered"];

function readOrders() { return safeRead(ORDER_KEY, []); }
function saveOrders(orders) { localStorage.setItem(ORDER_KEY, JSON.stringify(orders)); }
function addTrackingData(order) {
  order.statusIndex = 1; // Order Placed + Order Confirmed
  order.status = TRACKING_STEPS[1];
  order.timeline = [
    {label: TRACKING_STEPS[0], at: order.createdAt},
    {label: TRACKING_STEPS[1], at: order.createdAt}
  ];
  order.otp = null;
  order.otpExpiresAt = null;
  order.otpAttempts = 0;
  order.otpVerified = false;
  return order;
}
function formatDate(value) {
  if (!value) return "Pending";
  return new Date(value).toLocaleString("en-IN", {dateStyle:"medium", timeStyle:"short"});
}
function generateDeliveryOtp(order) {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  order.otp = otp;
  order.otpExpiresAt = Date.now() + 10 * 60 * 1000;
  order.otpAttempts = 0;
  order.otpVerified = false;
  return otp;
}
function trackingMarkup(order) {
  const timeline = TRACKING_STEPS.map((step, i) => {
    const done = i <= (order.statusIndex || 0);
    const active = i === order.statusIndex;
    const event = (order.timeline || []).find(x => x.label === step);
    return `<div class="track-step ${done ? "done" : ""} ${active ? "current" : ""}">
      <span class="track-dot">${done ? "✓" : i + 1}</span>
      <div><strong>${step}</strong><small>${event ? formatDate(event.at) : "Awaiting update"}</small></div>
    </div>`;
  }).join("");
  const isOut = order.statusIndex === 3;
  const otpBox = isOut ? `<div class="otp-panel">
      <h3>Delivery verification</h3>
      <p>Share this demo OTP with the delivery partner to complete delivery.</p>
      <div class="demo-otp">${order.otp || "------"}</div>
      <small>${order.otpExpiresAt && Date.now() < order.otpExpiresAt ? "OTP valid for 10 minutes from generation." : "OTP expired. Generate a fresh demo OTP below."}</small>
      <div class="otp-actions"><button type="button" class="text-btn" id="regenerateOtp">Generate new OTP</button>
      <form id="verifyOtpForm"><input id="deliveryOtp" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" placeholder="Enter 6-digit OTP" required><button class="primary-btn" type="submit">Verify & deliver ↗</button></form></div>
      <p class="otp-error" id="otpError" role="alert"></p>
    </div>` : "";
  const canAdvance = order.statusIndex < 3;
  return `<div class="tracking-card">
    <div class="tracking-card-head"><div><p class="eyebrow">ORDER ${order.reference}</p><h3>${order.status}</h3></div>
    <span class="track-badge">${order.payment}</span></div>
    <p class="tracking-meta">${order.items.map(i => `${i.name} × ${i.quantity}`).join(" · ")}</p>
    <div class="tracking-timeline">${timeline}</div>
    ${otpBox}
    ${canAdvance ? `<button type="button" class="primary-btn advance-status" id="advanceTracking">Simulate next status <span>↗</span></button><small class="demo-hint">Demo control: advance the shipment through its stages.</small>` : ""}
    ${order.statusIndex === 4 ? '<p class="delivered-message">✓ Your order has been delivered. Thank you for shopping with ShopSphere.</p>' : ""}
  </div>`;
}
function showTrackedOrder(order) {
  $("trackingResult").innerHTML = trackingMarkup(order);
  $("trackingResult").dataset.reference = order.reference;
  const advance = $("advanceTracking");
  if (advance) advance.addEventListener("click", () => advanceOrder(order.reference));
  const regenerate = $("regenerateOtp");
  if (regenerate) regenerate.addEventListener("click", () => {
    const orders = readOrders(), target = orders.find(o => o.reference === order.reference);
    if (!target) return;
    generateDeliveryOtp(target); saveOrders(orders); showTrackedOrder(target);
    showToast("A new demo delivery OTP has been generated.");
  });
  const verify = $("verifyOtpForm");
  if (verify) verify.addEventListener("submit", e => {
    e.preventDefault();
    const orders = readOrders(), target = orders.find(o => o.reference === order.reference);
    const error = $("otpError");
    if (!target) return;
    if (target.otpVerified) return;
    if (target.otpAttempts >= 5) { error.textContent = "Too many attempts. Generate a new OTP to try again."; return; }
    if (!target.otpExpiresAt || Date.now() > target.otpExpiresAt) { error.textContent = "This OTP has expired. Generate a new one."; return; }
    target.otpAttempts++;
    if ($("deliveryOtp").value.trim() !== target.otp) {
      saveOrders(orders);
      error.textContent = `Incorrect OTP. ${5 - target.otpAttempts} attempt(s) remaining.`;
      return;
    }
    target.otpVerified = true;
    target.statusIndex = 4;
    target.status = TRACKING_STEPS[4];
    target.timeline.push({label: TRACKING_STEPS[4], at: new Date().toISOString()});
    saveOrders(orders);
    showTrackedOrder(target);
    showToast("OTP verified. Order marked as delivered!");
  });
}
function advanceOrder(reference) {
  const orders = readOrders(), order = orders.find(o => o.reference === reference);
  if (!order || order.statusIndex >= 3) return;
  order.statusIndex++;
  order.status = TRACKING_STEPS[order.statusIndex];
  const now = new Date().toISOString();
  order.timeline.push({label: order.status, at: now});
  if (order.statusIndex === 3) generateDeliveryOtp(order);
  saveOrders(orders);
  showTrackedOrder(order);
  if (order.statusIndex === 3) showToast("Out for delivery! Demo OTP generated.");
  else showToast(`Order status updated: ${order.status}`);
}
function trackOrder(event) {
  event.preventDefault();
  const reference = $("trackingReference").value.trim().toUpperCase();
  const phone = $("trackingPhone").value.trim();
  const order = readOrders().find(o => o.reference.toUpperCase() === reference && o.address.phone === phone);
  if (!order) {
    $("trackingResult").innerHTML = '<div class="tracking-empty">We could not find an order matching that reference and phone number.</div>';
    return;
  }
  showTrackedOrder(order);
}

function loadSavedStock() {
  const saved=safeRead("shopSphereStock",[]);
  saved.forEach(s=>{const p=products.find(x=>x.id===s.id);if(p)p.stock=s.stock;});
}
async function submitCheckout(event) {
  event.preventDefault();
  const form=event.currentTarget;
  if (!form.reportValidity()) return;
  if (!cart.length) return showToast("Your bag is empty.");
  const address=getAddress(form);
  const method=new FormData(form).get("payment");
  $("formMessage").textContent="";
  if(method==="cod") { finishDemoOrder(address); return; }

  // Never expose Razorpay secret keys in browser code. A server must create the order
  // and verify the signature before stock is changed or an order is marked paid.
  $("placeOrderBtn").disabled=true;
  $("placeOrderBtn").textContent="Connecting securely…";
  try {
    const response=await fetch("/api/create-razorpay-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:cart,address})});
    if(!response.ok) throw new Error("Payment gateway is not configured on the server yet.");
    const data=await response.json();
    if(!data.keyId || !data.orderId || !window.Razorpay) throw new Error("Razorpay setup is incomplete.");
    const options={
      key:data.keyId, amount:data.amount, currency:data.currency||"INR", name:"ShopSphere",
      description:"ShopSphere order payment", order_id:data.orderId,
      prefill:{name:address.name,email:address.email,contact:address.phone},
      handler:async function(paymentResponse){
        const verify=await fetch("/api/verify-razorpay-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...paymentResponse,address,items:cart})});
        if(!verify.ok) { $("formMessage").textContent="Payment received by gateway but verification is pending. Please contact support with your payment ID."; return; }
        const result=await verify.json();
        if(!result.verified) { $("formMessage").textContent="We could not verify this payment. Please contact support."; return; }
        finishVerifiedOnlineOrder(address,paymentResponse.razorpay_payment_id);
      },
      modal:{ondismiss:()=>{$("placeOrderBtn").disabled=false;$("placeOrderBtn").innerHTML='Place order <span>↗</span>';}}
    };
    const checkout=new Razorpay(options); checkout.open();
  } catch(error) {
    $("formMessage").textContent=error.message+" Choose Cash on Delivery for the local demo, or configure the secure backend.";
  } finally {
    $("placeOrderBtn").disabled=false; $("placeOrderBtn").innerHTML='Place order <span>↗</span>';
  }
}
function finishVerifiedOnlineOrder(address,paymentId) {
  const reference=orderReference();
  const order=addTrackingData({reference,createdAt:new Date().toISOString(),address,items:cart.map(i=>({...i,name:products.find(p=>p.id===i.id).name,price:products.find(p=>p.id===i.id).price})),totals:cartTotals(),payment:"Razorpay",paymentId,status:"Order Confirmed"});
  const orders=safeRead("shopSphereOrders",[]);orders.push(order);localStorage.setItem("shopSphereOrders",JSON.stringify(orders));
  cart.forEach(i=>{const p=products.find(x=>x.id===i.id);if(p)p.stock=Math.max(0,p.stock-i.quantity);});
  localStorage.setItem("shopSphereStock",JSON.stringify(products.map(p=>({id:p.id,stock:p.stock}))));
  cart=[];persist();displayProducts();updateCart();closeCheckout();showSuccess(reference,"Online payment");
}

$("trackingForm").addEventListener("submit", trackOrder);

$("productGrid").addEventListener("click",e=>{
  const add=e.target.closest("[data-add]"); if(add)addToCart(Number(add.dataset.add));
  const wish=e.target.closest("[data-wish]"); if(wish){const id=Number(wish.dataset.wish);wishlist.includes(id)?wishlist=wishlist.filter(x=>x!==id):wishlist.push(id);persist();applyFilters();updateCart();showToast(wishlist.includes(id)?"Added to wishlist.":"Removed from wishlist.");}
});
$("cartItems").addEventListener("click",e=>{
  const qty=e.target.closest("[data-qty]");if(qty)changeQuantity(Number(qty.dataset.qty),Number(qty.dataset.delta));
  const remove=e.target.closest("[data-remove]");if(remove)removeFromCart(Number(remove.dataset.remove));
  if(e.target.id==="emptyShopLink")closeCart();
});
$("searchInput").addEventListener("input",applyFilters);
$("categoryFilter").addEventListener("change",applyFilters);
$("sortFilter").addEventListener("change",applyFilters);
$("clearFilters").addEventListener("click",()=>{$("searchInput").value="";$("categoryFilter").value="all";$("sortFilter").value="default";applyFilters();});
document.querySelectorAll(".category-card").forEach(card=>card.addEventListener("click",()=>{$("categoryFilter").value=card.dataset.category;applyFilters();$("shop").scrollIntoView({behavior:"smooth"});}));
$("searchBtn").addEventListener("click",()=>{$("shop").scrollIntoView({behavior:"smooth"});$("searchInput").focus();});
$("wishlistBtn").addEventListener("click",()=>{if(!wishlist.length)return showToast("Your wishlist is empty.");const names=wishlist.map(id=>products.find(p=>p.id===id)?.name).filter(Boolean);showToast("Wishlist: "+names.slice(0,3).join(", ")+(names.length>3?` +${names.length-3} more`:""));});
$("cartBtn").addEventListener("click",openCart);
$("closeCart").addEventListener("click",closeCart);
$("cartOverlay").addEventListener("click",closeCart);
$("continueShopping").addEventListener("click",closeCart);
$("checkoutBtn").addEventListener("click",openCheckout);
$("closeCheckout").addEventListener("click",closeCheckout);
$("checkoutBackdrop").addEventListener("click",e=>{if(e.target===$("checkoutBackdrop"))closeCheckout();});
$("checkoutForm").addEventListener("submit",submitCheckout);
$("successClose").addEventListener("click",()=>{$("successModal").classList.remove("active");document.body.classList.remove("no-scroll");});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();closeCheckout();$("successModal").classList.remove("active");document.body.classList.remove("no-scroll");}});
loadSavedStock();displayProducts();updateCart();
