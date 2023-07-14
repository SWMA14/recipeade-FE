const CATEGORIES = [
    {
        id: 1,
        name: "아주 쉬움"
    },
    {
        id: 2,
        name: "쉬움"
    },
    {
        id: 3,
        name: "보통"
    },
    {
        id: 4,
        name: "어려움"
    },
    {
        id: 5,
        name: "아주 어려움"
    }
];

export function getCategoryById(id: number | string)
{
    return typeof id === "string" ? id : CATEGORIES.find(x => x.id === id)!.name;
}