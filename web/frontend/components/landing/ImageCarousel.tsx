/**
 * Image carousel component displaying product parts
 */
"use client";

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const images = [
  { src: "/assets/allparts.webp", alt: "Full IntelVis prototype parts", caption: "Full Prototype Parts (ESP32, Sensor, Battery)" },
  { src: "/assets/mic.webp", alt: "Ultrasonic sensor with carrier board", caption: "Core: MEMS Ultrasonic Sensor" },
  { src: "/assets/esp32.webp", alt: "ESP32-S3 Module", caption: "Brain: ESP32-S3 Module" },
];

export function ImageCarousel() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden"> 
      <h3 className="mb-4 text-center text-xl font-semibold text-gray-100">
        Built with Industrial-Grade Parts
      </h3>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: true }}
        className="aspect-[4/3] w-full max-w-full rounded-xl border border-gray-800 bg-gray-950 shadow-2xl"
        style={{ overflow: 'hidden', maxWidth: '100%' }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
        }}
      >
        {images.map((img) => (
          <SwiperSlide key={img.src} className="flex flex-col items-center justify-center p-4 pb-12">
            <figure className="flex h-full w-full flex-col items-center justify-center">
              <div className="relative w-full flex-1">
                <Image 
                  src={img.src} 
                  alt={img.alt} 
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded-lg" 
                />
              </div>
              <figcaption className="mt-3 h-5 text-center text-sm text-gray-400">
                {img.caption}
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}