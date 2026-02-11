import { Client } from '@notionhq/client'

// Validación temprana de variables de entorno
const NOTION_TOKEN = process.env.NOTION_TOKEN
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

// Debug: Verificar variables (se verá en los logs de Vercel)
console.log('=== NOTION CONFIG ===')
console.log('Token exists:', !!NOTION_TOKEN)
console.log('Token starts with:', NOTION_TOKEN ? NOTION_TOKEN.substring(0, 10) + '...' : 'undefined')
console.log('Database ID:', NOTION_DATABASE_ID)
console.log('=====================')

if (!NOTION_TOKEN) {
  throw new Error('NOTION_TOKEN is not defined in environment variables')
}

if (!NOTION_DATABASE_ID) {
  throw new Error('NOTION_DATABASE_ID is not defined in environment variables')
}

const notion = new Client({ auth: NOTION_TOKEN })

export async function getSpecimens() {
  try {
    console.log('Fetching specimens from database:', NOTION_DATABASE_ID)
    
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      sorts: [{ property: 'Nombre', direction: 'ascending' }],
    })

    console.log('Found specimens:', response.results.length)

    return response.results.map((page) => {
      const props = page.properties
      
      return {
        id: page.id,
        name: props['Nombre']?.title?.[0]?.plain_text || 'Unnamed',
        imageUrl: page.cover?.external?.url || 
                  page.cover?.file?.url || 
                  props['Image']?.files?.[0]?.external?.url ||
                  props['Image']?.files?.[0]?.file?.url ||
                  null,
        primaryGroup: props['Primary Group']?.select?.name || '',
        time: props['Time']?.select?.name || '',
        diet: props['Diet']?.select?.name || '',
      }
    })
  } catch (error) {
    console.error('Error in getSpecimens:', error.message)
    console.error('Error details:', error.code, error.status)
    throw error
  }
}

export async function getSpecimenById(id) {
  try {
    console.log('Fetching specimen by ID:', id)
    
    const page = await notion.pages.retrieve({ page_id: id })
    const props = page.properties
    
    return {
      id: page.id,
      name: props['Nombre']?.title?.[0]?.plain_text || 'Unnamed',
      imageUrl: page.cover?.external?.url || 
                page.cover?.file?.url || 
                props['Image']?.files?.[0]?.external?.url ||
                props['Image']?.files?.[0]?.file?.url ||
                null,
      scientificData: {
        primaryGroup: props['Primary Group']?.select?.name || null,
        clade: props['Clade']?.select?.name || null,
        subClade: props['Sub-clade']?.select?.name || null,
        family: props['Family']?.select?.name || null,
        time: props['Time']?.select?.name || null,
        ecologicalRole: props['Ecological Role']?.select?.name || null,
        diet: props['Diet']?.select?.name || null,
        locomotion: props['Locomotion']?.select?.name || null,
        country: props['Primary Country']?.select?.name || null,
        length: props['Length']?.rich_text?.[0]?.plain_text || null,
        mass: props['Mass']?.rich_text?.[0]?.plain_text || null,
        fossilEvidence: props['Fossil Evidence']?.select?.name || null,
        fossilContext: props['Fossil Context']?.select?.name || null,
      },
    }
  } catch (error) {
    console.error('Error in getSpecimenById:', error.message)
    console.error('Error details:', error.code, error.status)
    throw error
  }
}
