const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const questions = [
    {
        title : "What is the capital city?",
        date :new Date("2026-03-20"),
        question: "What is the capital city of Finland?",
        answer: "Helsinki",
        "keywords" : ["Finland", "capital"]

    },
    {

        title : "What is the capital city?",
        date :new Date("2026-03-21"),
        question: "What is the capital city of Japan?",
        answer: "Tokyo",
        "keywords" : ["Japan", "capital"]
    },
    {

        title : "What is the capital city?",
        date :new Date("2026-03-21"),
        question: "What is the capital city of Denmark",
        answer: "Copenhagen",
        "keywords" : ["Denmark", "capital"]
    },
    {

        title : "What is the capital city?",
        date :new Date("2026-03-21"),
        question: "What is the capital city of Sweden",
        answer: "Stockholm",
        "keywords" : ["Sweden", "capital"]
    },
];

async function main() {
    await prisma.question.deleteMany();
    await prisma.keyword.deleteMany();

    for (const question of questions) {
        await prisma.question.create({
            data: {
                title:question.title,
                date:question.date,
                question: question.question,
                answer: question.answer,
                keywords: {
                    connectOrCreate: question.keywords.map((kw) => ({
                        where: { name: kw },
                        create: { name: kw },
                    })),
                },
            },
        });
    }

    console.log("Seed data inserted successfully");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
