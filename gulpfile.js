var gulp = require('gulp');
var gReplace = require('gulp-replace');
var glob = require('glob');

var srcGlob = '';

gulp.task('index', function() {
    glob("src/**", {}, function (er, files) {
        if (er) throw er;

        var src_list = files
            .map(function(f) { return '<script src="' + f + '"></script>'; })
            .join('\n');

        gulp.src('templates/index.html', { base : './templates/' })
            .pipe(gReplace(/\{\{src\}\}/g, src_list))
            .pipe(gulp.dest('out/'));
    });
});
