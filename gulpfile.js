{
  'use strict'

  // / Dependancies
  let gulp = require('gulp')
  let pug = require('gulp-pug')
  let clean = require('gulp-clean')
  let request = require('request')
  let waterfall = require('async-waterfall')

  // Config
  let site = 'yoursite.wordpress.com'
  let api = `https://public-api.wordpress.com/rest/v1.1/sites/${site}`

  // Clean out build folder
  gulp.task('clean', () => {
    return gulp.src('./build').pipe(clean())
  })

  // Build website
  gulp.task('build', [ 'clean' ], () => {

    // Execute requests to wordpress.com
    // https://developer.wordpress.com/docs/api/
    waterfall([
      // Get posts
      (callback) => {
        request(`${api}/posts/`, (err, response, body) => {
          callback(null, JSON.parse(body).posts)
        })
      },
      // Get pages
      (posts, callback) => {
        request(`${api}/posts/?type=page`, (err, response, body) => {
          callback(null, { posts: posts, pages: JSON.parse(body).posts })
        })
      }
    ], (err, data) => {
      gulp.src('./source/**/*.pug')
        .pipe(pug({ locals: data }))
        .pipe(gulp.dest('./build/'))
    })
  })
}
