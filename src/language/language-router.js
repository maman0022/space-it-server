const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const { Node, LinkedList } = require('./list-service')

let wordsList
let totalScore

async function generateWordsList(db, languageId) {
  if (!!wordsList) {
    return
  }
  const words = await LanguageService.getLanguageWords(db, languageId)
  wordsList = new LinkedList()
  words.forEach(word => {
    wordsList.add(new Node(word))
  })
}

const languageRouter = express.Router()
const jsonBodyParser = express.json()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      !totalScore ? totalScore = language.total_score : void 0

      generateWordsList(req.app.get('db'), language.id)

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      let headWord
      if (wordsList) {
        headWord = wordsList.head.value
      }
      else {
        headWord = await LanguageService.getWord(
          req.app.get('db'),
          req.language.head,
        )
      }

      res.json({
        nextWord: headWord.original,
        totalScore: req.language.total_score,
        wordCorrectCount: headWord.correct_count,
        wordIncorrectCount: headWord.incorrect_count
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    try {
      if (!req.body.guess)
        return res.status(400).json({
          error: `Missing 'guess' in request body`,
        })

      const { guess } = req.body
      await generateWordsList(req.app.get('db'), req.language.id)
      const word = wordsList.head.value

      if (guess === word.translation) {
        LanguageService.incrementTotalScore(req.app.get('db'), req.language)
        LanguageService.incrementWordScore(req.app.get('db'), word.id)
        ++totalScore
        ++word.correct_count
        word.memory_value *= 2
        wordsList.moveHeadBack(word.memory_value)
        const nextWord = wordsList.head.value
        return res.status(200).json({
          nextWord: nextWord.original,
          totalScore,
          wordCorrectCount: nextWord.correct_count,
          wordIncorrectCount: nextWord.incorrect_count,
          answer: word.translation,
          isCorrect: true
        })
      }

      if (guess !== word.translation) {
        LanguageService.decrementWordScore(req.app.get('db'), word.id)
        ++word.incorrect_count
        word.memory_value = 1
        wordsList.moveHeadBack(word.memory_value)
        const nextWord = wordsList.head.value
        return res.status(200).json({
          nextWord: nextWord.original,
          totalScore,
          wordCorrectCount: nextWord.correct_count,
          wordIncorrectCount: nextWord.incorrect_count,
          answer: word.translation,
          isCorrect: false
        })
      }

      next()
    } catch (error) {
      next(error)
    }
  })

module.exports = languageRouter
