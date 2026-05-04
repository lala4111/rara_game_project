const express = require('express');
const router = express.Router();
const prisma = require("../lib/prisma");



function formatQuestion(question) {
    return {
        ...question,
        date: question.date.toISOString().split("T")[0],
        keywords: question.keywords.map((k) => k.name),
    };
}

router.get("/", async (req, res) => {
    const {keyword} = req.query;
    const where = keyword ? { keywords: { some: { name: keyword } } }
        : {};

    const filteredQuestions = await prisma.question.findMany({
        where,
        include: {keywords: true},
        orderBy: {id: "asc"}
    })

    res.json(questions.map(formatQuestion));





});

//GET / API question/id
router.get("/:questionId", async (req, res) => {
    const questionId = Number(req.params.questionId);
    const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: { keywords: true },
    });

    if(!question){
        return res.status(404).json({msg:"Post Not Found"});
    }
    res.json(formatQuestion(question));
});

router.post("/", async (req,res)=> {
    const {question, answer, keywords} = req.body;
    const existingQuestion = await prisma.question.findUnique({ where: { id: questionId } });
    if (!existingQuestion) {
        return res.status(404).json({ message: "Post not found" });
    }

    if (!title || !date || !question || !answer) {
        return res.status(400).json({ msg: "title, date, question, and answer are mandatory" });
    }

    const keywordsArray = Array.isArray(keywords) ? keywords : [];
    const updatedQuestion = await prisma.question.update({
        where: { id: question },
        data: {
            title, date: new Date(date), question, answer,
            keywords: {
                set: [],
                connectOrCreate: keywordsArray.map((kw) => ({
                    where: { name: kw },
                    create: { name: kw },
                })),
            },
        },
        include: { keywords: true },
    });
    res.json(formatQuestion(updatedQuestion));

});

//put
router.put("/:questionId",(req,res)=> {

    const questionId = Number(req.params.questionId);
    const question = questions.find(p=>p.id === questionId);
    if(!question){
        return res.status(404).json({msg:"Question Not Found"});
    }

    const { answer, keywords} = req.body;
    if(!answer) {return res.status(400).json({msg:"answer is required"});}

    question.answer = answer;
    question.keywords = Array.isArray(keywords) ? keywords : [];

    res.json(question);


})

//delete
router.delete("/:questionId", async(req,res)=> {
    const questionId = Number(req.params.questionId);
    const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: { keywords: true },
    });

    if (!question) {
        return res.status(404).json({ message: "Post not found" });
    }

    await prisma.question.delete({ where: { id: questionId } });

    res.json({
        message: "Question deleted successfully",
        post: formatQuestion(question),
    });

});
module.exports = router;

