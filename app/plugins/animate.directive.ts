// plugins/animate.directive.ts
import { defineNuxtPlugin } from '#app'
import type { AnimateOptions, AnimationType } from '~/composables/useAnimate'

export default defineNuxtPlugin((nuxtApp) => {
  // v-animate="'slideUp'"
  // v-animate="{ type: 'slideUp', delay: 200, threshold: 0.3, once: false }"
  nuxtApp.vueApp.directive<HTMLElement, string | AnimateOptions>('animate', {
    mounted(el, binding) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) return

      const options: AnimateOptions =
        typeof binding.value === 'string'
          ? { type: binding.value as AnimationType }
          : binding.value ?? {}

      const {
        type = 'fadeIn',
        delay = 0,
        duration = 600,
        easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
        once = true,
        threshold = 0.1
      } = options

      const keyframes: Record<string, Keyframe[]> = {
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

      // از همون اول پنهان — قبل از اینکه کاربر ببینه
      el.style.opacity = '0'

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.animate(keyframes[type] ?? keyframes.fadeIn, {
                duration,
                delay,
                easing,
                fill: 'forwards'
              })
              if (once) observer.unobserve(el)
            }
          })
        },
        { threshold }
      )

      observer.observe(el)
      ;(el as any).__animateObserver = observer
    },
    unmounted(el) {
      ;(el as any).__animateObserver?.disconnect()
    }
  })

  // v-animate-stagger="{ delay: 0, gap: 120, type: 'slideUp', threshold: 0.1 }"
  nuxtApp.vueApp.directive<HTMLElement, { delay?: number; gap?: number; type?: AnimationType; threshold?: number } | undefined>('animate-stagger', {
    mounted(el, binding) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) return

      const { delay = 0, gap = 120, type = 'slideUp', threshold = 0.1 } = binding.value ?? {}

      const children = Array.from(el.children) as HTMLElement[]

      // از همون اول پنهان — قبل از اینکه کاربر scroll کنه و ببینه
      children.forEach((child) => {
        child.style.opacity = '0'
      })

      const keyframes: Record<string, Keyframe[]> = {
        slideUp: [
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        fadeIn: [{ opacity: 0 }, { opacity: 1 }],
        scaleIn: [
          { opacity: 0, transform: 'scale(0.9)' },
          { opacity: 1, transform: 'scale(1)' }
        ]
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              children.forEach((child, i) => {
                child.animate(keyframes[type] ?? keyframes.slideUp, {
                  duration: 600,
                  delay: delay + i * gap,
                  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  fill: 'forwards'
                })
              })
              observer.unobserve(el)
            }
          })
        },
        { threshold }
      )

      observer.observe(el)
      ;(el as any).__animateObserver = observer
    },
    unmounted(el) {
      ;(el as any).__animateObserver?.disconnect()
    }
  })
})