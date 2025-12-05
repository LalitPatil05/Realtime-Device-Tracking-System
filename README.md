# 📍 Real-Time Device Tracker

A modern, responsive real-time GPS location tracking application that allows multiple users to share and view their locations simultaneously on an interactive map.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D12.x-brightgreen.svg)

## ✨ Features

- 🗺️ Real-time location tracking with live updates
- 🎨 Modern, responsive UI for all devices
- 🎯 Custom colored markers for each user
- 👥 Active users panel with live status
- 📱 Mobile-friendly design
- 🎮 Interactive controls (center map, toggle panel)

## 🚀 Quick Start

### Prerequisites
- Node.js (v12.x or higher)
- Modern web browser with GPS support

### Installation

```bash
# Clone the repository
git clone https://github.com/LalitPatil05/Realtime-Device-Tracker.git
cd Realtime-Device-Tracker

# Install dependencies
npm install

# Start the server
npm start
```

Server runs at `http://localhost:3000`

## 💻 Usage

**Desktop:** Open `http://localhost:3000` in your browser

**Mobile (same WiFi):**
1. Find your IP: `ipconfig | Select-String "IPv4"`
2. Open `http://YOUR_IP:3000` on mobile
3. Allow location access

**Testing:** Open multiple browser tabs to see real-time tracking!

## 🛠️ Technologies

- **Backend:** Node.js, Express.js, Socket.IO
- **Frontend:** Leaflet.js, Vanilla JavaScript, CSS3
- **Map:** OpenStreetMap

## 📁 Project Structure

```
Realtime-Device-Tracker/
├── app.js              # Server
├── package.json        # Dependencies
├── public/
│   ├── css/style.css   # Styling
│   └── js/script.js    # Client logic
└── views/
    └── index.ejs       # HTML template
```

## 🐛 Troubleshooting

**Location not showing?** Enable location access in browser settings

**Can't connect from mobile?** 
- Check same WiFi network
- Allow port 3000 through firewall: 
  ```powershell
  New-NetFirewallRule -DisplayName "Node.js" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3000
  ```

**Port already in use?** Stop Node processes:
```powershell
Get-Process -Name node | Stop-Process -Force
```

## 👨‍💻 Author

**Lalit Patil**
- GitHub: [@LalitPatil05](https://github.com/LalitPatil05)
- LinkedIn: [Lalit Patil](https://www.linkedin.com/in/lalitpatil05)

## 📄 License

ISC License

---

<div align="center">
Made with ❤️ using Node.js and Socket.IO
<br/>
⭐ Star this repo if you find it useful!
</div>


