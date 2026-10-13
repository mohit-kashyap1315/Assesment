import { initializeApp, getApps } from "@firebase/app";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
} from "@firebase/auth";

export type MediaItem = {
  id: number;
  title: string;
  overview: string;
  poster: string;
  backdrop: string;
  date: string;
  rating: number;
  kind: "movie" | "tv";
};

const imageRoot = "https://image.tmdb.org/t/p";
const fallbackMovies: MediaItem[] = [
  { id: 603, title: "The Matrix", overview: "A computer hacker learns that reality is a simulation and joins a rebellion against its architects.", poster: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", backdrop: "/icmmSD4vTTDKOq2vvdulafOGw93.jpg", date: "1999-03-30", rating: 8.2, kind: "movie" },
  { id: 157336, title: "Interstellar", overview: "A team travels beyond this galaxy to discover whether mankind has a future among the stars.", poster: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", backdrop: "/xJHokMbljvjADYdit5fK5VHsXyE.jpg", date: "2014-11-05", rating: 8.4, kind: "movie" },
  { id: 27205, title: "Inception", overview: "A skilled thief is offered one last chance: plant an idea in a target's mind.", poster: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", backdrop: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg", date: "2010-07-15", rating: 8.4, kind: "movie" },
  { id: 299534, title: "Avengers: Endgame", overview: "The Avengers assemble once more to reverse the devastation left by Thanos.", poster: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg", backdrop: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", date: "2019-04-24", rating: 8.2, kind: "movie" },
  { id: 157350, title: "Divergent", overview: "In a divided future, one young woman discovers she does not fit into any faction.", poster: "/aNh4Q3iuPKDMPi2SL7GgOpiLukX.jpg", backdrop: "/b6ZJZHUdMEFECvGiDpJjlfUWela.jpg", date: "2014-03-14", rating: 6.9, kind: "movie" },
  { id: 118340, title: "Guardians of the Galaxy", overview: "An unlikely crew of outlaws becomes the galaxy's last line of defense.", poster: "/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg", backdrop: "/bHarw8xrmQeqf3t8HpuMY7zoK4x.jpg", date: "2014-07-30", rating: 7.9, kind: "movie" },
  { id: 335984, title: "Blade Runner 2049", overview: "A new blade runner uncovers a secret that could change what it means to be human.", poster: "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg", backdrop: "/ilRyazdMJwN05exqHwK4tMKBYZs.jpg", date: "2017-10-04", rating: 8.0, kind: "movie" },
  { id: 438631, title: "Dune", overview: "A gifted heir journeys to the most dangerous planet in the universe.", poster: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", backdrop: "/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg", date: "2021-09-15", rating: 7.8, kind: "movie" },
  { id: 299536, title: "Avengers: Infinity War", overview: "The Avengers and their allies face a threat too large for any one hero.", poster: "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg", backdrop: "/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg", date: "2018-04-25", rating: 8.2, kind: "movie" },
  { id: 550, title: "Fight Club", overview: "An insomniac office worker and a soap maker build something impossible to ignore.", poster: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", backdrop: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg", date: "1999-10-15", rating: 8.4, kind: "movie" },
  { id: 76341, title: "Mad Max: Fury Road", overview: "A road warrior joins a rebel escape across a post-apocalyptic wasteland.", poster: "/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg", backdrop: "/phszHPFVhPHhMZgo0fWTKBDQsJA.jpg", date: "2015-05-13", rating: 7.6, kind: "movie" },
  { id: 68718, title: "Django Unchained", overview: "A freed slave rides with a bounty hunter to rescue his wife.", poster: "/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg", backdrop: "/2o0PKGmnSgCGk9nsxF6d3dJobyg.jpg", date: "2012-12-25", rating: 8.2, kind: "movie" },
];

function normalize(row: any, kind: "movie" | "tv"): MediaItem | null {
  const title = row.title || row.name;
  if (!title) return null;
  return {
    id: row.id,
    title,
    overview: row.overview || "A new story is waiting to be discovered.",
    poster: row.poster_path ? `${imageRoot}/w500${row.poster_path}` : "",
    backdrop: row.backdrop_path ? `${imageRoot}/w1280${row.backdrop_path}` : "",
    date: row.release_date || row.first_air_date || "",
    rating: Number(row.vote_average || 0),
    kind,
  };
}

export const localCatalog = fallbackMovies.map((item) => ({
  ...item,
  poster: `${imageRoot}/w500${item.poster}`,
  backdrop: `${imageRoot}/w1280${item.backdrop}`,
}));

export type CatalogResult = { items: MediaItem[]; source: "tmdb" | "saved" | "local"; pages: number; message?: string };

export class PaginationController {
  clampPage(requested: number, totalPages: number): number {
    return Math.max(1, Math.min(Math.floor(requested), Math.max(1, totalPages)));
  }

  pageWindow(currentPage: number, totalPages: number, size = 5): number[] {
    const count = Math.max(1, Math.min(size, totalPages));
    const first = Math.max(1, Math.min(totalPages - count + 1, currentPage - Math.floor(count / 2)));
    return Array.from({ length: count }, (_, index) => first + index);
  }

  hasPrevious(currentPage: number): boolean {
    return currentPage > 1;
  }

  hasNext(currentPage: number, totalPages: number): boolean {
    return currentPage < totalPages;
  }
}

export class CatalogService {
  private key = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
  private base = "https://api.themoviedb.org/3";
  private cacheKey(path: string) { return `store-catalog:${path}`; }

  async discover(page = 1, genre = "all"): Promise<CatalogResult> {
    const path = genre === "all"
      ? `/trending/all/week?page=${page}`
      : `/discover/movie?page=${page}&with_genres=${encodeURIComponent(genre)}&sort_by=popularity.desc`;
    return this.request(path);
  }

  async search(query: string, page = 1): Promise<CatalogResult> {
    return this.request(`/search/multi?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`);
  }

  private async request(path: string): Promise<CatalogResult> {
    if (this.key) {
      try {
        const response = await fetch(`${this.base}${path}${path.includes("?") ? "&" : "?"}api_key=${encodeURIComponent(this.key)}`);
        if (!response.ok) throw new Error(`TMDB returned ${response.status}`);
        const payload = await response.json();
        const items = (payload.results || []).map((row: any) => normalize(row, row.media_type === "tv" ? "tv" : "movie")).filter(Boolean) as MediaItem[];
        const result: CatalogResult = { items, source: "tmdb", pages: Math.max(1, payload.total_pages || 1) };
        try { localStorage.setItem(this.cacheKey(path), JSON.stringify(result)); } catch { /* storage can be unavailable */ }
        return result;
      } catch (error) {
        const cached = this.readCache(path);
        return cached ? { ...cached, source: "saved", message: "TMDB is unreachable. Showing your last saved catalog." } : { items: localCatalog, pages: 3, source: "local", message: "TMDB is unreachable. Showing the local discovery shelf." };
      }
    }
    const cached = this.readCache(path);
    return cached ? { ...cached, source: "saved", message: "TMDB is not configured. Showing your last saved catalog." } : { items: localCatalog, pages: 3, source: "local", message: "TMDB key not configured. Showing the local discovery shelf." };
  }

  private readCache(path: string): CatalogResult | null {
    try { return JSON.parse(localStorage.getItem(this.cacheKey(path)) || "null") as CatalogResult | null; } catch { return null; }
  }
}

export class SignupService {
  private apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined;
  private authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined;
  private projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined;
  private appId = import.meta.env.VITE_FIREBASE_APP_ID as string | undefined;
  configured() { return Boolean(this.apiKey && this.authDomain && this.projectId && this.appId); }

  async createAccount(email: string, password: string): Promise<void> {
    const auth = this.getAuth();
    await setPersistence(auth, browserLocalPersistence);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const code = error instanceof Error && "code" in error ? String(error.code) : "";
      const messages: Record<string, string> = {
        "auth/email-already-in-use": "An account already exists for this email.",
        "auth/weak-password": "Choose a stronger password.",
        "auth/invalid-email": "Enter a valid email address.",
        "auth/operation-not-allowed": "Email and password signup is disabled in Firebase.",
        "auth/network-request-failed": "Firebase could not connect. Check your internet connection and try again.",
      };
      throw new Error(messages[code] || "Firebase could not create your account. Try again.");
    }
  }

  private getAuth() {
    if (!this.configured()) {
      throw new Error("Email signup is unavailable until the Firebase client configuration is added.");
    }
    const name = "steam-store-assessment";
    const app = getApps().find((candidate) => candidate.name === name) ?? initializeApp({
      apiKey: this.apiKey!,
      authDomain: this.authDomain!,
      projectId: this.projectId!,
      appId: this.appId!,
    }, name);
    return getAuth(app);
  }
}
