import { useIntersectionObserver } from "@vueuse/core";
import type { DirectiveBinding } from "vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("debounce", debounceDirective);
  nuxtApp.vueApp.directive("throttle", throttleDirective);
  nuxtApp.vueApp.directive("visible", visibleDirective);
});

// 防抖指令
const debounceDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (typeof binding.value !== "function") {
      console.warn("v-debounce directive expects a function as the value");
      return;
    }

    const delay = binding.arg ? parseInt(binding.arg) : 300;
    const debouncedFn = useDebounce(binding.value, delay, {
      leading: true,
      trailing: false,
    });

    el.addEventListener("click", debouncedFn);
    (el as any)._debouncedFn = debouncedFn;
  },
  beforeUnmount(el: HTMLElement) {
    if ((el as any)._debouncedFn) {
      el.removeEventListener("click", (el as any)._debouncedFn);
      delete (el as any)._debouncedFn;
    }
  },
};

// 节流指令
const throttleDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (typeof binding.value !== "function") {
      console.warn("v-throttle directive expects a function as the value");
      return;
    }

    const delay = binding.arg ? parseInt(binding.arg) : 300;
    const throttledFn = useThrottle(binding.value, delay, {
      leading: true,
      trailing: false,
    });

    el.addEventListener("click", throttledFn);
    (el as any)._throttledFn = throttledFn;
  },
  beforeUnmount(el: HTMLElement) {
    if ((el as any)._throttledFn) {
      el.removeEventListener("click", (el as any)._throttledFn);
      delete (el as any)._throttledFn;
    }
  },
};

// 元素可见
// export const visibleDirective = {
//   mounted(el: HTMLElement, binding: any) {
//     const { modifiers, value } = binding;

//     const { stop } = useIntersectionObserver(
//       el,
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           el.classList.add("visible");
//           // 触发回调
//           if (typeof value === "function") value(entry);
//           // 只触发一次
//           if (modifiers.once) stop();
//         } else if (!modifiers.once) {
//           el.classList.remove("visible");
//         }
//       },
//       {
//         threshold: 0.1,
//       },
//     );
//   },
// };
const visibleDirective = {
  mounted(el: HTMLElement, binding: any) {
    const { modifiers, value } = binding;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const isVisible = entry.isIntersecting;
        el.classList.toggle("hidden", !isVisible);
        if (typeof value === "function") value(isVisible);
        if (modifiers.once && isVisible) stop();
      });
    };
    const { stop } = useIntersectionObserver(el, handleIntersection, {
      threshold: 0.1,
    });
  },
};
