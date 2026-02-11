// lib/opensea.js - Versión final sin dependencias

const CONTRACT_ADDRESS = '0x3c7856e8615bef03e926e0ad48170f47ef95021c'
const BASE_RPC = 'https://mainnet.base.org'

// Lista de token IDs que sabemos que existen
const TOKEN_IDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']

async function fetchFromRPC(method, params) {
  const response = await fetch(BASE_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }),
  })
  const data = await response.json()
  return data.result
}

// Decodificar bytes hex a string
function decodeHexString(hexString) {
  if (!hexString || hexString === '0x') return ''
  
  // Remover 0x inicial
  const hex = hexString.slice(2)
  
  // Si empieza con offset (0x0000...20), es un string dinámico
  if (hex.slice(0, 62).replace(/0/g, '') === '' && hex.slice(62, 64) === '20') {
    // String dinámico: offset (32 bytes) + length (32 bytes) + data
    const lengthHex = hex.slice(64, 128)
    const length = parseInt(lengthHex, 16)
    const dataHex = hex.slice(128, 128 + (length * 2))
    
    let str = ''
    for (let i = 0; i < dataHex.length; i += 2) {
      const byte = parseInt(dataHex.substr(i, 2), 16)
      if (byte === 0) break
      str += String.fromCharCode(byte)
    }
    return str
  }
  
  // String corto (< 32 bytes)
  let str = ''
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.substr(i, 2), 16)
    if (byte === 0) break
    str += String.fromCharCode(byte)
  }
  return str
}

async function getTokenURI(tokenId) {
  try {
    // tokenURI(uint256) = keccak256("tokenURI(uint256)") = 0xc87b56dd
    const tokenIdHex = BigInt(tokenId).toString(16).padStart(64, '0')
    const data = '0xc87b56dd' + tokenIdHex
    
    const result = await fetchFromRPC('eth_call', [{
      to: CONTRACT_ADDRESS,
      data: data,
    }, 'latest'])
    
    if (!result || result === '0x') return null
    
    return decodeHexString(result)
  } catch (error) {
    console.error(`Error getting URI for ${tokenId}:`, error.message)
    return null
  }
}

export async function getDinosaurs() {
  const dinosaurs = []
  
  for (const tokenId of TOKEN_IDS) {
    try {
      const tokenURI = await getTokenURI(tokenId)
      
      if (!tokenURI) {
        console.log(`Token ${tokenId}: No URI found`)
        continue
      }
      
      console.log(`Token ${tokenId} URI:`, tokenURI.substring(0, 80))
      
      // Obtener metadata
      let metadata = {}
      
      if (tokenURI.startsWith('ipfs://')) {
        const ipfsHash = tokenURI.replace('ipfs://', '')
        const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`, {
          headers: { 'Accept': 'application/json' }
        })
        if (!response.ok) throw new Error('IPFS fetch failed')
        metadata = await response.json()
      } else if (tokenURI.startsWith('data:application/json;base64,')) {
        const base64 = tokenURI.split(',')[1]
        const json = atob(base64)
        metadata = JSON.parse(json)
      } else if (tokenURI.startsWith('http')) {
        const response = await fetch(tokenURI)
        metadata = await response.json()
      } else {
        console.log(`Token ${tokenId}: Unknown format`)
        continue
      }
      
      // Procesar traits
      const attributes = metadata.attributes || []
      const getTrait = (type) => {
        const trait = attributes.find(t => 
          t.trait_type?.toLowerCase() === type.toLowerCase()
        )
        return trait?.value || null
      }
      
      // Procesar imagen
      let imageUrl = metadata.image || metadata.image_url || ''
      if (imageUrl.startsWith('ipfs://')) {
        imageUrl = `https://ipfs.io/ipfs/${imageUrl.replace('ipfs://', '')}`
      }
      
      dinosaurs.push({
        id: tokenId,
        name: metadata.name || `Dinosaur #${tokenId}`,
        imageUrl: imageUrl,
        description: metadata.description || '',
        openseaUrl: `https://opensea.io/item/base/${CONTRACT_ADDRESS}/${tokenId}`,
        
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
      
      console.log(`✓ Token ${tokenId}: ${metadata.name}`)
      
    } catch (error) {
      console.error(`✗ Token ${tokenId}:`, error.message)
      continue
    }
  }
  
  console.log(`\nTotal loaded: ${dinosaurs.length} dinosaurs`)
  return dinosaurs
}

export async function getDinosaurById(tokenId) {
  const dinosaurs = await getDinosaurs()
  return dinosaurs.find(d => d.id === tokenId) || null
}
