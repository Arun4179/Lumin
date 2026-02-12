import { Category, Product, Order, UserProfile } from './types';

// Using high-quality Unsplash images that mimic high-end fashion editorial photography
// to ensure links remain valid and high resolution.

export const HERO_IMAGE = "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop";

export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Women",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    link: "#women"
  },
  {
    id: 2,
    name: "Men",
    image: "https://images.unsplash.com/photo-1617137968427-85924c809a22?q=80&w=1000&auto=format&fit=crop",
    link: "#men"
  },
  {
    id: 3,
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop",
    link: "#accessories"
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Oversized Wool Coat",
    category: "Women",
    price: 129.00,
    image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1000&auto=format&fit=crop",
    isNew: true,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Beige", "Black", "Grey"],
    description: "A timeless winter staple featuring a relaxed silhouette and dropped shoulders. Perfect for layering over chunky knits, this coat combines warmth with effortless style.",
    material: "100% Wool"
  },
  {
    id: 2,
    name: "Structured Cotton Blazer",
    category: "Men",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop",
    isNew: false,
    sizes: ["M", "L", "XL"],
    colors: ["Navy", "Black", "Brown"],
    description: "Tailored for a sharp, modern fit. Features a notched lapel, functional patch pockets, and a soft lining for all-day comfort.",
    material: "98% Cotton, 2% Elastane"
  },
  {
    id: 3,
    name: "Pleated Wide-Leg Trousers",
    category: "Women",
    price: 59.90,
    image: "https://images.unsplash.com/photo-1509631179647-b849389274e2?q=80&w=1000&auto=format&fit=crop",
    isNew: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Olive"],
    description: "Flowy and sophisticated high-waisted trousers with precise front pleats. The wide-leg cut offers a flattering drape suitable for office or evening wear.",
    material: "65% Polyester, 35% Viscose"
  },
  {
    id: 4,
    name: "Minimalist Leather Tote",
    category: "Accessories",
    price: 149.00,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop",
    isNew: false,
    sizes: ["One Size"],
    colors: ["Brown", "Black"],
    description: "Everyday luxury defined. This tote features a spacious interior with an internal zip pocket, sturdy handles, and a sleek unembellished exterior.",
    material: "Genuine Calf Leather"
  },
  {
    id: 5,
    name: "Cashmere Knit Sweater",
    category: "Men",
    price: 99.00,
    image: "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?q=80&w=1000&auto=format&fit=crop",
    isNew: false,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Grey", "Navy", "Cream"],
    description: "Ultra-soft crew neck sweater designed for comfort and warmth without the bulk. A versatile piece that transitions seamlessly from season to season.",
    material: "100% Cashmere"
  },
  {
    id: 6,
    name: "Silk Slip Dress",
    category: "Women",
    price: 79.90,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
    isNew: true,
    sizes: ["XS", "S", "M"],
    colors: ["Silver", "Black", "Red"],
    description: "Fluid elegance. A bias-cut silhouette that drapes beautifully over the body, featuring adjustable spaghetti straps and a subtle cowl neckline.",
    material: "100% Mulberry Silk"
  },
  {
    id: 7,
    name: "Classic Oxford Shirt",
    category: "Men",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop",
    isNew: false,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue"],
    description: "A wardrobe essential. Crisp cotton oxford cloth cut in a regular fit. Features a button-down collar and single chest pocket.",
    material: "100% Organic Cotton"
  },
  {
    id: 8,
    name: "Gold Vermeil Hoops",
    category: "Accessories",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a51?q=80&w=1000&auto=format&fit=crop",
    isNew: true,
    sizes: ["One Size"],
    colors: ["Gold"],
    description: "Chunky yet lightweight hoops crafted from recycled silver and plated in thick 18k gold. The perfect finishing touch for any outfit.",
    material: "18k Gold Vermeil"
  },
  {
    id: 9,
    name: "High-Waist Linen Shorts",
    category: "Women",
    price: 49.50,
    image: "https://images.unsplash.com/photo-1589810635657-232948472d98?q=80&w=1000&auto=format&fit=crop",
    isNew: false,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Beige", "Rust", "White"],
    description: "Breathable linen shorts with a flattering high waist and A-line cut. Includes a self-tie belt and deep side pockets.",
    material: "100% Linen"
  },
  {
    id: 10,
    name: "Canvas Weekender Bag",
    category: "Accessories",
    price: 110.00,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
    isNew: false,
    sizes: ["One Size"],
    colors: ["Olive", "Black"],
    description: "Durable canvas travel bag with leather accents. Perfectly sized for short getaways, featuring a detachable shoulder strap.",
    material: "Heavyweight Cotton Canvas"
  },
  {
    id: 11,
    name: "Slim Fit Chinos",
    category: "Men",
    price: 55.00,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop",
    isNew: false,
    sizes: ["30", "32", "34", "36"],
    colors: ["Khaki", "Navy", "Olive"],
    description: "Versatile trousers crafted from stretch cotton twill. Mid-rise with a slim, tapered leg for a modern silhouette.",
    material: "97% Cotton, 3% Elastane"
  },
  {
    id: 12,
    name: "Silk Scarf",
    category: "Accessories",
    price: 35.00,
    image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=1000&auto=format&fit=crop",
    isNew: true,
    sizes: ["One Size"],
    colors: ["Floral", "Geometric"],
    description: "A vibrant square scarf that can be worn around the neck, in the hair, or tied to a bag handle. Adds a pop of color to neutral looks.",
    material: "100% Silk Satin"
  }
];

export const MOCK_USER: UserProfile = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 012-3456",
  defaultAddress: "123 Fashion Avenue, Suite 4B, New York, NY 10012"
};

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-2024-8832",
    date: "March 15, 2024",
    status: "Delivered",
    total: 184.00,
    items: [
      { ...PRODUCTS[0], quantity: 1, selectedSize: "M", selectedColor: "Beige" },
      { ...PRODUCTS[11], quantity: 1, selectedSize: "One Size", selectedColor: "Floral" }
    ]
  },
  {
    id: "ORD-2024-8711",
    date: "February 28, 2024",
    status: "Delivered",
    total: 89.90,
    items: [
      { ...PRODUCTS[1], quantity: 1, selectedSize: "L", selectedColor: "Navy" }
    ]
  },
  {
    id: "ORD-2024-9001",
    date: "March 20, 2024",
    status: "Processing",
    total: 45.00,
    items: [
      { ...PRODUCTS[7], quantity: 1, selectedSize: "One Size", selectedColor: "Gold" }
    ]
  }
];