# Zustand store

Минимальный typed store для разделяемого client state.

```ts
import { create } from 'zustand'

/**
 * Состояние и actions счётчика.
 */
type CounterStore = {
  /** Текущее значение счётчика. */
  count: number
  /** Увеличивает значение счётчика на единицу. */
  increment: () => void
  /** Сбрасывает значение счётчика. */
  reset: () => void
}

/**
 * Предоставляет разделяемое состояние счётчика.
 *
 * Хранит значение и изменяет его только через actions владельца.
 */
export const useCounterStore = create<CounterStore>()((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 })
}))
```

В компоненте выбирай минимальный slice:

```ts
const count = useCounterStore((state) => state.count)
const increment = useCounterStore((state) => state.increment)
```

Не используй этот пример для remote data. REST cache принадлежит SWR, а subscription data по умолчанию принадлежит `useSWRSubscription`.
