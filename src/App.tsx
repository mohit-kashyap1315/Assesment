import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, CloudOff, Gamepad2, Heart, LoaderCircle, Menu, Search, ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import { CatalogService, localCatalog, PaginationController, SignupService, type CatalogResult, type MediaItem } from "./services/catalog";
import "./index.css";

const catalogService = new CatalogService();
const paginationController = new PaginationController();
const signupService = new SignupService();
const detailPath = "/app/1091500/Cyberpunk_2077/";
const explorePath = "/explore/new/";

function useConnectivity() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);
  return online;
}

function Header({ onSignup, wishlistCount, cartCount }: { onSignup: () => void; wishlistCount: number; cartCount: number }) {
  const [location, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const online = useConnectivity();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    setLocation(term ? `${explorePath}?q=${encodeURIComponent(term)}` : explorePath);
    window.dispatchEvent(new CustomEvent("store-search", { detail: term }));
    setMenuOpen(false);
  };
  return <>
    <div className="bg-[#090d12] text-[11px] text-[#92a0ac]">
      <div className="store-wrap flex min-h-8 items-center justify-between gap-3">
        <span className="hidden sm:block">STEAM STORE <span className="text-[#536273]">/</span> DISCOVER PC GAMES & ENTERTAINMENT</span>
        <div className="ml-auto flex items-center gap-4">
          <span data-testid="status-network" className={`inline-flex items-center gap-1.5 ${online ? "text-[#91c65c]" : "text-[#efb24d]"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-[#91c65c]" : "bg-[#efb24d]"}`} />
            {online ? "ONLINE" : "OFFLINE · SAVED CATALOG"}
          </span>
          <button onClick={onSignup} className="rounded-sm px-2 py-1 text-[#a6b4c2] hover:bg-white/10 hover:text-white active:bg-white/15 focus-visible:outline" data-testid="button-open-signup">Install Steam</button>
          <button onClick={onSignup} className="hover:text-white focus-visible:outline" data-testid="button-header-signin">Sign in</button>
        </div>
      </div>
    </div>
    <header className="masthead">
      <div className="store-wrap flex min-h-[70px] items-center gap-5">
        <button className="mr-1 grid h-9 w-9 place-items-center rounded text-[#a9c7db] hover:bg-white/10 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen} data-testid="button-menu"><Menu size={21} /></button>
        <Link href="/" className="steam-font flex shrink-0 items-center gap-2 text-[27px] font-bold tracking-[.08em] text-white" data-testid="link-store-logo">
          <Gamepad2 size={29} strokeWidth={1.8} className="text-[#62d6ff]" /><span>STEAM<span className="text-[#62d6ff]">.</span></span>
        </Link>
        <nav aria-label="Main navigation" className={`${menuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-[102px] z-30 flex-col gap-0 border-b border-[#293b4c] bg-[#171a21] p-3 shadow-xl md:static md:ml-5 md:flex md:flex-row md:items-center md:gap-5 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          <Link href="/" aria-current={location === "/" ? "page" : undefined} className="nav-link steam-font border-b-2 border-transparent px-2 py-2 text-[16px] font-bold tracking-[.07em] hover:border-[#62d6ff] md:py-1" data-testid="link-nav-store">STORE</Link>
          <Link href={explorePath} aria-current={location.includes("explore") ? "page" : undefined} className="nav-link steam-font border-b-2 border-transparent px-2 py-2 text-[16px] font-bold tracking-[.07em] hover:border-[#62d6ff] md:py-1" data-testid="link-nav-new">NEW &amp; NOTEWORTHY</Link>
          <Link href={detailPath} className="nav-link steam-font border-b-2 border-transparent px-2 py-2 text-[16px] font-bold tracking-[.07em] hover:border-[#62d6ff] md:py-1" data-testid="link-nav-cyberpunk">CYBERPUNK 2077</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden rounded p-2 text-[#aec2d1] sm:block" aria-label={`Wishlist, ${wishlistCount} items`} data-testid="status-wishlist-count"><Heart size={18} />{wishlistCount > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#67c1f5] px-1 text-[10px] text-[#0d1926]">{wishlistCount}</span>}</div>
          <div className="relative hidden rounded p-2 text-[#aec2d1] sm:block" aria-label={`Cart, ${cartCount} items`} data-testid="status-cart-count"><ShoppingCart size={18} />{cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#67c1f5] px-1 text-[10px] text-[#0d1926]">{cartCount}</span>}</div>
          <form onSubmit={submit} role="search" className="flex h-9 w-[min(37vw,240px)] min-w-[112px] items-center border border-[#35485a] bg-[#0d1722] transition focus-within:border-[#67c1f5] focus-within:ring-1 focus-within:ring-[#67c1f5]/30">
            <input value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="search the store" aria-label="Search the store" className="h-full min-w-0 flex-1 bg-transparent px-2 text-xs text-white outline-none placeholder:text-[#708092]" data-testid="input-store-search" />
            <button aria-label="Search" type="submit" className="grid h-full w-9 place-items-center text-[#8ebad2] hover:bg-[#203447] hover:text-white active:bg-[#2f526e]" data-testid="button-store-search"><Search size={17} /></button>
          </form>
        </div>
      </div>
    </header>
  </>;
}

function LazyMediaImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: "180px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={host} className={`image-frame relative ${className}`} data-testid={`image-frame-${alt.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
    {!loaded && !failed && <div className="skeleton absolute inset-0" />}
    {visible && src && !failed && <img src={src} alt={alt} loading="lazy" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} className={`absolute inset-0 h-full w-full object-cover ${loaded ? "opacity-100" : "opacity-0"}`} />}
    {(!src || failed) && <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_70%_20%,#355371,#14273a_55%,#101a27)] p-3 text-center text-[11px] uppercase tracking-widest text-[#9cbbcf]">{alt}</div>}
  </div>;
}

function AppFrame({ children, onSignup, wishlistCount, cartCount }: { children: ReactNode; onSignup: () => void; wishlistCount: number; cartCount: number }) {
  return <div className="app-shell min-h-[100dvh] text-[#c7d5e0]"><Header onSignup={onSignup} wishlistCount={wishlistCount} cartCount={cartCount} />{children}<footer className="mt-16 border-t border-[#26394a] bg-[#090f17] py-8"><div className="store-wrap flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#718293]"><span>© 2026 STEAM · YOUR GAMES, YOUR WAY</span><span>Catalog media powered by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</span><span className="mono">STOREFRONT DEMO</span></div></footer></div>;
}

const slides = [
  { title: "CYBERPUNK 2077", subtitle: "THE CITY IS YOURS FOR THE TAKING", copy: "Become a cyberpunk. An urban mercenary equipped with cybernetic enhancements, fighting for glory and survival in Night City.", date: "AVAILABLE NOW", color: "from-[#102d3d] via-[#172a39] to-[#171b29]", accent: "#f6a23a" },
  { title: "PHANTOM LIBERTY", subtitle: "A SPY-THRILLER EXPANSION", copy: "Return to Night City for a story of espionage, shifting loyalties, and impossible choices.", date: "EXPANSION · OUT NOW", color: "from-[#33231f] via-[#27313b] to-[#141e2d]", accent: "#e88152" },
  { title: "NIGHT CITY CALLS", subtitle: "MAKE YOUR LEGEND", copy: "Build your own legend in a sprawling open world where every choice leaves a mark.", date: "FEATURED EXPERIENCE", color: "from-[#12363d] via-[#1e2c3a] to-[#171c2d]", accent: "#65d4e7" },
];

function FeatureCarousel({ onCart, onWishlist, wished, added }: { onCart: () => void; onWishlist: () => void; wished: boolean; added: boolean }) {
  const [slide, setSlide] = useState(0);
  const featured = slides[slide];
  return <section id="featured-recommended" aria-label="Featured game" className="relative mt-7">
    <div className="mb-2 flex items-center justify-between"><h1 className="steam-font text-[22px] font-semibold tracking-[.06em] text-white">FEATURED &amp; RECOMMENDED</h1><span className="mono text-[10px] tracking-wider text-[#68849a]">STORE HIGHLIGHT · {String(slide + 1).padStart(2, "0")} / 03</span></div>
    <article className="relative grid min-h-[340px] overflow-hidden border border-[#2a4055] bg-[#14263a] md:grid-cols-[1.25fr_.75fr]">
      <div className={`relative flex min-h-[290px] flex-col justify-end overflow-hidden bg-gradient-to-br ${featured.color} p-6 md:p-9`}>
        <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(ellipse at 70% 25%, rgba(85,183,216,.4), transparent 37%), linear-gradient(130deg,transparent 55%,rgba(5,11,20,.9))" }} />
        <div className="absolute right-[9%] top-[8%] h-[230px] w-[230px] rounded-full border border-white/10 md:h-[290px] md:w-[290px]" />
        <div className="absolute right-[15%] top-[14%] h-[195px] w-[195px] rounded-full border border-white/10 md:h-[250px] md:w-[250px]" />
        <div className="relative z-10 max-w-[500px]">
          <span className="mono mb-3 inline-flex border-l-2 px-2 py-1 text-[10px] tracking-[.18em] text-[#c5d9e5]" style={{ borderColor: featured.accent }}>{featured.date}</span>
          <div className="steam-font text-[clamp(43px,7vw,82px)] font-extrabold leading-[.86] tracking-tight text-white drop-shadow-xl">{featured.title}</div>
          <div className="steam-font mt-4 text-[16px] font-semibold tracking-[.16em]" style={{ color: featured.accent }}>{featured.subtitle}</div>
          <p className="mt-3 max-w-[420px] text-sm leading-6 text-[#c1d0dc]">{featured.copy}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Link href={detailPath} className="inline-flex h-10 items-center gap-2 bg-gradient-to-b from-[#8bd742] to-[#5b9d27] px-4 text-sm font-bold text-[#13220e] shadow hover:brightness-110 active:brightness-90" data-testid="link-featured-details">Explore Night City <ArrowRight size={16} /></Link>
            <button onClick={onWishlist} aria-pressed={wished} className={`grid h-10 w-10 place-items-center border border-white/20 bg-black/20 hover:bg-white/10 active:bg-white/20 ${wished ? "text-[#f28387]" : "text-white"}`} aria-label={wished ? "Remove Cyberpunk from wishlist" : "Add Cyberpunk to wishlist"} data-testid="button-featured-wishlist"><Heart size={17} fill={wished ? "currentColor" : "none"} /></button>
            <button onClick={onCart} className="h-10 border border-white/20 bg-black/20 px-3 text-xs font-semibold text-white hover:bg-white/10 active:bg-white/20" data-testid="button-featured-cart">{added ? "IN CART" : "ADD TO CART"}</button>
          </div>
        </div>
        <div className="absolute bottom-4 right-5 mono text-[9px] tracking-[.2em] text-white/35">NC // 2077</div>
      </div>
      <div className="flex flex-col justify-between bg-gradient-to-b from-[#203a52] to-[#122239] p-4 md:p-5">
        <div>
          <div className="flex items-center justify-between">
            <p className="steam-font text-lg font-semibold tracking-wide text-white">Cyberpunk 2077</p>
            <span className="mono rounded-sm bg-[#91c84d] px-2 py-1 text-[11px] font-semibold text-[#11220c]">-50%</span>
          </div>
          <div className="mt-1 text-xs text-[#9eb3c4]">CD PROJEKT RED</div>
          <div className="mt-4 grid aspect-[16/8.5] place-items-center overflow-hidden border border-white/10 bg-[radial-gradient(ellipse_at_55%_40%,#23627a,#182b3c_46%,#0e1825)]">
            <div className="text-center"><span className="steam-font block text-[42px] font-bold leading-none tracking-tight text-[#f7bd68]">2077</span><span className="mono mt-1 block text-[8px] tracking-[.45em] text-[#d6e5e6]">NIGHT CITY</span></div>
          </div>
          <p className="mt-4 line-clamp-3 text-xs leading-5 text-[#bfced9]">{featured.copy}</p>
        </div>
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
          <div><span className="block text-[10px] text-[#8399ac]">SPECIAL PROMOTION</span><span className="text-[10px] text-[#91c84d]">Offer ends soon</span></div>
          <div className="text-right"><span className="block text-xs text-[#8296a7] line-through">$59.99</span><span className="text-lg font-semibold text-[#c7e8a2]">$29.99</span></div>
        </div>
      </div>
    </article>
    <div className="mt-2 flex items-center justify-center gap-2">
      <button onClick={() => setSlide((slide + slides.length - 1) % slides.length)} className="grid h-7 w-8 place-items-center bg-[#20364b] text-[#a9c8dc] hover:bg-[#31536e] active:bg-[#3a6789]" aria-label="Previous featured slide" data-testid="button-slide-prev"><ChevronLeft size={17} /></button>
      {slides.map((item, index) => <button key={item.title} onClick={() => setSlide(index)} className={`h-1.5 w-7 transition-colors ${index === slide ? "bg-[#69c8e9]" : "bg-[#365069] hover:bg-[#6b8da4]"}`} aria-label={`Show featured slide ${index + 1}`} aria-pressed={index === slide} data-testid={`button-slide-${index + 1}`} />)}
      <button onClick={() => setSlide((slide + 1) % slides.length)} className="grid h-7 w-8 place-items-center bg-[#20364b] text-[#a9c8dc] hover:bg-[#31536e] active:bg-[#3a6789]" aria-label="Next featured slide" data-testid="button-slide-next"><ChevronRight size={17} /></button>
    </div>
  </section>;
}

function MediaCard({ item, index, onCart, onWishlist, wished, added }: { item: MediaItem; index: number; onCart: () => void; onWishlist: () => void; wished: boolean; added: boolean }) {
  return <article className="catalog-card group min-w-0 border border-[#223a50]" data-testid={`card-product-${item.id}`}>
    <Link href={item.id === 1091500 ? detailPath : explorePath} className="block" aria-label={`View ${item.title}`} data-testid={`link-product-${item.id}`}>
      <LazyMediaImage src={item.poster} alt={item.title} className="aspect-[2/2.65] w-full" />
      <div className="p-3 pb-2">
        <h3 className="line-clamp-1 text-sm font-semibold text-[#dce6ef] group-hover:text-[#8edbfa]">{item.title}</h3>
        <p className="mt-1 line-clamp-2 min-h-[34px] text-[11px] leading-[17px] text-[#8fa4b5]">{item.overview}</p>
      </div>
    </Link>
    <div className="flex items-center justify-between gap-1 border-t border-white/5 px-3 py-2">
      <span className="mono text-[10px] text-[#93c45b]">{item.rating ? `${item.rating.toFixed(1)} / 10` : item.date?.slice(0, 4) || "New"}</span>
      <div className="flex items-center gap-1">
        <button onClick={onWishlist} aria-label={wished ? `Remove ${item.title} from wishlist` : `Add ${item.title} to wishlist`} aria-pressed={wished} className={`grid h-7 w-7 place-items-center rounded-sm text-[#94adbf] hover:bg-[#293e52] hover:text-white active:bg-[#3d5971] ${wished ? "text-[#ef8c94]" : ""}`} data-testid={`button-wishlist-${item.id}`}><Heart size={14} fill={wished ? "currentColor" : "none"} /></button>
        <button onClick={onCart} aria-label={added ? `${item.title} added to cart` : `Add ${item.title} to cart`} className="grid h-7 w-7 place-items-center rounded-sm bg-[#29415a] text-[#b9cfdf] hover:bg-[#3b6587] hover:text-white active:bg-[#4b84ad]" data-testid={`button-cart-${item.id}`}>{added ? <Check size={14} /> : <ShoppingCart size={14} />}</button>
      </div>
    </div>
  </article>;
}

function MediaShelf({ title, items, onCart, onWishlist, wished, cart }: { title: string; items: MediaItem[]; onCart: (id: string) => void; onWishlist: (id: string) => void; wished: string[]; cart: string[] }) {
  return <section id={title.toLowerCase().replace(/\s+/g, "-")} className="mt-9" aria-label={title}>
    <div className="mb-3 flex items-center justify-between border-b border-[#24405a] pb-2">
      <h2 className="steam-font text-[21px] font-semibold tracking-[.055em] text-white">{title}</h2>
      <Link href={explorePath} className="flex items-center gap-1 text-[11px] text-[#8bc9e6] hover:text-white focus-visible:outline" data-testid={`link-more-${title.toLowerCase().replace(/\W/g, "-")}`}>Browse all <ArrowRight size={13} /></Link>
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.slice(0, 5).map((item, i) => <MediaCard key={`${item.id}-${i}`} item={item} index={i} onCart={() => onCart(String(item.id))} onWishlist={() => onWishlist(String(item.id))} wished={wished.includes(String(item.id))} added={cart.includes(String(item.id))} />)}
    </div>
  </section>;
}

function StoreHome({ onCart, onWishlist, wished, cart }: { onCart: (id: string) => void; onWishlist: (id: string) => void; wished: string[]; cart: string[] }) {
  const [results, setResults] = useState<CatalogResult | null>(null);
  useEffect(() => { catalogService.discover(1).then(setResults); }, []);
  const items = results?.items || localCatalog;
  return <main className="store-wrap pb-4">
    <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
      <Link href="/#featured-recommended" className="rounded-sm bg-[#184260] px-3 py-2 text-[#c4e8fa] hover:bg-[#236088]" data-testid="link-discovery">Your Store</Link>
      <Link href="/#trending-this-week" className="rounded-sm bg-[#16334b] px-3 py-2 text-[#a7cada] hover:bg-[#20516d]" data-testid="link-browse-categories">Browse Categories</Link>
      <Link href={explorePath} className="rounded-sm bg-[#16334b] px-3 py-2 text-[#a7cada] hover:bg-[#20516d]" data-testid="link-new-releases">New Releases</Link>
    </div>
    <FeatureCarousel onCart={() => onCart("1091500")} onWishlist={() => onWishlist("1091500")} wished={wished.includes("1091500")} added={cart.includes("1091500")} />
    {results?.message && <div className="mt-5 flex items-center gap-2 border border-[#354a5c] bg-[#15273a] px-3 py-2 text-xs text-[#b8c5d0]" data-testid="status-catalog-source"><CloudOff size={14} className="text-[#e1b85d]" />{results.message}</div>}
    <MediaShelf title="Trending this week" items={items} onCart={onCart} onWishlist={onWishlist} wished={wished} cart={cart} />
    <section className="mt-10 border border-[#29445b] bg-[linear-gradient(100deg,#17334a,#193047_55%,#14243a)] p-5 md:flex md:items-center md:justify-between md:gap-8">
      <div><span className="mono text-[10px] tracking-[.2em] text-[#72c8e5]">YOUR NEXT FAVORITE</span><h2 className="steam-font mt-1 text-[27px] font-semibold text-white">A whole world, one click away.</h2><p className="mt-1 max-w-xl text-sm text-[#a9bdcc]">Explore what's new, find your next obsession, and keep your favorites close.</p></div>
      <Link href={explorePath} className="mt-4 inline-flex h-10 items-center gap-2 bg-[#3b85b4] px-4 text-sm font-semibold text-white hover:bg-[#56a2cf] active:bg-[#2c719c] md:mt-0" data-testid="link-explore-cta">Explore new releases <ArrowRight size={16} /></Link>
    </section>
  </main>;
}

function ExplorePage({ onCart, onWishlist, wished, cart }: { onCart: (id: string) => void; onWishlist: (id: string) => void; wished: string[]; cart: string[] }) {
  const [location] = useLocation();
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get("q") || "");
  useEffect(() => {
    const receiveSearch = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      setQuery(detail || "");
    };
    window.addEventListener("store-search", receiveSearch);
    return () => window.removeEventListener("store-search", receiveSearch);
  }, []);
  useEffect(() => { setQuery(new URLSearchParams(window.location.search).get("q") || ""); }, [location]);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [genre, setGenre] = useState("all");
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<CatalogResult["source"]>("local");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const goToPage = (requestedPage: number) => setPage(paginationController.clampPage(requestedPage, pages));
  useEffect(() => { setPage(1); }, [query, genre]);
  useEffect(() => {
    let current = true;
    setLoading(true); setError("");
    const request = query.trim() ? catalogService.search(query, page) : catalogService.discover(page, genre);
    request.then((result) => {
      if (!current) return;
      setItems(result.items); setPages(Math.min(500, result.pages)); setSource(result.source); setMessage(result.message || "");
    }).catch(() => { if (current) setError("The catalog could not be loaded. Try again."); }).finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [query, page, genre, retry]);
  const changeGenre = (value: string) => { setGenre(value); setPage(1); };
  return <main className="store-wrap min-h-[650px] pb-8">
    <div className="mt-7 flex flex-wrap items-end justify-between gap-3 border-b border-[#2b455c] pb-4">
      <div><div className="mono text-[10px] tracking-[.22em] text-[#72c8e5]">STEAM LABS / DISCOVERY</div><h1 className="steam-font mt-1 text-[34px] font-bold leading-none tracking-wide text-white">{query ? `SEARCH RESULTS: ${query}` : "NEW & NOTEWORTHY"}</h1><p className="mt-2 text-xs text-[#90a6b8]">Find something worth staying up for.</p></div>
      <span className="mono text-[10px] text-[#7990a3]" data-testid="text-catalog-source">{source === "tmdb" ? "LIVE CATALOG" : source === "saved" ? "SAVED CATALOG" : "LOCAL CATALOG"} · PAGE {page}</span>
    </div>
    <div className="mt-5 grid gap-5 md:grid-cols-[175px_1fr]">
      <aside className="h-fit border border-[#223b51] bg-[#102034] p-3" aria-label="Catalog filters">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#a9c5d7]"><SlidersHorizontal size={14} />Discover by</div>
        {["all", "28", "12", "878", "18", "35"].map((value) => {
          const label: Record<string, string> = { all: "Everything", "28": "Action", "12": "Adventure", "878": "Science fiction", "18": "Drama", "35": "Comedy" };
          return <button key={value} onClick={() => changeGenre(value)} aria-pressed={genre === value} className={`mb-1 flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-xs transition-colors ${genre === value ? "bg-[#245273] text-white" : "text-[#98adbd] hover:bg-[#1b334a] hover:text-white"} active:bg-[#315d7c]`} data-testid={`button-filter-${value}`}>{label[value]}{genre === value && <span className="h-1.5 w-1.5 rounded-full bg-[#7dd5f2]" />}</button>;
        })}
        <div className="mt-4 border-t border-[#294257] pt-3 text-[10px] leading-5 text-[#7790a2]">Catalog results from movies and television. Browse what's popular and find your next watch.</div>
      </aside>
      <div className="min-w-0">
        {message && <div className="mb-3 flex items-start gap-2 border border-[#4c4935] bg-[#24261f] px-3 py-2 text-xs text-[#d2c899]" data-testid="status-catalog-message"><CloudOff size={14} className="mt-0.5 shrink-0" />{message}</div>}
        {error && <div className="mb-4 flex items-center justify-between border border-[#704447] bg-[#321f25] p-4 text-sm text-[#f2b8ba]" role="alert" data-testid="status-catalog-error"><span>{error}</span><button onClick={() => setRetry((value) => value + 1)} className="border border-[#835659] px-3 py-1 text-xs hover:bg-white/10" data-testid="button-catalog-retry">Retry</button></div>}
        {loading ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <div className="skeleton aspect-[2/3] border border-[#223b51]" key={i} />)}</div> :
          items.length ? <div className="fade-in grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{items.map((item, i) => <MediaCard key={`${item.id}-${i}`} item={item} index={i} onCart={() => onCart(String(item.id))} onWishlist={() => onWishlist(String(item.id))} wished={wished.includes(String(item.id))} added={cart.includes(String(item.id))} />)}</div>
            : <div className="grid min-h-64 place-items-center border border-dashed border-[#34506a] bg-[#0e1d2c] p-6 text-center" data-testid="empty-catalog"><div><Search className="mx-auto mb-3 text-[#6597b6]" size={27} /><h2 className="steam-font text-xl text-white">No titles found</h2><p className="mt-1 text-xs text-[#8fa2b1]">Try another search or choose a different category.</p></div></div>}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#253e54] pt-4">
          <span className="mono text-[10px] text-[#7891a4]" data-testid="text-pagination">PAGE {page} OF {Math.max(pages, 1)}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => goToPage(page - 1)} disabled={!paginationController.hasPrevious(page) || loading} className="grid h-8 w-8 place-items-center border border-[#385269] bg-[#142b40] text-[#b9cfdd] hover:bg-[#234762] active:bg-[#316486] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Previous page" data-testid="button-page-prev"><ArrowLeft size={15} /></button>
            {paginationController.pageWindow(page, pages).map((n) => <button key={n} onClick={() => goToPage(n)} aria-current={page === n ? "page" : undefined} className={`grid h-8 min-w-8 place-items-center border px-2 text-xs ${page === n ? "border-[#67c9ed] bg-[#245475] text-white" : "border-[#304a60] bg-[#142a3e] text-[#9bb3c3] hover:bg-[#203f58]"} active:bg-[#2f6388]`} data-testid={`button-page-${n}`}>{n}</button>)}
            <button onClick={() => goToPage(page + 1)} disabled={!paginationController.hasNext(page, pages) || loading} className="grid h-8 w-8 place-items-center border border-[#385269] bg-[#142b40] text-[#b9cfdd] hover:bg-[#234762] active:bg-[#316486] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Next page" data-testid="button-page-next"><ArrowRight size={15} /></button>
          </div>
        </div>
        {loading && <span className="sr-only" role="status">Loading catalog</span>}
      </div>
    </div>
  </main>;
}

function CyberpunkPage({ onCart, onWishlist, wished, cart }: { onCart: (id: string) => void; onWishlist: (id: string) => void; wished: string[]; cart: string[] }) {
  const [related, setRelated] = useState<MediaItem[]>(localCatalog.slice(0, 5));
  const [selectedScreenshot, setSelectedScreenshot] = useState(0);
  const [ageVerified, setAgeVerified] = useState(() => {
    try { return sessionStorage.getItem("cyberpunk-age-verified") === "yes"; } catch { return false; }
  });
  const [birthMonth, setBirthMonth] = useState("1");
  const [birthDay, setBirthDay] = useState("1");
  const [birthYear, setBirthYear] = useState("1990");
  const [ageError, setAgeError] = useState("");
  const [, setLocation] = useLocation();
  useEffect(() => { catalogService.search("cyberpunk", 1).then((result) => setRelated(result.items.slice(0, 5))); }, []);
  const screenshotNames = ["NIGHT CITY", "THE BADLANDS", "AFTER DARK", "NEON DISTRICT"];
  const screenshotScenes = [
    "bg-[radial-gradient(ellipse_at_64%_34%,#b34546_0%,#7e333c_19%,#243549_48%,#101a27_78%)]",
    "bg-[radial-gradient(ellipse_at_64%_34%,#b59661_0%,#756548_19%,#35403c_48%,#101a27_78%)]",
    "bg-[radial-gradient(ellipse_at_64%_34%,#665590_0%,#44385f_19%,#28364a_48%,#101a27_78%)]",
    "bg-[radial-gradient(ellipse_at_64%_34%,#34949a_0%,#245c68_19%,#263c4e_48%,#101a27_78%)]",
  ];
  const verifyAge = () => {
    const today = new Date();
    const birthDate = new Date(Number(birthYear), Number(birthMonth) - 1, Number(birthDay));
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) age -= 1;
    if (Number.isNaN(birthDate.getTime()) || birthDate > today || age < 18) {
      setAgeError("Please enter a valid date of birth showing that you are at least 18 years old.");
      return;
    }
    try { sessionStorage.setItem("cyberpunk-age-verified", "yes"); } catch { /* Verification lasts for this view. */ }
    setAgeVerified(true);
    setAgeError("");
  };
  if (!ageVerified) return <main className="store-wrap min-h-[75vh] pb-10">
    <div className="age-gate mt-24 border border-[#40556a] bg-[#1b2c40] px-5 pb-8 pt-4 text-center sm:px-10">
      <div className="mx-auto -mt-16 grid h-[104px] w-[220px] place-items-center border-b-4 border-[#f6ec00] bg-[radial-gradient(ellipse_at_55%_40%,#e2cb00,#f5ef00_40%,#9e8e08)] shadow-lg">
        <div className="rotate-[-5deg] text-center"><span className="steam-font block text-[26px] font-extrabold italic leading-none text-[#111820]">CYBERPUNK</span><span className="steam-font text-[17px] font-bold tracking-[.45em] text-[#1b232b]">2077</span></div>
      </div>
      <h1 className="mt-7 text-[19px] leading-7 text-[#e6edf4] sm:text-[23px]">This game may contain content not appropriate for all ages,<br className="hidden sm:block" /> or may not be appropriate for viewing at work.</h1>
      <p className="mt-6 text-[11px] text-[#8699aa]">The developers describe the content like this:</p>
      <p className="mt-1 text-sm italic text-[#c4d0dc]">“Cyberpunk 2077 contains strong language, intense violence, blood and gore, as well as nudity and sexual material.”</p>
      <div className="mx-auto mt-5 max-w-[560px] bg-[#354558] px-4 py-3">
        <label htmlFor="age-day" className="block text-xs text-[#b5c4d1]">Please enter your birth date to continue:</label>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
          <select id="age-day" value={birthDay} onChange={(event) => setBirthDay(event.target.value)} className="h-8 border border-[#405b73] bg-[#172a3b] px-2 text-xs text-[#c9d9e6] focus-visible:outline" data-testid="select-birth-day" aria-label="Birth day">
            {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => <option key={day} value={day}>{day}</option>)}
          </select>
          <select value={birthMonth} onChange={(event) => setBirthMonth(event.target.value)} className="h-8 border border-[#405b73] bg-[#172a3b] px-2 text-xs text-[#c9d9e6] focus-visible:outline" data-testid="select-birth-month" aria-label="Birth month">
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
          </select>
          <select value={birthYear} onChange={(event) => setBirthYear(event.target.value)} className="h-8 border border-[#405b73] bg-[#172a3b] px-2 text-xs text-[#c9d9e6] focus-visible:outline" data-testid="select-birth-year" aria-label="Birth year">
            {Array.from({ length: 100 }, (_, index) => new Date().getFullYear() - index).map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
      </div>
      {ageError && <p role="alert" className="mx-auto mt-3 max-w-[560px] text-xs text-[#ffb8b8]" data-testid="status-age-error">{ageError}</p>}
      <div className="mt-8 flex justify-center gap-2">
        <button onClick={verifyAge} className="h-9 bg-gradient-to-r from-[#25a7ea] to-[#1765d4] px-4 text-sm text-white hover:brightness-110 active:brightness-90" data-testid="button-age-view">View Page</button>
        <button onClick={() => setLocation("/")} className="h-9 bg-gradient-to-r from-[#259ce1] to-[#1763cc] px-4 text-sm text-white hover:brightness-110 active:brightness-90" data-testid="button-age-cancel">Cancel</button>
      </div>
      <p className="mt-7 text-[10px] text-[#8092a2]">Your date of birth is used only to verify age and is not stored.</p>
    </div>
  </main>;
  return <main className="store-wrap pb-8">
    <div className="mt-5 flex items-center gap-2 text-[11px] text-[#85b2cb]"><Link href="/" className="hover:text-white" data-testid="link-breadcrumb-store">All Products</Link><ChevronRight size={12} /><span className="text-[#becdd7]">Cyberpunk 2077</span></div>
    <h1 className="steam-font mt-5 text-[38px] font-bold tracking-[.045em] text-white md:text-[46px]" data-testid="text-game-title">CYBERPUNK 2077</h1>
    <p className="mt-1 text-xs text-[#91a9ba]">CD PROJEKT RED · RPG · OPEN WORLD · CYBERPUNK</p>
    <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_278px]">
      <div>
        <div className={`relative grid aspect-[16/7.1] min-h-[220px] place-items-center overflow-hidden border border-[#35516a] ${screenshotScenes[selectedScreenshot]}`}>
          <div className="absolute inset-0 opacity-50" style={{ background: "linear-gradient(90deg,rgba(6,15,24,.35),transparent 55%,rgba(7,13,20,.65)),repeating-linear-gradient(0deg,transparent 0 44px,rgba(183,218,235,.04) 45px)" }} />
          <div className="absolute bottom-[14%] left-[8%] h-[55%] w-[1px] bg-[#eca85b]/70 shadow-[100px_-48px_0_0_rgba(237,142,82,.6),250px_20px_0_0_rgba(97,195,208,.35)]" />
          <div className="relative text-center"><span className="steam-font block text-[clamp(48px,11vw,105px)] font-extrabold leading-[.82] tracking-tight text-[#ffbd6a] drop-shadow-[0_4px_22px_rgba(15,15,20,.7)]">CYBERPUNK</span><span className="steam-font mt-1 block text-[clamp(34px,8vw,72px)] font-semibold leading-none tracking-[.35em] text-[#e8edf0]">2077</span><span className="mono mt-4 inline-block border border-white/20 bg-black/30 px-3 py-1 text-[9px] tracking-[.38em] text-[#d0e3eb]">NIGHT CITY · CALIFORNIA</span></div>
          <span className="absolute bottom-3 left-4 mono text-[9px] tracking-widest text-white/65">{screenshotNames[selectedScreenshot]}</span>
          <span className="absolute bottom-3 right-4 mono text-[9px] tracking-widest text-white/50">IN-GAME ARTWORK</span>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-none" aria-label="Screenshots">
          {screenshotNames.map((title, i) => <button key={title} onClick={() => setSelectedScreenshot(i)} aria-pressed={selectedScreenshot === i} className={`relative aspect-video w-[115px] shrink-0 overflow-hidden border ${selectedScreenshot === i ? "border-[#73c6e8]" : "border-[#304a5f]"} ${screenshotScenes[i]} hover:border-[#9fdff5] focus-visible:outline`} aria-label={`Show screenshot: ${title}`} data-testid={`button-screenshot-${i}`}><span className="steam-font absolute inset-x-1 bottom-1 text-left text-xs font-semibold tracking-wider text-white drop-shadow">{title}</span></button>)}
        </div>
        <section className="mt-6 border-l-2 border-[#68c5e7] bg-[#102136] px-4 py-4">
          <h2 className="steam-font text-[22px] font-semibold tracking-wide text-white">LIVE THE MERC LIFE</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#bdcbd6]">Cyberpunk 2077 is an open-world, action-adventure RPG set in Night City, a megalopolis obsessed with power, glamour, and body modification. Play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality. Customize your character and playstyle as you take on jobs, build a reputation, and unlock upgrades.</p>
          <p className="mt-3 text-sm leading-6 text-[#bdcbd6]">The relationships you forge and the choices you make will shape the story and the world around you. Legends are made here. What will yours look like?</p>
        </section>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="border border-[#29435a] bg-[#102034] p-4"><span className="mono text-[9px] tracking-[.2em] text-[#70c5e6]">ABOUT THIS GAME</span><h3 className="steam-font mt-1 text-lg text-white">Build your own legend</h3><p className="mt-2 text-xs leading-5 text-[#94aabd]">Explore the vast world of Night City, take on dangerous gigs, and decide who you want to be.</p></div>
          <div className="border border-[#29435a] bg-[#102034] p-4"><span className="mono text-[9px] tracking-[.2em] text-[#70c5e6]">SYSTEM REQUIREMENTS</span><h3 className="steam-font mt-1 text-lg text-white">Ready your hardware</h3><p className="mt-2 text-xs leading-5 text-[#94aabd]">64-bit processor and operating system · SSD required · DirectX 12.</p></div>
        </div>
      </div>
      <aside className="h-fit border border-[#2b475d] bg-gradient-to-b from-[#1a344b] to-[#102033] p-4">
        <div className="steam-font text-lg text-[#d6e4ed]">Buy Cyberpunk 2077</div>
        <p className="mt-2 text-xs leading-5 text-[#a1b6c4]">The complete experience. The city never sleeps.</p>
        <div className="mt-5 flex items-center justify-between bg-[#0d1a27] p-3"><span className="text-[11px] text-[#8ea2b1]">SPECIAL PROMOTION</span><span className="mono bg-[#91c84d] px-2 py-1 text-[11px] font-semibold text-[#14230c]">-50%</span></div>
        <div className="flex items-center justify-end gap-3 border-b border-[#30475a] bg-[#0d1a27] px-3 pb-3"><span className="text-xs text-[#8094a3] line-through">$59.99</span><span className="text-lg font-semibold text-[#c7e8a2]">$29.99</span></div>
        <button onClick={() => onCart("1091500")} className="mt-3 flex h-11 w-full items-center justify-center gap-2 bg-gradient-to-b from-[#83cf36] to-[#5a9a25] text-sm font-bold text-[#16220e] hover:brightness-110 active:brightness-90" data-testid="button-game-cart">{cart.includes("1091500") ? <><Check size={16} /> Added to cart</> : <>Add to cart · $29.99 <ShoppingCart size={16} /></>}</button>
        <button onClick={() => onWishlist("1091500")} aria-pressed={wished.includes("1091500")} className={`mt-2 flex h-10 w-full items-center justify-center gap-2 border border-[#46617a] bg-[#1b3348] text-xs font-semibold hover:bg-[#25475f] active:bg-[#2c5673] ${wished.includes("1091500") ? "text-[#f08e95]" : "text-[#bdccd8]"}`} data-testid="button-game-wishlist"><Heart size={15} fill={wished.includes("1091500") ? "currentColor" : "none"} />{wished.includes("1091500") ? "On your wishlist" : "Add to your wishlist"}</button>
        <dl className="mt-5 space-y-2 border-t border-[#30475a] pt-4 text-[11px]">
          <div className="flex justify-between gap-3"><dt className="text-[#8298a9]">Developer</dt><dd className="text-right text-[#c2d1dc]">CD PROJEKT RED</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-[#8298a9]">Publisher</dt><dd className="text-right text-[#c2d1dc]">CD PROJEKT RED</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-[#8298a9]">Release date</dt><dd className="text-right text-[#c2d1dc]">10 Dec, 2020</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-[#8298a9]">All reviews</dt><dd className="text-right text-[#83c9e8]">Very Positive</dd></div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-1.5">{["Open World", "RPG", "Story Rich", "Cyberpunk", "Singleplayer"].map((tag) => <span key={tag} className="rounded-sm bg-[#2a475d] px-2 py-1 text-[10px] text-[#b0cad9]">{tag}</span>)}</div>
      </aside>
    </div>
    <section className="mt-9">
      <div className="mb-3 flex items-end justify-between border-b border-[#2b455c] pb-2"><div><h2 className="steam-font text-[21px] font-semibold text-white">MEDIA FOR YOUR NEXT SESSION</h2><p className="mt-0.5 text-[11px] text-[#8ea4b5]">Related movies and series from the discovery catalog</p></div><Link href={explorePath} className="text-[11px] text-[#89c5e0] hover:text-white" data-testid="link-related-browse">Browse media</Link></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">{related.map((item, index) => <MediaCard key={item.id} item={item} index={index} onCart={() => onCart(String(item.id))} onWishlist={() => onWishlist(String(item.id))} wished={wished.includes(String(item.id))} added={cart.includes(String(item.id))} />)}</div>
    </section>
  </main>;
}

function SignupDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const emailInput = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const configured = signupService.configured();
  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => emailInput.current?.focus());
    const handle = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("keydown", handle); };
  }, [open, onClose]);
  if (!open) return null;
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError(""); setSuccess("");
    try { await signupService.createAccount(email, password); setSuccess("Account created. Your Steam adventure starts here."); setPassword(""); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not create your account."); }
    finally { setBusy(false); }
  };
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} data-testid="dialog-signup">
    <section role="dialog" aria-modal="true" aria-labelledby="signup-title" aria-describedby="signup-description" onKeyDown={(event) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href], [tabindex="0"]'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }} className="fade-in relative w-full max-w-[440px] border border-[#41617a] bg-[#111e2d] p-5 shadow-[0_20px_80px_rgba(0,0,0,.6)] sm:p-7">
      <button onClick={onClose} aria-label="Close signup" className="absolute right-3 top-3 grid h-8 w-8 place-items-center text-[#9ab0c1] hover:bg-white/10 hover:text-white active:bg-white/20" data-testid="button-close-signup"><X size={18} /></button>
      <span className="mono text-[10px] tracking-[.22em] text-[#73c9e8]">JOIN THE COMMUNITY</span>
      <h2 id="signup-title" className="steam-font mt-1 text-[29px] font-bold tracking-wide text-white">CREATE YOUR ACCOUNT</h2>
      <p id="signup-description" className="mt-2 text-xs leading-5 text-[#9cafbd]">One account for your games, friends, and the next thing you can't put down.</p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="block text-xs font-semibold text-[#b9c9d5]">Email address<input ref={emailInput} required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-1.5 h-10 w-full border border-[#3a5368] bg-[#091522] px-3 text-sm text-white outline-none placeholder:text-[#647a8d] hover:border-[#52718a] focus:border-[#67c9ed] focus:ring-2 focus:ring-[#67c9ed]/20" data-testid="input-signup-email" /></label>
        <label className="block text-xs font-semibold text-[#b9c9d5]">Password<input required minLength={6} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" className="mt-1.5 h-10 w-full border border-[#3a5368] bg-[#091522] px-3 text-sm text-white outline-none placeholder:text-[#647a8d] hover:border-[#52718a] focus:border-[#67c9ed] focus:ring-2 focus:ring-[#67c9ed]/20" data-testid="input-signup-password" /></label>
        {error && <p role="alert" className="border border-[#76454a] bg-[#351f27] p-2.5 text-xs text-[#f1b3b5]" data-testid="status-auth-error">{error}</p>}
        {success && <p role="status" className="border border-[#4e7440] bg-[#203321] p-2.5 text-xs text-[#c2e1a8]" data-testid="status-auth-success">{success}</p>}
        {!configured && <p className="border border-[#665535] bg-[#30291c] p-2.5 text-xs leading-5 text-[#e1c88e]" data-testid="status-auth-unconfigured">Firebase signup is not configured. Add the Firebase web app values from .env.example to enable email and password accounts.</p>}
        <button type="submit" disabled={busy || !configured} className="flex h-11 w-full items-center justify-center gap-2 bg-gradient-to-b from-[#74bee0] to-[#3d8eb7] text-sm font-bold text-[#0b1b26] hover:brightness-110 active:brightness-90 disabled:cursor-not-allowed disabled:opacity-50" data-testid="button-submit-signup">{busy ? <><LoaderCircle size={16} className="animate-spin" />Creating account</> : "Create account"}</button>
      </form>
      <p className="mt-4 text-[10px] leading-4 text-[#718697]">Account registration uses Firebase Authentication. This demo does not create or simulate an account without Firebase configuration.</p>
    </section>
  </div>;
}

function NotFound() {
  return <main className="store-wrap grid min-h-[70vh] place-items-center text-center"><div><span className="mono text-xs tracking-widest text-[#6abfe0]">ERROR 404</span><h1 className="steam-font mt-2 text-4xl text-white">This page went missing.</h1><Link href="/" className="mt-5 inline-block bg-[#357fa9] px-4 py-2 text-sm text-white hover:bg-[#4799c6]" data-testid="link-not-found-home">Back to the store</Link></div></main>;
}

function App() {
  const [signupOpen, setSignupOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("store-wishlist") || "[]") as string[]; } catch { return []; }
  });
  const [cart, setCart] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("store-cart") || "[]") as string[]; } catch { return []; }
  });
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);
  const showToast = (message: string) => { setToast(message); window.clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToast(""), 2300); };
  const toggleWishlist = (id: string) => setWishlist((current) => {
    const has = current.includes(id); showToast(has ? "Removed from your wishlist" : "Added to your wishlist");
    return has ? current.filter((item) => item !== id) : [...current, id];
  });
  const addCart = (id: string) => setCart((current) => {
    if (current.includes(id)) { showToast("This item is already in your cart"); return current; }
    showToast("Added to your cart"); return [...current, id];
  });
  useEffect(() => {
    try {
      localStorage.setItem("store-wishlist", JSON.stringify(wishlist));
      localStorage.setItem("store-cart", JSON.stringify(cart));
    } catch { /* Browsing remains available when storage is disabled. */ }
  }, [wishlist, cart]);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);
  return <AppFrame onSignup={() => setSignupOpen(true)} wishlistCount={wishlist.length} cartCount={cart.length}>
    <Switch>
      <Route path="/" component={() => <StoreHome onCart={addCart} onWishlist={toggleWishlist} wished={wishlist} cart={cart} />} />
      <Route path="/app/1091500/Cyberpunk_2077/" component={() => <CyberpunkPage onCart={addCart} onWishlist={toggleWishlist} wished={wishlist} cart={cart} />} />
      <Route path="/explore/new/" component={() => <ExplorePage onCart={addCart} onWishlist={toggleWishlist} wished={wishlist} cart={cart} />} />
      <Route component={NotFound} />
    </Switch>
    {toast && <div role="status" className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 border border-[#45718c] bg-[#183449] px-4 py-3 text-xs text-[#d9eaf4] shadow-xl" data-testid="status-store-toast">{toast}</div>}
    <SignupDialog open={signupOpen} onClose={() => setSignupOpen(false)} />
  </AppFrame>;
}

export default App;
