import { Client } from '@notionhq/client'

const NOTION_TOKEN = process.env.NOTION_TOKEN
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

const notion = new Client({ auth: NOTION_TOKEN })

export async function getSpecimens() {
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      sorts: [{ property: 'Nombre', direction: 'ascending' }],
    })

    console.log('Total specimens found:', response.results.length)
    
    // DEBUG: Ver la estructura completa de la primera página
    if (response.results.length > 0) {
      const firstPage = response.results[0]
      console.log('=== ESTRUCTURA COMPLETA DE NOTION API ===')
      console.log(JSON.stringify(firstPage, null, 2))
      console.log('==========================================')
    }

    return response.results.map((page) => {
      const props = page.properties
      
      // DEBUG específico para Argentinosaurus
      if (props['Nombre']?.title?.[0]?.plain_text?.includes('Argentinosaurus')) {
        console.log('=== ARGENTINOSAURUS PROPS ===')
        console.log(JSON.stringify(props, null, 2))
        console.log('=============================')
      }
      
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
    console.error('Error:', error.message)
    throw error
  }
}

export async function getSpecimenById(id) {
  try {
    const page = await notion.pages.retrieve({ page_id: id })
    const props = page.properties
    
    console.log('=== DETALLE PÁGINA ===')
    console.log('ID:', page.id)
    console.log('Tiene cover?:', !!page.cover)
    console.log('Tipo de cover:', page.cover?.type)
    console.log('URL cover:', page.cover?.external?.url || page.cover?.file?.url)
    console.log('======================')
    
    console.log('=== PROPIEDADES ===')
    Object.entries(props).forEach(([key, value]) => {
      console.log(`${key}:`, JSON.stringify(value, null, 2))
    })
    console.log('===================')
    
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
    console.error('Error:', error.message)
    throw error
  }
}
