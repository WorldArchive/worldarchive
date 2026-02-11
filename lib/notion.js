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
  const props = page.properties
  
  return {
    id: page.id,
    name: props['Nombre']?.title?.[0]?.plain_text || 'Unnamed',
    imageUrl: page.cover?.external?.url || page.cover?.file?.url || null,
    scientificData: {
      primaryGroup: props['Primary Group']?.select?.name,
      clade: props['Clade']?.select?.name,
      subClade: props['Sub-clade']?.select?.name,
      family: props['Family']?.select?.name,
      time: props['Time']?.select?.name,
      ecologicalRole: props['Ecological Role']?.select?.name,
      diet: props['Diet']?.select?.name,
      locomotion: props['Locomotion']?.select?.name,
      country: props['Primary Country']?.select?.name,
      length: props['Length']?.rich_text?.[0]?.plain_text,
      mass: props['Mass']?.rich_text?.[0]?.plain_text,
      fossilEvidence: props['Fossil Evidence']?.select?.name,
      fossilContext: props['Fossil Context']?.select?.name,
    },
  }
}
