// Computer manufacturers and their models data
export const computerManufacturersModels: Record<string, string[]> = {
  "Apple": [
    // MacBook Pro
    "MacBook Pro 16 (M3 Pro)", "MacBook Pro 16 (M3 Max)", "MacBook Pro 14 (M3)", "MacBook Pro 14 (M3 Pro)", "MacBook Pro 14 (M3 Max)",
    "MacBook Pro 16 (M2 Pro)", "MacBook Pro 16 (M2 Max)", "MacBook Pro 14 (M2 Pro)", "MacBook Pro 14 (M2 Max)",
    "MacBook Pro 16 (M1 Pro)", "MacBook Pro 16 (M1 Max)", "MacBook Pro 14 (M1 Pro)", "MacBook Pro 14 (M1 Max)",
    "MacBook Pro 13 (M2)", "MacBook Pro 13 (M1)",
    // MacBook Air
    "MacBook Air 15 (M3)", "MacBook Air 13 (M3)", "MacBook Air 15 (M2)", "MacBook Air 13 (M2)", "MacBook Air 13 (M1)",
    // iMac
    "iMac 24 (M3)", "iMac 24 (M1)", "iMac 27 (Intel)",
    // Mac Mini
    "Mac Mini (M2)", "Mac Mini (M2 Pro)", "Mac Mini (M1)",
    // Mac Studio
    "Mac Studio (M2 Max)", "Mac Studio (M2 Ultra)", "Mac Studio (M1 Max)", "Mac Studio (M1 Ultra)",
    // Mac Pro
    "Mac Pro (M2 Ultra)", "Mac Pro (Intel)"
  ],
  "Lenovo": [
    // ThinkPad
    "ThinkPad X1 Carbon Gen 11", "ThinkPad X1 Carbon Gen 10", "ThinkPad X1 Carbon Gen 9",
    "ThinkPad X1 Yoga Gen 8", "ThinkPad X1 Yoga Gen 7", "ThinkPad X1 Nano Gen 3",
    "ThinkPad T14s Gen 4", "ThinkPad T14 Gen 4", "ThinkPad T16 Gen 2",
    "ThinkPad P16s Gen 2", "ThinkPad P16 Gen 2", "ThinkPad P1 Gen 6",
    "ThinkPad E14 Gen 5", "ThinkPad E16 Gen 1", "ThinkPad L14 Gen 4",
    // IdeaPad
    "IdeaPad Slim 5", "IdeaPad Slim 5 Pro", "IdeaPad Flex 5", "IdeaPad Gaming 3",
    "IdeaPad 3", "IdeaPad 5", "IdeaPad 5 Pro",
    // Yoga
    "Yoga 9i Gen 8", "Yoga 7i Gen 8", "Yoga Slim 7 Pro", "Yoga 6",
    // Legion
    "Legion Pro 7i Gen 8", "Legion Pro 5i Gen 8", "Legion 5i Gen 8", "Legion 5 Gen 8",
    "Legion Slim 7i Gen 8", "Legion Slim 5 Gen 8",
    // Desktop
    "ThinkCentre M90q Gen 4", "ThinkCentre M70q Gen 4", "IdeaCentre 5i", "Legion Tower 7i"
  ],
  "HP": [
    // Spectre
    "Spectre x360 16", "Spectre x360 14", "Spectre x360 13.5",
    // Envy
    "Envy x360 15", "Envy x360 13", "Envy 17", "Envy 16", "Envy 15",
    // Pavilion
    "Pavilion Plus 14", "Pavilion x360 14", "Pavilion 15", "Pavilion Aero 13",
    // EliteBook
    "EliteBook 1040 G10", "EliteBook 860 G10", "EliteBook 840 G10", "EliteBook 640 G10",
    // ProBook
    "ProBook 450 G10", "ProBook 440 G10", "ProBook 650 G9",
    // ZBook
    "ZBook Studio G10", "ZBook Firefly G10", "ZBook Power G10", "ZBook Fury G10",
    // OMEN
    "OMEN 17", "OMEN 16", "OMEN Transcend 16", "OMEN Transcend 14",
    // Victus
    "Victus 16", "Victus 15",
    // Desktop
    "All-in-One 27", "Pavilion Desktop", "OMEN Desktop 45L", "OMEN Desktop 25L"
  ],
  "Dell": [
    // XPS
    "XPS 17 9730", "XPS 15 9530", "XPS 13 Plus 9320", "XPS 13 9315",
    // Inspiron
    "Inspiron 16 Plus", "Inspiron 16 2-in-1", "Inspiron 15", "Inspiron 14", "Inspiron 14 2-in-1",
    // Latitude
    "Latitude 9440 2-in-1", "Latitude 7440", "Latitude 5540", "Latitude 5440",
    // Precision
    "Precision 7780", "Precision 7680", "Precision 5680", "Precision 5480",
    // Vostro
    "Vostro 16 5640", "Vostro 15 3530", "Vostro 14 3440",
    // G Series (Gaming)
    "G16 7630", "G15 5530", "G15 5525",
    // Alienware
    "Alienware m18", "Alienware m16", "Alienware x16", "Alienware x14",
    // Desktop
    "Alienware Aurora R16", "XPS Desktop 8960", "Inspiron Desktop", "OptiPlex 7010"
  ],
  "ASUS": [
    // ZenBook
    "ZenBook Pro 16X OLED", "ZenBook Pro 14 OLED", "ZenBook 14X OLED", "ZenBook 14 OLED",
    "ZenBook S 13 OLED", "ZenBook Duo", "ZenBook Flip 13 OLED",
    // VivoBook
    "VivoBook Pro 16X OLED", "VivoBook Pro 15 OLED", "VivoBook S 14 OLED",
    "VivoBook 15", "VivoBook 14", "VivoBook Flip 14",
    // ProArt
    "ProArt Studiobook 16 OLED", "ProArt Studiobook Pro 16 OLED",
    // ExpertBook
    "ExpertBook B9 OLED", "ExpertBook B5 OLED", "ExpertBook B3 Flip",
    // ROG
    "ROG Zephyrus G16", "ROG Zephyrus G14", "ROG Zephyrus Duo 16", "ROG Zephyrus M16",
    "ROG Strix SCAR 18", "ROG Strix SCAR 17", "ROG Strix G18", "ROG Strix G16",
    "ROG Flow Z13", "ROG Flow X16", "ROG Flow X13",
    // TUF Gaming
    "TUF Gaming A16", "TUF Gaming A15", "TUF Gaming F15",
    // Desktop
    "ROG Strix GT35", "ROG Strix GA35", "ProArt Station"
  ],
  "Acer": [
    // Swift
    "Swift Go 16", "Swift Go 14", "Swift X 16", "Swift X 14", "Swift 5", "Swift 3",
    // Aspire
    "Aspire 5", "Aspire 3", "Aspire Vero",
    // Spin
    "Spin 5", "Spin 3",
    // TravelMate
    "TravelMate P6", "TravelMate P4", "TravelMate Spin P4",
    // Predator
    "Predator Helios 18", "Predator Helios 16", "Predator Helios 300",
    "Predator Triton 17 X", "Predator Triton 16",
    // Nitro
    "Nitro 5", "Nitro 16", "Nitro 17",
    // ConceptD
    "ConceptD 7", "ConceptD 5 Pro", "ConceptD 3",
    // Desktop
    "Predator Orion 7000", "Predator Orion 5000", "Nitro 50", "Aspire TC"
  ],
  "MSI": [
    // Stealth
    "Stealth 18 Mercedes-AMG", "Stealth 17 Studio", "Stealth 16 Studio", "Stealth 15M",
    // Titan
    "Titan GT77 HX", "Titan 18 HX",
    // Raider
    "Raider GE78 HX", "Raider GE68 HX", "Raider GE76",
    // Vector
    "Vector GP78 HX", "Vector GP68 HX", "Vector GP77",
    // Cyborg
    "Cyborg 15", "Cyborg 14",
    // Katana / Sword
    "Katana 17", "Katana 15", "Sword 17", "Sword 15",
    // Creator
    "Creator Z17 HX Studio", "Creator Z16 HX Studio", "Creator M16",
    // Prestige
    "Prestige 16 Studio", "Prestige 14 Evo", "Prestige 13 Evo",
    // Summit
    "Summit E16 Flip", "Summit E14 Flip",
    // Modern
    "Modern 15", "Modern 14",
    // Desktop
    "MEG Trident X2", "MAG Codex X5", "MAG Infinite S3"
  ],
  "Microsoft": [
    // Surface Laptop
    "Surface Laptop Studio 2", "Surface Laptop Go 3", "Surface Laptop 5",
    // Surface Pro
    "Surface Pro 9", "Surface Pro 9 5G", "Surface Pro 8",
    // Surface Book
    "Surface Book 3",
    // Surface Go
    "Surface Go 3",
    // Surface Studio
    "Surface Studio 2+"
  ],
  "Samsung": [
    // Galaxy Book
    "Galaxy Book4 Ultra", "Galaxy Book4 Pro 360", "Galaxy Book4 Pro", "Galaxy Book4",
    "Galaxy Book3 Ultra", "Galaxy Book3 Pro 360", "Galaxy Book3 Pro", "Galaxy Book3",
    "Galaxy Book2 Pro 360", "Galaxy Book2 Pro", "Galaxy Book2",
    // Galaxy Book Go
    "Galaxy Book Go",
    // Desktop
    "All-in-One Pro"
  ],
  "LG": [
    // Gram
    "Gram 17 (2024)", "Gram 16 (2024)", "Gram 15 (2024)", "Gram 14 (2024)",
    "Gram Pro 17", "Gram Pro 16",
    "Gram Style", "Gram SuperSlim",
    // UltraPC
    "UltraPC 17", "UltraPC 16", "UltraPC 14"
  ],
  "Razer": [
    // Blade
    "Blade 18", "Blade 17", "Blade 16", "Blade 15", "Blade 14",
    // Book
    "Book 13",
    // Desktop
    "Tomahawk Desktop"
  ],
  "Huawei": [
    // MateBook
    "MateBook X Pro (2024)", "MateBook X Pro (2023)", "MateBook 16s", "MateBook 14s",
    "MateBook D 16", "MateBook D 15", "MateBook D 14",
    // MateStation
    "MateStation X"
  ],
  "Gigabyte": [
    // AERO
    "AERO 17", "AERO 16 OLED", "AERO 15 OLED",
    // AORUS
    "AORUS 17X", "AORUS 15X", "AORUS 17H",
    // Gaming
    "G5 KF", "G5 MF", "G6 KF",
    // Desktop
    "AORUS Model X", "AORUS Model S"
  ],
  "Alienware": [
    "m18 R2", "m16 R2", "x16 R2", "x14 R2",
    "m18", "m16", "x17 R2", "x16", "x15 R2", "x14",
    "Aurora R16", "Aurora R15"
  ],
  "Framework": [
    "Framework Laptop 16", "Framework Laptop 13 (AMD)", "Framework Laptop 13 (Intel)"
  ],
  "Google": [
    "Pixelbook Go", "Pixel Slate"
  ],
  "Toshiba/Dynabook": [
    "Portégé X40L-K", "Portégé X30L-K", "Tecra A50-K", "Tecra A40-K"
  ]
};

export const getComputerManufacturers = (): string[] => {
  return Object.keys(computerManufacturersModels).sort((a, b) => a.localeCompare(b, 'he'));
};

export const getModelsForComputerManufacturer = (manufacturer: string): string[] => {
  return computerManufacturersModels[manufacturer] || [];
};
