import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  quote: string;
  course?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <motion.div
    className="flex-none w-96 mx-4 bg-base-100 rounded-xl shadow-lg border border-base-200 p-6 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="avatar placeholder">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-full w-12 h-12 shadow-lg">
          <User className="w-6 h-6" />
        </div>
      </div>
      <div>
        <h3 className="font-bold text-lg text-base-content">{testimonial.name}</h3>
      </div>
    </div>
    
  {/* Removed rating stars */}
    
    <div className="relative mb-4">
      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
      <p className="text-base leading-relaxed pl-6 text-base-content/90">"{testimonial.quote}"</p>
    </div>
    
  {/* Removed highlight text */}
    
    {testimonial.course && (
      <p className="text-sm text-base-content/60 mt-4 text-center italic font-medium">
        — Completed {testimonial.course}
      </p>
    )}
  </motion.div>
);

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ 
  testimonials, 
  direction = 'left', 
  speed = 30,
  className = '' 
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = () => {
      if (!isPaused) {
        setOffset(prev => {
          const cardWidth = 416; // 400px width + 16px margin
          const totalWidth = testimonials.length * cardWidth;
          const moveSpeed = speed / 10; // Adjust speed
          
          if (direction === 'left') {
            return prev <= -totalWidth ? 0 : prev - moveSpeed;
          } else {
            return prev >= 0 ? -totalWidth : prev + moveSpeed;
          }
        });
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, direction, testimonials.length, speed]);

  return (
    <section 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={containerRef}
      aria-label="Customer testimonials carousel"
    >
      <motion.div
        className="flex"
        style={{
          transform: `translateX(${offset}px)`,
          width: `${testimonials.length * 2 * 416}px` // Double width for seamless loop
        }}
        transition={{ type: 'tween', duration: 0 }}
      >
        {/* First set of testimonials */}
        {testimonials.map((testimonial) => (
          <TestimonialCard key={`first-${testimonial.id}`} testimonial={testimonial} />
        ))}
        {/* Duplicate set for seamless loop */}
        {testimonials.map((testimonial) => (
          <TestimonialCard key={`second-${testimonial.id}`} testimonial={testimonial} />
        ))}
      </motion.div>
      
      {/* Gradient overlays for smooth edges */}
      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-base-200 to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-base-200 to-transparent pointer-events-none z-10" />
    </section>
  );
};

export default TestimonialCarousel;
