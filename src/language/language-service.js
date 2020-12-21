const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },

  getWord(db, id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ id })
      .first()
  },

  async incrementTotalScore(db, user_id) {
    const language = await LanguageService.getUsersLanguage(db, user_id)
    const total_score = ++language.total_score
    db.from('language').where('id', language.id).update({ total_score })
  },

  async incrementWordScore(db, word_id) {
    const word = await LanguageService.getWord(db, word_id)
    const correct_count = ++word.correct_count
    db.from('word').where('id', word_id).update({ correct_count })
  },

  async decrementWordScore(db, word_id) {
    const word = await LanguageService.getWord(db, word_id)
    const incorrect_count = ++word.incorrect_count
    db.from('word').where('id', word_id).update({ incorrect_count })
  }
}

module.exports = LanguageService
