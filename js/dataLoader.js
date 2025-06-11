export async function loadVideoData(file) {
    try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!validateBasicStructure(data)) {
            throw new Error('Invalid file format. The file does not seem to be an array of videos or is missing key properties.');
        }
        console.log(`Loaded ${data.length} videos.`);
        return data;
    } catch (error) {
        console.error('Error loading or parsing JSON file:', error);
        throw error; // Re-throw to be caught by the caller
    }
}

export function validateBasicStructure(data) {
    // Check if data is an array
    if (!Array.isArray(data)) {
        console.error('Validation failed: Data is not an array.');
        return false;
    }

    // If array is empty, it's technically valid for structure but no data to process
    if (data.length === 0) {
        console.log('Validation: Data is an empty array.');
        return true; 
    }

    // Check if the first item has some of the required properties
    // This is a basic check; more thorough schema validation could be added for Phase 2+
    const firstItem = data[0];
    const requiredProps = ['_id', 'title', 'duration', 'difficultyScore', 'level', 'sources', 'hostingId'];
    const missingProps = requiredProps.filter(prop => !(prop in firstItem));

    if (missingProps.length > 0) {
        console.error(`Validation failed: First item is missing properties: ${missingProps.join(', ')}`);
        return false;
    }
    
    // Check if sources.youtube or hostingId is present (essential for launching)
    if (!firstItem.sources || (!firstItem.sources.youtube && !firstItem.hostingId)) {
        if(!firstItem.hostingId){
             console.error('Validation failed: First item is missing sources.youtube and hostingId.');
             return false;
        }
    }

    console.log('Basic structure validation passed.');
    return true;
}
