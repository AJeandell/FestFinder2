import React, { useState } from 'react';
import '../index.css';
import festivals from '../festivals.mjs';
// Change the order / sorting of festivals to be by date, soonest to latest
// also make a function that interacts to other sorting options like location, genre, etc.
// with distance/location, use the Haversine formula to calculate distance from user location to festival location
// also add filtering range by date, genre, location, price, etc.


function haversineDistance(lat1, lon1, lat2, lon2, unit = 'miles') {
  const toRad = deg => deg * Math.PI / 180;
  const R_km = 6371;
  const R_mi = 3958.8;
  const R = unit === 'km' ? R_km : R_mi;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function sortFestivals(festivals, sortBy, userLocation, distanceUnit) {
  const sorted = [...festivals];
  switch (sortBy) {
    case 'date':
      sorted.sort((a, b) => {
        // Try to parse the first date in the string (handles ranges like 'Aug 1-3, 2025')
        // Fallback to the whole string if no dash
        const parseDate = (dateStr) => {
          // Remove ordinal suffixes (1st, 2nd, 3rd, 4th, etc.)
          const clean = dateStr.replace(/(\d+)(st|nd|rd|th)/g, '$1');
          // If range, take the first date
          const first = clean.split('-')[0].trim();
          // Add year if missing (should be present)
          return new Date(first);
        };
        return parseDate(a.date) - parseDate(b.date);
      });
      break;
    case 'location':
      sorted.sort((a, b) => a.location.localeCompare(b.location));
      break;
    case 'genre':
      sorted.sort((a, b) => {
        const genreA = Array.isArray(a.genre) ? a.genre[0] : a.genre;
        const genreB = Array.isArray(b.genre) ? b.genre[0] : b.genre;
        return (genreA || '').localeCompare(genreB || '');
      });
      break;
    case 'closest':
      if (userLocation) {
        sorted.sort((a, b) => {
          const distA = haversineDistance(userLocation.lat, userLocation.lon, a.latitude, a.longitude, distanceUnit);
          const distB = haversineDistance(userLocation.lat, userLocation.lon, b.latitude, b.longitude, distanceUnit);
          return distA - distB;
        });
      }
      break;
    default:
      sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  return sorted;
}



function ServicesPage() {
  const [sortBy, setSortBy] = useState('name');
  const [userLocation, setUserLocation] = useState(null);
  const [locationPrompted, setLocationPrompted] = useState(false);
  const [distanceUnit, setDistanceUnit] = useState('miles');
  const [filterGenre, setFilterGenre] = useState('all');
  // Collapsible logic removed

  React.useEffect(() => {
    if (sortBy === 'closest' && !userLocation && !locationPrompted) {
      setLocationPrompted(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          },
          () => {
            alert('Location access denied or unavailable.');
          }
        );
      } else {
        alert('Geolocation is not supported by your browser.');
      }
    }
  }, [sortBy, userLocation, locationPrompted]);

  // Get all unique genres for dropdown
  const genreSet = new Set();
  festivals.forEach(f => {
    if (Array.isArray(f.genre)) {
      f.genre.forEach(g => genreSet.add(g.trim()));
    } else if (typeof f.genre === 'string') {
      f.genre.split(',').forEach(g => genreSet.add(g.trim()));
    }
  });
  const genreOptions = Array.from(genreSet).sort();

  // Filter festivals by genre
  const filteredFestivals = filterGenre === 'all'
    ? festivals
    : festivals.filter(f => {
        if (Array.isArray(f.genre)) {
          return f.genre.map(g => g.trim().toLowerCase()).includes(filterGenre.toLowerCase());
        } else if (typeof f.genre === 'string') {
          return f.genre.split(',').map(g => g.trim().toLowerCase()).includes(filterGenre.toLowerCase());
        }
        return false;
      });

  const sortedFestivals = sortFestivals(filteredFestivals, sortBy, userLocation, distanceUnit);



  return (
    <div style={{ width: '100%', padding: '0 2vw', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <h1>Upcoming Festivals</h1>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <label htmlFor="sortBy" style={{ fontWeight: 500, marginRight: 8 }}>Sort by:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={e => {
            setSortBy(e.target.value);
            if (e.target.value !== 'closest') setUserLocation(null);
            setLocationPrompted(false);
          }}
          style={{ fontSize: 16, padding: '4px 8px', borderRadius: 4 }}
        >
          <option value="name">Alphabetical (A-Z)</option>
          <option value="date">Date</option>
          <option value="location">Location</option>
          {/* <option value="genre">Genre</option> */}
          <option value="closest">Closest to You</option>
        </select>
        {/* Filter dropdown */}
        <label htmlFor="filterGenre" style={{ fontWeight: 500, marginLeft: 8 }}>Filter by Genre:</label>
        <select
          id="filterGenre"
          value={filterGenre}
          onChange={e => setFilterGenre(e.target.value)}
          style={{ fontSize: 16, padding: '4px 8px', borderRadius: 4 }}
        >
          <option value="all">All Genres</option>
          {genreOptions.map((g, idx) => (
            <option key={idx} value={g}>{g}</option>
          ))}
        </select>
        {sortBy === 'closest' && (
          <>
            <label htmlFor="distanceUnit" style={{ fontWeight: 500, marginLeft: 8 }}>Distance unit:</label>
            <select
              id="distanceUnit"
              value={distanceUnit}
              onChange={e => setDistanceUnit(e.target.value)}
              style={{ fontSize: 16, padding: '4px 8px', borderRadius: 4 }}
            >
              <option value="miles">Miles</option>
              <option value="km">Kilometers</option>
            </select>
          </>
        )}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 20,
        width: '100%'
      }}>
        {sortedFestivals.map((festival, idx) => {
          let distance = null;
          if (sortBy === 'closest' && userLocation) {
            distance = haversineDistance(userLocation.lat, userLocation.lon, festival.latitude, festival.longitude, distanceUnit);
          }
          return (
            <div key={idx} style={{ width: '100%' }}>
              <div style={{ width: '100%', textAlign: 'left', padding: 12, boxSizing: 'border-box', background: '#1a1a1a', color: 'inherit', border: '1px solid #646cff', borderRadius: 8, marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={festival.image} alt={festival.name} style={{ width: 100, height: 60, objectFit: 'cover', marginRight: 16 }} />
                  <div>
                    <div><strong>{festival.name}</strong></div>
                    <div>Date: {festival.date}</div>
                    <div>Location: {festival.location}</div>
                  </div>
                </div>
                <div>Description: {festival.description}</div>
                {festival.genre && (
                  <div>Genre: {Array.isArray(festival.genre) ? festival.genre.join(', ') : festival.genre}</div>
                )}
                {festival.link && (
                  <div>Link: <a href={festival.link} target="_blank" rel="noopener noreferrer">{festival.link}</a></div>
                )}
                {sortBy === 'closest' && userLocation && distance !== null && (
                  <div>Distance: {distance.toFixed(1)} {distanceUnit}</div>
                )}
                {festival.LineupImage && (
                  <details style={{ marginTop: 12 }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 500, color: '#646cff' }}>Show Lineup Image</summary>
                    <img src={festival.LineupImage} alt={festival.name + ' Lineup'} style={{ width: '100%', maxWidth: 400, marginTop: 8, borderRadius: 8 }} />
                  </details>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ServicesPage;