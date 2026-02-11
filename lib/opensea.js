const OPENSEA_API = 'https://api.opensea.io/api/v1'
const COLLECTION_SLUG = 'dinoarchive'

export async function getDinosaurs() {
  try {
    // Obtener todos los NFTs de la colección
    const response = await fetch(
      `${OPENSEA_API}/assets?collection=${COLLECTION_SLUG}&limit=50`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 } // Revalidar cada 1 hora
      }
    )
    
    if (!response.ok) {
      throw new Error(`OpenSea API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    console.log('NFTs encontrados:', data.assets?.length || 0)
    
    if (!data.assets || data.assets.length === 0) {
      return []
    }

    return data.assets.map(nft => {
      // Extraer traits de forma segura
      const getTrait = (traitType) => {
        const trait = nft.traits?.find(t => 
          t.trait_type?.toLowerCase() === traitType.toLowerCase()
        )
        return trait?.value || null
      }

      return {
        id: nft.token_id,
        name: nft.name || 'Unknown Dinosaur',
        imageUrl: nft.image_url || nft.image_preview_url || null,
        description: nft.description || '',
        openseaUrl: nft.permalink,
        
        // Atributos científicos desde los traits de OpenSea
        scientificData: {
          primaryGroup: getTrait('Primary Group'),
          clade: getTrait('Clade'),
          subClade: getTrait('Sub-clade'),
          family: getTrait('Family'),
          time: getTrait('Time'),
          ecologicalRole: getTrait('Ecological Role'),
          diet: getTrait('Diet'),
          locomotion: getTrait('Locomotion'),
          country: getTrait('Primary Country'),
          length: getTrait('Length'),
          mass: getTrait('Mass'),
          fossilEvidence: getTrait('Fossil Evidence'),
          fossilContext: getTrait('Fossil Context'),
        },
        
        // Todos los traits raw por si acaso
        allTraits: nft.traits || []
      }
    })
  } catch (error) {
    console.error('Error fetching from OpenSea:', error.message)
    return []
  }
}

export async function getDinosaurById(tokenId) {
  try {
    const dinosaurs = await getDinosaurs()
    return dinosaurs.find(d => d.id === tokenId) || null
  } catch (error) {
    console.error('Error finding dinosaur:', error.message)
    return null
  }
}
