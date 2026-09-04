// Cosmetic lookup tables only. Category and subcategory NAMES themselves
// always come from the backend (inventoryCategories / categorySummary /
// subCategorySummary) — nothing here decides what categories exist, it
// only decides what icon/color a known name gets. Anything not listed
// here (a brand-new category or subcategory added in MongoDB later)
// still renders correctly via the fallback entries.

import {
    Utensils,
    Pill,
    ShoppingBasket,
    Syringe,
    SprayCan,
    Box,
    Bone,
    Cookie,
    Milk,
    Beef,
    Wheat,
    Bug,
    Sparkles,
    Droplet,
    Thermometer,
    Layers,
    Link as LinkIcon,
    ToyBrick,
    BedDouble,
    Stethoscope,
    Bandage,
    Hand,
    Trash2,
    PawPrint,
} from "lucide-react";

const CATEGORY_THEME = {
    Food: {
        icon: Utensils,
        accent: "#F28C18",
        accentSoft: "#FFF0D9",
        heroBg: "#FFFBF5",
        heroBorder: "#F2E7D8",
        tagline: "Track food inventory and fulfill your furry friends' needs",
    },
    Medicine: {
        icon: Pill,
        accent: "#3B82F6",
        accentSoft: "#DBEAFE",
        heroBg: "#F6FAFF",
        heroBorder: "#DCE8FA",
        tagline: "Keep essential medicines stocked and ready to use",
    },
    Essentials: {
        icon: ShoppingBasket,
        accent: "#9B6BCB",
        accentSoft: "#EDE1FB",
        heroBg: "#FAF7FE",
        heroBorder: "#E7DCF7",
        tagline: "The everyday basics every shelter runs on",
    },
    "Medical Supplies": {
        icon: Syringe,
        accent: "#EF5B62",
        accentSoft: "#FEE2E2",
        heroBg: "#FFF7F7",
        heroBorder: "#F7DCDC",
        tagline: "Bandages, syringes, and clinical supplies on hand",
    },
    "Hygiene & Cleaning": {
        icon: SprayCan,
        accent: "#14B8A6",
        accentSoft: "#CCFBF1",
        heroBg: "#F5FDFC",
        heroBorder: "#D8F3EF",
        tagline: "Keeping the shelter fresh, clean, and safe",
    },
    Other: {
        icon: Box,
        accent: "#6B7280",
        accentSoft: "#E5E7EB",
        heroBg: "#FAFAFA",
        heroBorder: "#E8E8E8",
        tagline: "Everything else your shelter keeps track of",
    },
};

const FALLBACK_CATEGORY_THEME = {
    icon: Box,
    accent: "#54A86D",
    accentSoft: "#E5F6E7",
    heroBg: "#F7FAF5",
    heroBorder: "#E8EEE8",
    tagline: "Live inventory for this category",
};

export function getCategoryTheme(category) {
    return CATEGORY_THEME[category] || FALLBACK_CATEGORY_THEME;
}

// Rotating accent palette used for subcategory cards, so each card in the
// horizontal row gets a distinct but consistent color regardless of how
// many subcategories a category has.
export const SUBCATEGORY_PALETTE = [
    { bg: "bg-green-50", iconBg: "bg-green-100", color: "#3EAA62" },
    { bg: "bg-orange-50", iconBg: "bg-orange-100", color: "#F28C18" },
    { bg: "bg-blue-50", iconBg: "bg-blue-100", color: "#3B82F6" },
    { bg: "bg-red-50", iconBg: "bg-red-100", color: "#EF5B62" },
    { bg: "bg-purple-50", iconBg: "bg-purple-100", color: "#9B6BCB" },
    { bg: "bg-cyan-50", iconBg: "bg-cyan-100", color: "#14B8A6" },
];

const SUBCATEGORY_ICON_MAP = {
    "dog food": Utensils,
    "dog biscuits": Cookie,
    milk: Milk,
    meat: Beef,
    rice: Wheat,
    treats: Bone,
    deworming: Bug,
    antibiotics: Pill,
    vitamins: Sparkles,
    "skin care": Droplet,
    "pain & fever": Thermometer,
    "digestive care": Pill,
    "tick & flea": Bug,
    blankets: Layers,
    bowls: ShoppingBasket,
    leashes: LinkIcon,
    toys: ToyBrick,
    beds: BedDouble,
    "first aid kit": Stethoscope,
    bandages: Bandage,
    gauze: Bandage,
    syringes: Syringe,
    gloves: Hand,
    shampoo: Droplet,
    disinfectant: SprayCan,
    "floor cleaner": SprayCan,
    "waste bags": Trash2,
    miscellaneous: Box,
};

/** Icon for a subcategory name — falls back to a paw print for anything new. */
export function getSubcategoryIcon(subCategory) {
    const key = (subCategory || "").trim().toLowerCase();
    return SUBCATEGORY_ICON_MAP[key] || PawPrint;
}
