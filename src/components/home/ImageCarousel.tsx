
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface CarouselImage {
  url: string;
  alt: string;
}

const ImageCarousel = () => {
  // Carousel images
  const carouselImages = [
    {
      url: "https://i.ytimg.com/vi/UH9fxpguWpM/maxresdefault.jpg",
      alt: "College campus image",
    },
    {
      url: "https://scontent.fdel62-1.fna.fbcdn.net/v/t39.30808-6/471558786_1397984768254143_6677722960455006331_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=Pd_oszPC1YoQ7kNvwFOJXoh&_nc_oc=AdlTl7_1zmy77WG58CwCO3sj6SRc6ZubP2zkMQlLM5wmfxC8K6c1w1WEuVaMVGgvVPA&_nc_zt=23&_nc_ht=scontent.fdel62-1.fna&_nc_gid=agW1Vcj_GtIr4VKIBmcofQ&oh=00_AfLuMkAG2vBR01HEEAK0IojtkTPiWXf4pmPrSWrVaGGCyQ&oe=68277198",
      alt: "Students studying",
    },
    {
      url: "https://i.ytimg.com/vi/aViWYYLM3U4/sddefault.jpg",
      alt: "Computer lab",
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length
    );
  };

  return (
    <section className="relative">
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </div>
        ))}

        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevImage}
            className="bg-white/30 text-white hover:bg-white/50"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextImage}
            className="bg-white/30 text-white hover:bg-white/50"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
            Government Polytechnic Changipur
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-6 drop-shadow-md">
            Excellence in Technical Education Since 2014
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-primary hover:bg-blue-700">
              <Link to="/academics">Explore Programs</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-blue-700">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;
