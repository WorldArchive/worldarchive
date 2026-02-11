const CONTRACT_ADDRESS = '0x3c7856e8615bef03e926e0ad48170f47ef95021c'
const BASE_RPC = 'https://mainnet.base.org'

// Función para llamar al RPC de Base
async function callRPC(method, params = []) {
  const response = await fetch(BASE_RPC, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: method,
      params: params,
    }),
  })
  
  const data = await response.json()
  return data.result
}

// Decodificar hex a string
function hexToString(hex) {
  if (!hex || hex === '0x') return ''
  const bytes = []
  for (let i = 2; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16))
  }
  return new TextDecoder().decode(new Uint8Array(bytes))
}

// Obtener tokenURI para un token específico
async function getTokenURI(tokenId) {
  try {
    // tokenURI(uint256) = 0xc87b56dd
    const tokenIdHex = BigInt(tokenId).toString(16).padStart(64, '0')
    const data = '0xc87b56dd' + tokenIdHex
    
    const result = await callRPC('eth_call', [{
      to: CONTRACT_ADDRESS,
      data: data,
    }, 'latest'])
    
    if (!result || result === '0x') return null
    
    // Decodificar resultado
    const offset = parseInt(result.slice(2, 66), 16) * 2
    const length = parseInt(result.slice(66 + offset, 66 + offset + 64), 16) * 2
    const uriHex = result.slice(66 + offset + 64, 66 + offset + 64 + length)
    
    let uri = ''
    for (let i = 0; i < uriHex.length; i += 2) {
      const charCode = parseInt(uriHex.substr(i, 2), 16)
      if (charCode === 0) break
      uri += String.fromCharCode(charCode)
    }
    
    return uri
  } catch (error) {
    console.error(`Error getting tokenURI for ${tokenId}:`, error.message)
    return null
  }
}

export async function getDinosaurs() {
  try {
    const dinosaurs = []
    
    // Probar tokens del 1 al 20
    for (let i = 1; i <= 20; i++) {
      try {
        const tokenURI = await getTokenURI(i.toString())
        
        if (!tokenURI) {
          console.log(`Token ${i} no existe`)
          continue
        }
        
        console.log(`Token ${i} URI:`, tokenURI.substring(0, 100))
        
        // Obtener metadata
        let metadata = {}
        
        if (tokenURI.startsWith('ipfs://')) {
          const ipfsHash = tokenURI.replace('ipfs://', '')
          const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`)
          metadata = await response.json()
        } else if (tokenURI.startsWith('data:application/json;base64,')) {
          const base64 = tokenURI.split(',')[1]
          const json = atob(base64)
          metadata = JSON.parse(json)
        } else if (tokenURI.startsWith('http')) {
          const response = await fetch(tokenURI)
          metadata = await response.json()
        } else {
          console.log(`Formato desconocido para token ${i}`)
          continue
        }
        
        const attributes = metadata.attributes || []
        
        const getTrait = (traitType) => {
          const trait = attributes.find(t => 
            t.trait_type?.toLowerCase() === traitType.toLowerCase()
          )
          return trait?.value || null
        }
        
        // Procesar imagen
        let imageUrl = metadata.image || metadata.image_url || ''
        if (imageUrl.startsWith('ipfs://')) {
          imageUrl = `https://ipfs.io/ipfs/${imageUrl.replace('ipfs://', '')}`
        }
        
        dinosaurs.push({
          id: i.toString(),
          name: metadata.name || `Dinosaur #${i}`,
          imageUrl: imageUrl,
          description: metadata.description || '',
          openseaUrl: `https://opensea.io/item/base/${CONTRACT_ADDRESS}/${i}`,
          
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
        })
        
      } catch (error) {
        console.log(`Error con token ${i}:`, error.message)
        continue
      }
    }
    
    console.log(`Cargados ${dinosaurs.length} dinosaurios`)
    return dinosaurs
    
  } catch (error) {
    console.error('Error general:', error.message)
    return []
  }
}

export async function getDinosaurById(tokenId) {
  const dinosaurs = await getDinosaurs()
  return dinosaurs.find(d => d.id === tokenId) || null
}
