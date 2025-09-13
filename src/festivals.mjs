// Dynamic import of all festival entities using Vite's import.meta.glob
const festivals = [];

// Using Vite's import.meta.glob to dynamically import all JS files
const festivalModules = import.meta.glob('./assets/FestivalEntities/**/*.js', { 
  eager: true,  // This loads all modules immediately
  import: 'default'  // Only imports the default export
});

// Process all festival modules
Object.entries(festivalModules).forEach(([path, module]) => {
  if (module) {
    festivals.push(module);
    console.log(`Imported: ${path}`);
  }
});

console.log('Total festivals imported:', festivals.length);

// Export the festivals array
export default festivals;