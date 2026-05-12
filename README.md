
# 🐄 BovIntelligence AI - Advanced Bovine Intelligence Platform

> **Professional AI-powered cattle breed classification, genomic analysis, and livestock health management system**

BovIntelligence AI leverages cutting-edge Generative AI and computer vision to provide farmers, veterinarians, and livestock managers with elite-level diagnostics and breeding insights. Built with production-grade architecture, this platform combines morphological analysis, genomic intelligence, and automated expert protocols for comprehensive herd management.

---

## ✨ Core Features

### 🔬 **Genomic Vision**
- High-precision breed identification from single images
- AI-powered visual analysis using Gemini 2.5 Flash vision capabilities
- Confidence scoring and phenotypic marker detection
- Support for Cattle and Buffalo species classification

### 📊 **Morphological Analysis**
- **Cranial Assessment**: Ear shape, horn characteristics, forehead profile
- **Thoracic Evaluation**: Hump conformation, dewlap structure, neck musculature
- **Body Frame**: Topline analysis, coat texture, limb conformation, tail characteristics

### 🧬 **Expert Protocol Generation**
- Automated AI-generated livestock management guides
- Breed-specific nutrition protocols with vitamin/supplement recommendations
- Clinical health management including vaccination schedules and disease prevention
- 20-25 sentence professional clinical guidelines per breed

### 💾 **Secure Ledger (Smart Caching)**
- Persistent local storage vault for herd records
- Zero cloud dependency - all data remains on-device
- Automatic caching to prevent redundant API calls
- Browse complete scan history with timestamp tracking

### 📄 **Professional Export**
- Multi-format report generation (PDF, JSON, Clipboard)
- Publication-ready formatting for veterinary documentation
- Detailed phenotypic evidence markers
- Complete trait analysis and care protocols in one document

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API Key ([Get one here](https://ai.google.dev))

### Installation

1. **Clone & Install**:
   ```bash
   git clone https://github.com/soumyajitsarkar785/BovIntelligence-AI.git
   cd BovIntelligence-AI
   npm install
   ```

2. **Configure Environment**:
   Create `.env.local` in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:9002](http://localhost:9002) in your browser

4. **(Optional) Start Genkit AI Dashboard**:
   ```bash
   npm run genkit:dev
   ```
   Genkit dashboard available at [http://localhost:4000](http://localhost:4000)

---

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start Next.js dev server (port 9002)
npm run genkit:dev      # Start Genkit AI engine with dashboard
npm run genkit:watch    # Watch mode for Genkit flows

# Production
npm run build           # Create production build
npm start              # Run production server

# Quality Assurance
npm run lint           # Run ESLint
npm run typecheck      # TypeScript type checking
```

---

## 🏗️ Technical Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | Next.js 15 with TypeScript |
| **Runtime** | React 19 with Client/Server Components |
| **AI Engine** | Google Genkit v1.28 + Gemini 2.5 Flash |
| **UI Framework** | Tailwind CSS 4 + ShadCN UI Components |
| **Forms** | React Hook Form + Zod Validation |
| **State Management** | React Hooks + Browser localStorage |
| **Export** | html2canvas + jsPDF |
| **Icons** | Lucide React (475+ icons) |
| **Charts** | Recharts for data visualization |

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with theme
│   ├── page.tsx                 # Main classifier interface
│   └── globals.css              # Global styles
├── ai/                          # AI & ML Logic
│   ├── genkit.ts               # Genkit configuration
│   ├── flows/                  # AI workflows
│   │   ├── bovine-master-flow.ts      # Core classification flow
│   │   ├── classify-bovine-breed.ts   # Breed identification
│   │   ├── profile-bovine-traits-flow.ts # Trait profiling
│   │   └── generate-bovine-care-guide.ts # Care guide generation
│   └── dev.ts                  # Development setup
├── components/                  # React Components
│   ├── AnalysisView.tsx        # Breed analysis display
│   ├── ScanLedger.tsx          # History ledger UI
│   ├── ScanOverlay.tsx         # Camera/upload overlay
│   └── ui/                     # ShadCN UI components
├── lib/                        # Utilities
│   ├── storage.ts             # localStorage management
│   ├── utils.ts               # Helper functions
│   └── placeholder-images.ts  # Demo images
└── hooks/                     # React Hooks
    ├── use-mobile.tsx         # Mobile detection
    └── use-toast.ts           # Toast notifications
```

---

## 🔄 How It Works

### AI Flow Architecture
```
1. User uploads bovine image
   ↓
2. Image converted to data URI
   ↓
3. Sent to Genkit Flow with context
   ↓
4. Gemini AI analyzes morphology (45+ trait markers)
   ↓
5. AI generates comprehensive report with:
   - Breed identification (confidence %)
   - Physiological analysis (cranial, thoracic, body)
   - Genetic trait profiling
   - Care protocols (nutrition & health)
   ↓
6. Results cached in localStorage (smart learning)
   ↓
7. User can export as PDF/JSON or copy to clipboard
```

### Smart Caching System
- All scan results stored in browser's localStorage
- Identical images trigger cached results (no API call)
- Full audit trail with timestamps
- Option to delete individual scans or clear vault

---

## 📦 Key Dependencies

```json
{
  "genkit": "^1.28.0",
  "@genkit-ai/google-genai": "^1.28.0",
  "next": "^15.5.9",
  "react": "^19.2.1",
  "tailwindcss": "^4.0.0",
  "zod": "^3.24.2",
  "recharts": "^2.15.1",
  "html2canvas": "^1.4.1",
  "jspdf": "^2.5.2"
}
```

---

## 🎯 Use Cases

- ✅ **Veterinary Clinics**: Automated breed documentation and health protocols
- ✅ **Dairy Farms**: Genetic trait analysis for breeding decisions
- ✅ **Livestock Auctions**: Quick breed verification and pricing guides
- ✅ **Research Institutions**: Phenotypic data collection and documentation
- ✅ **Agricultural Extension**: Farmer education on breed characteristics

---

## 🔒 Privacy & Security

- ✔️ **Zero Cloud Dependency**: All data processed locally
- ✔️ **No Persistent Storage**: Results stored only in browser cache
- ✔️ **GDPR Compliant**: No user tracking or analytics
- ✔️ **Open Source**: Full code transparency

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/soumyajitsarkar785/BovIntelligence-AI/issues)
- **Author**: [Soumyajit Sarkar](https://github.com/soumyajitsarkar785)
- **API Docs**: [Google Genkit Documentation](https://genkit.dev)

---

## 🙏 Acknowledgments

- **Google Genkit** - AI framework and utilities
- **Gemini 2.5 Flash** - Vision and language model
- **ShadCN UI** - Premium component library
- **Next.js Team** - Modern web framework

---

**Last Updated**: May 2026 | **Version**: 1.0.0
