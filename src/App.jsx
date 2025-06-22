import React, { useState, useMemo, useCallback, useEffect } from 'react';

// --- SVG Icons ---
const icons = {
  shoppingCart: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  ),
  plus: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  minus: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  trash: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  x: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  chevronUp: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>,
  chevronDown: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  phone: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
  shield: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
  arrowRight: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="12 5 19 12 12 19"></polyline><line x1="19" y1="12" x2="5" y2="12"></line></svg>,
  arrowLeft: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="12 19 5 12 12 5"></polyline><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
};


// --- Data for the menu items ---
const menuItems = [
  { id: 1, name: "Margherita Pizza", description: "Classic pizza with fresh tomatoes, mozzarella cheese, and aromatic basil.", tags: ["Pizza", "Italian"], type: "veg", image: "https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", price: 450, topSeller: true },
  { id: 2, name: "Grilled Chicken Salad", description: "Juicy grilled chicken over mixed greens with a light vinaigrette.", tags: ["Salad", "Healthy"], type: "non-veg", image: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", price: 550 },
  { id: 4, name: "Paneer Tikka Masala", description: "Tandoor-cooked paneer in a rich, creamy tomato-based gravy.", tags: ["Indian", "Curry"], type: "veg", image: "https://images.pexels.com/photos/9609835/pexels-photo-9609835.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", price: 525, topSeller: true},
  { id: 5, name: "Spicy Vegan Burger", description: "Plant-based patty with spicy vegan mayo, lettuce, and tomato.", tags: ["Vegan", "Burger"], type: "veg", image: "https://images.unsplash.com/photo-1549611016-3a70d82b5040?q=80&w=2940&auto=format&fit=crop", price: 480 },
  { id: 6, name: "Mutton Rogan Josh", description: "Aromatic lamb curry from Kashmir, cooked with a blend of intense spices.", tags: ["Indian", "Curry"], type: "non-veg", image: "https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", price: 750 },
  { id: 7, name: "Mushroom Risotto", description: "Creamy Arborio rice cooked with wild mushrooms and parmesan cheese.", tags: ["Italian", "Gourmet"], type: "veg", image: "https://images.pexels.com/photos/3926133/pexels-photo-3926133.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", price: 600 },
  { id: 8, name: "Fish and Chips", description: "Classic British dish with beer-battered fish and thick-cut fries.", tags: ["British", "Seafood"], type: "non-veg", image: "https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", price: 680 },
  { id: 9, name: "Veg Hakka Noodles", description: "Stir-fried noodles with a mix of fresh vegetables in a savory sauce.", tags: ["Chinese", "Noodles"], type: "veg", image: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", price: 400 },
  { id: 10, name: "Chicken Biryani", description: "Layered rice and chicken dish cooked with fragrant spices in the dum style.", tags: ["Indian", "Rice"], type: "non-veg", image: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", price: 580, topSeller: false },
];

// --- Main App Component ---
export default function App() {
  // Auth state
  const [authStep, setAuthStep] = useState('phone'); // 'phone', 'otp', 'authenticated'
  const [inputValue, setInputValue] = useState(''); // Combined input for phone/OTP
  const [phoneNumberStored, setPhoneNumberStored] = useState(''); // Store phone number after first step
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [authMessage, setAuthMessage] = useState(''); // Separate message for auth flow

  // Menu state
  const [tagFilter, setTagFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartExpanded, setIsCartExpanded] = useState(false); // Floating cart state

  // Timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0 && authStep === 'otp') {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, authStep]);

  // --- Mock Auth Logic ---
  const handleAuthAction = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthMessage('');

    if (authStep === 'phone') {
      // Send OTP phase
      if (inputValue.trim().length > 0) {
        setPhoneNumberStored(inputValue.trim()); // Store the entered phone number
        setTimeout(() => {
          setIsLoading(false);
          setAuthStep('otp');
          setCountdown(30);
          setAuthMessage('OTP sent! (Mock OTP: 1234)'); // Provide a mock OTP for testing
          setInputValue(''); // Clear input for OTP entry
        }, 1500);
      } else {
        setIsLoading(false);
        setAuthMessage('Please enter your phone number.');
      }
    } else if (authStep === 'otp') {
      // Verify OTP phase
      if (inputValue === '1234') { // Mock OTP verification
        setTimeout(() => {
          setIsLoading(false);
          setAuthStep('authenticated');
          setAuthMessage('OTP Verified! Redirecting to menu...');
        }, 1500);
      } else {
        setIsLoading(false);
        setAuthMessage('Invalid OTP. Please try again. (Hint: It\'s 1234)');
      }
    }
  };

  const handleBackToPhone = () => {
    setAuthStep('phone');
    setInputValue(phoneNumberStored); // Restore the phone number
    setAuthMessage('');
    setCountdown(0);
  };

  const handleResendOtp = () => {
    setCountdown(30);
    setAuthMessage('OTP resent! (Mock OTP: 123456)');
  };

  // --- Cart and Filter Logic ---
  const handleItemQuantityChange = useCallback((item, change) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(ci => ci.id === item.id);
      if (!existingItem) {
        return [...prevCart, { ...item, quantity: 1 }];
      }
      const newQuantity = existingItem.quantity + change;
      if (newQuantity < 1) {
        return prevCart.filter(ci => ci.id !== item.id);
      }
      return prevCart.map(ci =>
        ci.id === item.id ? { ...ci, quantity: newQuantity } : ci
      );
    });
  }, []);
  
  const handleRemoveFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  }
  
  const handleClearCart = () => {
    setCart([]);
    setIsCartExpanded(false); // Collapse cart after clearing
  }

  const handleUpdateCartQuantity = useCallback((itemId, newQuantity) => {
    if (newQuantity < 1) {
        handleRemoveFromCart(itemId);
    } else {
        setCart((prevCart) =>
            prevCart.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
        );
    }
  }, []);

  const cartTotal = useMemo(() => {
      return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  }, [cart]);

  const totalCartItems = useMemo(() => {
      return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const allTags = useMemo(() => Array.from(new Set(menuItems.flatMap(item => item.tags))), []);

  const filteredItems = useMemo(() => {
    let items = menuItems;
    if (typeFilter) {
      items = items.filter(item => item.type === typeFilter);
    }
    if (tagFilter) {
      items = items.filter(item => item.tags.includes(tagFilter));
    }
    return items;
  }, [typeFilter, tagFilter]);
  
  const handleTagClick = (tag) => {
    setTagFilter(tagFilter === tag ? null : tag);
  };
  
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/600x400/1f2937/9ca3af?text=Image+Missing`;
  };

  // Render auth screens
  if (authStep !== 'authenticated') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-8"> {/* Ensure central alignment, adjusted padding */}
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4"> {/* Changed to black background */}
              <icons.shoppingCart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">The Modern Eatery</h1>
            <p className="text-gray-400">Welcome to our digital dining experience</p>
          </div>
          
          {/* Combined Phone/OTP Input Block (Black & White Theme) */}
          <div className="bg-white p-8 rounded-xl shadow-lg w-full text-black mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {authStep === 'otp' ? 'Verify your phone number' : 'Enter your phone number'}
            </h2>
            <form onSubmit={handleAuthAction} className="relative flex items-center mb-4">
              {authStep === 'otp' && (
                <button
                  type="button" // Important for buttons inside a form
                  onClick={handleBackToPhone}
                  className="absolute left-0 p-2 rounded-full text-gray-700 hover:bg-gray-200 transition-colors z-10"
                  aria-label="Back to phone number input"
                >
                  <icons.arrowLeft className="w-6 h-6" />
                </button>
              )}
              <input
                type="text" // Use text for flexible input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={authStep === 'otp' ? 'Enter OTP (123456)' : 'e.g., 9876543210'}
                className={`w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none ${authStep === 'otp' ? 'pl-12' : ''}`}
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`absolute right-0 p-2 rounded-full ${isLoading ? 'bg-gray-400' : 'bg-black text-white hover:bg-gray-800'} transition-colors`}
                aria-label={authStep === 'otp' ? 'Verify OTP' : 'Send OTP'}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <icons.arrowRight className="w-6 h-6" />
                )}
              </button>
            </form>
            {authMessage && <p className={`text-center mt-4 text-sm font-medium ${authMessage.includes('Invalid') || authMessage.includes('Please enter') ? 'text-red-500' : 'text-gray-700'}`}>{authMessage}</p>}

            {authStep === 'otp' && (
              <div className="mt-6 text-center space-y-3">
                {countdown > 0 ? (
                  <p className="text-gray-700">Resend OTP in {countdown}s</p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="text-black hover:text-gray-700 font-medium" // Adjusted text color
                    type="button"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render main menu app
  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6 sm:p-6 font-sans pb-32">
      <Header phoneNumber={phoneNumberStored} />
            
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Menu</h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">Explore our delicious offerings. Select filters to find your perfect dish.</p>
      </div>

      <FilterControls 
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        tagFilter={tagFilter}
        handleTagClick={handleTagClick}
        allTags={allTags}
        clearTagFilter={() => setTagFilter(null)}
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
        {filteredItems.map(item => (
          <MenuItemCard
            key={item.id}
            item={item}
            cartItem={cart.find(ci => ci.id === item.id)}
            onQuantityChange={handleItemQuantityChange}
            onTagClick={handleTagClick}
            onImageError={handleImageError}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center text-gray-500 mt-16 col-span-full">
            <h3 className="text-xl font-semibold">No Matches Found</h3>
            <p>Try adjusting your filters.</p>
        </div>
      )}

      {/* Floating Cart replaces the old CartModal */}
      <FloatingCart
        cart={cart}
        totalCartItems={totalCartItems}
        cartTotal={cartTotal}
        isExpanded={isCartExpanded}
        onToggleExpanded={() => setIsCartExpanded(!isCartExpanded)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />
    </div>
  );
}


// --- Sub-components (simplified where necessary) ---

const Header = ({ phoneNumber }) => (
  <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700/50 max-w-7xl mx-auto">
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">The Modern Eatery</h1>
    </div>
    {phoneNumber && (
      <div className="text-right">
        <p className="text-gray-400 text-sm">Welcome!</p>
        <p className="text-white text-sm font-medium">Phone: {phoneNumber}</p>
      </div>
    )}
  </header>
);

const FilterControls = ({ typeFilter, setTypeFilter, tagFilter, handleTagClick, allTags, clearTagFilter }) => (
  <>
    <div className="flex justify-center gap-2 sm:gap-3 mb-6">
      <button onClick={() => setTypeFilter(null)} className={`px-4 py-2 text-sm sm:px-5 sm:py-2 rounded-full font-semibold transition-all duration-300 ${!typeFilter ? "bg-purple-600 text-white shadow-lg" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>All</button>
      <button onClick={() => setTypeFilter('veg')} className={`px-4 py-2 text-sm sm:px-5 sm:py-2 rounded-full font-semibold transition-all duration-300 ${typeFilter === 'veg' ? "bg-green-600 text-white shadow-lg" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>Veg</button>
      <button onClick={() => setTypeFilter('non-veg')} className={`px-4 py-2 text-sm sm:px-5 sm:py-2 rounded-full font-semibold transition-all duration-300 ${typeFilter === 'non-veg' ? "bg-red-600 text-white shadow-lg" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>Non-Veg</button>
    </div>
    <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-10 pb-4 border-b border-gray-800">
      {allTags.map(tag => (
        <button key={tag} onClick={() => handleTagClick(tag)} className={`px-3 py-1 text-xs sm:px-4 sm:py-1 rounded-full border transition-all duration-300 ${tagFilter === tag ? "bg-purple-500 border-purple-500 text-white" : "border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"}`}>
          {tag}
        </button>
      ))}
      {tagFilter && <button onClick={clearTagFilter} className="text-xs text-purple-400 hover:text-purple-300 ml-2">Clear Tag</button>}
    </div>
  </>
);

const MenuItemCard = ({ item, cartItem, onQuantityChange, onTagClick, onImageError }) => (
  <div className={`bg-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${item.topSeller ? 'ring-2 ring-purple-500 shadow-xl shadow-purple-500/30' : 'ring-1 ring-gray-700'}`}>
    <div className="relative">
      <img src={item.image} alt={item.name} className="w-full h-32 sm:h-40 md:h-48 object-cover" onError={onImageError} />
      {item.topSeller && <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">Top Seller</span>}
    </div>
    <div className="p-3 sm:p-4 flex flex-col flex-grow">
      <div className="mb-2 min-h-[3rem]">
        <h2 className="text-base sm:text-lg font-semibold text-white w-full line-clamp-2">{item.name}</h2>
      </div>
      <p className="text-xs sm:text-sm text-gray-400 mb-2 flex-grow">{item.description}</p>
      <div className="flex justify-end items-center mb-4">
        <span className="text-green-400 font-bold text-base sm:text-lg">₹{item.price.toFixed(2)}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
        {item.tags.map(tag => (
          <button key={tag} onClick={() => onTagClick(tag)} className="text-xs px-2 sm:px-2.5 py-1 rounded-full bg-gray-700 text-gray-300 hover:bg-purple-500 hover:text-white transition-colors">
            {tag}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center mt-auto pt-4 border-t border-gray-700/50">
          {cartItem ? (
              <div className="flex items-center gap-3 sm:gap-4 w-full justify-center">
                  <button onClick={() => onQuantityChange(item, -1)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-700 hover:bg-red-500 transition-colors font-bold text-lg sm:text-xl flex items-center justify-center disabled:opacity-50" aria-label="Decrease quantity"><icons.minus className="w-4 h-4 sm:w-5 sm:h-5"/></button>
                  <span className="font-bold text-lg sm:text-xl w-6 sm:w-8 text-center">{cartItem.quantity}</span>
                  <button onClick={() => onQuantityChange(item, 1)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-700 hover:bg-green-500 transition-colors font-bold text-lg sm:text-xl flex items-center justify-center" aria-label="Increase quantity"><icons.plus className="w-4 h-4 sm:w-5 sm:h-5"/></button>
              </div>
          ) : (
              <button onClick={() => onQuantityChange(item, 1)} className="w-full bg-purple-600 hover:bg-purple-700 transition-colors text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2">
                 <icons.shoppingCart className="w-4 h-4"/> Add to Cart
              </button>
          )}
      </div>
    </div>
  </div>
);

const FloatingCart = ({ cart, totalCartItems, cartTotal, isExpanded, onToggleExpanded, onUpdateQuantity, onRemoveItem, onClearCart }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className={`relative bg-gray-800 rounded-t-3xl shadow-lg transition-transform duration-300 ${isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-4rem)]'} max-w-xl mx-auto`}>
        {/* Cart Header (always visible) */}
        <div className="flex justify-between items-center p-4 sm:p-6 cursor-pointer" onClick={onToggleExpanded}>
          <div className="flex items-center gap-3">
            <icons.shoppingCart className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-semibold text-white">Your Cart ({totalCartItems})</span>
          </div>
          <div className="flex items-center gap-4">
            {totalCartItems > 0 && <span className="text-green-400 text-xl font-bold">₹{cartTotal}</span>}
            <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white">
              {isExpanded ? <icons.chevronDown className="w-6 h-6" /> : <icons.chevronUp className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Cart Items (conditionally visible) */}
        {isExpanded && (
          cart.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <icons.shoppingCart className="w-12 h-12 mb-4" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-60 sm:max-h-80 p-4 sm:p-6">
              <ul className="-my-4 divide-y divide-gray-700">
                {cart.map(item => (
                  <li key={item.id} className="flex items-center py-4 gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="text-md font-semibold text-white">{item.name}</h3>
                      <p className="text-sm text-gray-400">₹{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-gray-700 hover:bg-red-500 transition-colors"><icons.minus className="w-4 h-4"/></button>
                      <span className="font-bold text-white">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-gray-700 hover:bg-green-500 transition-colors"><icons.plus className="w-4 h-4"/></button>
                    </div>
                    <button onClick={() => onRemoveItem(item.id)} className="p-1 text-gray-500 hover:text-red-400 transition-colors"><icons.trash className="w-5 h-5"/></button>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}

        {isExpanded && cart.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-300">Total</span>
              <span className="text-2xl font-bold text-green-400">₹{cartTotal}</span>
            </div>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg">
              Proceed to Checkout
            </button>
            <button onClick={onClearCart} className="w-full mt-2 text-sm text-gray-500 hover:text-red-400 transition-colors">Clear Cart</button>
          </div>
        )}
      </div>
    </div>
  );
};
