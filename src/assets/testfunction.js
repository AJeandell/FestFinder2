// trying to dynamically import all js files from a folder and add them to an array
const festivals = [];
const folderPath = path.join(__dirname, 'FestivalEntities');

function readJsFilesRecursive(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readJsFilesRecursive(fullPath);
    } else if (file.endsWith('.js')) {
      try {
        const entity = require(fullPath);
        // If the export is a default or a const object, add it
        if (entity && (typeof entity === 'object' || typeof entity === 'function')) {
          // If it's an ES6 default export
          if (entity.default) {
            festivals.push(entity.default);
          } else {
            festivals.push(entity);
          }
          console.log(`Added entity from ${file}`);
        }
      } catch (err) {
        console.error(`Error requiring ${file}:`, err);
      }
    }
  });
}

readJsFilesRecursive(folderPath);

console.log('Festivals array:', festivals);