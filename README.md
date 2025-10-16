# 🎮 Interactive Multiplication Tables

[![Angular](https://img.shields.io/badge/Angular-19.1.0-red?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?logo=github)](https://camilagksantos.github.io/tabuada-interativa/)

> Educational and gamified web application for practicing multiplication tables, built with Angular 19 and standalone components architecture.

## 🚀 [Live Demo](https://camilagksantos.github.io/tabuada-interativa/)

---

## 📋 About The Project

**Interactive Multiplication Tables** is an educational application designed for children who want to practice multiplication in a fun and interactive way. With a colorful interface, engaging animations, and detailed statistics system, the app makes learning more efficient and motivating.

### ✨ Key Features

- 🎯 **10-question game** with touch-friendly numeric keypad
- 📊 **Complete statistics system** with per-player and per-table analysis
- 🎨 **Animated visual feedback** (confetti for correct answers, explanatory modal for errors)
- 💾 **Data persistence** with LocalStorage
- 📱 **Mobile-first responsive design**
- 🔍 **Advanced filters** by period and player
- 📈 **Performance metrics dashboard**
- 🏆 **Weakness identification** (most difficult questions)

---

## 🛠️ Technologies Used

### **Frontend**
- ![Angular](https://img.shields.io/badge/Angular-19.1.0-DD0031?logo=angular&logoColor=white) - Main framework
- ![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?logo=typescript&logoColor=white) - Programming language
- ![SCSS](https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white) - CSS preprocessor
- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) - Semantic structure

### **Architecture and Patterns**
- ✅ **Standalone Components** (Angular 14+)
- 🔄 **Services** for shared business logic
- 📦 **TypeScript Interfaces** for type safety
- 🎯 **Reactive Programming** with RxJS (implicit in Angular)
- 🗂️ **LocalStorage API** for data persistence

### **UI/UX**
- 🎨 **Custom Design System** with gradients and CSS animations
- 📱 **Mobile-First** with responsive breakpoints (600px, 900px)
- ♿ **Accessibility** with contrasting colors and clear feedback
- 🎬 **CSS Animations** (@keyframes) for micro-interactions

### **Deploy and Tools**
- 🚀 **GitHub Pages** - Static hosting
- 📦 **angular-cli-ghpages** - Automated deployment
- 🔧 **Angular CLI 19.1.5** - Tooling and build
- 📝 **ESLint** (optional) - Code quality

### **Advanced Features**
- 🧮 **Unique question generation algorithm** (Set<string>)
- ⏱️ **Performance timer** per question and game
- 📊 **Statistical analysis system** with Map/reduce
- 🔄 **Case-insensitive dynamic grouping**
- 🎯 **Combined filters** (period + player)

---

## 🎯 Project Architecture
```
src/app/
├── components/
│   ├── home/              # Home screen (player and tables selection)
│   ├── game/              # Main game with numeric keypad
│   ├── feedback/          # Final game result screen
│   └── historico/         # Statistics and history system
│       ├── Summary Tab    # General dashboard
│       ├── Games Tab      # List grouped by player
│       └── Stats Tab      # Detailed individual analysis
├── services/
│   ├── game-state.service.ts    # Data sharing between routes
│   └── historico.service.ts     # CRUD and statistical calculations
├── models/
│   ├── questao.model.ts         # Question interface
│   └── partida.model.ts         # Game interface
└── app.routes.ts                # Lazy loading routes
```

---

## 🚀 How to Run Locally

### **Prerequisites**
- Node.js 18+ and npm
- Angular CLI 19+

### **Installation**
```bash
# Clone the repository
git clone https://github.com/camilagksantos/tabuada-interativa.git

# Enter the directory
cd tabuada-interativa

# Install dependencies
npm install

# Start development server
ng serve

# Access in browser
# http://localhost:4200
```

### **Production Build**
```bash
# Optimized build
ng build --configuration production --base-href "/tabuada-interativa/"

# Deploy to GitHub Pages
npx angular-cli-ghpages --dir=dist/tabuada-interativa/browser
```

---

## 📊 Detailed Features

### **1. Game System**
- Intelligent question generation without repetition
- Two modes: Sequential (1-10) or Random
- Individual timer per question and total game time
- Immediate visual feedback (correct/incorrect animations)
- Responsive numeric keypad with validations

### **2. History and Statistics**
- **Summary Tab**: Dashboard with overall performance cards
- **Games Tab**: List grouped by player and date
- **Statistics Tab**: Individual analysis with:
  - Overall success rate and best result
  - Performance per multiplication table (progress bars)
  - Difficult questions identification (<80% accuracy)
  - Ranking of most practiced tables

### **3. Advanced Filters**
- By period: 7, 30, 90 days or all time
- By player: Case-insensitive matching
- Dynamic statistics update

---

## 🎨 Design System

### **Color Palette**
```scss
// Primary
$primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

// Feedback
$success: #4CAF50;  // Correct answers
$error: #f44336;    // Errors
$warning: #ff9800;  // Warning
$info: #2196F3;     // Information

// Accent
$accent: #ff69b4;   // Titles
$highlight: #ffeb3b; // Current question
```

### **Responsiveness**
- **Mobile** (< 600px): Compact layout, 1 column
- **Tablet** (600-899px): 2-3 columns, hover enabled
- **Desktop** (≥ 900px): Full layout, elaborate hover animations

---

## 🔮 Future Roadmap

- [ ] PWA (Progressive Web App) with service workers
- [ ] Backend with Node.js + MongoDB for cloud sync
- [ ] Gamified achievements/badges system
- [ ] Time evolution charts (Chart.js/Recharts)
- [ ] Support for division, addition, and subtraction
- [ ] Local multiplayer mode
- [ ] PDF report export
- [ ] Physical keyboard support (Enter, Backspace, numbers)
- [ ] Sound feedback (correct/incorrect effects)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/MyFeature`)
3. Commit your changes (`git commit -m 'feat: add MyFeature'`)
4. Push to the branch (`git push origin feature/MyFeature`)
5. Open a Pull Request

---

## 📝 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

---

## 👩‍💻 Author

**Camila Santos**

- GitHub: [@camilagksantos](https://github.com/camilagksantos)
- LinkedIn: [Camila Santos](https://linkedin.com/in/camilagksantos)
- Portfolio: [camilagksantos.github.io](https://camilagksantos.github.io)

---

## 🙏 Acknowledgments

- Font: [Google Fonts - Nunito](https://fonts.google.com/specimen/Nunito)
- Inspiration: Gamified education and UX for children
- Deploy: [GitHub Pages](https://pages.github.com/)

---

⭐ **If this project helped you, consider giving it a star!** ⭐