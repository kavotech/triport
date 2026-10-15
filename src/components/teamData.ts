export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  qualifications: string;
  image: string;
  imagePosition?: string;
  bio: string;
  responsibilities: string[];
  quote: string;
}

export const teamMembers: TeamMember[] = [
  {
    slug: "micah",
    name: "Micah Bamutura",
    role: "Managing Director & Founder",
    qualifications: "B. Economics and Management, Uganda Christian University",
    image: "/team-micah.png",
    imagePosition: "center top",
    bio: `Micah Bamutura is the visionary founder of Triport Agro International Limited, bringing deep expertise in economics and agricultural trade. He leads the company's strategy to connect Ugandan farmers with premium international markets, ensuring sustainable growth and fair trade practices.

Under his leadership, Triport Agro has expanded its export footprint across Europe, the Middle East, and Asia, building trusted partnerships with buyers and farming communities alike.`,
    responsibilities: [
      "Defines and drives the overall company vision, mission, and long-term strategy",
      "Oversees all export operations, trade partnerships, and market expansion",
      "Builds and maintains relationships with international buyers and trade bodies"
    ],
    quote: "Managing Director accountable for the strategic direction, growth, and operational excellence of Triport Agro International Limited."
  },
  {
    slug: "kaboyo",
    name: "Ronald Kaboyo Hamfrey",
    role: "Sales Team Lead",
    qualifications: "B. Social Work and Social Administration, Uganda Christian University",
    image: "/team-kaboyo.png",
    bio: `Ronald Kaboyo Hamfrey leads the sales operations at Triport Agro, leveraging his background in social work and administration to build strong, people-centred client relationships. His approach combines market insight with community engagement to drive consistent revenue growth.

He coordinates the sales team's efforts across multiple product lines and export destinations, ensuring targets are met while maintaining the company's commitment to quality service.`,
    responsibilities: [
      "Leads the sales team to achieve quarterly and annual revenue targets",
      "Develops and manages client relationships across export markets",
      "Coordinates product pricing, quotations, and order fulfilment processes"
    ],
    quote: "Sales Team Lead responsible for driving revenue growth and building lasting client partnerships across international markets."
  },
  {
    slug: "matthew",
    name: "Matthew Atuhairwe",
    role: "Operations Manager",
    qualifications: "B.Agricultural Studies",
    image: "/team-matthew.png",
    bio: `Matthew Atuhairwe manages the full operations pipeline at Triport Agro, from farm-level sourcing through to export logistics. His agricultural studies background gives him a deep understanding of produce quality, seasonal cycles, and supply chain management.

He ensures that every shipment meets international standards by overseeing quality control, packaging, documentation, and cold chain logistics.`,
    responsibilities: [
      "Manages end-to-end export operations including sourcing, quality control, and logistics",
      "Coordinates with farming partners to ensure consistent supply and quality standards",
      "Oversees packaging, documentation, and compliance for international shipments"
    ],
    quote: "Operations Manager accountable for ensuring seamless product flow from Ugandan farms to international buyers with full quality assurance."
  },
  {
    slug: "norah",
    name: "Norah Amanya",
    role: "Legal Administrator",
    qualifications: "LLM Oil and Gas Law, University of Aberdeen; LLB (Hons), Uganda Christian University",
    image: "/team-norah.png",
    imagePosition: "center 8%",
    bio: `Norah Amanya is an Advocate of the High Court of Uganda and serves as Legal Administrator at Triport Agro International Limited. She brings 11 years of experience across private practice and in-house leadership, including her role as General Counsel at CITI Global and as Senior Associate at Cristal Advocates and ABMAK Associates. She is also a Partner at <a href="https://www.moonstoneadvocates.com/team/norah-amanya/" target="_blank" rel="noopener" class="team-modal-link">Moonstone Advocates</a>.

She holds a Master of Laws (LLM) in Oil and Gas Law from the University of Aberdeen, a Bachelor of Laws (LLB Hons) from Uganda Christian University, a Postgraduate Diploma in Legal Practice from the Law Development Centre, and a Postgraduate Diploma in Tax and Revenue Administration. She is a member of the Uganda Law Society, the East African Law Society, the Association of International Energy Negotiators and the Institute for African Women in Law.`,
    responsibilities: [
      "Oversees contracts, trade agreements, and legal documentation for export transactions",
      "Advises on corporate governance, regulatory compliance, and legal risk management",
      "Supports tax, licensing, and cross-border compliance requirements for international shipments"
    ],
    quote: "Legal Administrator safeguarding Triport Agro's contracts, compliance, and governance as the company grows across international markets."
  },
  {
    slug: "oliver",
    name: "Oliver Alinaitwe",
    role: "Strategic Partner",
    qualifications: "",
    image: "/team-oliver.png",
    bio: `Oliver Alinaitwe is a Strategic Partner at Triport Agro International Limited and the founder of <a href="https://www.axisagro.co.uk" target="_blank" rel="noopener" class="team-modal-link">Axis Agro International Limited</a>, a UK-based import and export company that supplies businesses and traders globally.

Through Axis Agro International Limited, Oliver leverages global supply networks while Triport Agro supplies and sources quality agricultural products for these partners, strengthening international trade relationships and market access.`,
    responsibilities: [
      "Builds strategic partnerships with buyers, importers, and trade partners",
      "Supports UK market access and international export opportunities",
      "Connects Triport Agro with commercial networks through Axis Agro International Limited"
    ],
    quote: "Strategic Partner supporting Triport Agro's international trade relationships and market growth through Axis Agro International Limited."
  }
];
