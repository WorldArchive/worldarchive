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
      // Solo filtros básicos
      primaryGroup: props['Primary Group']?.select?.name || '',
      time: props['Time']?.select?.name || '',
      diet: props['Diet']?.select?.name || '',
    }
  })
}
