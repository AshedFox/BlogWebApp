import { RefObject, useEffect, useState} from "react";


const useIntersection = (ref: RefObject<HTMLElement>, rootMargin: string = "0px") => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
                
                if (currentElement && entry.isIntersecting) {
                    observer.unobserve(currentElement);
                }
                
            }, {rootMargin}
        );
        
        const currentElement = ref?.current;

        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, []);

    return isVisible;
};

export default useIntersection;
