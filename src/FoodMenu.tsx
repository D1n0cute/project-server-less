import { useState, useMemo } from "react";
import "./FoodMenu.css";

/* ===== Types ===== */
interface MenuItem {
  id: number;
  name: string;
  nameEn: string;
  desc: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  badges: ("popular" | "veg" | "spicy")[];
}

/* ===== Data ===== */
const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: "ต้มยำกุ้ง",
    nameEn: "Tom Yum Goong",
    desc: "ต้มยำรสแซ่บ หัวกะทิสด กุ้งแม่น้ำตัวใหญ่ เห็ดฟาง มะนาว และสมุนไพรหอม",
    price: 280,
    category: "soup",
    image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&q=80",
    rating: 4.9,
    reviewCount: 312,
    badges: ["popular", "spicy"],
  },
  {
    id: 2,
    name: "ผัดไทยกุ้งสด",
    nameEn: "Pad Thai Goong Sod",
    desc: "เส้นจันท์ผัดซอสผัดไทยสูตรดั้งเดิม กุ้งสด ไข่ไก่ ถั่วงอก ต้นหอม",
    price: 220,
    category: "main",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&q=80",
    rating: 4.8,
    reviewCount: 487,
    badges: ["popular"],
  },
  {
    id: 3,
    name: "ส้มตำไทย",
    nameEn: "Som Tum Thai",
    desc: "มะละกอดิบตำสด มะเขือเทศ ถั่วฝักยาว กุ้งแห้ง ถั่วลิสงคั่ว",
    price: 120,
    category: "salad",
    image: "https://images.unsplash.com/photo-1599942978349-01db4a2bb3d1?w=600&q=80",
    rating: 4.7,
    reviewCount: 201,
    badges: ["veg", "spicy"],
  },
  {
    id: 4,
    name: "แกงเขียวหวานไก่",
    nameEn: "Green Curry Chicken",
    desc: "แกงเขียวหวานสูตรโบราณ กะทิสด ลูกเดือย มะเขือเปราะ ใบโหระพา",
    price: 210,
    category: "curry",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80",
    rating: 4.6,
    reviewCount: 156,
    badges: [],
  },
  {
    id: 5,
    name: "ข้าวผัดกะเพราหมูกรอบ",
    nameEn: "Krapao Crispy Pork",
    desc: "หมูกรอบทอดกรอบ ผัดกับพริกและกะเพราสด ไข่ดาวหน้ากรอบ",
    price: 180,
    category: "main",
    image: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80",
    rating: 4.9,
    reviewCount: 398,
    badges: ["popular", "spicy"],
  },
  {
    id: 6,
    name: "ยำวุ้นเส้นทะเล",
    nameEn: "Glass Noodle Seafood Salad",
    desc: "วุ้นเส้นนุ่มผสมอาหารทะเลสด กุ้ง หอยแมลงภู่ ปลาหมึก ซอสมะนาวรสจัด",
    price: 240,
    category: "salad",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80",
    rating: 4.5,
    reviewCount: 134,
    badges: ["spicy"],
  },
  {
    id: 7,
    name: "ข้าวเหนียวมะม่วง",
    nameEn: "Mango Sticky Rice",
    desc: "ข้าวเหนียวมูนกะทิสด มะม่วงน้ำดอกไม้สุกหวาน ราดกะทิข้น",
    price: 130,
    category: "dessert",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80",
    rating: 4.8,
    reviewCount: 290,
    badges: ["popular", "veg"],
  },
  {
    id: 8,
    name: "ชาไทยเย็น",
    nameEn: "Thai Iced Tea",
    desc: "ชาไทยแท้ หอมกลิ่นเครื่องเทศ นมข้นหวาน เสิร์ฟบนน้ำแข็งก้อน",
    price: 70,
    category: "drink",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
    rating: 4.7,
    reviewCount: 445,
    badges: ["veg"],
  },
];

const CATEGORIES = [
  { id: "all", label: "ทั้งหมด", icon: "🍽️" },
  { id: "soup", label: "ซุป", icon: "🍲" },
  { id: "main", label: "จานหลัก", icon: "🍛" },
  { id: "curry", label: "แกง", icon: "🥘" },
  { id: "salad", label: "ยำ / สลัด", icon: "🥗" },
  { id: "dessert", label: "ของหวาน", icon: "🍮" },
  { id: "drink", label: "เครื่องดื่ม", icon: "🧋" },
];

const BADGE_LABELS: Record<string, string> = {
  popular: "⭐ ยอดนิยม",
  veg: "🌿 มังสวิรัติ",
  spicy: "🌶️ เผ็ด",
};

/* ===== Helpers ===== */
const renderStars = (rating: number) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
};

/* ===== Main Component ===== */
export default function FoodMenu() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [favourites, setFavourites] = useState<Set<number>>(new Set());

  /* Filtered items */
  const filtered = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCat = activeCategory === "all" || item.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.name.includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.desc.includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  /* Cart */
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = MENU_ITEMS.find((m) => m.id === Number(id));
    return sum + (item?.price ?? 0) * qty;
  }, 0);

  const addToCart = (id: number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  const toggleFav = (id: number) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="menu-app">
      {/* Header */}
      <header className="menu-header">
        <p className="restaurant-label">Fine Thai Dining</p>
        <h1 className="restaurant-name">ครัวไทยแท้</h1>
        <p className="restaurant-tagline">รสชาติต้นตำรับ ใจกลางเมือง</p>
      </header>

      {/* Search */}
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="ค้นหาเมนู..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Tabs */}
      <nav className="category-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`tab-btn${activeCategory === cat.id ? " active" : ""}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span className="tab-icon">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </nav>

      {/* Section Title */}
      <h2 className="section-title">
        {CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "เมนูทั้งหมด"}
      </h2>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="menu-grid">
          {filtered.map((item) => (
            <article className="menu-card" key={item.id}>
              {/* Image */}
              <div className="card-img-wrap">
                <img className="card-img" src={item.image} alt={item.name} loading="lazy" />
                <div className="card-img-overlay" />

                {/* Badges */}
                <div className="card-badges">
                  {item.badges.map((b) => (
                    <span key={b} className={`badge badge-${b}`}>
                      {BADGE_LABELS[b]}
                    </span>
                  ))}
                </div>

                {/* Favourite */}
                <button
                  className={`fav-btn${favourites.has(item.id) ? " active" : ""}`}
                  onClick={() => toggleFav(item.id)}
                  aria-label="บันทึกรายการโปรด"
                >
                  {favourites.has(item.id) ? "♥" : "♡"}
                </button>
              </div>

              {/* Body */}
              <div className="card-body">
                <div className="card-top">
                  <div>
                    <h3 className="card-name">{item.name}</h3>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                      {item.nameEn}
                    </p>
                  </div>
                  <span className="card-price">฿{item.price}</span>
                </div>

                <p className="card-desc">{item.desc}</p>

                <div className="card-footer">
                  <div className="card-rating">
                    <span className="stars">{renderStars(item.rating)}</span>
                    <span>
                      {item.rating} ({item.reviewCount})
                    </span>
                  </div>

                  <button className="add-btn" onClick={() => addToCart(item.id)}>
                    {cart[item.id] ? (
                      <>
                        <span>+</span>
                        <span>{cart[item.id]} ชิ้น</span>
                      </>
                    ) : (
                      <>
                        <span>+</span>
                        <span>เพิ่ม</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <p className="empty-text">ไม่พบเมนูที่ค้นหา</p>
          <p className="empty-sub">ลองค้นหาด้วยคำอื่น หรือเปลี่ยนหมวดหมู่</p>
        </div>
      )}

      {/* Cart Pill */}
      {totalItems > 0 && (
        <button className="cart-pill">
          <span>🛒 ตะกร้าสินค้า</span>
          <span className="cart-count">{totalItems} รายการ</span>
          <span className="cart-total">฿{totalPrice.toLocaleString()}</span>
        </button>
      )}
    </div>
  );
}
