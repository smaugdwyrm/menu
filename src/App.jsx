import React, { useState, useMemo, useCallback } from 'react';

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
};


// --- Data for the menu items ---
const menuItems = [
  { id: 1, name: "Margherita Pizza", description: "Classic pizza with fresh tomatoes, mozzarella cheese, and aromatic basil.", tags: ["Pizza", "Italian"], type: "veg", image: "https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", price: 450, topSeller: true },
  { id: 2, name: "Grilled Chicken Salad", description: "Juicy grilled chicken over mixed greens with a light vinaigrette.", tags: ["Salad", "Healthy"], type: "non-veg", image: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", price: 550 },
  { id: 3, name: "Spaghetti Carbonara", description: "Creamy egg-based sauce, crispy pancetta, and parmesan.", tags: ["Pasta", "Italian"], type: "non-veg", image: "https://images.pexels.com/photos/4057739/pexels-photo-4057739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", price: 650, topSeller: true },
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
  const [tagFilter, setTagFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6 sm:p-6 font-sans">
      <Header totalCartItems={totalCartItems} onCartClick={() => setIsCartOpen(true)} />
      
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

      <CartModal 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
          total={cartTotal}
      />
    </div>
  );
}


// --- Sub-components ---

const Header = ({ totalCartItems, onCartClick }) => (
  <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700/50 max-w-7xl mx-auto">
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">The Modern Eatery</h1>
    </div>
    <button onClick={onCartClick} className="relative p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
      <icons.shoppingCart className="w-6 h-6" />
      {totalCartItems > 0 && (
        <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center transform translate-x-1/3 -translate-y-1/3 ring-2 ring-gray-900">
          {totalCartItems}
        </span>
      )}
    </button>
  </header>
);

const FilterControls = ({ typeFilter, setTypeFilter, tagFilter, handleTagClick, allTags, clearTagFilter }) => (
  <>
    <div className="flex justify-center gap-2 sm:gap-3 mb-6">
      <button onClick={() => setTypeFilter(null)} className={`px-4 py-2 text-sm sm:px-5 sm:py-2 rounded-full text-md font-semibold transition-all duration-300 ${!typeFilter ? "bg-purple-600 text-white shadow-lg" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>All</button>
      <button onClick={() => setTypeFilter('veg')} className={`px-4 py-2 text-sm sm:px-5 sm:py-2 rounded-full text-md font-semibold transition-all duration-300 ${typeFilter === 'veg' ? "bg-green-600 text-white shadow-lg" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>Veg</button>
      <button onClick={() => setTypeFilter('non-veg')} className={`px-4 py-2 text-sm sm:px-5 sm:py-2 rounded-full text-md font-semibold transition-all duration-300 ${typeFilter === 'non-veg' ? "bg-red-600 text-white shadow-lg" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>Non-Veg</button>
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
      {/* Adjusted image height for better scaling on smaller screens */}
      <img src={item.image} alt={item.name} className="w-full h-32 sm:h-40 md:h-48 object-cover" onError={onImageError} />
      {item.topSeller && <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">Top Seller</span>}
    </div>
    <div className="p-3 sm:p-4 flex flex-col flex-grow">
      {/* Added min-h-[3rem] for consistent height and line-clamp-2 for text truncation */}
      <div className="flex justify-between items-start mb-2 min-h-[3rem]">
        <h2 className="text-base sm:text-lg font-semibold text-white flex-1 mr-2 line-clamp-2">{item.name}</h2>
        <span className="text-green-400 font-bold text-base sm:text-lg">₹{item.price.toFixed(2)}</span>
      </div>
      <p className="text-xs sm:text-sm text-gray-400 mb-4 flex-grow">{item.description}</p>
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

const CartModal = ({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, total, onClearCart }) => (
  <>
    <div className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
    <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Your Cart</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"><icons.x className="w-6 h-6"/></button>
        </header>
        {cart.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
            <icons.shoppingCart className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-white">Your cart is empty</h3>
            <p className="text-gray-400">Add some delicious items from the menu!</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4 sm:p-6">
            <ul className="-my-4 divide-y divide-gray-700">
              {cart.map(item => (
                <li key={item.id} className="flex items-center py-4 gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="text-md font-semibold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400">₹{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-gray-800 hover:bg-red-500 transition-colors"><icons.minus className="w-4 h-4"/></button>
                    <span className="font-bold">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-gray-800 hover:bg-green-500 transition-colors"><icons.plus className="w-4 h-4"/></button>
                  </div>
                  <button onClick={() => onRemoveItem(item.id)} className="p-1 text-gray-500 hover:text-red-400 transition-colors"><icons.trash className="w-5 h-5"/></button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {cart.length > 0 && (
          <footer className="p-4 sm:p-6 border-t border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-300">Subtotal</span>
              <span className="text-2xl font-bold text-green-400">₹{total}</span>
            </div>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg">Proceed to Checkout</button>
            <button onClick={onClearCart} className="w-full mt-2 text-sm text-gray-500 hover:text-red-400 transition-colors">Clear Cart</button>
          </footer>
        )}
      </div>
    </div>
  </>
);
