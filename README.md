# Prima - Modern Next.js Dashboard

A modern, responsive dashboard application built with Next.js, TypeScript, TailwindCSS, and Shadcn UI components. Prima features a beautiful and intuitive interface with a collapsible sidebar, dark mode support, and a comprehensive navigation system.

## Features

- 🎨 **Modern UI/UX**
  - Clean and intuitive interface
  - Responsive design that works on all devices
  - Dark/Light mode support
  - Beautiful animations and transitions

- 📱 **Responsive Layout**
  - Collapsible sidebar with mobile support
  - Adaptive grid layouts
  - Mobile-first approach

- 🔍 **Smart Navigation**
  - Recently used items tracking
  - Search functionality
  - Collapsible menu items
  - Breadcrumb navigation

- 🎯 **User Experience**
  - Keyboard shortcuts
  - Tooltips for better accessibility
  - Smooth transitions
  - Intuitive navigation

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide Icons
- **Fonts**: Geist (Sans & Mono)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/next-js-shadcn-ui.git
cd next-js-shadcn-ui
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── ui/               # UI components
│   └── dashboard/        # Dashboard components
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
└── public/               # Static assets
```

## Features in Detail

### Sidebar Navigation

- Collapsible sidebar with mobile support
- Recently used items tracking (limited to 5 items)
- Search functionality for navigation items
- Submenu support with collapsible sections
- Keyboard shortcuts for navigation

### Theme Support

- System theme detection
- Manual theme switching
- Smooth theme transitions
- Persistent theme preference

### Layout Components

- Responsive top bar
- Breadcrumb navigation
- Flexible content area
- Footer with version information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Geist Font](https://vercel.com/font) 
