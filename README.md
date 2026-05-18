# EmissionsEye 🌍♻️

EmissionsEye is a comprehensive web application designed to help individuals track, analyze, and reduce their carbon footprint through real-time insights, actionable sustainability steps, and a gamified reward system.

## 🚀 Features

- **Advanced Carbon Calculator**: Calculate your emissions based on travel (car, public transport, flight), energy consumption (electricity, LPG, natural gas), and waste/consumption (clothes, electronics, plastic, food).
- **Gamified Badge System**: Earn up to 8 exclusive shield tiers (Copper to Master Shield) based on your most recent carbon emission score.
- **15-Day Calculation Cycle**: Build consistent sustainability habits! The built-in 15-day restriction ensures you measure your emissions bi-weekly, featuring a smart notification system when you're due for a new calculation.
- **Dynamic Dashboard & Analytics**: Visualize your emission history over time with an interactive line chart (powered by Chart.js).
- **Premium UI/UX**: Enjoy a sleek, responsive, dark-themed design featuring modern glassmorphism, smooth animations, and intuitive sticky navigation.

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Glassmorphic Design System), JavaScript, Chart.js
- **Backend**: Python, Flask
- **Database**: SQLite
- **Icons & Fonts**: FontAwesome, Google Fonts (Outfit, Merriweather)

## 💻 Local Installation & Setup

To run EmissionsEye locally on your machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/EmissionsEye.git
   cd EmissionsEye
   ```

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install the required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask application:**
   ```bash
   python app.py
   ```

5. **Open in Browser:**
   Visit `http://127.0.0.1:5000` to start tracking your emissions!


## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/EmissionsEye/issues).

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
