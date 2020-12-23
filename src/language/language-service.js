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

  incrementTotalScore(db, language) {
    //had to include then because of a bug in knex, which doesn't update if then not included
    return db.from('language').where('id', language.id).increment('total_score', 1).returning('total_score').then(num => num[0])
  },

  incrementWordScore(db, word_id) {
    db.from('word').where('id', word_id).increment('correct_count', 1).then()
  },

  decrementWordScore(db, word_id) {
    db.from('word').where('id', word_id).increment('incorrect_count', 1).then()
  },

  getTotalScore(db, language_id) {
    return db.from('language').where('id', language_id).select('total_score').first().then(obj => obj.total_score)
  }
}

module.exports = LanguageService
