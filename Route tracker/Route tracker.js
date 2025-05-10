// Initialize map centered on London
const map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles with modern-looking cartography
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
}).addTo(map);

// Route tracking variables
let routePoints = [];
let routeLine = null;

// Click handler - adds point and updates route
map.on('click', (e) => {
    routePoints.push(e.latlng);
    updateRoute();
    
    // Add visual marker for the point
    L.circleMarker(e.latlng, {
        radius: 6,
        fillColor: "gold",
        color: "darkorange",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map);
});

// Updates the drawn route line
function updateRoute() {
    // Remove old line if exists
    if (routeLine) map.removeLayer(routeLine);
    
    // Only draw if we have at least 2 points
    if (routePoints.length >= 2) {
        routeLine = L.polyline(routePoints, {
            color: 'dodgerblue',
            weight: 4,
            opacity: 0.8,
            dashArray: '5, 5',
            lineJoin: 'round'
        }).addTo(map);
        
        // Auto-zoom to show entire route
        map.fitBounds(routeLine.getBounds());
    }
    
    updateDistance();
}

// Calculates and displays total distance
function updateDistance() {
    let totalDistance = 0;
    
    // Sum distances between all points
    for (let i = 1; i < routePoints.length; i++) {
        totalDistance += routePoints[i-1].distanceTo(routePoints[i]);
    }
    
    // Update display (convert meters to km)
    document.getElementById('distance').textContent = 
        `${(totalDistance / 1000).toFixed(2)} km`;
}

// Clear button functionality
document.getElementById('clearBtn').addEventListener('click', () => {
    routePoints = [];
    if (routeLine) map.removeLayer(routeLine);
    updateDistance();
    map.eachLayer(layer => {
        if (layer instanceof L.CircleMarker) map.removeLayer(layer);
    });
});