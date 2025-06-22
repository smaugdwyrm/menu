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
  chevronUp: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>,
  chevronDown: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
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
  const [isCartExpanded, setIsCartExpanded] = useState(false);

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
    setIsCartExpanded(false);
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
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6 sm:p-6 font-sans pb-32">
      <Header />
      
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

// --- Sub-components ---

const Header = () => (
  <header className="flex justify-center items-center mb-6 pb-4 border-b border-gray-700/50 max-w-7xl mx-auto">
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">The Modern Eatery</h1>
    </div>
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
      <img src={item.image} alt={item.name} className="w-full h-32 sm:h-40 md:h-48 object-cover" onError={onImageError} />
      {item.topSeller && <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">Top Seller</span>}
    </div>
    <div className="p-3 sm:p-4 flex flex-col flex-grow">
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

const FloatingCart = ({ cart, totalCartItems, cartTotal, isExpanded, onToggleExpanded, onUpdateQuantity, onRemoveItem, onClearCart }) => {
  if (totalCartItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={onToggleExpanded}
        />
      )}
      
      {/* Floating cart container */}
      <div className={`relative z-50 bg-gray-800 border-t border-gray-700 shadow-2xl transition-all duration-300 ${
        isExpanded ? 'max-h-96' : 'max-h-20'
      }`}>
        
        {/* Cart header - always visible */}
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-750 transition-colors"
          onClick={onToggleExpanded}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <icons.shoppingCart className="w-6 h-6 text-purple-400" />
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalCartItems}
              </span>
            </div>
            <div>
              <p className="text-white font-semibold">{totalCartItems} {totalCartItems === 1 ? 'item' : 'items'}</p>
              <p className="text-green-400 font-bold">₹{cartTotal}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
              Checkout
            </button>
            {isExpanded ? (
              <icons.chevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <icons.chevronUp className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Expanded cart content */}
        {isExpanded && (
          <div className="border-t border-gray-700">
            <div className="max-h-64 overflow-y-auto p-4">
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-700 rounded-lg p-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{item.name}</h4>
                      <p className="text-gray-400 text-xs">₹{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-gray-600 hover:bg-red-500 transition-colors flex items-center justify-center"
                      >
                        <icons.minus className="w-3 h-3" />
                      </button>
                      <span className="text-white font-medium w-6 text-center text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-gray-600 hover:bg-green-500 transition-colors flex items-center justify-center"
                      >
                        <icons.plus className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="ml-2 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <icons.trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Cart actions */}
            <div className="border-t border-gray-600 p-4">
              <button 
                onClick={onClearCart}
                className="w-full text-sm text-gray-500 hover:text-red-400 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};