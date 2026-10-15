import { teamMembers } from "./teamData";

export function heroSection(): string {
  return `
    <section class="hero auto-bg" data-image-base="hero-coffee">
      <span class="asset-placeholder-label hero-placeholder">IMAGE PLACEHOLDER</span>
      <div class="container hero-content reveal">
        <h1>Premium Fresh &amp;<br/>Dry Produce,<br/><span class="hero-accent">Sustainably</span><br/>Sourced</h1>
        <p>Connecting Ugandan farmers directly to international markets. We deliver high-quality agricultural products with fair trade practices that empower local communities.</p>
        <div class="cta-row">
          <a href="/products" class="btn btn-primary">Explore Products</a>
          <a href="/quote" class="btn btn-outline">Get a Quote</a>
        </div>
      </div>
      <div class="container hero-kpis-wrap reveal">
        <div class="hero-kpis">
          <article class="hero-kpi">
            <strong>15+</strong>
            <span>Years<br/>Experience</span>
          </article>
          <article class="hero-kpi">
            <strong>10+</strong>
            <span>Countries<br/>Served</span>
          </article>
          <article class="hero-kpi">
            <strong>500+</strong>
            <span>Partner<br/>Farmers</span>
          </article>
          <article class="hero-kpi hero-kpi-highlight">
            <strong>100%</strong>
            <span>Sustainable</span>
          </article>
        </div>
      </div>
    </section>
  `;
}

export function processSection(): string {
  return `
    <section class="section soft-green">
      <div class="container">
        <div class="section-head reveal">
          <h2>Our Export Process</h2>
          <p>A seamless four-step journey from your order to international delivery with full quality assurance.</p>
        </div>
        <div class="card-grid four">
          ${[
            ["1", "Quote & Order", "Submit your export requirements through our simple quote form."],
            ["2", "Sourcing & Quality", "Source fresh produce from trusted Ugandan farmers with checks."],
            ["3", "Documentation", "Complete handling of all export documents and certifications."],
            ["4", "Shipping & Delivery", "Safe transport via air or sea with cold chain management."]
          ]
            .map(
              (step) => `
            <article class="step-card reveal">
              <span class="step-pill">${step[0]}</span>
              <h3>${step[1]}</h3>
              <p>${step[2]}</p>
            </article>
          `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

export function productsSection(): string {
  const products = [
    {
      base: "product-coffee",
      image: "/product-coffee.png",
      title: "Ugandan Coffee",
      summary: "Specialty and commercial coffee sourced from high-altitude regions with traceable farmer networks.",
      varieties: "Arabica (Bugisu, Sipi) and Robusta (Central Uganda)",
      packaging: "60 kg jute bags, GrainPro-lined bags, and private-label options",
      formats: "Green beans, screen-graded lots, and selected microlots"
    },
    {
      base: "product-fruits",
      image: "/product-fruits.jpg",
      title: "Fresh Fruits",
      summary: "Export-grade tropical fruits selected for taste, shelf life, and consistent size profiles.",
      varieties: "Pineapple (Smooth Cayenne), mango (Apple/Kent), avocado (Hass/Fuerte), passion fruit",
      packaging: "4 kg to 10 kg ventilated cartons, clamshells, and palletized cold-chain loads",
      formats: "Air-freight premium packs and sea-freight controlled-ripening packs"
    },
    {
      base: "product-vegetables",
      image: "/product-vegetables.png",
      title: "Fresh Vegetables",
      summary: "Farm-fresh vegetables harvested to order and prepared to meet retail and wholesale specifications.",
      varieties: "Hot peppers, French beans, okra, eggplant, tomatoes, and leafy assortments",
      packaging: "2 kg to 8 kg produce boxes, perforated liners, and moisture-control packs",
      formats: "Trimmed, graded, and mixed-load consignments"
    },
    {
      base: "product-foods",
      image: "/product-foods.jpg",
      title: "Grains & Legumes",
      summary: "Cleaned and sorted staples for food service, retail, and ingredient supply chains.",
      varieties: "Sesame, maize, beans, soybeans, and other seasonal commodity lines",
      packaging: "25 kg and 50 kg PP bags, bulk sacks, and custom labeled retail packs",
      formats: "Machine-cleaned, handpicked premium grades, and contract-volume supply"
    }
  ];

  return `
    <section class="section white-bg">
      <div class="container">
        <div class="section-head reveal">
          <h2>Premium Ugandan Products</h2>
          <p>From premium coffee to fresh produce and dry commodities, each product line includes clear variety, grading, and packaging options for international buyers.</p>
        </div>
        <div class="card-grid four products-grid">
          ${products
            .map(
              (item) => `
            <article class="product-card reveal">
              <img class="product-media-image" src="${item.image}" alt="${item.title}" loading="lazy" decoding="async" />
              <div class="product-body">
                <h3>${item.title}</h3>
                <p class="product-summary">${item.summary}</p>
                <ul class="product-specs">
                  <li><strong>Types:</strong> ${item.varieties}</li>
                  <li><strong>Packaging:</strong> ${item.packaging}</li>
                  <li><strong>Export Formats:</strong> ${item.formats}</li>
                </ul>
              </div>
            </article>
          `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

export function marketsSection(): string {
  return `
    <section class="section green-splash auto-bg" data-image-base="market-network">
      <span class="asset-placeholder-label section-placeholder">IMAGE PLACEHOLDER</span>
      <div class="container">
        <div class="section-head on-dark reveal">
          <h2>Exporting to 3 Continents</h2>
          <p>From the heart of Uganda to markets across Europe, the Middle East, and Asia.</p>
        </div>
        <div class="card-grid three glass-grid">
          ${[
            ["Europe", "Serving premium markets with high-quality Ugandan coffee, fresh produce, and agricultural products."],
            ["Middle East", "Trusted supplier of fresh fruits, vegetables, and specialty products to Gulf markets."],
            ["Asia", "Growing presence in Asian markets with premium coffee and agricultural exports."]
          ]
            .map(
              (market) => `
            <article class="glass-card reveal">
              <h3>${market[0]}</h3>
              <p>${market[1]}</p>
            </article>
          `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

export function aboutHeroSection(): string {
  return `
    <section class="section about-hero auto-bg" data-image-base="pic">
      <span class="asset-placeholder-label section-placeholder">IMAGE PLACEHOLDER</span>
      <div class="container about-hero-content reveal">
        <h1>Built In Uganda, Trusted Across Global Markets</h1>
        <p>Triport Agro International Limited is an export-focused agribusiness connecting farmer communities to international buyers through high-quality produce, transparent sourcing, and dependable logistics.</p>
        <div class="about-hero-tags">
          <span>Farmer Partnerships</span>
          <span>Traceable Supply</span>
          <span>Export Compliance</span>
        </div>
      </div>
    </section>
  `;
}

export function aboutValuesSection(): string {
  const values = [
    [
      "Quality Without Compromise",
      "Every shipment is selected, graded, and packed to meet destination-market standards for freshness, consistency, and shelf life."
    ],
    [
      "Fair Trade Partnerships",
      "We work directly with organized farmer groups and pay transparently, helping create sustainable income opportunities in rural communities."
    ],
    [
      "Reliable Export Execution",
      "From documentation and certification to shipment coordination, our team manages end-to-end export workflows with clear communication."
    ]
  ];

  return `
    <section class="section about-values-wrap">
      <div class="container">
        <div class="section-head reveal">
          <h2>How We Create Value</h2>
          <p>Our operations are built around quality, fairness, and reliability for both farmers and international buyers.</p>
        </div>
        <div class="card-grid three about-values-grid">
          ${values
            .map(
              (item) => `
            <article class="about-value-card reveal">
              <h3>${item[0]}</h3>
              <p>${item[1]}</p>
            </article>
          `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

export function aboutSection(): string {
  return `
    <section class="section white-bg">
      <div class="container">
        <div class="section-head reveal">
          <h2>Your Trusted Ugandan Export Partner</h2>
          <p>Triport Agro International Limited connects organized farmer groups and global buyers through reliable sourcing, quality control, and export-ready logistics.</p>
        </div>
        <article class="about-panel reveal auto-bg" data-image-base="about-farm">
          <span class="asset-placeholder-label section-placeholder">IMAGE PLACEHOLDER</span>
          <div class="about-copy">
            <p>We build long-term partnerships with Ugandan farmers to source premium coffee, fresh fruits, vegetables, and dry commodities that meet international quality expectations.</p>
            <p>Our team manages selection, grading, packaging, and export documentation end-to-end so buyers receive consistent products, transparent communication, and dependable delivery windows.</p>
            <div class="about-highlights">
              <span>Farmer-First Sourcing</span>
              <span>Strict Quality Grading</span>
              <span>Export Documentation Support</span>
            </div>
            <a href="/quote" class="btn btn-primary">Request Quote</a>
          </div>
          <div class="metrics">
            <div><strong>500+</strong><span>Partner Farmers</span></div>
            <div><strong>15+</strong><span>Countries Served</span></div>
            <div><strong>3</strong><span>Continents</span></div>
            <div><strong>10+</strong><span>Export Products</span></div>
          </div>
        </article>
      </div>
    </section>
  `;
}

export function ctaSection(imageBase = "cta-texture"): string {
  return `
    <section class="section pale-band">
      <div class="container reveal">
        <article class="cta-panel auto-bg" data-image-base="${imageBase}">
          <span class="asset-placeholder-label section-placeholder">IMAGE PLACEHOLDER</span>
          <h2>Global Export Solutions</h2>
          <p>Serving international buyers across Europe, Middle East, and beyond with certified export-quality produce.</p>
          <div class="tag-row">
            <span>Certified Quality</span>
            <span>Fast Processing</span>
            <span>Global Delivery</span>
          </div>
          <a href="/quote" class="btn btn-light">Request Export Quote</a>
        </article>
      </div>
    </section>
  `;
}

export function proofStripSection(): string {
  return `
    <section class="section proof-strip-wrap">
      <div class="container">
        <div class="proof-strip reveal">
          <article class="proof-item">
            <strong>500+</strong>
            <span>Tons Exported Annually</span>
          </article>
          <article class="proof-item">
            <strong>15+</strong>
            <span>Countries Reached</span>
          </article>
          <article class="proof-item">
            <strong>100+</strong>
            <span>Satisfied Buyers</span>
          </article>
          <article class="proof-item">
            <strong>10+</strong>
            <span>Years Experience</span>
          </article>
        </div>
      </div>
    </section>
  `;
}

export function testimonialsSection(): string {
  const testimonials = [
    [
      "European Import Buyer",
      "Triport Agro International Limited has been our preferred coffee and produce supplier for three seasons. Quality consistency and communication are excellent."
    ],
    [
      "Retail Distributor, Gulf Region",
      "Documentation and shipment handling are always reliable. Their team understands export timelines and compliance requirements."
    ],
    [
      "Food Service Buyer, Asia",
      "Fresh produce quality is dependable and deliveries are on schedule. We value their transparent updates and responsive support."
    ]
  ];

  return `
    <section class="section testimonials-wrap" id="testimonials">
      <div class="container">
        <div class="section-head reveal">
          <h2>What Our Clients Say</h2>
          <p>Trusted by international buyers and local partners across global markets.</p>
        </div>
        <div class="testimonial-grid">
          ${testimonials
            .map(
              (entry) => `
            <article class="testimonial-card reveal">
              <div class="stars" aria-label="5 star rating">*****</div>
              <p class="testimonial-quote">"${entry[1]}"</p>
              <h3>${entry[0]}</h3>
            </article>
          `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

export function teamSection(): string {
  const members = teamMembers;

  return `
    <section class="section team-wrap">
      <div class="container">
        <div class="section-head reveal">
          <h2>Our Team</h2>
          <p>Experienced leaders at the intersection of agriculture, trade, law, and finance.</p>
        </div>
        <div class="team-grid">
          ${members
            .map(
              (m, i) => `
            <article class="team-card reveal" id="team-${m.slug}">
              <div class="team-photo-wrap">
                <img class="team-photo" src="${m.image}" alt="${m.name}" loading="lazy" decoding="async" onerror="this.style.display='none'" style="object-position:${m.imagePosition ?? "center"}" />
              </div>
              <a href="/team-${m.slug}" class="team-name-link">
                <h3 class="team-name">${m.name}</h3>
              </a>
              <span class="team-role">${m.role}</span>
              ${m.qualifications ? `<span class="team-quals"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg><span>${m.qualifications}</span></span>` : ""}
              <button type="button" class="team-link" data-team-index="${i}">View Full Profile <span aria-hidden="true">&rsaquo;</span></button>
            </article>
          `
            )
            .join("")}
        </div>
      </div>
    </section>
    <script type="application/json" id="teamData">${JSON.stringify(members.map(m => ({ slug: m.slug, name: m.name, role: m.role, qualifications: m.qualifications, image: m.image, imagePosition: m.imagePosition, bio: m.bio, responsibilities: m.responsibilities, quote: m.quote })))}</script>
  `;
}

export function teamModalMarkup(): string {
  return `
    <div class="team-modal-overlay" id="teamModal" aria-hidden="true">
      <div class="team-modal" role="dialog" aria-modal="true">
        <button class="team-modal-close" id="teamModalClose" type="button" aria-label="Close profile">&times;</button>
        <div class="team-modal-header">
          <div class="team-modal-photo-wrap">
            <img class="team-modal-photo" id="teamModalPhoto" src="" alt="" decoding="async" />
          </div>
          <div class="team-modal-info">
            <h3 class="team-modal-name" id="teamModalName"></h3>
            <span class="team-modal-role" id="teamModalRole"></span>
            <span class="team-modal-quals" id="teamModalQuals"></span>
          </div>
        </div>
        <div class="team-modal-body" id="teamModalBody"></div>
        <div class="team-modal-responsibilities">
          <h4><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> Key Responsibilities</h4>
          <ul id="teamModalResponsibilities"></ul>
        </div>
        <blockquote class="team-modal-quote" id="teamModalQuote"></blockquote>
      </div>
    </div>
  `;
}

export function faqSection(): string {
  const rows = [
    ["What are your minimum order quantities for export?", "Minimum order quantities vary by product and destination. Most export orders start from one consolidated container load."],
    ["Which countries do you export to?", "We export to markets in Europe, the Middle East, and Asia, with documentation prepared per destination requirements."],
    ["How long does shipping take?", "Lead times depend on product type and destination. Typical dispatch windows range from 7 to 21 days after order confirmation."],
    ["Do you provide quality certifications?", "Yes. We coordinate required certifications, phytosanitary documentation, and compliance paperwork for each shipment."]
  ];

  return `
    <section class="section faq-wrap">
      <div class="container">
        <div class="section-head reveal">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about ordering and exporting.</p>
        </div>
        <div class="faq-list">
          ${rows
            .map(
              (entry, i) => `
            <details class="faq-item reveal" ${i === 0 ? "open" : ""}>
              <summary>${entry[0]}</summary>
              <div class="faq-answer"><div class="faq-answer-inner"><p>${entry[1]}</p></div></div>
            </details>
          `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

export function quoteSection(): string {
  const broadProductGroups: Array<[string, string, string[]]> = [
    ["coffee", "Coffee", ["Arabica Coffee", "Robusta Coffee", "Specialty / Single Origin Coffee", "Green Coffee (Generic)"]],
    ["fruits", "Fresh Fruits", ["Avocados", "Mangoes", "Pineapples", "Bananas / Plantain", "Passion Fruit", "Jackfruit", "Papaya / Pawpaw", "Oranges", "Lemons / Limes", "Watermelon"]],
    ["grains", "Grains, Seeds & Legumes", ["Maize / Corn", "Sorghum", "Millet (Finger / Pearl)", "Sesame Seeds", "Beans / Pulses", "Groundnuts / Peanuts", "Cowpeas", "Soybeans", "Rice", "Wheat", "Barley", "Lentils", "Chia Seeds"]],
    ["spices", "Spices & Botanicals", ["Vanilla", "Ginger", "Turmeric", "Chilli Peppers", "Coriander Seeds", "Moringa", "Cardamom", "Black Pepper", "Cinnamon"]],
    ["oils", "Oils & Other", ["Shea Butter / Shea Nuts", "Sunflower Seeds / Oil", "Palm Oil (Crude)", "Cassava / Tapioca", "Sweet Potato", "Green Plantain", "Cocoa Beans", "Tea (Black / Green)", "Macadamia Nuts", "Cashew Nuts", "Other / Mixed"]]
  ];

  const broadProductOptions = broadProductGroups
    .map(
      ([category, group, items]) => `
        <optgroup label="${group}">
          ${items.map((item) => `<option value="${item.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}" data-grade-category="${category}">${item}</option>`).join("")}
        </optgroup>
      `
    )
    .join("");

  const broadGradeOptions = ["AA", "A", "AB", "PB", "Screen 18", "Screen 15", "FAQ", "Clean Cup", "Specialty Grade", "Grade 1", "Grade 2", "Premium", "Export Grade"]
    .map((item) => `<option value="${item.toLowerCase().replace(/\s+/g, "-")}">${item}</option>`)
    .join("");

  const countryOptions = [
    ["Uganda", "uganda"],
    ["Kenya", "kenya"],
    ["Tanzania", "tanzania"],
    ["Rwanda", "rwanda"],
    ["Burundi", "burundi"],
    ["Ethiopia", "ethiopia"],
    ["Zambia", "zambia"],
    ["Zimbabwe", "zimbabwe"],
    ["South Africa", "south-africa"],
    ["Nigeria", "nigeria"],
    ["Ghana", "ghana"],
    ["Senegal", "senegal"],
    ["Benin", "benin"],
    ["Togo", "togo"],
    ["Morocco", "morocco"],
    ["Egypt", "egypt"],
    ["Algeria", "algeria"],
    ["United Arab Emirates", "uae"],
    ["Saudi Arabia", "saudi-arabia"],
    ["Qatar", "qatar"],
    ["Kuwait", "kuwait"],
    ["Oman", "oman"],
    ["United Kingdom", "united-kingdom"],
    ["France", "france"],
    ["Germany", "germany"],
    ["Italy", "italy"],
    ["Netherlands", "netherlands"],
    ["Spain", "spain"],
    ["United States of America", "usa"],
    ["Canada", "canada"],
    ["Australia", "australia"],
    ["India", "india"],
    ["China", "china"],
    ["Japan", "japan"],
    ["South Korea", "south-korea"],
    ["Singapore", "singapore"],
    ["Malaysia", "malaysia"],
    ["Vietnam", "vietnam"],
    ["Turkey", "turkey"],
    ["Brazil", "brazil"],
    ["Mexico", "mexico"],
    ["Argentina", "argentina"]
  ]
    .map(([label, value]) => `<option value="${value}">${label}</option>`)
    .join("");

  const renderSelect = (id: string, name: string, label: string, gradeId: string, gradeName: string) => `
    <div class="product-picker">
      <label class="form-group">${label} *
        <select id="${id}" name="${name}" class="product-select" multiple required size="10">${broadProductOptions}</select>
      </label>
      <label class="form-group" id="${gradeId}-wrap" style="display:none;">Grade / Quality
        <select id="${gradeId}" name="${gradeName}" class="grade-select" multiple size="6">${broadGradeOptions}</select>
      </label>
    </div>
  `;

  return `
    <section class="section white-bg contact-system-section">
      <div class="container">
        <div class="section-head reveal">
          <h2>Get In Touch</h2>
          <p>Questions about our products or export process? Share your details and we will respond within one business day.</p>
        </div>
        <div class="contact-grid reveal">
          <div class="contact-form-wrapper">
            <form class="quote-form contact-system-form" id="quoteForm" novalidate>
              <div class="form-row">
                <label class="form-group">First Name *
                  <input type="text" name="firstName" placeholder="John" required />
                </label>
                <label class="form-group">Last Name *
                  <input type="text" name="lastName" placeholder="Smith" required />
                </label>
              </div>

              <div class="form-row">
                <label class="form-group">Email Address *
                  <input type="email" name="email" placeholder="john@yourcompany.com" required />
                </label>
                <label class="form-group">Phone / WhatsApp *
                  <input type="tel" name="phone" placeholder="+256 700 000000" required />
                </label>
              </div>

              <div class="form-row">
                <label class="form-group">Company / Organisation
                  <input type="text" name="company" placeholder="Your Company Ltd" />
                </label>
                <label class="form-group">Country *
                  <select id="country" name="country" required>
                    <option value="" selected>Where are you based?</option>
                    ${countryOptions}
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>

              <div class="form-group biz-type-group full">
                <label class="biz-type-label">What best describes you? *</label>
                <p class="biz-type-hint">We will tailor your enquiry fields to your business profile.</p>
                <div class="biz-type-grid" id="bizTypeGrid">
                  <label class="biz-card"><input type="radio" name="businessType" value="farmer" required /><span class="biz-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a7 7 0 0 1 7 7c0 4-3.5 8-7 11-3.5-3-7-7-7-11a7 7 0 0 1 7-7z"/><circle cx="12" cy="10" r="2.2"/></svg></span><span><span class="biz-card-title">Farmer / Producer</span><span class="biz-card-sub">I grow produce and want to supply Triport</span></span></label>
                  <label class="biz-card"><input type="radio" name="businessType" value="cooperative" /><span class="biz-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3 20c0-3.3 2.9-6 6.5-6S16 16.7 16 20"/><path d="M20 20c0-2.2-1.3-4-3.2-5"/></svg></span><span><span class="biz-card-title">Farming Cooperative</span><span class="biz-card-sub">Group of farmers seeking an export partner</span></span></label>
                  <label class="biz-card"><input type="radio" name="businessType" value="wholesale" /><span class="biz-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M12 12v4"/><path d="M10 14h4"/></svg></span><span><span class="biz-card-title">Wholesale / Distributor</span><span class="biz-card-sub">Bulk buyer distributing to other businesses</span></span></label>
                  <label class="biz-card"><input type="radio" name="businessType" value="importer" /><span class="biz-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/><path d="M4 20h16"/></svg></span><span><span class="biz-card-title">Import Buyer</span><span class="biz-card-sub">Buying produce directly for operations</span></span></label>
                  <label class="biz-card"><input type="radio" name="businessType" value="exporter" /><span class="biz-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/><path d="M4 4h16"/></svg></span><span><span class="biz-card-title">International Exporter</span><span class="biz-card-sub">Moving produce to international markets</span></span></label>
                  <label class="biz-card"><input type="radio" name="businessType" value="retailer" /><span class="biz-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M8 10a4 4 0 0 0 8 0"/></svg></span><span><span class="biz-card-title">Retailer / Food Service</span><span class="biz-card-sub">Supermarket, restaurant, hotel, catering</span></span></label>
                  <label class="biz-card"><input type="radio" name="businessType" value="manufacturer" /><span class="biz-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20V11l5-3v3l5-3v3l5-3v12z"/></svg></span><span><span class="biz-card-title">Food Manufacturer</span><span class="biz-card-sub">Processing raw agricultural products</span></span></label>
                  <label class="biz-card"><input type="radio" name="businessType" value="trader" /><span class="biz-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v4H4z"/><path d="M4 10h16v4H4z"/><path d="M4 16h16v4H4z"/></svg></span><span><span class="biz-card-title">Commodity Trader / Broker</span><span class="biz-card-sub">Trading agricultural commodities on markets</span></span></label>
                  <label class="biz-card"><input type="radio" name="businessType" value="logistics" /><span class="biz-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span><span><span class="biz-card-title">Freight / Logistics</span><span class="biz-card-sub">Looking to partner on shipping and logistics</span></span></label>
                  <label class="biz-card"><input type="radio" name="businessType" value="other" /><span class="biz-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2.5 2.5"/></svg></span><span><span class="biz-card-title">Other / General</span><span class="biz-card-sub">Something else - just get in touch</span></span></label>
                </div>
                <p class="multi-select-hint">Hold Ctrl on Windows or Cmd on Mac to select more than one product or grade.</p>
              </div>

              <div id="fields-farmer" class="conditional-fields full" style="display:none;">
                <div class="conditional-header"><span>Tell us about your farm</span></div>
                ${renderSelect("f-product", "farmerProduct", "Primary Crop", "f-grade", "farmerGrade")}
                <div class="form-row">
                  <label class="form-group">Farm Size *<input type="text" name="farmSize" placeholder="e.g. 10 hectares" required /></label>
                  <label class="form-group">Years Farming *<input type="number" name="farmYears" min="0" placeholder="e.g. 8" required /></label>
                </div>
              </div>

              <div id="fields-cooperative" class="conditional-fields full" style="display:none;">
                <div class="conditional-header"><span>Tell us about your cooperative</span></div>
                <div class="form-row">
                  <label class="form-group">Farmers in Cooperative *<input type="text" name="coopMembers" placeholder="e.g. 120" required /></label>
                  <label class="form-group">Total Land<input type="text" name="coopLand" placeholder="e.g. 500 hectares" /></label>
                </div>
                ${renderSelect("c-product", "coopProduct", "Primary Produce", "c-grade", "coopGrade")}
              </div>

              <div id="fields-wholesale" class="conditional-fields full" style="display:none;">
                <div class="conditional-header"><span>Your wholesale requirements</span></div>
                ${renderSelect("w-product", "wholesaleProduct", "Product of Interest", "w-grade", "wholesaleGrade")}
                <div class="form-row">
                  <label class="form-group">Monthly Volume *<input type="text" name="wholesaleVolume" placeholder="e.g. 5 tonnes / month" required /></label>
                  <label class="form-group">Order Frequency
                    <select name="wholesaleFrequency">
                      <option value="">Select...</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </label>
                </div>
              </div>

              <div id="fields-importer" class="conditional-fields full" style="display:none;">
                <div class="conditional-header"><span>Your import requirements</span></div>
                ${renderSelect("i-product", "importProduct", "Product Required", "i-grade", "importGrade")}
                <div class="form-row">
                  <label class="form-group">Order Volume *<input type="text" name="importVolume" placeholder="e.g. 1 x 40ft / month" required /></label>
                </div>
              </div>

              <div id="fields-exporter" class="conditional-fields full" style="display:none;">
                <div class="conditional-header"><span>Your export requirements</span></div>
                ${renderSelect("ex-product", "exportProduct", "Product to Source", "ex-grade", "exportGrade")}
                <div class="form-row">
                  <label class="form-group">Destination Markets *<input type="text" name="exportDestination" placeholder="e.g. Germany, UAE" required /></label>
                </div>
              </div>

              <div id="fields-retailer" class="conditional-fields full" style="display:none;">
                <div class="conditional-header"><span>Your retail / food service needs</span></div>
                <div class="form-row">
                  <label class="form-group">Business Type *
                    <select name="retailType" required>
                      <option value="">Select...</option>
                      <option value="supermarket">Supermarket / Grocery</option>
                      <option value="restaurant">Restaurant / Cafe</option>
                      <option value="hotel">Hotel / Hospitality</option>
                      <option value="online">Online Food Retail</option>
                    </select>
                  </label>
                  <label class="form-group">Locations<input type="text" name="retailLocations" placeholder="e.g. 12 stores" /></label>
                </div>
                ${renderSelect("r-product", "retailProduct", "Product of Interest", "r-grade", "retailGrade")}
              </div>

              <div id="fields-manufacturer" class="conditional-fields full" style="display:none;">
                <div class="conditional-header"><span>Your raw material requirements</span></div>
                <div class="form-row">
                  <label class="form-group">What do you manufacture? *
                    <select name="mfrProduct" required>
                      <option value="">Select...</option>
                      <option value="roasted-coffee">Roasted / Ground Coffee</option>
                      <option value="fruit-juice">Fruit Juice / Concentrate</option>
                      <option value="flour-starch">Flour / Starch Products</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                  <label class="form-group">Monthly Requirement<input type="text" name="mfrVolume" placeholder="e.g. 20 tonnes / month" /></label>
                </div>
                ${renderSelect("m-product", "mfrRawMaterial", "Raw Material", "m-grade", "mfrGrade")}
              </div>

              <div id="fields-trader" class="conditional-fields full" style="display:none;">
                <div class="conditional-header"><span>Your trading profile</span></div>
                ${renderSelect("t-product", "traderProduct", "Commodity", "t-grade", "traderGrade")}
                <div class="form-row">
                  <label class="form-group">Markets<input type="text" name="traderMarkets" placeholder="e.g. EU, East Africa" /></label>
                  <label class="form-group">Price Terms
                    <select name="traderTerms">
                      <option value="">Select...</option>
                      <option value="fob">FOB</option>
                      <option value="cif">CIF</option>
                      <option value="spot">Spot</option>
                    </select>
                  </label>
                </div>
              </div>

              <div id="fields-logistics" class="conditional-fields full" style="display:none;">
                <div class="conditional-header"><span>Logistics partnership details</span></div>
                <div class="form-row">
                  <label class="form-group">Services Offered *<input type="text" name="logisticsServices" placeholder="e.g. FCL, customs clearance" required /></label>
                  <label class="form-group">Routes Covered<input type="text" name="logisticsRoutes" placeholder="e.g. Mombasa to Rotterdam" /></label>
                </div>
              </div>

              <div id="fields-other" class="conditional-fields full" style="display:none;">
                <div class="conditional-header"><span>Your enquiry</span></div>
                <label class="form-group">How can we help? *
                  <textarea name="otherEnquiry" rows="5" placeholder="Tell us about your enquiry" required></textarea>
                </label>
              </div>

              <div id="commonFields" class="full" style="display:none;">
                <div class="form-row">
                  <label class="form-group">Timeline *
                    <select name="timeline" required>
                      <option value="">When do you need this?</option>
                      <option value="urgent">Urgent (within 2 weeks)</option>
                      <option value="1-2mo">1-2 months</option>
                      <option value="2-6mo">2-6 months</option>
                      <option value="longterm">Long term / ongoing</option>
                    </select>
                  </label>
                  <label class="form-group" id="budgetGroup" style="display:none;">Estimated Budget
                    <select name="budget">
                      <option value="">Select range...</option>
                      <option value="under-5k">Under GBP 5,000</option>
                      <option value="5k-20k">GBP 5,000 - GBP 20,000</option>
                      <option value="20k-50k">GBP 20,000 - GBP 50,000</option>
                      <option value="over-50k">Over GBP 50,000</option>
                    </select>
                  </label>
                </div>
                <label class="form-group">Anything else we should know? *
                  <textarea name="message" rows="4" placeholder="Add any extra context or requirements" required></textarea>
                </label>
              </div>

              <p id="quoteFormStatus" class="quote-form-status" role="status" aria-live="polite"></p>

              <button type="submit" class="btn btn-primary full" id="quoteSubmitBtn">Send Enquiry</button>
            </form>
          </div>

          <aside class="contact-info-panel">
            <span class="section-label contact-panel-label">Our Details</span>
            <img src="/logo-tripport.png" alt="Triport Agro International Limited" class="contact-panel-logo" loading="lazy" decoding="async" />
            <h3>Triport Agro International Limited</h3>
            <p>Uganda-based exporters of premium specialty and commercial coffee, serving importers and roasters worldwide.</p>
            <div class="contact-info-list">
              <div class="contact-info-item">
                <div class="contact-info-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>
                <div><h4>Office Location</h4><p>Uganda<br />(Registered Office - Details available on request)</p></div>
              </div>
              <div class="contact-info-item">
                <div class="contact-info-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></div>
                <div><h4>Email</h4><p>triportago@gmail.com</p></div>
              </div>
              <div class="contact-info-item">
                <div class="contact-info-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
                <div><h4>Phone / WhatsApp</h4><p>+256 780 391916</p></div>
              </div>
              <div class="contact-info-item">
                <div class="contact-info-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div>
                <div><h4>Business Hours</h4><p>Monday - Friday: 9:00am - 5:30pm (EAT)</p></div>
              </div>
            </div>
            <div class="contact-faq-mini">
              <h4>East Africa Operations</h4>
              <div class="contact-info-item east-africa-card">
                <div class="contact-info-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a14.5 14.5 0 0 0 0 18a14.5 14.5 0 0 0 0-18"/><path d="M3 12h18"/></svg></div>
                <div><h4>Head Office</h4><p>Sourcing &amp; Operations Team<br />Uganda, East Africa<br />(Available for inquiries)</p></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  `;
}
