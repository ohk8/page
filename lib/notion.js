import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

export async function getDatabase() {
    try {
        const response = await notion.request({
            path: `databases/${DATABASE_ID}/query`,
            method: "POST",
            body: {
                filter: {
                    property: "Published",
                    checkbox: { equals: true },
                },
                sorts: [
                    {
                        property: "Date",
                        direction: "descending",
                    },
                ],
            },
        });

        return response.results.map((page) => ({
            id: page.id,
            title: page.properties.Page?.title[0]?.plain_text || "제목 없음",
            date: page.properties.Date?.date?.start || "날짜 미정",
            slug: page.properties.Slug?.rich_text[0]?.plain_text || page.id,
        }));
    } catch (error) {
        console.error("Notion API Error:", error);
        return [];
    }
}