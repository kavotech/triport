const EXTENSIONS = ["png", "jpg", "jpeg", "webp", "avif", "gif", "svg"];
const RETRY_INTERVAL_MS = 5000;

const KNOWN_ASSETS: Record<string, string> = {
  "about-farm": "/about-farm.png",
  "cta-texture": "/cta-texture.png",
  "global1": "/global1.png",
  "global2": "/global2.png",
  "global3": "/global3.png",
  "global4": "/global4.png",
  "hero-coffee": "/hero-coffee.jpg",
  "logo-tripport": "/logo-tripport.png",
  "market-network": "/market-network.jpg",
  "pic": "/pic.png",
  "product-coffee": "/product-coffee.png",
  "product-foods": "/product-foods.jpg",
  "product-fruit": "/product-fruit.png",
  "product-fruits": "/product-fruits.jpg",
  "product-vegetables": "/product-vegetables.png",
  "team-micah": "/team-micah.png",
  "team-kaboyo": "/team-kaboyo.png",
  "team-matthew": "/team-matthew.png",
  "team-norah": "/team-norah.png",
  "team-oliver": "/team-oliver.png"
};

const resolvedCache = new Map<string, Promise<string | null>>();

function probeImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = `${url}?v=${Date.now()}`;
  });
}

async function resolveImageByBase(baseName: string): Promise<string | null> {
  const mappedAsset = KNOWN_ASSETS[baseName];

  if (mappedAsset) {
    return mappedAsset;
  }

  for (const ext of EXTENSIONS) {
    const candidate = `/${baseName}.${ext}`;

    // eslint-disable-next-line no-await-in-loop
    if (await probeImage(candidate)) {
      return candidate;
    }
  }

  return null;
}

function getImage(baseName: string): Promise<string | null> {
  const key = baseName.trim().toLowerCase();

  if (!resolvedCache.has(key)) {
    resolvedCache.set(key, resolveImageByBase(key));
  }

  return resolvedCache.get(key) as Promise<string | null>;
}

function clearImageCache(baseName: string): void {
  resolvedCache.delete(baseName.trim().toLowerCase());
}

async function hydrateAutoBackground(element: HTMLElement): Promise<void> {
  const baseName = element.dataset.imageBase;

  if (!baseName) {
    return;
  }

  const src = await getImage(baseName);

  if (src) {
    element.style.backgroundImage = `url('${src}')`;
    element.classList.add("has-resolved-image");
  } else {
    element.classList.remove("has-resolved-image");
  }
}

export function wireAutoAssets(): void {
  const elements = document.querySelectorAll<HTMLElement>("[data-image-base]");
  const unresolved = new Set<HTMLElement>();

  if (!elements.length) {
    return;
  }

  const hydrateElement = (element: HTMLElement) => {
    void hydrateAutoBackground(element).then(() => {
      if (!element.classList.contains("has-resolved-image")) {
        unresolved.add(element);
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        observer.unobserve(entry.target);
        hydrateElement(entry.target as HTMLElement);
      });
    },
    { rootMargin: "240px 0px" }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });

  if (unresolved.size === 0) {
    return;
  }

  const timer = window.setInterval(() => {
    if (unresolved.size === 0) {
      window.clearInterval(timer);
      return;
    }

    unresolved.forEach((element) => {
      const baseName = element.dataset.imageBase;

      if (!baseName) {
        unresolved.delete(element);
        return;
      }

      clearImageCache(baseName);
      void hydrateAutoBackground(element).then(() => {
        if (element.classList.contains("has-resolved-image")) {
          unresolved.delete(element);
        }
      });
    });
  }, RETRY_INTERVAL_MS);
}
