const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const { createWordsList } = require('./list-service')


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

      req.wordsList = await createWordsList(req.user.id, req.app.get('db'), language.id)

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
      if (req.wordsList) {
        headWord = req.wordsList.head.value
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
      if (!req.body.guess) {
        return res.status(400).json({
          error: `Missing 'guess' in request body`,
        })
      }

      const { guess } = req.body
      const word = req.wordsList.head.value

      if (guess === word.translation) {
        const totalScore = await LanguageService.incrementTotalScore(req.app.get('db'), req.language)
        LanguageService.incrementWordScore(req.app.get('db'), word.id)
        ++word.correct_count
        word.memory_value *= 2
        req.wordsList.moveHeadBack(word.memory_value)
        const nextWord = req.wordsList.head.value
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
        const totalScore = await LanguageService.getTotalScore(req.app.get('db'), req.language.id)
        ++word.incorrect_count
        word.memory_value = 1
        req.wordsList.moveHeadBack(word.memory_value)
        const nextWord = req.wordsList.head.value
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
