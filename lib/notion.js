import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const databaseId = process.env.NOTION_DATABASE_ID

export async function getSpecimens() {
  const response = await notion.databases.query({
    database_id: databaseId,
  })

  return response.results.map((page) => {
    const properties = page.properties
    
    // Get name from Title property
    const nameProperty = properties.Name || properties.title
    const name = nameProperty?.title?.[0]?.plain_text || 'Unnamed'
    
    return {
      id: page.id,
      name: name,
      primaryGroup: properties['Primary Group']?.select?.name || '',
      clade: properties['Clade']?.select?.name || '',
      subClade: properties['Sub-clade']?.select?.name || '',
      family: properties['Family']?.select?.name || '',
      time: properties['Time']?.select?.name || '',
      ecologicalRole: properties['Ecological Role']?.select?.name || '',
      diet: properties['Diet']?.select?.name || '',
      locomotion: properties['Locomotion']?.select?.name || '',
      primaryCountry: properties['Primary Country']?.select?.name || '',
      length: properties['Length']?.number || null,
      mass: properties['Mass']?.number || null,
      fossilEvidence: properties['Fossil Evidence']?.select?.name || '',
      fossilContext: properties['Fossil Context']?.rich_text?.[0]?.plain_text || '',
      coverImage: page.cover?.external?.url || page.cover?.file?.url || null,
    }
  })
}

export async function getSpecimenById(id) {
  const page = await notion.pages.retrieve({ page_id: id })
  const properties = page.properties
  
  // Get name from Title property
  const nameProperty = properties.Name || properties.title
  const name = nameProperty?.title?.[0]?.plain_text || 'Unnamed'
  
  return {
    id: page.id,
    name: name,
    primaryGroup: properties['Primary Group']?.select?.name || '',
    clade: properties['Clade']?.select?.name || '',
    subClade: properties['Sub-clade']?.select?.name || '',
    family: properties['Family']?.select?.name || '',
    time: properties['Time']?.select?.name || '',
    ecologicalRole: properties['Ecological Role']?.select?.name || '',
    diet: properties['Diet']?.select?.name || '',
    locomotion: properties['Locomotion']?.select?.name || '',
    primaryCountry: properties['Primary Country']?.select?.name || '',
    length: properties['Length']?.number || null,
    mass: properties['Mass']?.number || null,
    fossilEvidence: properties['Fossil Evidence']?.select?.name || '',
    fossilContext: properties['Fossil Context']?.rich_text?.[0]?.plain_text || '',
    coverImage: page.cover?.external?.url || page.cover?.file?.url || null,
  }
}
