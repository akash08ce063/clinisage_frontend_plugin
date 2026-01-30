import { useEffect, type RefObject } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref.
 * Optimized for Shadow DOM using event.composedPath()
 */
export function useClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void) {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            // composedPath() returns an array of nodes through which the event has bubbled,
            // including those in the Shadow DOM.
            const path = event.composedPath();

            // If the ref exists and the click path does NOT include the target element, trigger handler.
            if (ref.current && !path.includes(ref.current)) {
                handler();
            }
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}
