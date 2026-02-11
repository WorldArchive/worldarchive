import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const databaseId = process.env.NOTION_DATABASE_ID

export async function getSpecimens() {
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [{ property: 'Nombre', direction: 'ascending' }],
  })

  return response.results.map((page) => {
    const props = page.properties
    
    return {
      id: page.id,
      name: props['Nombre']?.title?.[0]?.plain_text || 'Unnamed',
      imageUrl: page.cover?.external?.url || page.cover?.file?.url || null,
      primaryGroup: props['Primary Group']?.select?.name || '',
      time: props['Time']?.select?.name || '',
      diet: props['Diet']?.select?.name || '',
    }
  })
}

export async function getSpecimenById(id) {
  const page = await notion.pages.retrieve({ page_id: id })
  
  // DEBUG: Imprime en consola lo que Notion devuelve
  console.log('PAGE:', JSON.stringify(page, null, 2))
  console.log('PROPERTIES:', JSON.stringify(page.properties, null, 2))
  console.log('COVER:', page.cover)
  
  const props = page.properties
  
  return {
    id: page.id,
    name: props['Nombre']?.title?.[0]?.plain_text || 'Unnamed',
    imageUrl: page.cover?.external?.url || page.cover?.file?.url || null,
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
}
