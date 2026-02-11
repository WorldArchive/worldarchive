import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const databaseId = process.env.NOTION_DATABASE_ID

export async function getSpecimens() {
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [{ property: 'Nombre', direction: 'ascending' }],
  })

  return response.results.map((page) => {
    const properties = page.properties
    
    return {
      id: page.id,
      name: properties['Nombre']?.title?.[0]?.plain_text || 'Unnamed',
      imageUrl: page.cover?.external?.url || page.cover?.file?.url || null,
      primaryGroup: properties['Primary Group']?.select?.name || '',
      time: properties['Time']?.select?.name || '',
      diet: properties['Diet']?.select?.name || '',
    }
  })
}

export async function getSpecimenById(id) {
  const page = await notion.pages.retrieve({ page_id: id })
  const properties = page.properties
  
  return {
    id: page.id,
    name: properties['Nombre']?.title?.[0]?.plain_text || 'Unnamed',
    imageUrl: page.cover?.external?.url || page.cover?.file?.url || null,
    primaryGroup: properties['Primary Group']?.select?.name || '',
    clade: properties['Clade']?.select?.name || '',
    subClade: properties['Sub-clade']?.select?.name || '',
    family: properties['Family']?.select?.name || '',
    time: properties['Time']?.select?.name || '',
    ecologicalRole: properties['Ecological Role']?.select?.name || '',
    diet: properties['Diet']?.select?.name || '',
    locomotion: properties['Locomotion']?.select?.name || '',
    primaryCountry: properties['Primary Country']?.select?.name || '',
    length: properties['Length']?.rich_text?.[0]?.plain_text || '',
    mass: properties['Mass']?.rich_text?.[0]?.plain_text || '',
    fossilEvidence: properties['Fossil Evidence']?.select?.name || '',
    fossilContext: properties['Fossil Context']?.select?.name || '',
  }
}
