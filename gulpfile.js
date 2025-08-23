const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const browserSync = require('browser-sync').create();

// 🔹 Browserify deps
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const uglify = require('gulp-uglify');

// ---------------------------------------------
// 1. Generate root index.html
// ---------------------------------------------
function generateRootIndex(cb) {
	const baseDir = './';
	const collectedDirs = [];

	// Only scan immediate children of root
	const items = fs.readdirSync(baseDir);

	items.forEach((item) => {
		const fullPath = path.join(baseDir, item);

		if (fs.statSync(fullPath).isDirectory()) {
			const subItems = fs.readdirSync(fullPath);

			if (subItems.includes('index.html')) {
				collectedDirs.push(item); // parent directory name only
			}
		}
	});

	const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link href="style.css" rel="stylesheet" />
  <title>Dug's notes - D3</title>
</head>
<body>
  <ul>
    ${collectedDirs.map((dir) => `<li><a href="./${dir}/index.html">${dir}</a></li>`).join('\n    ')}
  </ul>
</body>
</html>`;

	fs.writeFileSync(path.join(baseDir, 'index.html'), htmlContent, 'utf8');
	console.log('✅ Root index.html created with links:', collectedDirs);

	cb();
}

// ---------------------------------------------
// 2. Bundle ALL js/app.js files in topic dirs
// ---------------------------------------------
function scripts(cb) {
	const baseDir = './';
	const items = fs.readdirSync(baseDir);

	items.forEach((item) => {
		const jsEntry = path.join(baseDir, item, 'src.js');

		if (fs.existsSync(jsEntry)) {
			// Browserify for each app.js
			browserify({
				entries: [jsEntry],
				debug: true,
			})
				.transform(
					babelify.configure({
						presets: ['@babel/preset-env'],
						sourceType: 'module', // ✅ allow ESM parsing
						ignore: [/\/core-js\//], // optional
					}),
					{ global: true } // ✅ apply to node_modules too
				)
				.bundle()
				.pipe(source('app.js')) // always output app.js
				.pipe(buffer())
				.pipe(uglify())
				.pipe(gulp.dest(path.join(baseDir, item, 'js'))) // save inside same folder
				.pipe(browserSync.stream());
			console.log(`✅ Bundled: ${item}/js/app.js`);
		}
	});

	cb();
}

// ---------------------------------------------
// 3. Start BrowserSync server
// ---------------------------------------------
function serve() {
	browserSync.init({
		server: {
			baseDir: './',
		},
		notify: false,
		open: true,
	});

	// Watch for changes
	gulp.watch(['*/index.html'], gulp.series(generateRootIndex, reloadHtml));
	gulp.watch(['*/app.js'], gulp.series(reloadHtml)); // watch JS inside topic dirs
	gulp.watch(['**/*.css', '**/*.scss'], injectCss);
}

// ---------------------------------------------
// 4. Reload helpers
// ---------------------------------------------
function reloadHtml(cb) {
	browserSync.reload();
	cb();
}

function injectCss(cb) {
	browserSync.reload('*.css');
	cb();
}

// ---------------------------------------------
// 5. Default task
// ---------------------------------------------
exports.default = gulp.series(generateRootIndex, reloadHtml, serve);
