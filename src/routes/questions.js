const express = require('express');
const router = express.Router();

const questions = require("../data/questions");

router.get("/", (req, res) => {
    const {keyword} = req.query;
    if(!keyword) {
        return res.json(questions);
    }
    const filteredQuestions = questions.filter(p=>p.keywords.includes(keyword));
    res.json(filteredQuestions);


});

//GET / API question/id
router.get("/:questionId",(req, res) => {
    const questionId = Number(req.params.questionId);
    const question = questions.find(p=>p.id === questionId);
    if(!question){
        return res.status(404).json({msg:"Post Not Found"});
    }
    res.json(question);
});

router.post("/", (req,res)=> {
    const {question, answer, keywords} = req.body;
    if(!question|| !answer) {
        return res.status(400).json({msg:"question and answer are required"});
    }
    
    const exsistingIds = questions.map(p=>p.id);
    const maxId = Math.max(...exsistingIds);

    const newQuestion = {
        id : questions.length ? maxId + 1 :1,
        question,answer,
        keywords: Array.isArray(keywords)? keywords : []
    }
    questions.push(newQuestion);
    res.status(201).json(newQuestion);
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
router.delete("/:questionId", (req,res)=> {
    const questionId = Number(req.params.questionId);
    const questionIndex = questions.findIndex(p => p.id === questionId);
    if(questionIndex === -1){
        return res.status(404).json({msg: "Message not found"})
    }
    const deletedQuestion = questions.splice(questionIndex,1);
    res.json({
        msg : "Question is deleted.",
        question : deletedQuestion
    });
});
module.exports = router;

