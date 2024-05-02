export interface CarouselItemProps {
    src: string;
    alt: string;
    description: string;
    url: string;
    onClick?: () => void;
    label?: string;
}
