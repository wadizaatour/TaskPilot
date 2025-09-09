# TaskPilot 🚀

> A smart task management application with gamification features to boost your productivity!

[![Live Demo](https://img.shields.io/badge/Live%20Demo-taskspilot.netlify.app-blue?style=for-the-badge&logo=netlify)](https://taskspilot.netlify.app/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)](https://taskspilot.netlify.app/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#license)

TaskPilot transforms task management into an engaging experience with gamification elements including points, streaks, badges, and level progression. Built with modern web technologies for a smooth and responsive user experience.

## 🌟 Live Demo

**🔗 [Try TaskPilot Now](https://taskspilot.netlify.app/)**

Experience all features live without any setup required!

## ✨ Features

### 📋 Smart Task Management
- Create, organize, and track your daily tasks
- Categorize tasks with custom icons and colors
- Set due dates and priority levels
- Mark tasks as done, missed, or pending

### 🎮 Gamification System
- **Points System**: Earn points for completing tasks
- **Streak Tracking**: Maintain daily completion streaks
- **Badge System**: Unlock achievements for milestones
- **Level Progression**: Advance through experience levels
- **Weekly Goals**: Set and track category-specific targets

### 📊 Analytics & Insights
- Visual progress tracking dashboard
- Task completion statistics
- Category performance insights
- Weekly and daily trend analysis
- Streak and achievement history

### 💫 User Experience
- **Responsive Design**: Optimized for desktop and mobile
- **Dark/Light Theme**: Customizable appearance
- **Local Storage**: Data persists in your browser
- **Offline Ready**: Works without internet connection
- **Fast Performance**: Built with modern web standards

## 🛠️ Tech Stack

- **Framework**: Nuxt 3 (Vue 3)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Testing**: Vitest + Vue Testing Library
- **Build Tool**: Vite
- **Deployment**: Netlify
- **Icons**: Heroicons / Emoji

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** 18.x or higher
- **npm** 9.x or higher (or yarn/pnpm)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/wadizaatour/TaskPilot.git
   cd TaskPilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Visit `http://localhost:3000` to see TaskPilot in action!

## 📋 Available Scripts

### Development
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run generate     # Generate static site
```

### Testing
```bash
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with Vitest UI
npm run test:coverage # Generate test coverage report
```

### Code Quality
```bash
npm run lint         # Run ESLint (if configured)
npm run type-check   # Run TypeScript type checking
```

## 🏗️ Project Structure

```
TaskPilot/
├── 📁 assets/               # Static assets
│   └── css/
│       └── tailwind.css     # Tailwind CSS styles
├── 📁 components/           # Vue components
│   ├── BadgeCard.vue        # Achievement badges display
│   ├── Dashboard.vue        # Main dashboard
│   ├── GamificationWidget.vue # Points and levels
│   ├── TaskCard.vue         # Individual task component
│   └── TaskList.vue         # Task list container
├── 📁 composables/          # Vue composables
│   └── useGamification.ts   # Gamification logic
├── 📁 pages/                # Nuxt pages (auto-routing)
│   ├── index.vue            # Home/Dashboard page
│   ├── tasks.vue            # Tasks management page
│   ├── add.vue              # Add new task page
│   ├── analytics.vue        # Analytics page
│   └── profile.vue          # User profile settings
├── 📁 stores/               # Pinia stores
│   └── task.ts              # Main task store
├── 📁 tests/                # Test files
│   ├── components/          # Component tests
│   ├── composables/         # Composable tests
│   └── setup.ts             # Test configuration
├── 📁 types/                # TypeScript definitions
├── netlify.toml             # Netlify deployment config
├── nuxt.config.ts           # Nuxt configuration
├── tailwind.config.js       # Tailwind CSS config
├── vitest.config.ts         # Vitest configuration
└── package.json             # Dependencies and scripts
```

## 🎯 Key Features Deep Dive

### Task Management
- **Smart Categories**: 10 pre-configured categories with custom icons
- **Flexible Scheduling**: Set tasks for any date
- **Status Tracking**: Pending, Done, Missed states
- **Smart Suggestions**: AI-powered task recommendations
- **Bulk Operations**: Mark multiple tasks at once

### Gamification Elements
- **Point System**: Different point values based on task complexity
- **Streak Rewards**: Bonus points for consecutive days
- **Achievement Badges**: 15+ unique badges to unlock
- **Level System**: Visual progression with level milestones
- **Weekly Challenges**: Category-specific goals

### Data & Analytics
- **Progress Visualization**: Charts and graphs
- **Productivity Metrics**: Completion rates and trends
- **Category Analysis**: Performance by task type
- **Export Functionality**: Download your data
- **Import/Restore**: Backup and restore capabilities

## 🧪 Testing

TaskPilot includes comprehensive test coverage:

```bash
# Run all tests
npm run test

# Run specific test file
npm run test TaskCard.test.ts

# Generate coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Coverage
- ✅ **Components**: All UI components tested
- ✅ **Composables**: Business logic validated
- ✅ **Store**: State management tested
- ✅ **User Interactions**: Click events and form handling
- ✅ **Data Persistence**: LocalStorage functionality

## 🌐 Deployment

TaskPilot is optimized for Netlify deployment and includes automatic deployment configuration.

### Deploy Your Own Instance

1. **Fork this repository**
2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Import from GitHub
   - Select your forked repository
3. **Deploy automatically**
   - Build command: `npm run build`
   - Publish directory: `.output/public`

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy to Netlify (with CLI)
npm install -g netlify-cli
netlify deploy --prod --dir=.output/public
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔧 Configuration

### Environment Variables
Create a `.env` file for local development:
```env
# Optional: Analytics tracking
NUXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Optional: Custom app name
NUXT_PUBLIC_APP_NAME=TaskPilot
```

### Customization
- **Colors**: Edit `tailwind.config.js` for custom color schemes
- **Categories**: Modify default categories in `stores/task.ts`
- **Badges**: Add new achievements in the badges configuration
- **Points**: Adjust point values for different actions

## 📱 Browser Support

TaskPilot supports all modern browsers:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run test
   npm run build
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines
- Write tests for new features
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure accessibility compliance
- Test on mobile devices

## 🐛 Troubleshooting

### Common Issues

**Build fails with dependency errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Tests not running**
```bash
# Ensure test dependencies are installed
npm install --save-dev
npm run test
```

**Local storage not working**
- Ensure you're running on `http://localhost:3000` not file://
- Check browser privacy settings
- Clear browser cache and try again

### Getting Help
- 📚 Check the [documentation](https://taskspilot.netlify.app/)
- 🐛 [Report bugs](https://github.com/wadizaatour/TaskPilot/issues)
- 💬 [Ask questions](https://github.com/wadizaatour/TaskPilot/discussions)

## 📈 Roadmap

### Upcoming Features
- [ ] **Cloud Sync**: Sync data across devices
- [ ] **Team Collaboration**: Share tasks with others
- [ ] **Mobile App**: Native iOS/Android apps
- [ ] **Advanced Analytics**: More detailed insights
- [ ] **API Integration**: Connect with external services
- [ ] **Custom Themes**: More appearance options

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Enhanced gamification system
- **v1.2.0** - Analytics dashboard improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Framework**: Built with [Nuxt 3](https://nuxt.com/)
- **Styling**: Powered by [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Heroicons](https://heroicons.com/) and emoji
- **Testing**: [Vitest](https://vitest.dev/) and [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)
- **Deployment**: Hosted on [Netlify](https://netlify.com/)

## 🌟 Star History

If you find TaskPilot helpful, please consider giving it a star on GitHub!

[![Star History Chart](https://api.star-history.com/svg?repos=wadizaatour/TaskPilot&type=Timeline)](https://star-history.com/#wadizaatour/TaskPilot&Timeline)

---

<div align="center">

**[🚀 Try TaskPilot Now](https://taskspilot.netlify.app/)** • 
**[📖 Documentation](https://taskspilot.netlify.app/)** • 
**[🐛 Report Bug](https://github.com/wadizaatour/TaskPilot/issues)** • 
**[✨ Request Feature](https://github.com/wadizaatour/TaskPilot/issues)**

Made with ❤️ by [Wadi Zaatour](https://github.com/wadizaatour)

</div>
