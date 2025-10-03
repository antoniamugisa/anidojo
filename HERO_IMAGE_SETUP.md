# 🎌 One Piece Hero Background Setup

## How to Add Your One Piece Image

### Step 1: Save Your Image
1. Save your One Piece image as `one-piece-hero.jpg`
2. Place it in the `/public/images/` folder
3. The file path should be: `/public/images/one-piece-hero.jpg`

### Step 2: Image Requirements
- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 1920x1080 or larger
- **File size**: Under 2MB for best performance
- **Aspect ratio**: 16:9 works best for hero sections

### Step 3: Alternative - Direct URL
If you have the image hosted online, you can use it directly:

```typescript
// In src/app/page.tsx, change:
imageUrl={animeBackgrounds.onePiece}

// To:
imageUrl="https://your-image-url.com/one-piece-image.jpg"
```

### Step 4: Adjust Overlay (Optional)
The current overlay is set to 40% opacity. You can adjust it:

```typescript
// In src/app/page.tsx
overlayOpacity={0.4}  // 0 = no overlay, 1 = completely dark
```

### Step 5: Test Different Backgrounds
You can easily switch between different backgrounds:

```typescript
// Available options:
animeBackgrounds.onePiece    // Your One Piece image
animeBackgrounds.cyberpunk   // Neon/cyberpunk theme
animeBackgrounds.nature      // Natural/forest theme
animeBackgrounds.city        // Urban/cityscape theme
animeBackgrounds.abstract    // Colorful abstract theme
animeBackgrounds.default     // Default anime theme
```

## Current Setup
- ✅ One Piece background configured
- ✅ Overlay set to 40% for good text readability
- ✅ Text shadows added for contrast
- ✅ Responsive design implemented

## File Structure
```
public/
└── images/
    └── one-piece-hero.jpg  ← Your image goes here
```

Once you add the image file, your hero section will display the beautiful One Piece scene with Luffy looking out at the ocean! 🌊⚓
