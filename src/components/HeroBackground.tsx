interface HeroBackgroundProps {
  imageUrl?: string;
  overlayOpacity?: number;
  children: React.ReactNode;
}

export default function HeroBackground({ 
  imageUrl = "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  overlayOpacity = 0.5,
  children 
}: HeroBackgroundProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url('${imageUrl}')`
        }}
      />
      
      {/* Overlay for text readability */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
}

// Predefined anime background options
export const animeBackgrounds = {
  onePiece: "/images/hero-img.jpeg", // Your One Piece image
  default: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  cyberpunk: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  nature: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  city: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  abstract: "https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
};
