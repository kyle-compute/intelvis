"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// These imports MUST be here for the carousel to be styled correctly
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Image from 'next/image';

const images = [
  { src: "/assets/allparts.webp", alt: "Full IntelVis prototype parts", caption: "Full Prototype Parts" },
  { src: "/assets/mic.webp", alt: "MEMS Ultrasonic Sensor Board", caption: "Core: MEMS Ultrasonic Sensor" },
  { src: "/assets/esp32.webp", alt: "ESP32-S3 Module", caption: "Brain: ESP32-S3 Module" },
];

export function ImageCarousel() {
  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">Built with Industrial-Grade Parts</h3>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: true }}
        className="w-full max-w-md mx-auto rounded-lg border border-gray-200 bg-white"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index} className="p-4 pb-10">
            <figure>
              <Image src={img.src} alt={img.alt} width={400} height={300} className="w-full h-auto object-contain rounded-md" />
              <figcaption className="text-sm text-gray-600 mt-2 text-center">{img.caption}</figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}