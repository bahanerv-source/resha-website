import { CategoryBrowser } from './CategoryBrowser';
import { Countdown } from './Countdown';
import { ProductCustomizer } from './ProductCustomizer';
import { ProductGallery } from './ProductGallery';
import { SearchResults } from './SearchResults';
import { SiteHeader } from './SiteHeader';

/** Interactive components, hydrated in the browser by src/client.tsx. */
export const islands = { SiteHeader, Countdown, ProductGallery, ProductCustomizer, CategoryBrowser, SearchResults };
export type IslandName = keyof typeof islands;
