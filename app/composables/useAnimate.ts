// composables/useAnimate.ts
export type AnimationType =
  | 'fadeIn'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'blurIn'

export interface AnimateOptions {
  type?: AnimationType
  delay?: number
  duration?: number
  easing?: string
  once?: boolean
  threshold?: number  // 0 تا 1 — چقدر از المنت باید دیده بشه
}

export function useAnimate() {
  function animate(el: HTMLElement, options: AnimateOptions = {}) {
    const {
      type = 'fadeIn',
      delay = 0,
      duration = 600,
      easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
      once = true,
      threshold = 0.1
    } = options

    const keyframes: Record<AnimationType, Keyframe[]> = {
      fadeIn: [{ opacity: 0 }, { opacity: 1 }],
      slideUp: [
        { opacity: 0, transform: 'translateY(32px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      slideDown: [
        { opacity: 0, transform: 'translateY(-32px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      slideLeft: [
        { opacity: 0, transform: 'translateX(40px)' },
        { opacity: 1, transform: 'translateX(0)' }
      ],
      slideRight: [
        { opacity: 0, transform: 'translateX(-40px)' },
        { opacity: 1, transform: 'translateX(0)' }
      ],
      scaleIn: [
        { opacity: 0, transform: 'scale(0.85)' },
        { opacity: 1, transform: 'scale(1)' }
      ],
      blurIn: [
        { opacity: 0, filter: 'blur(8px)', transform: 'scale(0.97)' },
        { opacity: 1, filter: 'blur(0)', transform: 'scale(1)' }
      ]
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = '0'
            setTimeout(() => {
              el.animate(keyframes[type], {
                duration,
                delay,
                easing,
                fill: 'forwards'
              })
            }, delay)
            if (once) observer.unobserve(el)
          }
        })
      },
      { threshold }
    )
  }

  return { animate }
}