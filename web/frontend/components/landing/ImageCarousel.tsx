// frontend/components/landing/ImageCarousel.tsx
"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

// --- IMAGE FIX: Use the correct image paths and descriptions ---
// I've added your new image. Add or remove images here as needed.
const images = [
  { src: "/assets/allparts.webp", alt: "Full IntelVis prototype parts", caption: "Full Prototype Parts (ESP32, Sensor, Battery)" },
  { src: "/assets/mic.webp", alt: "Ultrasonic sensor with carrier board", caption: "Core: MEMS Ultrasonic Sensor" }, // <-- REPLACE with your actual new image filename
  { src: "/assets/esp32.webp", alt: "ESP32-S3 Module", caption: "Brain: ESP32-S3 Module" },
];

export function ImageCarousel() {
  return (
    // --- LAYOUT FIX: Main container with a fixed height and flex column layout ---
    <div className="w-full flex flex-col h-[480px]"> 
      <h3 className="text-xl font-semibold mb-4 text-gray-100 text-center">Built with Industrial-Grade Parts</h3>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: true }}
        // --- LAYOUT FIX: Swiper now fills the remaining space in its flex container ---
        className="w-full flex-1 rounded-xl border border-gray-800 bg-gray-950 shadow-2xl"
      >
        {images.map((img) => (
          <SwiperSlide key={img.src} className="p-4 pb-12 flex flex-col items-center justify-center">
            <figure className="w-full h-full flex flex-col items-center justify-center">
              <div className="relative w-full flex-1">
                <Image 
                  src={img.src} 
                  alt={img.alt} 
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded-lg" 
                />
              </div>
              <figcaption className="text-sm text-gray-400 mt-3 text-center h-5">
                {img.caption}
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}