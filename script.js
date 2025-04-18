// Store the registered stores and houses in arrays
let registeredStores = [];
let registeredHouses = [];
let vehicleMap;
let storesMap;
let housesMap;
let vehicleMarker;
let storeMarkers = [];
let houseMarkers = [];

// DOM Elements
const carForm = document.getElementById('carForm');
const storeForm = document.getElementById('storeForm');
const houseForm = document.getElementById('houseForm');
const carIdInput = document.getElementById('carId');
const carLocationInput = document.getElementById('carLocation');
const statusIndicator = document.querySelector('.status-indicator');
const statusText = document.querySelector('.status-text');
const storeList = document.getElementById('storeList');
const houseList = document.getElementById('houseList');

// Initialize maps
function initMaps() {
    // Initialize vehicle map
    vehicleMap = new google.maps.Map(document.getElementById('vehicleMap'), {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 12,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [{"color": "#242f3e"}]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#242f3e"}]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#746855"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#38414e"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#212a37"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#17263c"}]
            }
        ]
    });

    // Initialize stores map
    storesMap = new google.maps.Map(document.getElementById('storesMap'), {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 12,
        styles: vehicleMap.getStyles()
    });

    // Initialize houses map
    housesMap = new google.maps.Map(document.getElementById('housesMap'), {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 12,
        styles: vehicleMap.getStyles()
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadStores();
    loadHouses();
});

function setupEventListeners() {
    carForm.addEventListener('submit', handleCarTracking);
    storeForm.addEventListener('submit', handleStoreRegistration);
    houseForm.addEventListener('submit', handleHouseRegistration);
    carIdInput.addEventListener('input', validateCarId);
    document.getElementById('storeName').addEventListener('input', validateStoreName);
    document.getElementById('storeLocation').addEventListener('input', validateStoreLocation);
    document.getElementById('houseName').addEventListener('input', validateHouseName);
    document.getElementById('houseAddress').addEventListener('input', validateHouseAddress);
}

// Car Tracking Functions
function handleCarTracking(e) {
    e.preventDefault();
    
    if (!validateCarId()) {
        return;
    }

    // Simulate tracking process
    statusIndicator.classList.add('active');
    statusText.textContent = 'Tracking vehicle...';
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        const carId = carIdInput.value;
        // Simulate getting location
        const location = getRandomLocation();
        carLocationInput.value = location;
        
        // Update map with vehicle location
        updateVehicleLocation(location);
        
        statusText.textContent = 'Vehicle found!';
        statusIndicator.classList.remove('active');
        statusIndicator.style.backgroundColor = '#2ecc71';
    }, 2000);
}

function updateVehicleLocation(location) {
    // Use Geocoding API to convert address to coordinates
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results[0]) {
            const position = results[0].geometry.location;
            
            // Remove existing marker if any
            if (vehicleMarker) {
                vehicleMarker.setMap(null);
            }
            
            // Create new marker
            vehicleMarker = new google.maps.Marker({
                position: position,
                map: vehicleMap,
                title: 'Vehicle Location',
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#00f3ff',
                    fillOpacity: 1,
                    strokeColor: '#00f3ff',
                    strokeWeight: 2
                }
            });
            
            // Center map on marker
            vehicleMap.setCenter(position);
            
            // Add info window
            const infoWindow = new google.maps.InfoWindow({
                content: `<div style="color: #00f3ff; text-shadow: 0 0 5px #00f3ff;">
                    <strong>Vehicle ID:</strong> ${carIdInput.value}<br>
                    <strong>Location:</strong> ${location}
                </div>`
            });
            
            vehicleMarker.addListener('click', () => {
                infoWindow.open(vehicleMap, vehicleMarker);
            });
        }
    });
}

function validateCarId() {
    const carId = carIdInput.value;
    const errorMessage = carIdInput.nextElementSibling;
    
    if (!carId) {
        showError(errorMessage, 'Vehicle ID is required');
        return false;
    }
    
    if (!/^[A-Z0-9]{6}$/.test(carId)) {
        showError(errorMessage, 'Vehicle ID must be 6 characters (letters and numbers)');
        return false;
    }
    
    hideError(errorMessage);
    return true;
}

// Store Management Functions
function handleStoreRegistration(e) {
    e.preventDefault();
    
    if (!validateStoreName() || !validateStoreLocation()) {
        return;
    }
    
    const storeName = document.getElementById('storeName').value;
    const storeLocation = document.getElementById('storeLocation').value;
    const storeType = document.getElementById('storeType').value;
    
    const store = {
        name: storeName,
        location: storeLocation,
        type: storeType,
        id: Date.now() // Simple unique ID
    };
    
    registeredStores.push(store);
    saveStores();
    addStoreToList(store);
    addStoreToMap(store);
    storeForm.reset();
}

function validateStoreName() {
    const storeNameInput = document.getElementById('storeName');
    const errorMessage = storeNameInput.nextElementSibling;
    const storeName = storeNameInput.value;
    
    if (!storeName) {
        showError(errorMessage, 'Store name is required');
        return false;
    }
    
    if (storeName.length < 3) {
        showError(errorMessage, 'Store name must be at least 3 characters');
        return false;
    }
    
    hideError(errorMessage);
    return true;
}

function validateStoreLocation() {
    const storeLocationInput = document.getElementById('storeLocation');
    const errorMessage = storeLocationInput.nextElementSibling;
    const location = storeLocationInput.value;
    
    if (!location) {
        showError(errorMessage, 'Store location is required');
        return false;
    }
    
    hideError(errorMessage);
    return true;
}

// House Management Functions
function handleHouseRegistration(e) {
    e.preventDefault();
    
    if (!validateHouseName() || !validateHouseAddress()) {
        return;
    }
    
    const houseName = document.getElementById('houseName').value;
    const houseAddress = document.getElementById('houseAddress').value;
    const houseType = document.getElementById('houseType').value;
    const houseStatus = document.getElementById('houseStatus').value;
    
    const house = {
        name: houseName,
        address: houseAddress,
        type: houseType,
        status: houseStatus,
        id: Date.now()
    };
    
    registeredHouses.push(house);
    saveHouses();
    addHouseToList(house);
    addHouseToMap(house);
    houseForm.reset();
}

function validateHouseName() {
    const houseNameInput = document.getElementById('houseName');
    const errorMessage = houseNameInput.nextElementSibling;
    const houseName = houseNameInput.value;
    
    if (!houseName) {
        showError(errorMessage, 'House name is required');
        return false;
    }
    
    if (houseName.length < 3) {
        showError(errorMessage, 'House name must be at least 3 characters');
        return false;
    }
    
    hideError(errorMessage);
    return true;
}

function validateHouseAddress() {
    const houseAddressInput = document.getElementById('houseAddress');
    const errorMessage = houseAddressInput.nextElementSibling;
    const address = houseAddressInput.value;
    
    if (!address) {
        showError(errorMessage, 'House address is required');
        return false;
    }
    
    hideError(errorMessage);
    return true;
}

// Helper Functions
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

function hideError(element) {
    element.style.display = 'none';
}

function getRandomLocation() {
    const locations = [
        '123 Main St, New York',
        '456 Oak Ave, Los Angeles',
        '789 Pine St, Chicago',
        '321 Elm St, Houston'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
}

function addStoreToList(store) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${store.name} - ${store.location}</span>
        <span class="store-type">${store.type}</span>
        <button class="delete-btn" data-id="${store.id}">Delete</button>
    `;
    
    // Add delete functionality
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        deleteStore(store.id);
        li.remove();
    });
    
    storeList.appendChild(li);
}

function addStoreToMap(store) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: store.location }, (results, status) => {
        if (status === 'OK' && results[0]) {
            const position = results[0].geometry.location;
            
            const marker = new google.maps.Marker({
                position: position,
                map: storesMap,
                title: store.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#ff00ff',
                    fillOpacity: 1,
                    strokeColor: '#ff00ff',
                    strokeWeight: 2
                }
            });
            
            storeMarkers.push(marker);
            
            const infoWindow = new google.maps.InfoWindow({
                content: `<div style="color: #ff00ff; text-shadow: 0 0 5px #ff00ff;">
                    <strong>${store.name}</strong><br>
                    <strong>Type:</strong> ${store.type}<br>
                    <strong>Location:</strong> ${store.location}
                </div>`
            });
            
            marker.addListener('click', () => {
                infoWindow.open(storesMap, marker);
            });
            
            // Update map bounds to include all markers
            updateMapBounds();
        }
    });
}

function updateMapBounds() {
    const bounds = new google.maps.LatLngBounds();
    storeMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
    });
    storesMap.fitBounds(bounds);
}

function deleteStore(storeId) {
    // Remove marker from map
    const markerIndex = storeMarkers.findIndex(marker => marker.getTitle() === storeId.toString());
    if (markerIndex !== -1) {
        storeMarkers[markerIndex].setMap(null);
        storeMarkers.splice(markerIndex, 1);
    }
    
    // Update store list
    registeredStores = registeredStores.filter(store => store.id !== storeId);
    saveStores();
    
    // Update map bounds if there are remaining markers
    if (storeMarkers.length > 0) {
        updateMapBounds();
    }
}

function addHouseToList(house) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${house.name} - ${house.address}</span>
        <div>
            <span class="house-type">${house.type}</span>
            <span class="house-status ${house.status}">${house.status}</span>
            <button class="delete-btn" data-id="${house.id}">Delete</button>
        </div>
    `;
    
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        deleteHouse(house.id);
        li.remove();
    });
    
    houseList.appendChild(li);
}

function addHouseToMap(house) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: house.address }, (results, status) => {
        if (status === 'OK' && results[0]) {
            const position = results[0].geometry.location;
            
            const marker = new google.maps.Marker({
                position: position,
                map: housesMap,
                title: house.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: getStatusColor(house.status),
                    fillOpacity: 1,
                    strokeColor: getStatusColor(house.status),
                    strokeWeight: 2
                }
            });
            
            houseMarkers.push(marker);
            
            const infoWindow = new google.maps.InfoWindow({
                content: `<div style="color: ${getStatusColor(house.status)}; text-shadow: 0 0 5px ${getStatusColor(house.status)};">
                    <strong>${house.name}</strong><br>
                    <strong>Type:</strong> ${house.type}<br>
                    <strong>Status:</strong> ${house.status}<br>
                    <strong>Address:</strong> ${house.address}
                </div>`
            });
            
            marker.addListener('click', () => {
                infoWindow.open(housesMap, marker);
            });
            
            updateHouseMapBounds();
        }
    });
}

function getStatusColor(status) {
    switch(status) {
        case 'occupied':
            return '#00f3ff';
        case 'vacant':
            return '#ff00ff';
        case 'maintenance':
            return '#ff0000';
        default:
            return '#39ff14';
    }
}

function updateHouseMapBounds() {
    const bounds = new google.maps.LatLngBounds();
    houseMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
    });
    housesMap.fitBounds(bounds);
}

function deleteHouse(houseId) {
    const markerIndex = houseMarkers.findIndex(marker => marker.getTitle() === houseId.toString());
    if (markerIndex !== -1) {
        houseMarkers[markerIndex].setMap(null);
        houseMarkers.splice(markerIndex, 1);
    }
    
    registeredHouses = registeredHouses.filter(house => house.id !== houseId);
    saveHouses();
    
    if (houseMarkers.length > 0) {
        updateHouseMapBounds();
    }
}

// Local Storage Functions
function saveStores() {
    localStorage.setItem('registeredStores', JSON.stringify(registeredStores));
}

function loadStores() {
    const savedStores = localStorage.getItem('registeredStores');
    if (savedStores) {
        registeredStores = JSON.parse(savedStores);
        registeredStores.forEach(store => addStoreToList(store));
    }
}

function saveHouses() {
    localStorage.setItem('registeredHouses', JSON.stringify(registeredHouses));
}

function loadHouses() {
    const savedHouses = localStorage.getItem('registeredHouses');
    if (savedHouses) {
        registeredHouses = JSON.parse(savedHouses);
        registeredHouses.forEach(house => {
            addHouseToList(house);
            addHouseToMap(house);
        });
    }
} 