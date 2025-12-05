const socket = io();

// Color palette for user markers
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'];
const markers = {};
const userColors = {};
let colorIndex = 0;
let myLocation = null;
let myMarkerId = null;

// Show loading initially
document.getElementById('loading').style.display = 'block';

// Get user's location
if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
            const {latitude, longitude} = position.coords;
            myLocation = [latitude, longitude];
            socket.emit("send-location", {latitude, longitude});
            
            // Hide loading on first location
            document.getElementById('loading').style.display = 'none';
        }, 
        (error)=>{
            console.error(error);
            document.getElementById('loading').innerHTML = '<div class="loading-text" style="color: #ff6b6b;">⚠️ Location access denied</div>';
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
            }, 3000);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
} else {
    alert('Geolocation is not supported by your browser');
}

// Initialize map
const map = L.map("map").setView([23.1630, 79.0193], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Custom marker icon function
function createCustomIcon(color, isMe = false) {
    const size = isMe ? 40 : 30;
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            background-color: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            ${isMe ? 'animation: bounce 2s infinite;' : ''}
        "></div>
        <style>
            @keyframes bounce {
                0%, 100% { transform: rotate(-45deg) translateY(0); }
                50% { transform: rotate(-45deg) translateY(-10px); }
            }
        </style>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size]
    });
}

// Assign color to user
function getUserColor(id) {
    if (!userColors[id]) {
        userColors[id] = colors[colorIndex % colors.length];
        colorIndex++;
    }
    return userColors[id];
}

// Update user count and list
function updateUsersList() {
    const usersList = document.getElementById('usersList');
    const userCount = document.getElementById('userCount');
    const count = Object.keys(markers).length;
    
    userCount.textContent = count;
    
    if (count === 0) {
        usersList.innerHTML = '<li style="color: #999; font-style: italic;">No users connected yet...</li>';
    } else {
        usersList.innerHTML = '';
        Object.keys(markers).forEach((id, index) => {
            const color = getUserColor(id);
            const isMe = id === myMarkerId;
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="user-marker-icon" style="background-color: ${color};"></span>
                <div class="user-info">
                    <div class="user-label">${isMe ? '👤 You' : `User ${index + 1}`}</div>
                    <div class="user-status">🟢 Active</div>
                </div>
            `;
            li.onclick = () => {
                const marker = markers[id];
                if (marker) {
                    map.setView(marker.getLatLng(), 15);
                    marker.openPopup();
                }
            };
            usersList.appendChild(li);
        });
    }
}

// Handle incoming location data
socket.on("receive-location", (data)=>{
    const {id, latitude, longitude} = data;
    const isMe = !myMarkerId || id === socket.id;
    
    if (isMe) {
        myMarkerId = id;
    }
    
    const color = getUserColor(id);
    
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    } else {
        const icon = createCustomIcon(color, isMe);
        const marker = L.marker([latitude, longitude], {icon: icon}).addTo(map);
        
        const popupContent = `
            <div class="popup-content">
                <strong>${isMe ? '👤 You' : '📍 User Location'}</strong>
                <div>Lat: ${latitude.toFixed(4)}</div>
                <div>Lng: ${longitude.toFixed(4)}</div>
            </div>
        `;
        marker.bindPopup(popupContent);
        
        markers[id] = marker;
        
        // Center to first location (likely user's own)
        if (Object.keys(markers).length === 1) {
            map.setView([latitude, longitude], 13);
        }
    }
    
    updateUsersList();
});

// Handle user disconnection
socket.on("user-disconnected", (id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
        delete userColors[id];
        updateUsersList();
    }
});

// Center to my location
function centerToMyLocation() {
    if (myLocation) {
        map.setView(myLocation, 15);
        if (myMarkerId && markers[myMarkerId]) {
            markers[myMarkerId].openPopup();
        }
    } else {
        alert('Your location is not available yet!');
    }
}

// Toggle info panel
function toggleInfoPanel() {
    const panel = document.getElementById('infoPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// Make map responsive
window.addEventListener('resize', () => {
    map.invalidateSize();
});

