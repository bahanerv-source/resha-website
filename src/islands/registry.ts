import { CategoryBrowser } from './CategoryBrowser';
import { Countdown } from './Countdown';
import { ProductCustomizer } from './ProductCustomizer';
import { ProductGallery } from './ProductGallery';
import { ProductRail } from './ProductRail';
import { SearchResults } from './SearchResults';
import { SiteHeader } from './SiteHeader';

/** Interactive components, hydrated in the browser by src/client.tsx. */
export const islands = { SiteHeader, Countdown, ProductGallery, ProductCustomizer, CategoryBrowser, SearchResults, ProductRail };
export type IslandName = keyof typeof islands;
