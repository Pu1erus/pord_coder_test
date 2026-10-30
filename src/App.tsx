import { useState, useMemo, useCallback } from 'react';
import { Product, CartItem } from './types';
import { products, categories } from './data';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.flavor.some((f) =>
          f.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === '全部' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Cart operations
  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`已添加「${product.name}」到购物车`);
  }, []);

  const updateQuantity = useCallback((productId: number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handlePlaceOrder = () => {
    setOrderComplete(true);
    setCart([]);
    setTimeout(() => {
      setShowCheckout(false);
      setOrderComplete(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#faf6f1]/95 backdrop-blur-md border-b border-[#a0785a]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">☕</span>
              <h1 className="font-serif-cn text-xl font-bold text-[#3d2314]">
                醇香咖啡
              </h1>
            </div>

            {/* Search Bar */}
            <div className="hidden sm:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="搜索咖啡产地、风味..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-white/80 border border-[#a0785a]/30 text-sm text-[#3d2314] placeholder-[#a0785a]/60 focus:outline-none focus:ring-2 focus:ring-[#c8956c]/40 focus:border-[#c8956c] transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a0785a]/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 rounded-full hover:bg-[#a0785a]/10 transition-colors"
            >
              <svg
                className="w-6 h-6 text-[#3d2314]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c8956c] text-white text-xs rounded-full flex items-center justify-center font-medium animate-scaleIn">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden pb-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="搜索咖啡产地、风味..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/80 border border-[#a0785a]/30 text-sm text-[#3d2314] placeholder-[#a0785a]/60 focus:outline-none focus:ring-2 focus:ring-[#c8956c]/40 focus:border-[#c8956c] transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a0785a]/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3d2314] via-[#6b4423] to-[#a0785a] text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=400&fit=crop')] bg-cover bg-center"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl animate-fadeIn">
            <p className="text-[#c8956c] text-sm font-medium tracking-wider uppercase mb-3">
              Specialty Coffee
            </p>
            <h2 className="font-serif-cn text-3xl sm:text-5xl font-bold mb-4 leading-tight">
              每一杯，都是
              <br />
              一次味蕾的旅行
            </h2>
            <p className="text-white/80 text-base sm:text-lg max-w-lg">
              精选全球优质产区咖啡豆，从种植到烘焙，每一步都倾注匠心。让精品咖啡成为您日常生活中的一份美好。
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-[#3d2314] text-white shadow-lg shadow-[#3d2314]/20'
                  : 'bg-white text-[#6b4423] border border-[#a0785a]/30 hover:border-[#c8956c] hover:bg-[#c8956c]/5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-[#a0785a] text-lg">
              没有找到匹配的咖啡，换个关键词试试？
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="product-card bg-white rounded-2xl overflow-hidden shadow-sm border border-[#a0785a]/10 animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Product Image */}
                <div
                  className="relative h-56 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="badge bg-white/90 text-[#6b4423] backdrop-blur-sm">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="badge bg-[#3d2314]/80 text-white backdrop-blur-sm">
                      ★ {product.rating}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className="font-serif-cn text-lg font-semibold text-[#3d2314] cursor-pointer hover:text-[#c8956c] transition-colors"
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-sm text-[#a0785a] mb-3">
                    {product.origin} · {product.roast} · {product.weight}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {product.flavor.slice(0, 3).map((f) => (
                      <span
                        key={f}
                        className="text-xs px-2 py-0.5 rounded-full bg-[#faf6f1] text-[#6b4423] border border-[#a0785a]/20"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#3d2314]">
                      ¥{product.price}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 bg-[#3d2314] text-white text-sm rounded-full hover:bg-[#6b4423] active:scale-95 transition-all shadow-md shadow-[#3d2314]/20"
                    >
                      加入购物车
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#3d2314] text-white/70 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">☕</span>
              <span className="font-serif-cn font-semibold text-white">
                醇香咖啡
              </span>
            </div>
            <p className="text-sm">© 2024 醇香咖啡 · 精品咖啡，匠心之选</p>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 overlay flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-64 sm:h-80 object-cover rounded-t-3xl"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#3d2314] hover:bg-white transition-colors shadow-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="badge bg-[#faf6f1] text-[#6b4423]">
                  {selectedProduct.category}
                </span>
                <span className="badge bg-[#faf6f1] text-[#6b4423]">
                  {selectedProduct.roast}
                </span>
                <span className="text-sm text-[#c8956c]">
                  ★ {selectedProduct.rating}
                </span>
              </div>
              <h2 className="font-serif-cn text-2xl sm:text-3xl font-bold text-[#3d2314] mb-2">
                {selectedProduct.name}
              </h2>
              <p className="text-[#a0785a] mb-4">
                {selectedProduct.origin} · {selectedProduct.weight}
              </p>
              <p className="text-[#3d2314]/80 leading-relaxed mb-6">
                {selectedProduct.description}
              </p>
              <div className="mb-6">
                <h4 className="text-sm font-medium text-[#6b4423] mb-2">
                  风味特征
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.flavor.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-[#faf6f1] to-[#f0e6da] text-[#6b4423] text-sm border border-[#a0785a]/20"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#a0785a]/10">
                <span className="text-3xl font-bold text-[#3d2314]">
                  ¥{selectedProduct.price}
                </span>
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="px-6 py-3 bg-[#3d2314] text-white rounded-full hover:bg-[#6b4423] active:scale-95 transition-all shadow-lg shadow-[#3d2314]/20 font-medium"
                >
                  加入购物车
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div
          className="fixed inset-0 z-50 overlay"
          onClick={() => setShowCart(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-[#faf6f1] shadow-2xl animate-slideIn flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#a0785a]/20">
              <h2 className="font-serif-cn text-xl font-bold text-[#3d2314]">
                购物车
              </h2>
              <button
                onClick={() => setShowCart(false)}
                className="w-8 h-8 rounded-full hover:bg-[#a0785a]/10 flex items-center justify-center text-[#3d2314] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-5xl mb-4 block">🛒</span>
                  <p className="text-[#a0785a]">购物车是空的</p>
                  <p className="text-sm text-[#a0785a]/60 mt-1">
                    去挑选几款心仪的咖啡吧
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 bg-white rounded-xl p-3 shadow-sm border border-[#a0785a]/10"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#3d2314] truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-[#c8956c] font-semibold mt-1">
                          ¥{item.product.price}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, -1)
                              }
                              className="w-7 h-7 rounded-full bg-[#faf6f1] border border-[#a0785a]/30 flex items-center justify-center text-[#3d2314] hover:bg-[#a0785a]/10 transition-colors text-sm"
                            >
                              −
                            </button>
                            <span className="text-sm font-medium text-[#3d2314] w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, 1)
                              }
                              className="w-7 h-7 rounded-full bg-[#faf6f1] border border-[#a0785a]/30 flex items-center justify-center text-[#3d2314] hover:bg-[#a0785a]/10 transition-colors text-sm"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-xs text-[#a0785a] hover:text-red-500 transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#a0785a]/20 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#a0785a]">合计</span>
                  <span className="text-2xl font-bold text-[#3d2314]">
                    ¥{cartTotal}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-[#3d2314] text-white rounded-full font-medium hover:bg-[#6b4423] active:scale-[0.98] transition-all shadow-lg shadow-[#3d2314]/20"
                >
                  去结算
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div
          className="fixed inset-0 z-50 overlay flex items-center justify-center p-4"
          onClick={() => !orderComplete && setShowCheckout(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-scaleIn overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {orderComplete ? (
              <div className="p-12 text-center animate-fadeIn">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">✓</span>
                </div>
                <h2 className="font-serif-cn text-2xl font-bold text-[#3d2314] mb-2">
                  下单成功！
                </h2>
                <p className="text-[#a0785a]">
                  感谢您的购买，咖啡正在路上 ☕
                </p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-[#a0785a]/10">
                  <h2 className="font-serif-cn text-xl font-bold text-[#3d2314]">
                    确认订单
                  </h2>
                </div>
                <div className="p-6 max-h-[50vh] overflow-y-auto">
                  {/* Order Items */}
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-[#3d2314]">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-[#a0785a]">
                              × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-[#3d2314]">
                          ¥{item.product.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#a0785a]/10 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#a0785a]">商品总额</span>
                      <span className="text-[#3d2314]">¥{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#a0785a]">运费</span>
                      <span className="text-[#3d2314]">
                        {cartTotal >= 99 ? '免运费' : '¥12'}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#a0785a]/10">
                      <span className="text-[#3d2314]">应付总额</span>
                      <span className="text-[#c8956c]">
                        ¥{cartTotal >= 99 ? cartTotal : cartTotal + 12}
                      </span>
                    </div>
                  </div>

                  {/* Simulated Address */}
                  <div className="mt-6 p-4 bg-[#faf6f1] rounded-xl border border-[#a0785a]/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">📍</span>
                      <span className="text-sm font-medium text-[#3d2314]">
                        收货地址
                      </span>
                    </div>
                    <p className="text-sm text-[#a0785a]">
                      张三 138****8888
                      <br />
                      上海市静安区南京西路1688号 醇香大厦12层
                    </p>
                  </div>
                </div>
                <div className="p-6 border-t border-[#a0785a]/10">
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-3 bg-gradient-to-r from-[#3d2314] to-[#6b4423] text-white rounded-full font-medium hover:from-[#6b4423] hover:to-[#3d2314] active:scale-[0.98] transition-all shadow-lg"
                  >
                    确认支付 ¥{cartTotal >= 99 ? cartTotal : cartTotal + 12}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-fadeIn">
          <div className="px-5 py-3 bg-[#3d2314] text-white rounded-full shadow-xl text-sm flex items-center gap-2">
            <span>✓</span>
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
