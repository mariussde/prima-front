# Prima Frontend

A modern, comprehensive dashboard application built with Next.js, TypeScript, and TailwindCSS for managing business entities like carriers, clients, and agents.

## Features

- 🔐 **Authentication & Authorization**
  - Secure login system
  - Role-based access control
  - Protected routes

- 📊 **Data Management**
  - Complete CRUD operations
  - Real-time data filtering
  - Advanced sorting capabilities
  - Infinite scrolling with pagination

- 🎨 **Modern UI/UX**
  - Responsive design
  - Dark/Light mode support
  - Toast notifications
  - Loading states
  - Form validation

- 🛠 **Developer Experience**
  - TypeScript for type safety
  - ESLint & Prettier for code quality
  - Comprehensive documentation
  - Modular architecture

## Tech Stack

- **Framework:** [Next.js 13+](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [TailwindCSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/prima-front.git
cd prima-front
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_AUTH_URL=your_auth_url
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
prima-front/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── general-settings/  # Feature pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
├── types/                # TypeScript definitions
├── hooks/                # Custom React hooks
├── styles/               # Global styles
└── public/              # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier
- `npm run type-check` - Run TypeScript compiler

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Documentation

For detailed documentation, please refer to:
- [Project Documentation](docs/PROJECT.md)
- [API Documentation](docs/API.md)
- [Component Documentation](docs/COMPONENTS.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please:
- Open an issue in the GitHub repository
- Contact the development team
- Check the documentation

---

Built with ❤️ by the Prima Team 
